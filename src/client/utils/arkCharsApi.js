// Thin GraphQL client for ak-account-api, the user's own service that wraps
// Arknights' Yostar email-OTP login flow. Public API endpoint, not a secret, so
// hardcoded rather than an env var. (Formerly ak-chars-api.fly.dev — that
// deployment is retired; this is its Cloud Run replacement, same schema/auth flow.)
const API_URL = 'https://ak-account-api-705516204230.us-central1.run.app/graphql';

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
// { success, channelUid, yostarToken, deviceId, server, error }. `deviceId` is an
// opaque string — persist it as-is alongside the token and pass it back on every
// authenticated call (fetchAccountData below); without it the server presents as a
// fresh device on each call, which is what actually logs the player out of the game
// (not the token itself). Treat it as a required part of the credential, not optional.
export async function getAuthToken(email, code, server = 'en') {
  const data = await graphqlRequest(
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
    const data = await graphqlRequest(
      `query GetPlayerAvatarUrl($playerId: String!, $server: String!) {
        getPlayerAvatarUrl(playerId: $playerId, server: $server)
      }`,
      { playerId, server }
    );
    return data.getPlayerAvatarUrl ?? null;
  } catch (err) {
    console.error('[arkCharsApi] getPlayerAvatarUrl failed:', err);
    return null;
  }
}

// Fetches the linked account's nickname/level/uid (for display, confirming which
// account is connected) and current Orundum / Originite Prime / Headhunting Permit
// counts, using a previously obtained { channelUid, yostarToken, deviceId, server }.
// Passing the same deviceId back on every call (rather than leaving it out, which
// falls back to a fresh random device per call server-side) is what's expected to
// stop each fetch from kicking the player's live game session.
export async function fetchAccountData({ channelUid, yostarToken, deviceId, server }) {
  const data = await graphqlRequest(
    `query FetchAccountData(
      $channelUid: String!
      $yostarToken: String!
      $deviceId: String
      $server: String!
    ) {
      myStatus(
        channelUid: $channelUid
        yostarToken: $yostarToken
        deviceId: $deviceId
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
        server: $server
      ) {
        orundum
        originitePrime
        headhuntingPermits
      }
    }`,
    { channelUid, yostarToken, deviceId, server }
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
