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

const limitedOperators = [
  { name: "Ch'en the Dawnstreak", star: 6, class: 'Guard', limited: false, icon: null },
  { name: 'Chongyue', star: 6, class: 'Guard', limited: true, icon: null },
  { name: 'Shu', star: 6, class: 'Defender', limited: true, icon: null },
  { name: 'Taraxacum', star: 5, class: 'Medic', limited: false, icon: null },
];

const standardOperators = [
  { name: 'Mudrock', star: 6, class: 'Defender', limited: false, icon: null },
  { name: 'Whisperain', star: 5, class: 'Medic', limited: false, icon: null },
];

const discountableOperatorNames = limitedOperators
  .filter((op) => op.star === 6)
  .map((op) => op.name);

function sparkCostFor(op, discountedOperator) {
  if (op.star === 6) return op.name === discountedOperator ? 200 : 300;
  if (op.star === 5) return 75;
  return null;
}

function buildBanner(bannerType, discountedOperator) {
  if (bannerType === 'Standard') {
    return {
      name: 'Joint Operation #21',
      type: 'Standard',
      sparkEligible: false,
      operators: standardOperators.map((op) => ({ ...op, sparkCost: null })),
    };
  }
  if (bannerType === 'Limited') {
    return {
      name: baseEvent.name,
      type: 'Limited',
      sparkEligible: true,
      operators: limitedOperators.map((op) => ({
        ...op,
        sparkCost: sparkCostFor(op, discountedOperator),
      })),
    };
  }
  return null;
}

function renderEvent({ bannerType, selected, discountedOperator }) {
  const banner = buildBanner(bannerType, discountedOperator);
  return (
    <ul className="ak-events-list">
      <Event
        event={{ ...baseEvent, banner }}
        selectedEvents={selected ? new Set([baseEvent.name]) : new Set()}
        onEventToggle={() => {}}
      />
    </ul>
  );
}

export default {
  title: 'Components/Event',
  component: Event,
  argTypes: {
    bannerType: {
      control: 'select',
      options: ['None', 'Limited', 'Standard'],
      description: 'Which banner (if any) is attached to the event',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the event card is shown selected',
    },
    discountedOperator: {
      control: 'select',
      options: ['None', ...discountableOperatorNames],
      description:
        'Which 6★ operator (if any) currently has a reduced 200-contract spark cost. Only applies to Limited banners.',
    },
  },
  render: renderEvent,
};

export const NoBanner = {
  args: { bannerType: 'None', selected: false, discountedOperator: 'None' },
};

export const LimitedBanner = {
  args: { bannerType: 'Limited', selected: false, discountedOperator: 'Chongyue' },
};

export const StandardBanner = {
  args: { bannerType: 'Standard', selected: false, discountedOperator: 'None' },
};

export const Selected = {
  args: { bannerType: 'Limited', selected: true, discountedOperator: 'None' },
};
