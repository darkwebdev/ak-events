import React, { useState } from 'react';
import { Event } from './index.jsx';
import type { Event as EventType, ResolvedBanner, ResolvedBannerOperator } from '../../types.js';

const baseEvent: EventType = {
  name: 'Ashes to Ashes, Ages on Ages',
  type: 'Side Story',
  image: '1280px-EN_The_Masses%27_Travels_banner.png',
  start: null,
  end: null,
  globalStart: '2026-07-16',
  globalEnd: '2026-07-30',
  cnStart: '2026-02-10',
  cnEnd: '2026-02-24',
  datesPredicted: false,
  origPrime: 18,
  hhPermits: 3,
  intCerts: null,
  link: 'https://arknights.wiki.gg/wiki/Ashes_to_Ashes,_Ages_on_Ages',
};

const limitedOperators: Omit<ResolvedBannerOperator, 'sparkCost'>[] = [
  { name: "Ch'en the Dawnstreak", star: 6, class: 'Guard', limited: false, icon: null },
  { name: 'Chongyue', star: 6, class: 'Guard', limited: true, icon: null },
  { name: 'Shu', star: 6, class: 'Defender', limited: true, icon: null },
  { name: 'Taraxacum', star: 5, class: 'Medic', limited: false, icon: null },
];

const standardOperators: Omit<ResolvedBannerOperator, 'sparkCost'>[] = [
  { name: 'Mudrock', star: 6, class: 'Defender', limited: false, icon: null },
  { name: 'Whisperain', star: 5, class: 'Medic', limited: false, icon: null },
];

const discountableOperatorNames = limitedOperators
  .filter((op) => op.star === 6)
  .map((op) => op.name);

function sparkCostFor(
  op: Omit<ResolvedBannerOperator, 'sparkCost'>,
  discountedOperators: string[]
): number | null {
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

type BannerType = 'None' | 'Limited' | 'Standard';

function buildBanner(bannerType: BannerType, discountedOperators: string[]): ResolvedBanner | null {
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

interface EventArgs {
  bannerType: BannerType;
  selected: boolean;
  discountedOperators: string[];
}

function renderEvent({ bannerType, selected, discountedOperators }: EventArgs) {
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

const rerunEvent: EventType = {
  ...baseEvent,
  name: 'When Elegies Are Ashes',
  type: 'Side Story (Rerun)',
  origPrime: 28,
  hhPermits: 3,
  // A rerun's own scraped maximum (see extractIntCertsFromHtml on the server) — a
  // ceiling assuming the player already owns every substitutable reward, so the
  // event card only counts it toward the Orundum total once the checkbox below is
  // checked (intCertsIncluded), not just because intCerts is present.
  intCerts: 1755,
};

// Interactive (real useState, not a fixed args object) so clicking the checkbox
// visibly updates the event's Orundum total and its Breakdown popover — the
// behavior itself is the point of this story, not just a static snapshot of one
// checked/unchecked state.
export function RerunWithIntCerts() {
  const [intCertsIncluded, setIntCertsIncluded] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  return (
    <ul className="ak-events-list">
      <Event
        event={{ ...rerunEvent, intCertsIncluded, banner: buildBanner('Limited', []) }}
        selectedEvents={selectedEvents}
        onEventToggle={(name) =>
          setSelectedEvents((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
          })
        }
        onToggleIntCerts={(_name, checked) => setIntCertsIncluded(checked)}
      />
    </ul>
  );
}

// A banner-less event's row keeps the same ~2/3 event-column width as a paired one
// instead of stretching to fill the row — shown stacked against a bannered event so
// the two widths (and the empty space next to the banner-less one) are directly
// comparable, which a single NoBanner story rendered alone can't demonstrate.
export function NoBannerWidthComparison() {
  return (
    <ul className="ak-events-list">
      <Event
        event={{ ...baseEvent, banner: buildBanner('Limited', ['Chongyue']) }}
        selectedEvents={new Set()}
        onEventToggle={() => {}}
      />
      <Event
        event={{ ...baseEvent, name: 'A Different Event', banner: null }}
        selectedEvents={new Set()}
        onEventToggle={() => {}}
      />
    </ul>
  );
}

const RESPONSIVE_WIDTHS = [
  { width: 1400, height: 340, label: '1400px — wide desktop: banner sits beside the event' },
  {
    width: 700,
    height: 700,
    label: '700px — banner drops below the event (≤900px), image stays a normal block (>480px)',
  },
  {
    width: 420,
    height: 820,
    label: '420px — image becomes a full-bleed card background (≤480px)',
  },
];

// Renders the LimitedBanner story inside real <iframe>s of different widths, so the
// responsive breakpoints in Event/index.css (banner-under-event at 900px, image-as-
// background at 480px) can be inspected directly in Storybook without resizing the
// browser window. A styled <div> wouldn't work here — @media queries evaluate the
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
