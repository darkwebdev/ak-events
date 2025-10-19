import React from 'react';
import { calcTotalOrundum, pullsFromOrundum } from '../../utils/orundum.js';
import { formatEventDates, calculateDaysBetween, getEffectiveStart, getEffectiveEnd } from '../../utils/dates.js';
import { InfoButton } from "../InfoButton";
import { Orundum } from '../Orundum';
import './index.css';
import { Breakdown } from '../Breakdown/index.jsx';
import { normalizeImageSrc } from '../../utils/images.js';

/**
 * Component for displaying events list with calculations
 */
export function EventsList({ filteredEvents, selectedEvents, onEventToggle, settingsTotal, playerOrundumTotal: ownedOrundum }) {
  const totalEventsOrundum = calcTotalOrundum(filteredEvents, selectedEvents, 0, 0);
  const totalEventsPulls = pullsFromOrundum(totalEventsOrundum);
  
  // Calculate the maximum days between now and the latest selected event's effective start
  // This ensures daily income is counted only up to selected events, not all future events.
  const selectedList = filteredEvents.filter(ev => selectedEvents.has(ev.name));
  const eventStarts = selectedList.map(event => getEffectiveStart(event)).filter(Boolean);
  const maxDays = eventStarts.length > 0
    ? Math.max(...eventStarts.map(start => calculateDaysBetween(start)))
    : 0;
  const latestEventStart = eventStarts.length > 0
    ? new Date(Math.max(...eventStarts.map(start => start.getTime())))
    : null;
  
  const dailyOrundum = settingsTotal * maxDays;
  const totalOrundum = calcTotalOrundum(filteredEvents, selectedEvents, dailyOrundum, ownedOrundum);
  const totalPulls = pullsFromOrundum(totalOrundum);

  return (
    <div className="ak-events">
      {filteredEvents.length === 0 ? (
        <div className="ak-empty-row">No upcoming events</div>
      ) : (
        <ul className="ak-events-list">
          {filteredEvents.map(event => {
            const start = getEffectiveStart(event);
            const end = getEffectiveEnd(event);
            const startStr = start ? start.toLocaleDateString() : 'Unknown';
            const endStr = end ? end.toLocaleDateString() : 'Unknown';
            return (
              <li
                key={event.name}
                className={`ak-events-list-item ${selectedEvents.has(event.name) ? 'selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onEventToggle(event.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEventToggle(event.name);
                  }
                }}
              >
                <div className="ak-event">
                  <div className="ak-event-title">{event.name}</div>
                  {event.image && (() => {
                    const raw = event.image;
                    const prefixed = (raw.startsWith('/') || raw.startsWith('http')) ? raw : `/data/images/${raw}`;
                    const imgSrc = normalizeImageSrc(prefixed);
                    return (
                      <div className="ak-event-image-wrap">
                        <img
                          className="ak-event-image"
                          src={imgSrc}
                          alt={`${event.name} banner`}
                        />
                      </div>
                    );
                  })()}
                  <div className="ak-event-meta">
                    <div className="ak-event-date">{startStr} - {endStr}</div>
                    <div className="ak-event-orundum"><Orundum withPulls>{event.orundum}</Orundum></div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="ak-events-footer">
        <div className="ak-events-footer-left">
          <strong><InfoButton label="Total Orundum from events">
            Amount of Orundum that can be earned from {selectedList.length} selected events
          </InfoButton></strong>
        </div>
        <div className="ak-events-footer-right">
          <Orundum withPulls>{totalEventsOrundum}</Orundum>
        </div>
      </div>
    </div>
  );
}