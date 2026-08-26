// ak-account-api, the user's own service that wraps Arknights' Yostar email-OTP
// login flow. Public API endpoint, not a secret, so hardcoded rather than an env
// var. (Formerly ak-chars-api.fly.dev — that deployment is retired; this is its
// Cloud Run replacement, same schema/auth flow.)
export const arkAccountApiUrl = 'https://ak-account-api-705516204230.us-central1.run.app/graphql';

const config = { arkAccountApiUrl };
export default config;
