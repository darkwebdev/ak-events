import React from 'react';
import { PullCounter } from './index.jsx';

export default {
  title: 'Components/PullCounter',
  component: PullCounter,
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'The value to display in the counter',
    },
  },
};

export const Default = {
  args: {
    value: 10,
  },
};

export function OneToTen() {
  return <PullCounter value={10} />;
}
export function Five() {
  return <PullCounter value={5} />;
}
