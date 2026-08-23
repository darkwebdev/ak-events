import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './PullIcon.css';

// className always includes the default `ak-pulls-icon` sizing rather than requiring
// every caller to pass it — an <img> with no explicit width/height falls back to the
// source SVG's own size (huge) if a caller forgets it, or if this is used somewhere
// this stylesheet never otherwise loads (e.g. the Design/Icons Storybook page, which
// imports this icon directly).
export function PullIcon({ className }) {
  return (
    <img
      className={`ak-pulls-icon${className ? ` ${className}` : ''}`}
      src={normalizeImageSrc('/images/icon-pull.svg')}
      alt="Pull"
    />
  );
}
