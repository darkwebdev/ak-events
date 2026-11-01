import React, { useContext, useState } from 'react';
import { jpgifyLocal } from '../../utils/images.js';
import {
  getEffectiveStart,
  getEffectiveEnd,
  getBannerDates,
  parseDate,
} from '../../utils/dates.js';
import { splitOperatorColumns, type StarGroups } from '../../utils/operators.js';
import { InfoButton } from '../InfoButton';
import { Operator } from '../Operator';
import { EventOrundum } from '../EventOrundum';
import { IntCertsIcon } from '../IntCertsIcon';
import { DateText } from '../DateText';
import { Countdown } from '../Countdown';
import { BannerProgressContext } from '../../ownedOperators.js';
import type { Event as EventType, SelectedEvents } from '../../types.js';
import './index.css';

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

// The linked account's progress on this banner, once the banner is in the game's own
// data (its gachaPoolId etc. — see bannerPoolFrom on the server): pulls made here,
// Headhunting Data Contracts held, its own ten-roll permit, and how far the free
// operator at 300 pulls is. Nothing without a linked account or before then.
const FREE_OPERATOR_PULLS = 300;

function AccountBannerProgress({ banner }: { banner: NonNullable<EventType['banner']> }) {
  const progress = useContext(BannerProgressContext);
  if (!progress || !banner.gachaPoolId) return null;
  const pool = progress.pools[banner.gachaPoolId];
  const contracts = banner.contractItemId ? progress.items[banner.contractItemId] ?? 0 : 0;
  const tenRolls = banner.tenRollItemId ? progress.items[banner.tenRollItemId] ?? 0 : 0;
  const parts = [
    pool && `${pool.pulls} ${pool.pulls === 1 ? 'pull' : 'pulls'} here`,
    contracts > 0 && `${contracts} ${contracts === 1 ? 'contract' : 'contracts'}`,
    tenRolls > 0 && `${tenRolls} banner ten-roll ${tenRolls === 1 ? 'permit' : 'permits'}`,
  ].filter(Boolean);
  if (!parts.length) return null;
  let freeOperator: string | null = null;
  if (pool?.freeCharClaimed) freeOperator = 'Free operator claimed';
  else if (pool)
    freeOperator = `${Math.max(0, FREE_OPERATOR_PULLS - pool.pulls)} more to the free operator`;
  return (
    <div className="ak-event-banner-progress">
      You: {parts.join(' · ')}
      {freeOperator && <div>{freeOperator}</div>}
    </div>
  );
}

export function Event({
  event,
  selectedEvents,
  onEventToggle,
  onToggleIntCerts = () => {},
}: EventProps) {
  const { name, type, image, intCerts, intCertsIncluded, banner, datesPredicted } = event;
  const start = getEffectiveStart(event);
  const end = getEffectiveEnd(event);
  const startStr = start ? <DateText date={start} /> : 'Unknown';
  const endStr = end ? <DateText date={end} /> : 'Unknown';
  // A banner's own run dates, which can differ from its event's — absent in data
  // scraped before they were added, in which case the range is simply omitted.
  const bannerDates = banner ? getBannerDates(banner, event) : null;
  // Countdowns use the exact start/end moments where the scraper found them (the game's
  // activity table for events, the banner pages' wikitext for banners); otherwise the
  // calendar dates, counted in whole days.
  const exactEvent = event.globalStartAt && event.globalEndAt;
  const exactBanner = banner?.globalStartAt && banner.globalEndAt;
  const bannerStartAt = exactBanner ? new Date(banner.globalStartAt as string) : bannerDates?.start;
  const bannerEndAt = exactBanner ? new Date(banner.globalEndAt as string) : bannerDates?.end;
  const [sixStarGroups, otherGroups] = banner ? splitOperatorColumns(banner.operators) : [[], []];
  // Phones show a banner collapsed to just its name until tapped (index.css).
  const [bannerExpanded, setBannerExpanded] = useState(false);

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
                  {event.cnStart && event.cnEnd && (
                    <>
                      {' '}
                      In CN it ran <DateText date={parseDate(event.cnStart)} /> -{' '}
                      <DateText date={parseDate(event.cnEnd)} />.
                    </>
                  )}
                </InfoButton>
              )}
              <Countdown
                start={exactEvent ? new Date(event.globalStartAt as string) : start}
                end={exactEvent ? new Date(event.globalEndAt as string) : end}
                exact={!!exactEvent}
              />
            </div>
            <div>
              <EventOrundum event={event} />
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
              {/* A button so phones can expand the collapsed banner (see index.css);
                  on wider screens it's plain text and the banner is always open. Its
                  click mustn't reach the card, which toggles the event's selection. */}
              <button
                type="button"
                className="ak-event-banner-toggle"
                aria-expanded={bannerExpanded}
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerExpanded((open) => !open);
                }}
              >
                <span className="ak-event-banner-name">
                  {banner.name === name ? 'Banner' : `Banner: ${banner.name}`}
                </span>
                <span className="ak-event-banner-chevron" aria-hidden="true">
                  ▾
                </span>
              </button>
            </div>
            <div className={`ak-event-banner-body${bannerExpanded ? ' expanded' : ''}`}>
              <AccountBannerProgress banner={banner} />
              <div className="ak-event-banner-columns">
                <OperatorColumn groups={sixStarGroups} />
                <OperatorColumn groups={otherGroups} />
              </div>
              {banner.storeOperators?.length ? (
                // Not rate-ups: the series' earlier limited operators, which this banner's
                // Headhunting Data Contract Store also sells.
                <div className="ak-operator-group ak-event-banner-store">
                  <InfoButton label={<span className="ak-operator-group-label">Store</span>}>
                    Not on the rate-up list, but also sold in this banner&apos;s Headhunting Data
                    Contract Store: 300, or 200 for operators 4+ years past their debut (5+ for
                    Festival ones) or discounted by the event.
                  </InfoButton>
                  <div className="ak-operator-group-badges">
                    {/* Newest first: storeOperators is in the series' debut order, oldest
                      first — so this also puts full price (300) before the aged-out 200s. */}
                    {[...banner.storeOperators].reverse().map((op) => (
                      <Operator key={op.name} operator={op} />
                    ))}
                  </div>
                </div>
              ) : null}
              {bannerDates?.start && bannerDates.end && (
                <div className="ak-event-banner-date">
                  <DateText date={bannerDates.start} /> - <DateText date={bannerDates.end} />
                  {bannerDates.estimated && (
                    <InfoButton
                      label={<span className="ak-event-date-predicted">(estimated)</span>}
                    >
                      Not yet confirmed for Global — based on this banner&apos;s CN dates and how
                      long after CN this event reaches Global.
                    </InfoButton>
                  )}
                  <Countdown
                    start={bannerStartAt ?? null}
                    end={bannerEndAt ?? null}
                    exact={!!exactBanner}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
