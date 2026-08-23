import React from 'react';
import { PullIcon } from './PullIcon.jsx';

// Shown as "[icon]×N", matching the in-game Headhunting pull-count badge, instead of
// the "N pull(s)" text this used to render.
export function Pulls({ children }) {
  const pulls = parseFloat(children);
  return (
    <>
      <PullIcon />×{pulls}
    </>
  );
}
