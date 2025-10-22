import React from 'react';
import { PullCounter } from './index.jsx';

export default {
  title: 'Components/PullCounter',
  component: PullCounter,
};

export const OneToTen = () => <PullCounter startValue={1} value={10} />;
export const Five = () => <PullCounter value={5} />;
