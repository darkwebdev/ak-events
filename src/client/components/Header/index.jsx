import React from 'react';
import { PullCounter } from '../PullCounter';
import { normalizeImageSrc } from '../../utils/images.js';

/**
 * Header component for the app title and pull counter
 */
export function Header({ totalPulls }) {
  return (
    <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em' }}>
      Arknights Pull Prophecy
      {totalPulls > 0 ? (
        <PullCounter value={totalPulls} />
      ) : (
        <img src={normalizeImageSrc('images/icon-diamond-black.svg')} alt="Diamond icon" style={{ height: '2.5rem', verticalAlign: 'middle' }} />
      )}
    </h1>
  );
}