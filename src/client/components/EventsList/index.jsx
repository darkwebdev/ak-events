import React from 'react';
import { calcTotalOrundum } from '../../utils/orundum.js';
import { getEffectiveStart, getEffectiveEnd } from '../../utils/dates.js';
import { Orundum } from '../Orundum';
import './index.css';
import { jpgifyLocal } from '../../utils/images.js';

/**
 * Component for displaying events list with calculations
 */
export function EventsList({
  filteredEvents,
  selectedEvents,
  onEventToggle,
  settingsTotal,
  playerOrundumTotal: ownedOrundum,
}) {
  const totalEventsOrundum = calcTotalOrundum(filteredEvents, selectedEvents, 0, 0);

  // derived list left intentionally unused for now (kept for future UI)

  return (
    <div className="ak-events">
      {filteredEvents.length === 0 ? (
        <div className="ak-empty-row">No upcoming events</div>
      ) : (
        <ul className="ak-events-list">
          {filteredEvents.map((event) => {
            const start = getEffectiveStart(event);
            const end = getEffectiveEnd(event);
            const startStr = start ? start.toLocaleDateString() : 'Unknown';
            const endStr = end ? end.toLocaleDateString() : 'Unknown';
            return (
              <li
                key={event.name}
                className={`ak-events-list-item ${
                  selectedEvents.has(event.name) ? 'selected' : ''
                }`}
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
                  <div className="ak-event-title">
                    <span className="ak-event-name">{event.name}</span>
                    {event.type && <span className="ak-event-type">{event.type}</span>}
                  </div>
                  {event.image &&
                    (() => {
                      const raw = event.image;
                      const prefixed =
                        raw.startsWith('/') || raw.startsWith('http') ? raw : `/data/images/${raw}`;
                      // prefer jpg sibling for display, but link to original image
                      const { displaySrc, originalSrc } = jpgifyLocal(prefixed);
                      return (
                        <div className="ak-event-image-wrap">
                          <a href={originalSrc} target="_blank" rel="noopener noreferrer">
                            <img
                              className="ak-event-image"
                              src={displaySrc}
                              alt={`${event.name} banner`}
                            />
                          </a>
                        </div>
                      );
                    })()}
                  <div className="ak-event-meta">
                    <div className="ak-event-date">
                      {startStr} - {endStr}
                    </div>
                    <div className="ak-event-orundum">
                      <Orundum withPulls>{event.orundum}</Orundum>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="ak-events-footer">
        <div className="ak-events-footer-left">
          <strong>Total Orundum from events</strong>
        </div>
        <div className="ak-events-footer-right">
          <Orundum withPulls>{totalEventsOrundum}</Orundum>
        </div>
      </div>
    </div>
  );
}
