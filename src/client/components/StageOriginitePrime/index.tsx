import React from 'react';
import { DateText } from '../DateText';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { orundumFromOP } from '../../utils/orundum.js';
import {
  NATURAL_SANITY_PER_DAY,
  sectionsFor,
  type GroupSummary,
  type OpStage,
  type SanityPotion,
  type StageOpSummary,
  type StoryGrouping,
  type StorySection,
  type Storyline,
} from '../../utils/stageOp.js';
import type { SanityItem } from '../../../server/lib/stageOp.js';
import './index.css';

interface StageOriginitePrimeProps {
  summary: StageOpSummary | null;
  // Whether a linked account's stage progress is known; without it every stage
  // counts as unclaimed.
  hasProgress: boolean;
  // The Monthly Card's daily sanity pack, 0 when the card isn't ticked.
  monthlyCardSanity: number;
  storylines: Storyline[];
  sanityItems: Record<string, SanityItem>;
  potions: SanityPotion[] | undefined;
  grouping: StoryGrouping;
  onGroupingChange: (grouping: StoryGrouping) => void;
  // The account's server: release dates are the CN ones for a CN account, EN otherwise.
  server: string;
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

const TYPE_LABEL = {
  main: 'Main Story',
  sideStory: 'Side Story',
  vignette: 'Vignette',
};

function Op({ children }: { children: number }) {
  return (
    <>
      <OriginitePrimeIcon />
      {children}
    </>
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const storyCount = (n: number) => `${n} ${n === 1 ? 'story' : 'stories'}`;

function StoryMeta({
  story,
  storylines,
  server,
}: {
  story: GroupSummary;
  storylines: Storyline[];
  server: string;
}) {
  const { group, sanity } = story;
  const { info } = group;
  const parts: React.ReactNode[] = [];
  if (info) {
    parts.push(group.kind === 'intermezzi' ? 'Intermezzo' : TYPE_LABEL[info.type]);
    const line = storylines.find((l) => l.id === info.storyline);
    if (info.movement) parts.push(info.movement);
    else if (line) parts.push(line.name);
    const start = server === 'cn' ? info.cnStart : info.enStart;
    if (start) parts.push(<DateText key="date" date={new Date(start * 1000)} />);
  } else if (group.kind === 'supply') {
    parts.push('Not an event');
  }
  if (group.kind === 'event' && group.startTime != null && group.endTime != null) {
    const opens = group.startTime * 1000 > Date.now();
    parts.push(
      <React.Fragment key="run">
        {opens ? 'opens ' : 'until '}
        <DateText date={new Date((opens ? group.startTime : group.endTime) * 1000)} />
      </React.Fragment>
    );
  }
  parts.push(`${sanity} sanity`);
  return (
    <div className="ak-stage-op-group-meta">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' · '}
          {part}
        </React.Fragment>
      ))}
    </div>
  );
}

