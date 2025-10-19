import React from 'react';
import { Breakdown } from './index.jsx';

export default {
  title: 'Components/Breakdown',
  component: Breakdown,
};

export const Default = () => (
  <Breakdown
    items={['Orundum', 'OP', 'Permits']}
    calcs={['-', '3 × 180', '2 × 600']}
    totals={[1200, 540, 1200]}
  />
);

export const SingleItem = () => (
  <Breakdown
    items={['Orundum']}
    calcs={['-']}
    totals={[500]}
  />
);

export const MultipleItems = () => (
  <Breakdown
    items={['Orundum', 'OP', 'Permits', 'Monthly Card']}
    calcs={['-', '5 × 180', '1 × 600', '30 × 1']}
    totals={[2000, 900, 600, 30]}
  />
);

export const ZeroValues = () => (
  <Breakdown
    items={['Orundum', 'OP', 'Permits']}
    calcs={['-', '0 × 180', '0 × 600']}
    totals={[0, 0, 0]}
  />
);

export const LargeNumbers = () => (
  <Breakdown
    items={['Orundum', 'OP', 'Permits']}
    calcs={['-', '50 × 180', '20 × 600']}
    totals={[10000, 9000, 12000]}
  />
);