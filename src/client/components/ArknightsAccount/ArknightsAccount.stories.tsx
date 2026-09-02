import React from 'react';
import { ArknightsAccount } from './index.jsx';
import type { ArkAuth } from '../../types.js';

export default {
  title: 'Components/ArknightsAccount',
  component: ArknightsAccount,
};

const FAKE_AUTH: ArkAuth = {
  channelUid: 'demo-uid',
  yostarToken: 'demo-token',
  server: 'en',
};

// Small self-contained placeholder (no network dependency, unlike the real
// myStatus.avatarUrl fetch) so this story renders identically offline and doesn't
// depend on that field's own reliability.
const FAKE_AVATAR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
  <rect width='28' height='28' rx='4' fill='%23564fd1'/>
  <text x='14' y='19' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>D</text>
</svg>`;
const FAKE_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(FAKE_AVATAR_SVG)}`;

// The email/code-entry and "connected" branches don't require any network call to
// render on their own (only clicking "Send code"/"Verify"/"Refresh data" does), so
// all three stories below are safe to render without mocking arkCharsApi.js.
export const Disconnected = {
  render: () => <ArknightsAccount authState={null} setAuthState={() => {}} onFetched={() => {}} />,
  decorators: [
    (Story: React.ComponentType) => {
      localStorage.removeItem('ak-events-arknights-linked-account');
      return <Story />;
    },
  ],
};

// A real (if usually brief) state: authState is set right after a successful
// login, before the inline fetch that follows it resolves — or after a fetch
// failed silently. No linked-account line yet, just the Refresh data button.
// Explicitly clears the persisted key rather than assuming it's empty — Storybook's
// iframe shares one origin's localStorage across every story, so without this,
// visiting ConnectedWithAccount first would leak its seeded data in here too.
export const Connected = {
  render: () => (
    <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />
  ),
  decorators: [
    (Story: React.ComponentType) => {
      localStorage.removeItem('ak-events-arknights-linked-account');
      return <Story />;
    },
  ],
};

// The common real-world case once a fetch has actually succeeded: nickname,
// level, avatar, and the logout icon all showing — this is the state a full OTP
// login normally settles into, without needing to run that flow for real just to
// look at the UI. Seeds `linkedAccount`'s persisted storage key before mount,
// since the component owns that state internally rather than taking it as a prop.
export const ConnectedWithAccount = {
  render: () => (
    <ArknightsAccount authState={FAKE_AUTH} setAuthState={() => {}} onFetched={() => {}} />
  ),
  decorators: [
    (Story: React.ComponentType) => {
      localStorage.setItem(
        'ak-events-arknights-linked-account',
        JSON.stringify({ nickName: 'Doctor', level: 120, avatarUrl: FAKE_AVATAR })
      );
      return <Story />;
    },
  ],
};
