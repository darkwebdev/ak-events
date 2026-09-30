import React from 'react';
import { PlayIcon } from './index.jsx';

export default {
  title: 'Components/PlayIcon',
  component: PlayIcon,
};

export function Default() {
  return <PlayIcon />;
}

export function BeforeACountdown() {
  return (
    <span>
      <PlayIcon />
      Ends in 2 days
    </span>
  );
}
