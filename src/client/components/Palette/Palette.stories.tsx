import React from 'react';
import { Palette } from './index.jsx';

export default {
  title: 'Design/Palette',
  component: Palette,
};

// data-theme forces a theme regardless of the viewer's OS/browser preference, so both
// palettes render reliably side by side here instead of only whichever one matches
// prefers-color-scheme. The real app instead follows prefers-color-scheme automatically
// (see src/client/App.css) — data-theme is only needed to force a side-by-side preview.
export function LightAndDark() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div data-theme="light">
        <Palette label="Light" />
      </div>
      <div data-theme="dark">
        <Palette label="Dark" />
      </div>
    </div>
  );
}

export function Light() {
  return (
    <div data-theme="light">
      <Palette label="Light" />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark">
      <Palette label="Dark" />
    </div>
  );
}
