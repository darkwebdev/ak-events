import React from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { Breakdown } from '../Breakdown';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { OrundumIcon } from '../Orundum/OrundumIcon.jsx';
import { PullIcon } from '../Pulls/PullIcon.jsx';

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
            <span className="ak-aside-name">
              <OrundumIcon />
              Orundum
            </span>
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
            <span className="ak-aside-name">
              <OriginitePrimeIcon />
              Originite Prime
            </span>
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
            <span className="ak-aside-name">
              <PullIcon className="ak-pulls-icon" />
              Headhunting Permits
            </span>
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
            {/* The value itself is the hover/click trigger — no separate "Total
                Orundum" label needed, and no duplicate icon either. */}
            <InfoButton
              title="Breakdown"
              label={
                <span className="ak-aside-value">
                  <Orundum withPulls>{totalOwned}</Orundum>
                </span>
              }
            >
              <Breakdown
                // The "Orundum" row isn't converted from anything (calc is just
                // "-"), so its own total cell already carries the Orundum icon via
                // <Orundum> — repeating it as the item label too would be a
                // same-row duplicate, unlike the OP/Permits rows below it (each of
                // those pairs a *different* source icon with the resulting
                // Orundum-icon total, which is meaningful, not repetitive).
                items={[
                  'Orundum',
                  <OriginitePrimeIcon key="op" />,
                  <PullIcon key="permits" className="ak-pulls-icon" />,
                ]}
                calcs={['-', `${owned.op} × 180`, `${owned.hhPermits} × 600`]}
                totals={[owned.orundum, owned.op * 180, owned.hhPermits * 600]}
              />
            </InfoButton>
          </div>
        </div>
      </div>
    </div>
  );
}
