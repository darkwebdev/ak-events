// Thin GraphQL client for ak-chars-api.fly.dev, the user's own service that wraps
// Arknights' Yostar email-OTP login flow. Public API endpoint, not a secret, so
// hardcoded rather than an env var.
const API_URL = 'https://ak-chars-api.fly.dev/graphql';

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
// out of the game itself, per Yostar's single-session behavior.
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

// Fetches the linked account's nickname/level (for display, confirming which
// account is connected) and current Orundum / Originite Prime / Headhunting Permit
// counts, using a previously obtained { channelUid, yostarToken, server }.
export async function fetchAccountData({ channelUid, yostarToken, server }) {
  const data = await graphqlRequest(
    `query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
      myStatus(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        nickName
        level
      }
      myInventory(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        orundum
        originitePrime
        headhuntingPermits
      }
    }`,
    { channelUid, yostarToken, server }
  );
  return {
    nickName: data.myStatus?.nickName ?? null,
    level: data.myStatus?.level ?? null,
    orundum: data.myInventory?.orundum ?? 0,
    originitePrime: data.myInventory?.originitePrime ?? 0,
    headhuntingPermits: data.myInventory?.headhuntingPermits ?? 0,
  };
}
