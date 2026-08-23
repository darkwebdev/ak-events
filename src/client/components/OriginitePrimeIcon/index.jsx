import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './index.css';

export function OriginitePrimeIcon() {
  return (
    <img
      className="ak-op-icon"
      src={normalizeImageSrc('/images/icon-diamond-yellow.svg')}
      alt="Originite Prime"
      title="Originite Prime"
    />
  );
}
