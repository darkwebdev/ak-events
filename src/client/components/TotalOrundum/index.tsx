import React from 'react';
import { DateText } from '../DateText';
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
  // Originite Prime from stages cleared by then (see StageOriginitePrime), when
  // counted.
  stageOrundum?: number | null;
  stageOrundumCalc?: string;
}

export function TotalOrundum({
  latestEventStart,
  totalOrundum,
  totalEventsOrundum,
  eventsOrundumCalc,
  totalDailyOrundum,
  dailyOrundumCalc,
  playerOrundumTotal,
  stageOrundum = null,
  stageOrundumCalc = '',
}: TotalOrundumProps) {
  const withStages = stageOrundum != null;
  return (
    <div className="ak-total-section">
      <div className="ak-total-orundum">
        <strong>
          <InfoButton
            label={
              latestEventStart ? (
                <>
                  Total by <DateText date={latestEventStart} />
                </>
              ) : (
                'Total now'
              )
            }
          >
            <Breakdown
              items={['Events', 'Daily', ...(withStages ? ['Stages'] : []), 'Owned']}
              calcs={[
                eventsOrundumCalc,
                dailyOrundumCalc,
                ...(withStages ? [stageOrundumCalc] : []),
                '-',
              ]}
              totals={[
                totalEventsOrundum,
                totalDailyOrundum,
                ...(withStages ? [stageOrundum] : []),
                playerOrundumTotal,
              ]}
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
