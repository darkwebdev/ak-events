import React from 'react';
import { Event } from './index.jsx';

const baseEvent = {
  name: 'Ashes to Ashes, Ages on Ages',
  type: 'Side Story',
  image: '1280px-EN_The_Masses%27_Travels_banner.png',
  globalStart: '2026-07-16',
  globalEnd: '2026-07-30',
  cnStart: '2026-02-10',
  cnEnd: '2026-02-24',
  origPrime: 18,
  hhPermits: 3,
  link: 'https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages',
};

const defaultProps = {
  selectedEvents: new Set(),
  onEventToggle: () => {},
};

export default {
  title: 'Components/Event',
  component: Event,
};

export function NoBanner() {
  return (
    <ul className="ak-events-list">
      <Event event={{ ...baseEvent, banner: null }} {...defaultProps} />
    </ul>
  );
}

export function LimitedBanner() {
  const banner = {
    name: 'Ashes to Ashes, Ages on Ages',
    type: 'Limited',
    sparkEligible: true,
    sparkCost: 300,
    operators: [
      {
        name: "Ch'en the Dawnstreak",
        star: 6,
        class: 'Guard',
        limited: false,
        icon: null,
      },
      { name: 'Chongyue', star: 6, class: 'Guard', limited: true, icon: null },
      { name: 'Shu', star: 6, class: 'Defender', limited: true, icon: null },
      { name: 'Taraxacum', star: 5, class: 'Medic', limited: false, icon: null },
    ],
  };
  return (
    <ul className="ak-events-list">
      <Event event={{ ...baseEvent, banner }} {...defaultProps} />
    </ul>
  );
}

export function StandardBanner() {
  const banner = {
    name: 'Joint Operation #21',
    type: 'Standard',
    sparkEligible: false,
    sparkCost: null,
    operators: [
      { name: 'Mudrock', star: 6, class: 'Defender', limited: false, icon: null },
      { name: 'Whisperain', star: 5, class: 'Medic', limited: false, icon: null },
    ],
  };
  return (
    <ul className="ak-events-list">
      <Event event={{ ...baseEvent, banner }} {...defaultProps} />
    </ul>
  );
}

export function Selected() {
  const banner = {
    name: 'Ashes to Ashes, Ages on Ages',
    type: 'Limited',
    sparkEligible: true,
    sparkCost: 300,
    operators: [{ name: 'Chongyue', star: 6, class: 'Guard', limited: true, icon: null }],
  };
  return (
    <ul className="ak-events-list">
      <Event
        event={{ ...baseEvent, banner }}
        selectedEvents={new Set([baseEvent.name])}
        onEventToggle={() => {}}
      />
    </ul>
  );
}
