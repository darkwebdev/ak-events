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

export const OneToTen = () => <PullCounter value={10} />;
export const Five = () => <PullCounter value={5} />;
