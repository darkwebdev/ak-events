import React from 'react';
import { PullCounter } from '../PullCounter';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import './index.css';

/**
 * Header component for the app title and pull counter
 */
export function Header({ totalPulls }) {
  return (
    <header className="ak-header">
      <h1>Arknights Pull Prophecy</h1>
      &nbsp;
      <span className="ak-header-pulls">
        <PullIcon className="ak-header-pulls-icon" />
        <span className="ak-header-pulls-x">×</span>
        <PullCounter value={totalPulls} />
      </span>
    </header>
  );
}
