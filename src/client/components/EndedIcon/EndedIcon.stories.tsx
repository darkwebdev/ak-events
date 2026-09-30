import React from 'react';
import { EndedIcon } from './index.jsx';

export default {
  title: 'Components/EndedIcon',
  component: EndedIcon,
};

export function Default() {
  return <EndedIcon />;
}

export function BeforeACountdown() {
  return (
    <span>
      <EndedIcon />
      Ended 25 days ago
    </span>
  );
}
