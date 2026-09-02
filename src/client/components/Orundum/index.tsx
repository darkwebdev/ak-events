import React from 'react';
import { Pulls } from '../Pulls';
import { pullsFromOrundum } from '../../utils/orundum.js';
import { OrundumIcon } from './OrundumIcon.jsx';
import './index.css';

interface OrundumProps {
  children?: number | string;
  withPulls?: boolean;
  pullsPrecision?: number;
}

/**
 * Format orundum amount with pull count in parentheses
 */
export function Orundum({ children = 0, withPulls = false, pullsPrecision = 0 }: OrundumProps) {
  const orundum = parseInt(String(children), 10);
  const pulls = pullsFromOrundum(orundum, pullsPrecision);
  const showPulls = withPulls && pulls !== 0;
  return (
    <>
      <OrundumIcon />
      {orundum}
      {showPulls && (
        <>
          &nbsp;(<Pulls>{pulls}</Pulls>)
        </>
      )}
    </>
  );
}
