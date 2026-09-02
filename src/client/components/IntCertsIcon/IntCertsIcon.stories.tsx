import React from 'react';
import { IntCertsIcon } from './index.jsx';

export default {
  title: 'Components/IntCertsIcon',
  component: IntCertsIcon,
};

export function Default() {
  return <IntCertsIcon />;
}

export function BeforeANumber() {
  return (
    <span>
      <IntCertsIcon /> 1755
    </span>
  );
}
