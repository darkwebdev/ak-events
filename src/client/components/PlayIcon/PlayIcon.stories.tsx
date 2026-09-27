import React from 'react';
import { PlayIcon } from './index.jsx';

export default {
  title: 'Components/PlayIcon',
  component: PlayIcon,
};

export function Default() {
  return <PlayIcon />;
}

export function BeforeAName() {
  return (
    <span>
      <PlayIcon /> Stronghold Protocol Alliance Part 2
    </span>
  );
}
