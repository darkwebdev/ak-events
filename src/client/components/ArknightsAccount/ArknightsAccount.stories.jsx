import React from 'react';
import { ArknightsAccount } from './index.jsx';

export default {
  title: 'Components/ArknightsAccount',
  component: ArknightsAccount,
};

// The email/code-entry and "connected" branches don't require any network call to
// render on their own (only clicking "Send code"/"Verify"/"Refresh data" does), so
// both are safe to story without mocking arkCharsApi.js.
export function Disconnected() {
  return <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />;
}

export function Connected() {
  return (
    <ArknightsAccount
      authState={{ channelUid: 'demo-uid', yostarToken: 'demo-token', server: 'en' }}
      setAuthState={() => {}}
      onFetched={() => {}}
    />
  );
}
