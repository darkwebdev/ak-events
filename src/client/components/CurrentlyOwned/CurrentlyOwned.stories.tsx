import React from 'react';
import { CurrentlyOwned } from './index.jsx';

export default {
  title: 'Components/CurrentlyOwned',
  component: CurrentlyOwned,
};

const defaultProps = {
  owned: { orundum: 1000, op: 3, hhPermits: 2 },
  updateOwned: () => {},
  totalOwned: 1000 + 3 * 180 + 2 * 600,
};

export function Default() {
  return <CurrentlyOwned {...defaultProps} />;
}

export function ZeroOwned() {
  return (
    <CurrentlyOwned
      owned={{ orundum: 0, op: 0, hhPermits: 0 }}
      updateOwned={() => {}}
      totalOwned={0}
    />
  );
}

export function LargeAmounts() {
  return (
    <CurrentlyOwned
      owned={{ orundum: 10000, op: 50, hhPermits: 20 }}
      updateOwned={() => {}}
      totalOwned={10000 + 50 * 180 + 20 * 600}
    />
  );
}

export function OnlyOrundum() {
  return (
    <CurrentlyOwned
      owned={{ orundum: 5000, op: 0, hhPermits: 0 }}
      updateOwned={() => {}}
      totalOwned={5000}
    />
  );
}
