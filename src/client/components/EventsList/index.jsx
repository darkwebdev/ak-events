import React from 'react';
import { calcTotalOrundum } from '../../utils/orundum.js';
import { Orundum } from '../Orundum';
import { Event } from '../Event';
import './index.css';

export function EventsList({ filteredEvents, selectedEvents, onEventToggle, onToggleIntCerts }) {
  const totalEventsOrundum = calcTotalOrundum(filteredEvents, selectedEvents, 0, 0);

  return (
    <div className="ak-events">
      {filteredEvents.length === 0 ? (
        <div className="ak-empty-row">No upcoming events</div>
      ) : (
        <ul className="ak-events-list">
          {filteredEvents.map((event) => (
            <Event
              key={event.name}
              event={event}
              selectedEvents={selectedEvents}
              onEventToggle={onEventToggle}
              onToggleIntCerts={onToggleIntCerts}
            />
          ))}
        </ul>
      )}

      <div className="ak-events-footer">
        <strong>
          Total from events: <Orundum withPulls>{totalEventsOrundum}</Orundum>
        </strong>
      </div>
    </div>
  );
}
