import React from 'react';
import { OriginitePrimeIcon } from './index.jsx';

export default {
  title: 'Components/OriginitePrimeIcon',
  component: OriginitePrimeIcon,
};

export function Default() {
  return <OriginitePrimeIcon />;
}

export function BeforeANumber() {
  return (
    <span>
      <OriginitePrimeIcon /> 28
    </span>
  );
}
