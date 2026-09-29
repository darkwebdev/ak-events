import React from 'react';
import { EndedIcon } from './index.jsx';

export default {
  title: 'Components/EndedIcon',
  component: EndedIcon,
};

export function Default() {
  return <EndedIcon />;
}

export function BeforeADateRange() {
  return (
    <span>
      <EndedIcon />
      20/08/2026 - 03/09/2026
    </span>
  );
}
