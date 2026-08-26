// Thin GraphQL client for ak-account-api — see config.js for the endpoint itself.
import { arkAccountApiUrl } from '../config.js';

const API_URL = arkAccountApiUrl;

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

// Fetches the linked account's nickname/level/uid/avatar (for display, confirming
// which account is connected) and current Orundum / Originite Prime / Headhunting
// Permit counts, using a previously obtained { channelUid, yostarToken, server }.
// avatarUrl comes straight from myStatus as a ready-to-use image URL (resolved
// server-side from the account's own chosen portrait — this only works for the
// logged-in user's own avatar, not an arbitrary player id) and may be null if the
// portrait couldn't be resolved.
export async function fetchAccountData({ channelUid, yostarToken, server }) {
  const data = await graphqlRequest(
    `query FetchAccountData($channelUid: String!, $yostarToken: String!, $server: String!) {
      myStatus(channelUid: $channelUid, yostarToken: $yostarToken, server: $server) {
        nickName
        level
        uid
        avatarUrl
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
    avatarUrl: data.myStatus?.avatarUrl ?? null,
    orundum: data.myInventory?.orundum ?? 0,
    originitePrime: data.myInventory?.originitePrime ?? 0,
    headhuntingPermits: data.myInventory?.headhuntingPermits ?? 0,
  };
}
