import React from 'react';
import { getEffectiveStart, getEffectiveEnd, getBannerDates } from '../../utils/dates.js';
import { DateText } from '../DateText';
import { Countdown } from '../Countdown';
import { EventOrundum } from '../EventOrundum';
import { IntCertsIcon } from '../IntCertsIcon';
import type { Event as EventType, ResolvedBannerOperator, SelectedEvents } from '../../types.js';
import './index.css';

interface EventRowProps {
  event: EventType;
  selectedEvents: SelectedEvents;
  onEventToggle: (eventName: string) => void;
  onToggleIntCerts?: (eventName: string, checked: boolean) => void;
}

// The banner's headline operators as text: its 6★ rate-ups, or its top-rarity ones
// when it has no 6★ (e.g. a 5★-only banner).
function headlineOperators(operators: ResolvedBannerOperator[]): ResolvedBannerOperator[] {
  const top = Math.max(0, ...operators.map((op) => op.star ?? 0));
  return operators.filter((op) => (op.star ?? 0) === top);
}

// One event as a single dense row of the list view: no images, everything as text.
// Selecting works the same as on a card (see Event): the whole row is the toggle.
export function EventRow({
  event,
  selectedEvents,
  onEventToggle,
  onToggleIntCerts = () => {},
}: EventRowProps) {
  const { name, type, banner, datesPredicted, intCerts, intCertsIncluded } = event;
  const selected = selectedEvents.has(name);
  const start = getEffectiveStart(event);
  const end = getEffectiveEnd(event);
  const exactEvent = event.globalStartAt && event.globalEndAt;
  const bannerDates = banner ? getBannerDates(banner, event) : null;
  // Only worth a mention when the banner runs on different days from its event.
  const bannerDatesDiffer =
    bannerDates?.start &&
    bannerDates.end &&
    (bannerDates.start.getTime() !== start?.getTime() ||
      bannerDates.end.getTime() !== end?.getTime());
  const headliners = banner ? headlineOperators(banner.operators) : [];

  return (
    <li
      className={`ak-event-row-compact${selected ? ' selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={(e) => {
        // The Intelligence Certificates checkbox is its own control inside the row.
        if ((e.target as HTMLElement).closest('.ak-erc-int-certs')) return;
        onEventToggle(name);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEventToggle(name);
        }
      }}
    >
      <span className="ak-erc-check" aria-hidden="true">
        {selected ? '✓' : ''}
      </span>
      <div className="ak-erc-name">
        <span className="ak-erc-title">{name}</span>
        {type && <span className="ak-erc-type">{type}</span>}
      </div>
      <div className="ak-erc-dates">
        <span className="ak-erc-range">
          {start ? <DateText date={start} /> : '?'} – {end ? <DateText date={end} /> : '?'}
          {datesPredicted && (
            <abbr className="ak-erc-estimated" title="Estimated from the CN release">
              {' '}
              est.
            </abbr>
          )}
        </span>
        <Countdown
          start={exactEvent ? new Date(event.globalStartAt as string) : start}
          end={exactEvent ? new Date(event.globalEndAt as string) : end}
          exact={!!exactEvent}
        />
      </div>
      <div className="ak-erc-banner">
        {banner ? (
          <>
            <span className={`ak-erc-banner-type${banner.type === 'Limited' ? ' limited' : ''}`}>
              {banner.type}
            </span>{' '}
            {headliners.map((op, i) => (
              <React.Fragment key={op.name}>
                {i > 0 && ', '}
                <span className="ak-erc-op">
                  {op.star ? `${op.star}★ ` : ''}
                  {op.name}
                </span>
              </React.Fragment>
            ))}
            {bannerDatesDiffer && (
              <span className="ak-erc-banner-dates">
                {' '}
                (<DateText date={bannerDates!.start!} /> – <DateText date={bannerDates!.end!} />)
              </span>
            )}
          </>
        ) : (
          <span className="ak-erc-none">—</span>
        )}
      </div>
      <div className="ak-erc-pulls">
        <EventOrundum event={event} />
        {intCerts != null && (
          <label className="ak-erc-int-certs" title="Count Intelligence Certificates">
            <input
              type="checkbox"
              checked={!!intCertsIncluded}
              onChange={(e) => onToggleIntCerts(name, e.target.checked)}
            />
            <IntCertsIcon /> ≤{intCerts}
          </label>
        )}
      </div>
    </li>
  );
}
