import React from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { Breakdown } from '../Breakdown';

/**
 * Component for managing currently owned orundum and resources
 */
export function CurrentlyOwned({ owned, updateOwned, totalOwned }) {
  return (
    <div className="ak-aside">
      <h3 className="ak-aside-title">Currently owned</h3>
      <div className="ak-aside-list">
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <span className="ak-aside-name">Orundum</span>
            <input 
              type="number" 
              className="ak-number-input"
              min="0"
              step="1"
              value={owned.orundum}
              onChange={(e) => updateOwned('orundum', parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <span className="ak-aside-name">Originite Prime</span>
            <input 
              type="number" 
              className="ak-number-input"
              min="0"
              step="1"
              value={owned.op}
              onChange={(e) => updateOwned('op', parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <span className="ak-aside-name">Headhunting Permits</span>
            <input 
              type="number" 
              className="ak-number-input"
              min="0"
              step="1"
              value={owned.hhPermits}
              onChange={(e) => updateOwned('hhPermits', parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
      </div>
      <div className="ak-aside-total">
        <div className="ak-aside-item">
          <div className="ak-aside-label">
            <span className="ak-aside-name">
              <InfoButton title="Breakdown" label="Total Orundum">
                <Breakdown 
                  items={["Orundum", "OP", "Permits"]}
                  calcs={["-", `${owned.op} × 180`, `${owned.hhPermits} × 600`]}
                  totals={[owned.orundum, owned.op * 180, owned.hhPermits * 600]}
                />
              </InfoButton>
            </span>
            <span className="ak-aside-value"><Orundum withPulls>{totalOwned}</Orundum></span>
          </div>
        </div>
      </div>
    </div>
  );
}