import React from 'react';
import { PullIcon } from './PullIcon.jsx';

interface PullsProps {
  children: number | string;
}

// Shown as "[icon]×N", matching the in-game Headhunting pull-count badge, instead of
// the "N pull(s)" text this used to render.
export function Pulls({ children }: PullsProps) {
  const pulls = parseFloat(String(children));
  return (
    <>
      <PullIcon />×{pulls}
    </>
  );
}
