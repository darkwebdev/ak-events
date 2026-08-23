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
      <div className="ak-header-title">
        <h1>Arknights Pull Prophecy</h1>
        <span className="ak-header-pulls">
          <PullIcon className="ak-header-pulls-icon" />
          <span className="ak-header-pulls-x">×</span>
          <PullCounter value={totalPulls} />
        </span>
      </div>
    </header>
  );
}
