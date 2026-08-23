import React from 'react';
import { Pulls } from '../Pulls';
import { pullsFromOrundum } from '../../utils/orundum';
import { OrundumIcon } from './OrundumIcon.jsx';
import './index.css';

/**
 * Format orundum amount with pull count in parentheses
 * @param {number} orundum - Orundum amount
 * @returns {string} Formatted string with pulls
 */
export function Orundum({ children = 0, withPulls = false, pullsPrecision = 0 }) {
  const orundum = parseInt(children, 10);
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
