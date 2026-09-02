import React from 'react';
import { jpgifyLocal } from '../../utils/images.js';
import { getEffectiveStart, getEffectiveEnd } from '../../utils/dates.js';
import {
  calcEventOrundum,
  orundumFromOP,
  orundumFromHH,
  orundumFromIntCerts,
} from '../../utils/orundum.js';
import { splitOperatorColumns, type StarGroups } from '../../utils/operators.js';
import { Orundum } from '../Orundum';
import { InfoButton } from '../InfoButton';
import { Breakdown } from '../Breakdown';
import { Operator } from '../Operator';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import { IntCertsIcon } from '../IntCertsIcon';
import type { Event as EventType, SelectedEvents } from '../../types.js';
import './index.css';

// Array#filter(Boolean) doesn't narrow away the falsy branch of `x && y` at the type
// level (a well-known TS limitation), even though it does at runtime — this gives
// Breakdown's items/calcs/totals arrays their real (falsy-value-free) element types.
function truthy<T>(value: T | false | 0 | '' | null | undefined): value is T {
  return !!value;
}

function OperatorColumn({ groups }: { groups: StarGroups }) {
  if (!groups.length) return null;
  return (
    <div className="ak-operator-column">
      {groups.map(([star, ops]) => (
        <div className="ak-operator-group" key={star}>
          {star > 0 && <span className="ak-operator-group-label">{star}★</span>}
          <div className="ak-operator-group-badges">
            {ops.map((op) => (
              <Operator key={op.name} operator={op} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface EventProps {
  event: EventType;
  selectedEvents: SelectedEvents;
  onEventToggle: (eventName: string) => void;
  onToggleIntCerts?: (eventName: string, checked: boolean) => void;
}

export function Event({
  event,
  selectedEvents,
  onEventToggle,
  onToggleIntCerts = () => {},
}: EventProps) {
  const {
    name,
    type,
    image,
    origPrime,
    hhPermits,
    intCerts,
    intCertsIncluded,
    link,
    banner,
    datesPredicted,
  } = event;
  const hasIntCertsValue = intCertsIncluded && intCerts;
  const start = getEffectiveStart(event);
  const end = getEffectiveEnd(event);
  const startStr = start ? start.toLocaleDateString() : 'Unknown';
  const endStr = end ? end.toLocaleDateString() : 'Unknown';
  const [sixStarGroups, otherGroups] = banner ? splitOperatorColumns(banner.operators) : [[], []];

  return (
    <li
      className={`ak-events-list-item ${selectedEvents.has(name) ? 'selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        // The Intelligence Certificates checkbox/label is its own control nested
        // inside this otherwise-fully-clickable card — clicking it should toggle
        // that checkbox, not also select/deselect the event.
        if ((e.target as HTMLElement).closest('.ak-event-int-certs')) return;
        onEventToggle(name);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEventToggle(name);
        }
      }}
    >
      <div className="ak-event-row">
        <div className="ak-event">
          <div className="ak-event-title">
            <span className="ak-event-name">{name}</span>
            {type && <span className="ak-event-type">{type}</span>}
          </div>
          {image &&
            (() => {
              const { displaySrc } = jpgifyLocal(image);
              return (
                <div className="ak-event-image-wrap">
                  <img
                    className="ak-event-image"
                    src={displaySrc ?? undefined}
                    alt={`${name} banner`}
                  />
                </div>
              );
            })()}
          <div className="ak-event-meta">
            <div className="ak-event-date">
              {startStr} - {endStr}
              {datesPredicted && (
                <InfoButton label={<span className="ak-event-date-predicted">(estimated)</span>}>
                  Not yet confirmed for Global — a prediction based on the usual delay after this
                  event releases in China, and may shift.
                </InfoButton>
              )}
            </div>
            <div>
              {(origPrime || hhPermits || hasIntCertsValue) && (
                // The Orundum value itself is the hover/click trigger now — no
                // separate "Orundum" label needed, and no duplicate icon either.
                <InfoButton
                  label={
                    <span className="ak-event-orundum">
                      <Orundum withPulls>{calcEventOrundum(event)}</Orundum>
                    </span>
                  }
                >
                  <Breakdown
                    items={[
                      origPrime && <OriginitePrimeIcon key="op" />,
                      // A Headhunting Permit is redeemable as one pull, so it's
                      // labeled with the pull icon rather than its own text.
                      hhPermits && <PullIcon key="hh" />,
                      hasIntCertsValue && <IntCertsIcon key="ic" />,
                    ].filter(truthy)}
                    calcs={[
                      origPrime && `${origPrime} × 180`,
                      hhPermits && `${hhPermits} × 600`,
                      hasIntCertsValue && `${intCerts} × 5`,
                    ].filter(truthy)}
                    totals={[
                      origPrime && orundumFromOP(origPrime),
                      hhPermits && orundumFromHH(hhPermits),
                      hasIntCertsValue && orundumFromIntCerts(intCerts),
                    ].filter(truthy)}
                  />
                  Source:{' '}
                  <a href={link ?? undefined} target="_blank" rel="noopener noreferrer">
                    arknights.wiki.gg
                  </a>
                </InfoButton>
              )}
            </div>
          </div>
          {intCerts != null && (
            // A rerun's Intelligence Certificate total is a ceiling (the maximum if
            // the player already owns every substitutable reward — see
            // extractIntCertsFromHtml on the server), not a guaranteed amount like
            // origPrime/hhPermits, so it's opt-in rather than counted by default.
            <div className="ak-event-int-certs">
              <label>
                <input
                  type="checkbox"
                  checked={!!intCertsIncluded}
                  onChange={(e) => onToggleIntCerts(name, e.target.checked)}
                />
                <IntCertsIcon /> Intelligence Certificates (up to {intCerts})
              </label>
            </div>
          )}
        </div>
        {banner && (
          <div className="ak-event-banner">
            <div className="ak-event-banner-header">
              <span className="ak-event-banner-name">
                {banner.name === name ? 'Banner' : `Banner: ${banner.name}`}
              </span>
            </div>
            <div className="ak-event-banner-columns">
              <OperatorColumn groups={sixStarGroups} />
              <OperatorColumn groups={otherGroups} />
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
