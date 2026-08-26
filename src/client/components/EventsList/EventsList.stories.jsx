import React from 'react';
import { EventsList } from './index.jsx';

const mockEvents = [
  {
    name: 'Event A',
    orundum: 300,
    globalStart: '2025-10-20',
    globalEnd: '2025-10-25',
    image: '1280px-EN_The_Masses%27_Travels_banner.png',
  },
  {
    name: 'Event B',
    orundum: 150,
    globalStart: '2025-11-01',
    globalEnd: '2025-11-05',
    image: '1280px-EN_Duel_Channel_Green_Grassville_banner.png',
  },
];
const defaultProps = {
  filteredEvents: mockEvents.map((e) => ({ ...e, cnStart: e.globalStart })),
  selectedEvents: new Set(['Event A']),
  onEventToggle: () => {},
  settingsTotal: 100,
  playerOrundumTotal: 500,
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
  selectedEvents: new Set(),
  onEventToggle: () => {},
  settingsTotal: 100,
  playerOrundumTotal: 500,
};

export function NoEvents() {
  return <EventsList {...noEventsProps} />;
}

const manyEvents = [
  {
    name: 'Event A',
    orundum: 300,
    globalStart: '2025-10-20',
    globalEnd: '2025-10-25',
    image: '1280px-EN_The_Masses%27_Travels_banner.png',
  },
  {
    name: 'Event B',
    orundum: 150,
    globalStart: '2025-11-01',
    globalEnd: '2025-11-05',
    image: '1280px-EN_Duel_Channel_Green_Grassville_banner.png',
  },
  {
    name: 'Event C',
    orundum: 400,
    globalStart: '2025-11-10',
    globalEnd: '2025-11-15',
    image: '1280px-EN_Integrated_Lookback_Back_to_Castle_banner.png',
  },
  {
    name: 'Event D',
    orundum: 250,
    globalStart: '2025-11-20',
    globalEnd: '2025-11-25',
    image: '1280px-CN_Vector_Breakthrough_Mechanist_banner.png',
  },
  {
    name: 'Event E',
    orundum: 180,
    globalStart: '2025-12-01',
    globalEnd: '2025-12-05',
    image: '1280px-CN_Act_or_Die_banner.png',
  },
];

const manyEventsProps = {
  filteredEvents: manyEvents.map((e) => ({ ...e, cnStart: e.globalStart })),
  selectedEvents: new Set(['Event A', 'Event C', 'Event E']),
  onEventToggle: () => {},
  settingsTotal: 200,
  playerOrundumTotal: 1000,
};

export function ManyEvents() {
  return <EventsList {...manyEventsProps} />;
}

const allSelectedProps = {
  filteredEvents: mockEvents.map((e) => ({ ...e, cnStart: e.globalStart })),
  selectedEvents: new Set(['Event A', 'Event B']),
  onEventToggle: () => {},
  settingsTotal: 100,
  playerOrundumTotal: 500,
};

export function AllSelected() {
  return <EventsList {...allSelectedProps} />;
}

function makeBanner(name) {
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
const mixedBannerEvents = manyEvents.map((e, i) => ({
  ...e,
  cnStart: e.globalStart,
  banner: i % 2 === 0 ? makeBanner(`Banner: ${e.name}`) : null,
}));

const mixedBannersProps = {
  filteredEvents: mixedBannerEvents,
  selectedEvents: new Set(),
  onEventToggle: () => {},
  settingsTotal: 200,
  playerOrundumTotal: 1000,
};

export function MixedBanners() {
  return <EventsList {...mixedBannersProps} />;
}