function StoryList({
  stories,
  storylines,
  server,
}: {
  stories: GroupSummary[];
  storylines: Storyline[];
  server: string;
}) {
  return (
    <ul className="ak-stage-op-groups">
      {stories.map((story) => (
        <li key={story.group.id}>
          <details>
            <summary>
              <span className="ak-stage-op-group-name">{story.group.name}</span>
              <span className="ak-stage-op-group-value">
                <Op>{story.op}</Op>
                {story.op < story.totalOp && (
                  <span className="ak-stage-op-muted"> / {story.totalOp}</span>
                )}
              </span>
            </summary>
            <StoryMeta story={story} storylines={storylines} server={server} />
            <ul className="ak-stage-op-stages">
              {story.unclaimed.map((stage) => (
                <li key={stage.id}>
                  <span className="ak-stage-op-code">
                    {stage.code}
                    {MODE_LABEL[stage.mode] && (
                      <span className="ak-stage-op-mode"> {MODE_LABEL[stage.mode]}</span>
                    )}
                  </span>
                  <span className="ak-stage-op-ap" title="Sanity per clear">
                    {stage.ap} sanity
                  </span>
                  <span
                    className="ak-stage-op-reward"
                    title="Originite Prime for the first 3-star clear"
                  >
                    <Op>{stage.op}</Op>
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

function Section({
  section,
  storylines,
  server,
}: {
  section: StorySection;
  storylines: Storyline[];
  server: string;
}) {
  const count =
    section.stories.length + section.subsections.reduce((n, sub) => n + sub.stories.length, 0);
  return (
    <details className="ak-stage-op-section">
      <summary>
        <span className="ak-stage-op-group-name">
          {section.title} <span className="ak-stage-op-muted">({storyCount(count)})</span>
        </span>
        <span className="ak-stage-op-group-value">
          <Op>{section.op}</Op>
        </span>
      </summary>
      {section.subsections.map((sub) => (
        <details key={sub.key} className="ak-stage-op-section ak-stage-op-subsection">
          <summary>
            <span className="ak-stage-op-group-name">{sub.title}</span>
            <span className="ak-stage-op-group-value">
              <Op>{sub.op}</Op>
            </span>
          </summary>
          <StoryList stories={sub.stories} storylines={storylines} server={server} />
        </details>
      ))}
      {section.stories.length > 0 && (
        <StoryList stories={section.stories} storylines={storylines} server={server} />
      )}
    </details>
  );
}

// The account's unexpired sanity packs, soonest to expire first. `potions` is
// undefined for an account snapshot saved before packs were fetched.
function SanityPackList({
  potions,
  sanityItems,
}: {
  potions: SanityPotion[] | undefined;
  sanityItems: Record<string, SanityItem>;
}) {
  if (!potions) return <p>Refresh the account to load your packs.</p>;
  const now = Date.now() / 1000;
  const live = potions
    .filter((p) => p.expiresAt == null || p.expiresAt > now)
    .sort((a, b) => (a.expiresAt ?? Infinity) - (b.expiresAt ?? Infinity));
  if (!live.length) return <p>You have no sanity packs.</p>;
  return (
    <ul className="ak-stage-op-packs">
      {live.map((p, i) => (
        <li key={i}>
          {(p.itemId && sanityItems[p.itemId]?.name) || `${p.sanity}-sanity pack`} × {p.count} ={' '}
          {p.sanity * p.count}
          {p.expiresAt != null && (
            <>
              {' '}
              · expires <DateText date={new Date(p.expiresAt * 1000)} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

// Originite Prime from first 3-star stage clears: what's left to claim, and how much
// of it the sanity on hand clears today and by the selected event.
export function StageOriginitePrime({
  summary,
  hasProgress,
  monthlyCardSanity,
  storylines,
  sanityItems,
  potions,
  grouping,
  onGroupingChange,
  server,
  included,
  onIncludedChange,
  deadline,
  days,
}: StageOriginitePrimeProps) {
  if (!summary) {
    return (
      <div className="ak-aside ak-stage-op">
        <h3 className="ak-aside-title">
          First-clear <OriginitePrimeIcon />
        </h3>
        <p className="ak-stage-op-note">Loading stages…</p>
      </div>
    );
  }
  const sections = sectionsFor(summary.available, grouping, storylines);
  const sumOp = (stories: GroupSummary[]) => stories.reduce((n, g) => n + g.op, 0);

  return (
    <div className="ak-aside ak-stage-op">
      <h3 className="ak-aside-title">
        First-clear <OriginitePrimeIcon />
      </h3>
      {!hasProgress && (
        <p className="ak-stage-op-note">
          Fetch your account above to see which stages you&apos;ve cleared. Until then every stage
          counts.
        </p>
      )}
      <div className="ak-aside-list">
        <div className="ak-aside-item">
          <div className="ak-aside-label">
            <span className="ak-aside-name">
              <InfoButton label="Stages left">
                <div>
                  Stages you can play now whose first 3-star clear you haven&apos;t done, worth{' '}
                  <Op>{summary.opLeft}</Op>.
                </div>
                <div>
                  <Op>{summary.totalGameOp}</Op> in the whole game.
                </div>
              </InfoButton>
            </span>
            <span className="ak-aside-value">{summary.stagesLeft}</span>
          </div>
        </div>
      </div>

      <table className="ak-stage-op-table">
        <thead>
          <tr>
            <th aria-label="What" />
            <th>Today</th>
            {deadline && (
              <th>
                By <DateText date={deadline} />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <InfoButton label="Sanity">
                Natural regen is {NATURAL_SANITY_PER_DAY} a day (1 every 6 minutes) at every level;
                your level only sets the cap. Counted as if you spend it all on these stages.
              </InfoButton>
            </th>
            <td>{hasProgress ? summary.sanity.now : '–'}</td>
            {deadline && <td>{summary.sanity.byDeadline}</td>}
          </tr>
          <tr>
            <th>
              <InfoButton label="Sanity packs" title="Sanity packs">
                {hasProgress && <SanityPackList potions={potions} sanityItems={sanityItems} />}
                <p>
                  Counted: your unexpired packs
                  {monthlyCardSanity > 0 &&
                    `, plus the Monthly Card's ${monthlyCardSanity}-sanity pack a day (it's ticked in Daily Orundum)`}
                  .
                </p>
              </InfoButton>
            </th>
            <td>{hasProgress ? summary.potions.now : '–'}</td>
            {deadline && <td>{summary.potions.byDeadline}</td>}
          </tr>
          <tr className="ak-stage-op-table-result">
            <th>
              <InfoButton label="You can get">
                Cheapest stages first, each 3-starred on the first try, ignoring what has to be
                cleared first to unlock a stage.
              </InfoButton>
            </th>
            <td>
              <Op>{summary.planNow.op}</Op>
            </td>
            {deadline && (
              <td>
                <Op>{summary.plan.op}</Op>
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {!deadline && <p className="ak-stage-op-note">Select an event to plan up to its start.</p>}

      <div className="ak-stage-op-switch" role="radiogroup" aria-label="Group stories">
        {(['storyline', 'year'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={grouping === value}
            className={grouping === value ? 'active' : ''}
            onClick={() => onGroupingChange(value)}
          >
            {value === 'storyline' ? 'By storyline' : 'By year'}
          </button>
        ))}
      </div>
      <div className="ak-stage-op-sections">
        {sections.map((section) => (
          <Section key={section.key} section={section} storylines={storylines} server={server} />
        ))}
        {summary.supply && (
          <details className="ak-stage-op-section">
            <summary>
              <span className="ak-stage-op-group-name">Supply stages</span>
              <span className="ak-stage-op-group-value">
                <Op>{summary.supply.op}</Op>
              </span>
            </summary>
            <StoryList stories={[summary.supply]} storylines={storylines} server={server} />
          </details>
        )}
        {summary.upcoming.length > 0 && (
          <details className="ak-stage-op-section">
            <summary>
              <span className="ak-stage-op-group-name">
                Coming up{' '}
                <span className="ak-stage-op-muted">({storyCount(summary.upcoming.length)})</span>
              </span>
              <span className="ak-stage-op-group-value">
                <Op>{sumOp(summary.upcoming)}</Op>
              </span>
            </summary>
            <StoryList stories={summary.upcoming} storylines={storylines} server={server} />
          </details>
        )}
        {summary.waiting.length > 0 && (
          <details className="ak-stage-op-section">
            <summary>
              <span className="ak-stage-op-group-name">
                <InfoButton label="Waiting for rerun">
                  Side Stories that ended and aren&apos;t in the archive yet. Not counted above.
                </InfoButton>{' '}
                <span className="ak-stage-op-muted">({storyCount(summary.waiting.length)})</span>
              </span>
              <span className="ak-stage-op-group-value">
                <Op>{sumOp(summary.waiting)}</Op>
              </span>
            </summary>
            <StoryList stories={summary.waiting} storylines={storylines} server={server} />
          </details>
        )}
      </div>

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
                  {summary.sanity.byDeadline + summary.potions.byDeadline} sanity with packs over{' '}
                  {plural(days, 'day')} clears <Op>{summary.plan.op}</Op>.
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
    </div>
  );
}
