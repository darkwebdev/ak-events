import React from 'react';
import './index.css';

interface EndedIconProps {
  className?: string;
}

// Marks a banner that has already ended (while its event may still be running) — the
// counterpart of PlayIcon, drawn the same way: an inline SVG in currentColor-style
// theme tokens rather than a static asset.
export function EndedIcon({ className }: EndedIconProps) {
  return (
    <svg
      className={`ak-ended-icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 16 16"
      role="img"
      aria-label="Ended"
    >
      <title>Ended</title>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
