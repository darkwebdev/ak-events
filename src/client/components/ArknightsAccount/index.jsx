import React, { useState } from 'react';
import { sendAuthCode, getAuthToken, fetchAccountData } from '../../utils/arkCharsApi.js';
import './index.css';

// Imports Orundum/Originite Prime/Headhunting Permit counts from a real Arknights
// account via the user's own ak-chars-api (which wraps Yostar's email one-time-code
// login — the same flow the official game client uses). `authState` is
// `{ channelUid, yostarToken, server } | null`, persisted by the caller (via
// useStorage) so a successful login survives a page reload; this component only
// owns the transient email/code form state and in-flight/error UI.
export function ArknightsAccount({ authState, setAuthState, onFetched }) {
  const connected = !!authState;
  const [pendingStep, setPendingStep] = useState('email'); // 'email' | 'code' — only used while !connected
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [linkedAccount, setLinkedAccount] = useState(null); // { nickName, level } from the last successful fetch
  const [confirmingRefresh, setConfirmingRefresh] = useState(false);
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
        setAuthState({
          channelUid: result.channelUid,
          yostarToken: result.yostarToken,
          server: result.server,
        });
        setCode('');
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

  function handleDisconnect() {
    // Only clears the auth token — whatever Orundum/OP/Permits values were last
    // fetched into playerStatus stay put, same as any other manually-entered value.
    setAuthState(null);
    setPendingStep('email');
    setEmail('');
    setLinkedAccount(null);
    setError(null);
  }

  async function handleConfirmRefresh() {
    setConfirmingRefresh(false);
    setError(null);
    setBusy(true);
    try {
      const data = await fetchAccountData(authState);
      setLinkedAccount({ nickName: data.nickName, level: data.level });
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
              className="ak-button-link"
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
            <p className="ak-ark-account-hint">
              Linked: {linkedAccount.nickName} (Lv. {linkedAccount.level})
            </p>
          )}
          {!confirmingRefresh ? (
            <div className="ak-ark-account-actions">
              <button
                type="button"
                className="ak-button"
                onClick={() => setConfirmingRefresh(true)}
                disabled={busy}
              >
                {busy ? 'Fetching…' : 'Refresh data'}
              </button>
              <button
                type="button"
                className="ak-button-link"
                onClick={handleDisconnect}
                disabled={busy}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="ak-ark-account-confirm">
              <p className="ak-ark-account-warning">
                Fetching your data will log you out of Arknights on this device — continue?
              </p>
              <div className="ak-ark-account-actions">
                <button type="button" className="ak-button" onClick={handleConfirmRefresh}>
                  Yes, fetch
                </button>
                <button
                  type="button"
                  className="ak-button-link"
                  onClick={() => setConfirmingRefresh(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="ak-ark-account-error">{error}</p>}
    </div>
  );
}
