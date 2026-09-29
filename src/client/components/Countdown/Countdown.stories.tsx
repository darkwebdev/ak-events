import React from 'react';
import { Countdown } from './index.jsx';

export default {
  title: 'Components/Countdown',
  component: Countdown,
};

const inMs = (ms: number) => new Date(Date.now() + ms);
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function StartsInDays() {
  return <Countdown start={inMs(5 * DAY)} end={inMs(19 * DAY)} exact />;
}

// Exact times: the last day counts down in hours and minutes.
export function EndsInHours() {
  return <Countdown start={inMs(-13 * DAY)} end={inMs(2 * HOUR + 15 * 60 * 1000)} exact />;
}

// Calendar dates only: whole days, even on the last one.
export function EndsDateOnly() {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return <Countdown start={inMs(-13 * DAY)} end={tomorrow} exact={false} />;
}

// After the end: how long ago, e.g. a banner that finished before its event does.
export function EndedDaysAgo() {
  return <Countdown start={inMs(-40 * DAY)} end={inMs(-26 * DAY)} exact />;
}

export function EndedHoursAgo() {
  return <Countdown start={inMs(-14 * DAY)} end={inMs(-3 * HOUR)} exact />;
}
