import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { useStorage } from '../../hooks/useStorage.js';
import { useNow } from '../../hooks/useNow.js';
import { formatLongDateTime, formatTimeAgo } from '../../utils/dates.js';
import {
  sendAuthCode,
  getAuthToken,
  fetchAccountData,
  type FetchAccountDataResult,
} from '../../utils/arkCharsApi.js';
import type { ArkAuth, LinkedAccount } from '../../types.js';
import './index.css';

type PendingStep = 'email' | 'code';

interface ArknightsAccountProps {
  authState: ArkAuth | null;
  setAuthState: Dispatch<SetStateAction<ArkAuth | null>>;
  onFetched: (data: FetchAccountDataResult) => void;
  // Disconnecting the account — for clearing account-specific data (its roster).
  onLogout?: () => void;
}

// When the account data was last fetched, as "Updated 5 minutes ago" (refreshed every
// minute), with the exact date and time in the browser's native tooltip.
function LastUpdated({ date }: { date: Date }) {
  const now = useNow();
  return (
    <time
      className="ak-ark-account-updated"
      dateTime={date.toISOString()}
      title={formatLongDateTime(date)}
    >
      Updated {formatTimeAgo(date, now)}
    </time>
  );
}

// Imports Orundum/Originite Prime/Headhunting Permit counts from a real Arknights
// account via the user's own ak-chars-api (which wraps Yostar's email one-time-code
// login — the same flow the official game client uses). `authState` is
// `{ channelUid, yostarToken, server } | null`, persisted by the caller (via
// useStorage) so a successful login survives a page reload; this component only
// owns the transient email/code form state and in-flight/error UI.
export function ArknightsAccount({
  authState,
  setAuthState,
  onFetched,
  onLogout,
}: ArknightsAccountProps) {
  const connected = !!authState;
  const [pendingStep, setPendingStep] = useState<PendingStep>('email'); // only used while !connected
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  // { nickName, level, avatarUrl } from the last successful fetch — persisted so a
  // page reload can keep showing it without needing another live fetch (which is
  // what actually talks to Yostar) just to redisplay data we already have.
  const [linkedAccount, setLinkedAccount] = useStorage<LinkedAccount | null>(
    'ak-events-arknights-linked-account',
    null
  );
  // Whether the third-party/logout warning was dismissed — remembered, so it stays
  // closed on later visits.
  const [warningHidden, setWarningHidden] = useStorage('ak-events-arknights-warning-hidden', false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent) {
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
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await getAuthToken(email, code);
      if (result.success) {
        // A successful response is contractually guaranteed to carry all three —
        // only `error` is optional on failure.
        const auth: ArkAuth = {
          channelUid: result.channelUid!,
          yostarToken: result.yostarToken!,
          server: result.server!,
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
      setError((err as Error).message);
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
    onLogout?.();
    setPendingStep('email');
    setEmail('');
    setError(null);
  }

  async function fetchAndApply(auth: ArkAuth) {
    setError(null);
    setBusy(true);
    try {
      const data = await fetchAccountData(auth);
      setLinkedAccount({
        nickName: data.nickName,
        level: data.level,
        avatarUrl: data.avatarUrl,
        fetchedAt: new Date().toISOString(),
      });
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
          {!warningHidden && (
            <div className="ak-ark-account-warning">
              <button
                type="button"
                className="ak-ark-account-warning-close"
                onClick={() => setWarningHidden(true)}
                aria-label="Hide this warning"
                title="Hide"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                </svg>
              </button>
              <p>
                This is not an official Yostar or Hypergryph service. Your login goes through an
                unofficial third-party server, which receives access to your account. Logging in
                through third-party tools may break the game&apos;s terms of service and can put
                your account at risk. Use it at your own risk.
              </p>
              <p>
                Connecting, and every data refresh after that, logs you out of the Arknights game.
              </p>
            </div>
          )}
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
            {linkedAccount?.fetchedAt && <LastUpdated date={new Date(linkedAccount.fetchedAt)} />}
          </div>
        </div>
      )}

      {error && <p className="ak-ark-account-error">{error}</p>}
    </div>
  );
}
