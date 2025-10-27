import React from 'react';
import { Header } from './index.jsx';

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    totalPulls: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'The total number of pulls to display in the counter',
    },
  },
};

export const Default = {
  args: {
    totalPulls: 10,
  },
};

export const ZeroPulls = {
  args: {
    totalPulls: 0,
  },
};

export const HighPulls = {
  args: {
    totalPulls: 500,
  },
};