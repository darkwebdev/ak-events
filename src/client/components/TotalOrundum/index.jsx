import React from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { Breakdown } from '../Breakdown';
import './index.css';

export function TotalOrundum({
  latestEventStart,
  totalOrundum,
  totalEventsOrundum,
  eventsOrundumCalc,
  totalDailyOrundum,
  dailyOrundumCalc,
  playerOrundumTotal,
}) {
  return (
    <div className="ak-total-section">
      <div className="ak-total-orundum">
        <strong>
          <InfoButton
            label={`Total Orundum${
              latestEventStart ? ` by ${latestEventStart.toLocaleDateString()}` : ''
            }`}
          >
            <Breakdown
              items={['Events', 'Daily', 'Owned']}
              calcs={[eventsOrundumCalc, dailyOrundumCalc, '-']}
              totals={[totalEventsOrundum, totalDailyOrundum, playerOrundumTotal]}
            />
          </InfoButton>
        </strong>
        <Orundum withPulls>{totalOrundum}</Orundum>
      </div>
    </div>
  );
}
