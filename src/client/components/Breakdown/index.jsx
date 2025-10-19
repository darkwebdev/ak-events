import React from "react";
import { Orundum } from '../Orundum';
import './index.css';

export const Breakdown = ({ items, calcs, totals }) => {
  return (
    <div className="ak-breakdown">
      {items.map((item, index) => (
        <div key={index} className="ak-breakdown-row">
          <div className="ak-breakdown-item">{item}</div>
          <div className="ak-breakdown-calc">{calcs[index]}</div>
          <div className="ak-breakdown-total"><Orundum withPulls>{totals[index]}</Orundum></div>
        </div>
      ))}
    </div>
  );
};
