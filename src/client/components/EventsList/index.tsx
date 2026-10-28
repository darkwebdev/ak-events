import React from 'react';
import { calcTotalOrundum } from '../../utils/orundum.js';
import { Orundum } from '../Orundum';
import { Event } from '../Event';
import { NO_EVENT_FILTERS, type EventFilters } from '../../utils/events.js';
import type { Event as EventType, SelectedEvents } from '../../types.js';
import './index.css';

interface EventsListProps {
  // The events shown, after the filters below.
  filteredEvents: EventType[];
  // Every upcoming event, for the total: a selected event the filters hide still
  // counts. Defaults to filteredEvents.
  allEvents?: EventType[];
  filters?: EventFilters;
  onFiltersChange?: (filters: EventFilters) => void;
  selectedEvents: SelectedEvents;
  onEventToggle: (eventName: string) => void;
  onToggleIntCerts?: (eventName: string, checked: boolean) => void;
}

export function EventsList({
  filteredEvents,
  allEvents = filteredEvents,
  filters = NO_EVENT_FILTERS,
  onFiltersChange,
  selectedEvents,
  onEventToggle,
  onToggleIntCerts,
}: EventsListProps) {
  const totalEventsOrundum = calcTotalOrundum(allEvents, selectedEvents, 0, 0);
  const filtering = filters.rewardsOnly || filters.limitedOnly;

  return (
    <div className="ak-events">
      {onFiltersChange && (
        <div className="ak-events-filters" role="group" aria-label="Filter events">
          <label>
            <input
              type="checkbox"
              checked={filters.limitedOnly}
              onChange={(e) => onFiltersChange({ ...filters, limitedOnly: e.target.checked })}
            />
            Only limited
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.rewardsOnly}
              onChange={(e) => onFiltersChange({ ...filters, rewardsOnly: e.target.checked })}
            />
            Only with rewards
          </label>
        </div>
      )}
      {filteredEvents.length === 0 ? (
        <div className="ak-empty-row">
          {filtering && allEvents.length
            ? 'No upcoming events match the filters'
            : 'No upcoming events'}
        </div>
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
