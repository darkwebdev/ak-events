import React from 'react';
import { Icons } from './index.jsx';

export default {
  title: 'Design/Icons',
  component: Icons,
};

// data-theme forces a theme regardless of the viewer's OS/browser preference — see
// Palette.stories.jsx for why this is only needed here, not in the real app.
export function LightAndDark() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div data-theme="light">
        <Icons label="Light" />
      </div>
      <div data-theme="dark">
        <Icons label="Dark" />
      </div>
    </div>
  );
}

export function Light() {
  return (
    <div data-theme="light">
      <Icons label="Light" />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark">
      <Icons label="Dark" />
    </div>
  );
}
