import React from "react";
/**
 * Format pulls with correct singular/plural
 * @param {number} n
 * @returns {string}
 */
export const Pulls = ({ children }) => {
    const pulls = parseFloat(children);
    const pullsStr = `pull${pulls === 1 ? '' : 's'}`;
    return <>{pulls}&nbsp;{pullsStr}</>;
}
