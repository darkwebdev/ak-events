import React from 'react';
import { PlayIcon } from './index.jsx';

export default {
  title: 'Components/PlayIcon',
  component: PlayIcon,
};

export function Default() {
  return <PlayIcon />;
}

export function BeforeADateRange() {
  return (
    <span>
      <PlayIcon />
      20/08/2026 - 01/10/2026
    </span>
  );
}
