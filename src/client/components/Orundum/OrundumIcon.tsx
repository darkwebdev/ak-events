import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './index.css';

interface OrundumIconProps {
  className?: string;
}

// className always includes the default `ak-orundum-icon` sizing rather than
// requiring every caller to pass it — an <img> with no explicit width/height
// falls back to the source SVG's own dimensions (huge) if a caller forgets it.
export function OrundumIcon({ className }: OrundumIconProps) {
  return (
    <img
      className={`ak-orundum-icon${className ? ` ${className}` : ''}`}
      src={normalizeImageSrc('/images/icon-orundum-red.svg') ?? undefined}
      alt="Orundum"
    />
  );
}
