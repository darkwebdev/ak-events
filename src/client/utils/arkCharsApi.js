// Thin GraphQL client for ak-account-api — see config.js for the endpoint itself.
import { arkAccountApiUrl } from '../config.js';

const API_URL = arkAccountApiUrl;
const API_ORIGIN = new URL(API_URL).origin;

async function graphqlRequest(query, variables) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message || 'GraphQL request failed');
  }
  return json.data;
}

// Sends a one-time login code to `email` via Yostar (the same code the official
// game client would send). Returns { success, message }.
export async function sendAuthCode(email, server = 'en') {
  const data = await graphqlRequest(
    `mutation SendAuthCode($email: String!, $server: String!) {
      sendAuthCode(email: $email, server: $server) {
        success
        message
      }
    }`,
    { email, server }
  );
  return data.sendAuthCode;
}

// Exchanges the emailed one-time `code` for a Yostar session token. Returns
// { success, channelUid, yostarToken, server, error }. Note: this token is a real
// game session credential — using it (via fetchAccountData below) logs the player
// out of the game itself, per Yostar's single-session-per-account enforcement.
// (Tried reusing a stable device identity and, separately, resuming rather than
// re-running the login handshake — neither stopped the kick in testing against a
// real account: Yostar ties one live connection to the account itself, and any
// authenticated request, ours or the real game client's, claims that slot and
// evicts whoever held it. Not something fixable from this side.)
export async function getAuthToken(email, code, server = 'en') {
  const data = await graphqlRequest(
    `mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        server
        error
      }
    }`,
    { email, code, server }
  );
  return data.getAuthToken;
}

// Looks up the public avatar image URL for any player uid (not scoped to the
// current session/token — same lookup the API uses for search/expand results).
// Its resolution has known fallback gaps for some account shapes, so a failure
// here is treated as "no avatar" rather than failing the whole account fetch.
async function fetchPlayerAvatarUrl(playerId, server) {
  try {
    const data = await graphqlRequest(
      `query GetPlayerAvatarUrl($playerId: String!, $server: String!) {
        getPlayerAvatarUrl(playerId: $playerId, server: $server)
      }`,
      { playerId, server }
    );
    // The field returns a path relative to the API host (e.g. "/avatars/123"), not
    // a full URL — resolving it as-is would have the browser fetch it against the
    // *page's* origin instead. `new URL` leaves an already-absolute URL untouched.
    return data.getPlayerAvatarUrl ? new URL(data.getPlayerAvatarUrl, API_ORIGIN).toString() : null;
  } catch (err) {
    console.error('[arkCharsApi] getPlayerAvatarUrl failed:', err);
    return null;
  }
}

// Fetches the linked account's nickname/level/uid (for display, confirming which
// account is connected) and current Orundum / Originite Prime / Headhunting Permit
// counts, using a previously obtained { channelUid, yostarToken, server }.
export async function fetchAccountData({ channelUid, yostarToken, server }) {
  const data = await graphqlRequest(
    `query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
      myStatus(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        nickName
        level
        uid
      }
      myInventory(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        orundum
        originitePrime
        headhuntingPermits
      }
    }`,
    { channelUid, yostarToken, server }
  );
  const uid = data.myStatus?.uid ?? null;
  const avatarUrl = uid ? await fetchPlayerAvatarUrl(uid, server) : null;
  return {
    nickName: data.myStatus?.nickName ?? null,
    level: data.myStatus?.level ?? null,
    avatarUrl,
    orundum: data.myInventory?.orundum ?? 0,
    originitePrime: data.myInventory?.originitePrime ?? 0,
    headhuntingPermits: data.myInventory?.headhuntingPermits ?? 0,
  };
}
