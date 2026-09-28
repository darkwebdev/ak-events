import React from 'react';
import { DateText } from './index.jsx';

export default {
  title: 'Components/DateText',
  component: DateText,
};

// Hover for the long form, e.g. "16 September 2026" (both follow the browser's locale).
export function Default() {
  return <DateText date={new Date(2026, 8, 16)} />;
}

export function Range() {
  return (
    <span>
      <DateText date={new Date(2026, 8, 16)} /> - <DateText date={new Date(2026, 8, 30)} />
    </span>
  );
}
