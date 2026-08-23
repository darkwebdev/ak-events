import React from 'react';
import { jpgifyLocal } from '../../utils/images.js';
import { getEffectiveStart, getEffectiveEnd } from '../../utils/dates.js';
import { calcEventOrundum, orundumFromOP, orundumFromHH } from '../../utils/orundum.js';
import { splitOperatorColumns } from '../../utils/operators.js';
import { Orundum } from '../Orundum';
import { InfoButton } from '../InfoButton';
import { Breakdown } from '../Breakdown';
import { OperatorBadge } from '../OperatorBadge';
import './index.css';

function OperatorColumn({ groups }) {
  if (!groups.length) return null;
  return (
    <div className="ak-operator-column">
      {groups.map(([star, ops]) => (
        <div className="ak-operator-group" key={star}>
          {star > 0 && <span className="ak-operator-group-label">{star}★</span>}
          <div className="ak-operator-group-badges">
            {ops.map((op) => (
              <OperatorBadge key={op.name} operator={op} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Event({ event, selectedEvents, onEventToggle }) {
  const { name, type, image, origPrime, hhPermits, link, banner } = event;
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
      onClick={() => onEventToggle(name)}
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
                  <img className="ak-event-image" src={displaySrc} alt={`${name} banner`} />
                </div>
              );
            })()}
          <div className="ak-event-meta">
            <div className="ak-event-date">
              {startStr} - {endStr}
            </div>
            <div>
              {(origPrime || hhPermits) && (
                <>
                  <InfoButton label="Orundum">
                    <Breakdown
                      items={[origPrime && 'OP', hhPermits && 'HH Permits'].filter(Boolean)}
                      calcs={[
                        origPrime && `${origPrime} × 180`,
                        hhPermits && `${hhPermits} × 600`,
                      ].filter(Boolean)}
                      totals={[
                        origPrime && orundumFromOP(origPrime),
                        hhPermits && orundumFromHH(hhPermits),
                      ].filter(Boolean)}
                    />
                    Source:{' '}
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      arknights.wiki.gg
                    </a>
                  </InfoButton>
                  :&nbsp;
                  <span className="ak-event-orundum">
                    <Orundum withPulls>{calcEventOrundum(event)}</Orundum>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {banner && (
          <div className="ak-event-banner">
            <div className="ak-event-banner-header">
              <span className="ak-event-banner-name">Banner: {banner.name}</span>
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
