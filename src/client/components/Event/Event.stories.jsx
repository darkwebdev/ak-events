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

function sparkCostFor(op, discountedOperators) {
  // Spark redemption is a limited-exclusive perk — a non-limited operator (a
  // standard/guest op featured on an otherwise-limited banner) never has a spark cost.
  if (!op.limited) return null;
  // The wiki names a growing list of discounted 6★ operators, not just one — more get
  // added every year — so this checks membership in a list, not equality with a
  // single name.
  if (op.star === 6) return discountedOperators.includes(op.name) ? 200 : 300;
  if (op.star === 5) return 75;
  return null;
}

function buildBanner(bannerType, discountedOperators) {
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
        sparkCost: sparkCostFor(op, discountedOperators),
      })),
    };
  }
  return null;
}

function renderEvent({ bannerType, selected, discountedOperators }) {
  const banner = buildBanner(bannerType, discountedOperators);
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
    discountedOperators: {
      control: 'multi-select',
      options: discountableOperatorNames,
      description:
        // The wiki accumulates more of these every year, not just one at a time.
        '6★ operators that currently have a reduced 200-contract spark cost. Only applies to Limited banners.',
    },
  },
  render: renderEvent,
};

export const NoBanner = {
  args: { bannerType: 'None', selected: false, discountedOperators: [] },
};

export const LimitedBanner = {
  args: { bannerType: 'Limited', selected: false, discountedOperators: ['Chongyue'] },
};

export const StandardBanner = {
  args: { bannerType: 'Standard', selected: false, discountedOperators: [] },
};

export const Selected = {
  args: { bannerType: 'Limited', selected: true, discountedOperators: [] },
};

export const MultipleDiscountedOperators = {
  args: { bannerType: 'Limited', selected: false, discountedOperators: ['Chongyue', 'Shu'] },
};

const RESPONSIVE_WIDTHS = [
  { width: 1400, height: 340, label: '1400px — wide desktop: banner sits beside the event' },
  {
    width: 700,
    height: 700,
    label:
      '700px — banner drops below the event (\u2264900px), image stays a normal block (>480px)',
  },
  {
    width: 420,
    height: 820,
    label: '420px \u2014 image becomes a full-bleed card background (\u2264480px)',
  },
];

// Renders the LimitedBanner story inside real <iframe>s of different widths, so the
// responsive breakpoints in Event/index.css (banner-under-event at 900px, image-as-
// background at 480px) can be inspected directly in Storybook without resizing the
// browser window. A styled <div> wouldn't work here \u2014 @media queries evaluate the
// actual browser viewport, not a container's CSS width, so only a real nested browsing
// context (an iframe) can be narrower than the page around it.
export function ResponsiveSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
      {RESPONSIVE_WIDTHS.map(({ width, height, label }) => (
        <div key={width}>
          <p style={{ font: '12px monospace', marginBottom: '8px', maxWidth: `${width}px` }}>
            {label}
          </p>
          <iframe
            title={`Event at ${width}px`}
            src="iframe.html?id=components-event--limited-banner&viewMode=story"
            style={{ width: `${width}px`, height: `${height}px`, border: '1px dashed #999' }}
          />
        </div>
      ))}
    </div>
  );
}
