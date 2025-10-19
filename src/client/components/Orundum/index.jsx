import React from "react";
import { Pulls } from '../Pulls';
import { pullsFromOrundum } from '../../utils/orundum';

/**
 * Format orundum amount with pull count in parentheses
 * @param {number} orundum - Orundum amount
 * @returns {string} Formatted string with pulls
 */
export const Orundum = ({ children = 0, withPulls = false, pullsPrecision = 0 }) => {
  const orundum = parseInt(children, 10);
  const pulls = pullsFromOrundum(orundum, pullsPrecision);
  if (!withPulls || pulls === 0) {
    return orundum;
  }
  return (
    <>
      {orundum}&nbsp;(<Pulls>{pulls}</Pulls>)
    </>
  );
};
