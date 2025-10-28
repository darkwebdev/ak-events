import React from 'react';
import { PullCounter } from '../PullCounter';
// image normalization not needed in Header
import './index.css';

/**
 * Header component for the app title and pull counter
 */
export function Header({ totalPulls }) {
  return (
    <header className="ak-header">
      <h1>Arknights Pull Prophecy</h1>
      &nbsp;
      <PullCounter value={totalPulls} />
    </header>
  );
}
