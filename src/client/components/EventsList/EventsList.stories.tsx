import React from 'react';
import { EventsList } from './index.jsx';
import type { Event, ResolvedBanner } from '../../types.js';

function makeEvent(
  partial: Partial<Event> & Pick<Event, 'name' | 'globalStart' | 'globalEnd'>
): Event {
  return {
    type: null,
    image: null,
    start: null,
    end: null,
    cnStart: partial.globalStart,
    cnEnd: partial.globalEnd,
    datesPredicted: false,
    link: null,
    origPrime: null,
    hhPermits: null,
    intCerts: null,
    ...partial,
  };
}

const mockEvents: Event[] = [
  makeEvent({
    name: 'Event A',
    globalStart: '2025-10-20',
    globalEnd: '2025-10-25',
    image: '1280px-EN_The_Masses%27_Travels_banner.png',
  }),
  makeEvent({
    name: 'Event B',
    globalStart: '2025-11-01',
    globalEnd: '2025-11-05',
    image: '1280px-EN_Duel_Channel_Green_Grassville_banner.png',
  }),
];

const defaultProps = {
  filteredEvents: mockEvents,
  selectedEvents: new Set(['Event A']),
  onEventToggle: () => {},
};

export default {
  title: 'Components/EventsList',
  component: EventsList,
};

export function Default() {
  return <EventsList {...defaultProps} />;
}

const noEventsProps = {
  filteredEvents: [],
  selectedEvents: new Set<string>(),
  onEventToggle: () => {},
};

export function NoEvents() {
  return <EventsList {...noEventsProps} />;
}

const manyEvents: Event[] = [
  makeEvent({
    name: 'Event A',
    globalStart: '2025-10-20',
    globalEnd: '2025-10-25',
    image: '1280px-EN_The_Masses%27_Travels_banner.png',
  }),
  makeEvent({
    name: 'Event B',
    globalStart: '2025-11-01',
    globalEnd: '2025-11-05',
    image: '1280px-EN_Duel_Channel_Green_Grassville_banner.png',
  }),
  makeEvent({
    name: 'Event C',
    globalStart: '2025-11-10',
    globalEnd: '2025-11-15',
    image: '1280px-EN_Integrated_Lookback_Back_to_Castle_banner.png',
  }),
  makeEvent({
    name: 'Event D',
    globalStart: '2025-11-20',
    globalEnd: '2025-11-25',
    image: '1280px-CN_Vector_Breakthrough_Mechanist_banner.png',
  }),
  makeEvent({
    name: 'Event E',
    globalStart: '2025-12-01',
    globalEnd: '2025-12-05',
    image: '1280px-CN_Act_or_Die_banner.png',
  }),
];

const manyEventsProps = {
  filteredEvents: manyEvents,
  selectedEvents: new Set(['Event A', 'Event C', 'Event E']),
  onEventToggle: () => {},
};

export function ManyEvents() {
  return <EventsList {...manyEventsProps} />;
}

const allSelectedProps = {
  filteredEvents: mockEvents,
  selectedEvents: new Set(['Event A', 'Event B']),
  onEventToggle: () => {},
};

export function AllSelected() {
  return <EventsList {...allSelectedProps} />;
}

function makeBanner(name: string): ResolvedBanner {
  return {
    name,
    type: 'Limited',
    sparkEligible: true,
    operators: [
      { name: 'Chongyue', star: 6, class: 'Guard', limited: true, icon: null, sparkCost: 300 },
      { name: 'Taraxacum', star: 5, class: 'Medic', limited: false, icon: null, sparkCost: null },
    ],
  };
}

// Real event lists are a mix — most events have a matching banner, some don't (an
// event whose banner data hasn't been scraped/matched yet, or one with no gacha
// banner at all). Alternates banner/no-banner across manyEvents so both the
// side-by-side (banner present) and narrowed-card (banner absent) layouts from
// Event/index.css are visible together, in the same list, rather than only in
// Event.stories.jsx's isolated NoBannerWidthComparison.
const mixedBannerEvents: Event[] = manyEvents.map((e, i) => ({
  ...e,
  banner: i % 2 === 0 ? makeBanner(`Banner: ${e.name}`) : null,
}));

const mixedBannersProps = {
  filteredEvents: mixedBannerEvents,
  selectedEvents: new Set<string>(),
  onEventToggle: () => {},
};

export function MixedBanners() {
  return <EventsList {...mixedBannersProps} />;
}
