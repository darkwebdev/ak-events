import React from 'react';
import { PullCounter } from '../PullCounter';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import './index.css';

interface HeaderProps {
  totalPulls: number;
  // The phone-only button that opens the sidebar (owned pulls, daily income, totals)
  // as a panel over the page — hidden on wider screens, where it's always shown.
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

/**
 * Header component for the app title and pull counter
 */
export function Header({ totalPulls, sidebarOpen = false, onToggleSidebar }: HeaderProps) {
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
      {onToggleSidebar && (
        <button
          type="button"
          className="ak-header-sidebar-toggle"
          aria-label={sidebarOpen ? 'Close pulls and income' : 'Open pulls and income'}
          aria-expanded={sidebarOpen}
          aria-controls="ak-sidebar"
          onClick={onToggleSidebar}
        >
          {/* Sliders: the panel holds what you own and your income settings. */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="10" cy="12" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
        </button>
      )}
    </header>
  );
}
