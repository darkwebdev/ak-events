import React from 'react';
import { DateText } from '../DateText';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { orundumFromOP } from '../../utils/orundum.js';
import {
  NATURAL_SANITY_PER_DAY,
  type GroupSummary,
  type OpStage,
  type StageOpSummary,
} from '../../utils/stageOp.js';
import './index.css';

interface StageOriginitePrimeProps {
  summary: StageOpSummary | null;
  // Whether a linked account's stage progress is known; without it every stage
  // counts as unclaimed.
  hasProgress: boolean;
  sanityNow: number | null;
  sanityPerDay: number;
  onSanityPerDayChange: (value: number) => void;
  // The Monthly Card's daily potion, 0 when the card isn't ticked.
  monthlyCardSanity: number;
  included: boolean;
  onIncludedChange: (included: boolean) => void;
  deadline: Date | null;
  days: number;
}

const MODE_LABEL: Record<OpStage['mode'], string | null> = {
  standard: null,
  adverse: 'Adverse',
  challenge: 'Challenge',
  sixStar: '6★',
};

function Op({ children }: { children: number }) {
  return (
    <>
      <OriginitePrimeIcon />
      {children}
    </>
  );
}

function GroupList({ groups }: { groups: GroupSummary[] }) {
  return (
    <ul className="ak-stage-op-groups">
      {groups.map(({ group, unclaimed, op, totalOp, sanity }) => (
        <li key={group.id}>
          <details>
            <summary>
              <span className="ak-stage-op-group-name">{group.name}</span>
              <span className="ak-stage-op-group-value">
                <Op>{op}</Op>
                {op < totalOp && <span className="ak-stage-op-muted"> / {totalOp}</span>}
              </span>
            </summary>
            <div className="ak-stage-op-group-meta">
              {sanity} sanity to clear
              {group.kind === 'event' && group.endTime != null && (
                <>
                  {' · '}
                  {group.startTime != null && group.startTime * 1000 > Date.now()
                    ? 'opens '
                    : 'until '}
                  <DateText
                    date={
                      new Date(
                        (group.startTime != null && group.startTime * 1000 > Date.now()
                          ? group.startTime
                          : group.endTime) * 1000
                      )
                    }
                  />
                </>
              )}
            </div>
            <ul className="ak-stage-op-stages">
              {unclaimed.map((stage) => (
                <li key={stage.id}>
                  <span className="ak-stage-op-code">{stage.code}</span>
                  <span className="ak-stage-op-name">
                    {stage.name}
                    {MODE_LABEL[stage.mode] && (
                      <span className="ak-stage-op-mode"> {MODE_LABEL[stage.mode]}</span>
                    )}
                  </span>
                  <span className="ak-stage-op-ap" title="Sanity per clear">
                    {stage.ap}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ul>
  );
}

// Originite Prime from first 3-star stage clears: what's left to claim, the sanity
// that takes, and how much of it the sanity available by the selected event clears.
export function StageOriginitePrime({
  summary,
  hasProgress,
  sanityNow,
  sanityPerDay,
  onSanityPerDayChange,
  monthlyCardSanity,
  included,
  onIncludedChange,
  deadline,
  days,
}: StageOriginitePrimeProps) {
  return (
    <div className="ak-aside ak-stage-op">
      <h3 className="ak-aside-title">
        First-clear <OriginitePrimeIcon />
      </h3>
      {!summary ? (
        <p className="ak-stage-op-note">Loading stages…</p>
      ) : (
        <>
          {!hasProgress && (
            <p className="ak-stage-op-note">
              Fetch your account above to see which stages you&apos;ve cleared. Until then every
              stage counts.
            </p>
          )}
          <div className="ak-aside-list">
            <div className="ak-aside-item">
              <div className="ak-aside-label">
                <span className="ak-aside-name">
                  <InfoButton label="Left to claim">
                    <div>First 3-star clears of stages you can play now.</div>
                    <div>
                      <Op>{summary.endedOp + summary.endedOtherOp}</Op> more in events that have
                      ended. Those can&apos;t be cleared unless the event comes back, which most
                      never do.
                    </div>
                    <div>
                      <Op>{summary.totalGameOp}</Op> in the whole game.
                    </div>
                  </InfoButton>
                </span>
                <span className="ak-aside-value">
                  <Op>{summary.opLeft}</Op>
                </span>
              </div>
            </div>
            <div className="ak-aside-item">
              <div className="ak-aside-label">
                <span className="ak-aside-name">Sanity to clear them</span>
                <span className="ak-aside-value">{summary.sanityLeft}</span>
              </div>
            </div>
            <div className="ak-aside-item">
              <div className="ak-aside-label">
                <span className="ak-aside-name">Sanity now</span>
                <span className="ak-aside-value">{sanityNow ?? '–'}</span>
              </div>
            </div>
            <div className="ak-aside-item">
              <div className="ak-aside-label">
                <span className="ak-aside-name">Sanity in potions</span>
                <span className="ak-aside-value">{hasProgress ? summary.potions : '–'}</span>
              </div>
            </div>
            <div className="ak-aside-item">
              <label className="ak-aside-label">
                <span className="ak-aside-name">
                  <InfoButton label="Sanity per day for stages">
                    Natural regen is {NATURAL_SANITY_PER_DAY} a day. Lower it for sanity you spend
                    elsewhere, raise it for potions and refills.
                  </InfoButton>
                </span>
                <input
                  type="number"
                  className="ak-number-input"
                  min="0"
                  step="10"
                  value={sanityPerDay}
                  onChange={(e) => onSanityPerDayChange(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </label>
            </div>
            {monthlyCardSanity > 0 && (
              <div className="ak-aside-item">
                <div className="ak-aside-label">
                  <span className="ak-aside-name">
                    <InfoButton label="Monthly Card potion">
                      Its daily Emergency Sanity Booster. Counted because Monthly Card is ticked in
                      Daily Orundum.
                    </InfoButton>
                  </span>
                  <span className="ak-aside-value">+{monthlyCardSanity} a day</span>
                </div>
              </div>
            )}
          </div>

          <details className="ak-stage-op-list">
            <summary>
              Stages left ({summary.available.length} group
              {summary.available.length === 1 ? '' : 's'})
            </summary>
            <GroupList groups={summary.available} />
          </details>
          {summary.upcoming.length > 0 && (
            <details className="ak-stage-op-list">
              <summary>
                Coming up (<Op>{summary.upcoming.reduce((n, g) => n + g.op, 0)}</Op>)
              </summary>
              <GroupList groups={summary.upcoming} />
            </details>
          )}
          {summary.ended.length > 0 && (
            <details className="ak-stage-op-list">
              <summary>
                Ended story events (<Op>{summary.endedOp}</Op>)
              </summary>
              <GroupList groups={summary.ended} />
            </details>
          )}
          {summary.endedOther.length > 0 && (
            <details className="ak-stage-op-list">
              <summary>
                Ended other events (<Op>{summary.endedOtherOp}</Op>)
              </summary>
              <GroupList groups={summary.endedOther} />
            </details>
          )}

          <div className="ak-aside-total">
            <div className="ak-aside-item">
              <label className="ak-aside-label">
                <input
                  type="checkbox"
                  checked={included}
                  onChange={(e) => onIncludedChange(e.target.checked)}
                />
                <span className="ak-aside-name">
                  <InfoButton
                    label={
                      deadline ? (
                        <>
                          By <DateText date={deadline} />
                        </>
                      ) : (
                        'With sanity now'
                      )
                    }
                  >
                    <div>
                      {sanityNow ?? 0} now + {summary.potions} in potions +{' '}
                      {sanityPerDay + monthlyCardSanity} × {days} day{days === 1 ? '' : 's'} ={' '}
                      {summary.budget} sanity
                    </div>
                    <div>
                      clears <Op>{summary.plan.op}</Op> (cheapest stages first,{' '}
                      {summary.plan.sanity} sanity)
                    </div>
                    <div>Tick to add it to the total.</div>
                  </InfoButton>
                </span>
                <span className="ak-aside-value">
                  <Orundum withPulls pullsPrecision={1}>
                    {orundumFromOP(summary.plan.op)}
                  </Orundum>
                </span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
