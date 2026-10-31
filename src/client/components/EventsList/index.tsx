import React from 'react';
import { calcTotalOrundum } from '../../utils/orundum.js';
import { Orundum } from '../Orundum';
import { Event } from '../Event';
import { EventRow } from '../EventRow';
import { NO_EVENT_FILTERS, type EventFilters } from '../../utils/events.js';
import type { Event as EventType, SelectedEvents } from '../../types.js';
import './index.css';

// How the events are shown: picture cards, or a dense text-only list.
export type EventsView = 'cards' | 'list';

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
  view?: EventsView;
  onViewChange?: (view: EventsView) => void;
}

export function EventsList({
  filteredEvents,
  allEvents = filteredEvents,
  filters = NO_EVENT_FILTERS,
  onFiltersChange,
  selectedEvents,
  onEventToggle,
  onToggleIntCerts,
  view = 'cards',
  onViewChange,
}: EventsListProps) {
  const totalEventsOrundum = calcTotalOrundum(allEvents, selectedEvents, 0, 0);
  const filtering = filters.rewardsOnly || filters.limitedOnly;

  const events =
    view === 'list' ? (
      <ul className="ak-events-table">
        <li className="ak-events-table-head" aria-hidden="true">
          <span />
          <span>Event</span>
          <span>Dates</span>
          <span>Banner</span>
          <span className="ak-events-table-head-pulls">Pulls</span>
        </li>
        {filteredEvents.map((event) => (
          <EventRow
            key={event.name}
            event={event}
            selectedEvents={selectedEvents}
            onEventToggle={onEventToggle}
            onToggleIntCerts={onToggleIntCerts}
          />
        ))}
      </ul>
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
    );

  return (
    <div className="ak-events">
      {(onFiltersChange || onViewChange) && (
        <div className="ak-events-toolbar">
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
          {onViewChange && (
            <div className="ak-events-view-toggle" role="group" aria-label="Show events as">
              {(['cards', 'list'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => onViewChange(v)}
                >
                  {v === 'cards' ? 'Cards' : 'List'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {filteredEvents.length === 0 ? (
        <div className="ak-empty-row">
          {filtering && allEvents.length
            ? 'No upcoming events match the filters'
            : 'No upcoming events'}
        </div>
      ) : (
        events
      )}

      <div className="ak-events-footer">
        <strong>
          Total from events: <Orundum withPulls>{totalEventsOrundum}</Orundum>
        </strong>
      </div>
    </div>
  );
}
