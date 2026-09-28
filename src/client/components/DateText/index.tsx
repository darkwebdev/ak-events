import React from 'react';
import { formatDate, formatLongDate, toIsoDate } from '../../utils/dates.js';

interface DateTextProps {
  date: Date;
}

// A date in the viewer's own locale format, with the long form (full month name) in
// the browser's native tooltip on hover — a plain `title`, not a custom popup, so it
// behaves like any other native hover hint.
export function DateText({ date }: DateTextProps) {
  return (
    <time dateTime={toIsoDate(date)} title={formatLongDate(date)}>
      {formatDate(date)}
    </time>
  );
}
