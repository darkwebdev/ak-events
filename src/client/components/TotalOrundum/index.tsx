import React from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { Breakdown } from '../Breakdown';
import './index.css';

interface TotalOrundumProps {
  latestEventStart: Date | null;
  totalOrundum: number;
  totalEventsOrundum: number;
  eventsOrundumCalc: string;
  totalDailyOrundum: number;
  dailyOrundumCalc: string;
  playerOrundumTotal: number;
}

export function TotalOrundum({
  latestEventStart,
  totalOrundum,
  totalEventsOrundum,
  eventsOrundumCalc,
  totalDailyOrundum,
  dailyOrundumCalc,
  playerOrundumTotal,
}: TotalOrundumProps) {
  return (
    <div className="ak-total-section">
      <div className="ak-total-orundum">
        <strong>
          <InfoButton
            label={`Total ${
              latestEventStart ? `by ${latestEventStart.toLocaleDateString()}` : 'now'
            }`}
          >
            <Breakdown
              items={['Events', 'Daily', 'Owned']}
              calcs={[eventsOrundumCalc, dailyOrundumCalc, '-']}
              totals={[totalEventsOrundum, totalDailyOrundum, playerOrundumTotal]}
            />
          </InfoButton>
        </strong>
        <span className="ak-total-value">
          <Orundum withPulls>{totalOrundum}</Orundum>
        </span>
      </div>
    </div>
  );
}
