import React, { useEffect, useState } from 'react';
import { sendAuthCode, getAuthToken, fetchAccountData } from '../../utils/arkCharsApi.js';
import './index.css';

// Imports Orundum/Originite Prime/Headhunting Permit counts from a real Arknights
// account via the user's own ak-chars-api (which wraps Yostar's email one-time-code
// login — the same flow the official game client uses). `authState` is
// `{ channelUid, yostarToken, deviceId, server } | null`, persisted by the caller
// (via useStorage) so a successful login survives a page reload; this component
// only owns the transient email/code form state and in-flight/error UI.
export function ArknightsAccount({ authState, setAuthState, onFetched }) {
  const connected = !!authState;
  const [pendingStep, setPendingStep] = useState('email'); // 'email' | 'code' — only used while !connected
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [linkedAccount, setLinkedAccount] = useState(null); // { nickName, level } from the last successful fetch
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

  useEffect(() => {
    if (connected && !linkedAccount) {
      fetchAndApply(authState);
    }
    // Deliberately mount-only: `authState` survives a page reload (persisted via
    // useStorage) but `linkedAccount` doesn't, so a reload otherwise leaves the
    // "connected" view with no name/level/avatar shown until a manual refresh. A
    // fresh login already fetches inline in handleVerifyCode, and that doesn't
    // remount this component — re-running on every authState/connected change here
    // would instead race that inline fetch and double-hit the API on every login.
  }, []);

  async function fetchAndApply(auth) {
    setError(null);
    setBusy(true);
    try {
      const data = await fetchAccountData(auth);
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
