import React from 'react';
import { useNow } from '../../hooks/useNow.js';
import {
  getCountdown,
  formatEndedAgo,
  formatLongDate,
  formatLongDateTime,
} from '../../utils/dates.js';
import './index.css';

interface CountdownProps {
  start: Date | null;
  end: Date | null;
  // Whether start/end are real moments (not calendar dates read as midnight) — only
  // then does the last day count down in hours and minutes.
  exact: boolean;
}

// "Starts in 3 days" / "Ends in 2h 15m", then "Ended 3 days ago", ticking every
// minute. The exact moment is in the native tooltip.
export function Countdown({ start, end, exact }: CountdownProps) {
  const now = useNow();
  const countdown = getCountdown(start, end, exact, now);
  const tooltip = (date: Date) => (exact ? formatLongDateTime(date) : formatLongDate(date));
  if (!countdown) {
    if (!end || now < end) return null;
    return (
      <span className="ak-countdown ak-countdown-ended" title={tooltip(end)}>
        Ended {formatEndedAgo(end, exact, now)}
      </span>
    );
  }
  const { phase, target, remaining } = countdown;
  return (
    <span className={`ak-countdown ak-countdown-${phase}`} title={tooltip(target)}>
      {phase === 'starts' ? 'Starts' : 'Ends'} in {remaining}
    </span>
  );
}
