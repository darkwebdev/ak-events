// Thin GraphQL client for ak-account-api — see config.js for the endpoint itself.
import { arkAccountApiUrl } from '../config.js';

const API_URL = arkAccountApiUrl;
const API_ORIGIN = new URL(API_URL).origin;

// Returns both the parsed GraphQL data and the raw Response, since the session-
// resumption mechanism used by fetchAccountData below rides on a response header
// (X-Ak-Session) rather than anything in the GraphQL body.
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
  return { data: json.data, response: res };
}

// Sends a one-time login code to `email` via Yostar (the same code the official
// game client would send). Returns { success, message }.
export async function sendAuthCode(email, server = 'en') {
  const { data } = await graphqlRequest(
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
// { success, channelUid, yostarToken, deviceId, server, error }. `deviceId` is an
// opaque string — persist it as-is alongside the token and pass it back on every
// authenticated call (fetchAccountData below); without it the server presents as a
// fresh device on each call, which is what actually logs the player out of the game
// (not the token itself). Treat it as a required part of the credential, not optional.
export async function getAuthToken(email, code, server = 'en') {
  const { data } = await graphqlRequest(
    `mutation GetAuthToken($email: String!, $code: String!, $server: String!) {
      getAuthToken(email: $email, code: $code, server: $server) {
        success
        channelUid
        yostarToken
        deviceId
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
    const { data } = await graphqlRequest(
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
// counts, using a previously obtained
// { channelUid, yostarToken, deviceId, session, server }.
//
// `session` resumes an already-authenticated Yostar session instead of re-running
// the full login handshake (deviceId reuse alone wasn't enough to stop each fetch
// from kicking the player's live game session — this is a genuinely different
// mechanism: skip re-authenticating at all, rather than make re-authenticating look
// consistent). Pass whatever was returned by the previous call (or omit it on the
// very first authenticated call after login, when no session exists yet). The
// server returns the *updated* session — it's a counter that advances on every
// authenticated request, so a stale/previously-sent value won't work for the next
// call — via the `X-Ak-Session` response header, not the GraphQL body; the caller
// must persist `.session` from this function's return value for next time.
export async function fetchAccountData({ channelUid, yostarToken, deviceId, session, server }) {
  const { data, response } = await graphqlRequest(
    `query FetchAccountData(
      $channelUid: String!
      $yostarToken: String!
      $deviceId: String
      $session: String
      $server: String!
    ) {
      myStatus(
        channelUid: $channelUid
        yostarToken: $yostarToken
        deviceId: $deviceId
        session: $session
        server: $server
      ) {
        nickName
        level
        uid
      }
      myInventory(
        channelUid: $channelUid
        yostarToken: $yostarToken
        deviceId: $deviceId
        session: $session
        server: $server
      ) {
        orundum
        originitePrime
        headhuntingPermits
      }
    }`,
    { channelUid, yostarToken, deviceId, session, server }
  );
  const uid = data.myStatus?.uid ?? null;
  const avatarUrl = uid ? await fetchPlayerAvatarUrl(uid, server) : null;
  // Falls back to the session we sent in if the header is missing for some reason
  // on an otherwise-successful response — never surface `null` here, since the
  // caller persisting that would force the next call back into a full login.
  const updatedSession = response.headers.get('X-Ak-Session') ?? session ?? null;
  return {
    nickName: data.myStatus?.nickName ?? null,
    level: data.myStatus?.level ?? null,
    avatarUrl,
    session: updatedSession,
    orundum: data.myInventory?.orundum ?? 0,
    originitePrime: data.myInventory?.originitePrime ?? 0,
    headhuntingPermits: data.myInventory?.headhuntingPermits ?? 0,
  };
}
