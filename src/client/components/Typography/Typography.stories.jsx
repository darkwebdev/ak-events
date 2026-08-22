import React from 'react';
import { Typography } from './index.jsx';

export default {
  title: 'Design/Typography',
  component: Typography,
};

// data-theme forces a theme regardless of the viewer's OS/browser preference — see
// Palette.stories.jsx for why this needs an explicit [data-theme] override in App.css
// rather than relying on prefers-color-scheme alone.
export function LightAndDark() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div data-theme="light">
        <Typography label="Light" />
      </div>
      <div data-theme="dark">
        <Typography label="Dark" />
      </div>
    </div>
  );
}

export function Light() {
  return (
    <div data-theme="light">
      <Typography label="Light" />
    </div>
  );
}

export function Dark() {
  return (
    <div data-theme="dark">
      <Typography label="Dark" />
    </div>
  );
}
