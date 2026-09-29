import React from 'react';
import './index.css';

interface PlayIconProps {
  className?: string;
}

// Marks an event or banner that's currently running, before its date range (see
// isEventRunning in utils/dates.ts) — an inline SVG rather than a static asset
// like the other icons here, since a plain triangle needs no artwork and this way it
// picks up currentColor instead of a baked-in fill.
export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg
      className={`ak-play-icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 16 16"
      role="img"
      aria-label="Currently running"
    >
      <title>Currently running</title>
      <path d="M4 2.5v11l10-5.5z" />
    </svg>
  );
}
