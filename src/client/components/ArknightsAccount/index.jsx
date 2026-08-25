import React, { useState } from 'react';
import { useStorage } from '../../hooks/useStorage.js';
import { sendAuthCode, getAuthToken, fetchAccountData } from '../../utils/arkCharsApi.js';
import './index.css';

// Imports Orundum/Originite Prime/Headhunting Permit counts from a real Arknights
// account via the user's own ak-chars-api (which wraps Yostar's email one-time-code
// login — the same flow the official game client uses). `authState` is
// `{ channelUid, yostarToken, deviceId, session, server } | null`, persisted by the
// caller (via useStorage) so a successful login survives a page reload; this
// component only owns the transient email/code form state and in-flight/error UI.
// `session` starts absent (there's nothing to resume before the first fetch) and
// gets updated after every successful fetch — see fetchAccountData's own comment
// for why it must always be the most recently returned value.
export function ArknightsAccount({ authState, setAuthState, onFetched }) {
  const connected = !!authState;
  const [pendingStep, setPendingStep] = useState('email'); // 'email' | 'code' — only used while !connected
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  // { nickName, level, avatarUrl } from the last successful fetch — persisted so a
  // page reload can keep showing it without needing another live fetch (which is
  // what actually talks to Yostar) just to redisplay data we already have.
  const [linkedAccount, setLinkedAccount] = useStorage('ak-events-arknights-linked-account', null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSendCode(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await sendAuthCode(email);
      if (result.success) {
        setPendingStep('code');
      } else {
        setError(result.message || 'Failed to send code.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await getAuthToken(email, code);
      if (result.success) {
        const auth = {
          channelUid: result.channelUid,
          yostarToken: result.yostarToken,
          deviceId: result.deviceId,
          server: result.server,
        };
        setAuthState(auth);
        setCode('');
        // Fetch immediately on a successful login rather than waiting for a
        // separate manual step — the user's already been warned about the
        // game-logout side effect up front, on the email form.
        await fetchAndApply(auth);
      } else {
        setError(result.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleCancelCode() {
    setPendingStep('email');
    setCode('');
    setError(null);
  }

  function handleLogout() {
    // Only clears the auth token/display cache — whatever Orundum/OP/Permits
    // values were last fetched into playerStatus stay put, same as any other
    // manually-entered value.
    setAuthState(null);
    setLinkedAccount(null);
    setPendingStep('email');
    setEmail('');
    setError(null);
  }

  async function fetchAndApply(auth) {
    setError(null);
    setBusy(true);
    try {
      const data = await fetchAccountData(auth);
      // Persist the updated session (resumed rather than re-logging-in next time)
      // alongside the rest of the credential — merge onto `auth`, not the current
      // `authState` prop, since a call kicked off before a re-render still closes
      // over the `auth` it was passed even if authState itself has since changed.
      setAuthState({ ...auth, session: data.session });
      setLinkedAccount({ nickName: data.nickName, level: data.level, avatarUrl: data.avatarUrl });
      onFetched(data);
    } catch (err) {
      // Most likely an expired/invalidated token (each fetch logs the game session
      // out, so a stale token here is expected sooner or later) — clear it so the
      // user can just reconnect rather than getting stuck retrying a dead token.
      // Logged (not just shown generically) since the real GraphQL error is useful
      // for diagnosing anything that isn't plain token expiry.
      console.error('[ArknightsAccount] fetchAccountData failed:', err);
      setError('Could not fetch account data — your session may have expired. Please reconnect.');
      setAuthState(null);
      setPendingStep('email');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ak-aside ak-arknights-account">
      <h3 className="ak-aside-title">Arknights Account</h3>

      {!connected && pendingStep === 'email' && (
        <form className="ak-ark-account-form" onSubmit={handleSendCode}>
          <p className="ak-ark-account-warning">
            Fetching your data will log you out of Arknights on this device, every time you refresh
            it.
          </p>
          <input
            type="email"
            className="ak-text-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={busy}
          />
          <button type="submit" className="ak-button" disabled={busy || !email}>
            {busy ? 'Sending…' : 'Send code'}
          </button>
        </form>
      )}

      {!connected && pendingStep === 'code' && (
        <form className="ak-ark-account-form" onSubmit={handleVerifyCode}>
          <p className="ak-ark-account-hint">Enter the code sent to {email}</p>
          <input
            type="text"
            inputMode="numeric"
            className="ak-text-input"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={busy}
          />
          <div className="ak-ark-account-actions">
            <button type="submit" className="ak-button" disabled={busy || !code}>
              {busy ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              className="ak-button-secondary"
              onClick={handleCancelCode}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {connected && (
        <div className="ak-ark-account-connected">
          {linkedAccount && (
            <p className="ak-ark-account-hint ak-ark-account-linked">
              {linkedAccount.avatarUrl && (
                <img
                  className="ak-ark-account-avatar"
                  src={linkedAccount.avatarUrl}
                  alt=""
                  width={28}
                  height={28}
                />
              )}
              Linked: {linkedAccount.nickName} (Lv. {linkedAccount.level})
              <button
                type="button"
                className="ak-ark-account-logout"
                onClick={handleLogout}
                disabled={busy}
                aria-label="Log out of Arknights account"
                title="Log out"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
                  <polyline
                    points="16 17 21 12 16 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
                </svg>
              </button>
            </p>
          )}
          <div className="ak-ark-account-actions">
            <button
              type="button"
              className="ak-button"
              onClick={() => fetchAndApply(authState)}
              disabled={busy}
            >
              {busy ? 'Fetching…' : 'Refresh data'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="ak-ark-account-error">{error}</p>}
    </div>
  );
}
