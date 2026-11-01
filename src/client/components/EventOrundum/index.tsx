import React from 'react';
import {
  calcEventOrundum,
  orundumFromOP,
  orundumFromHH,
  orundumFromIntCerts,
} from '../../utils/orundum.js';
import { Orundum } from '../Orundum';
import { InfoButton } from '../InfoButton';
import { Breakdown } from '../Breakdown';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import { IntCertsIcon } from '../IntCertsIcon';
import type { Event as EventType } from '../../types.js';

// Array#filter(Boolean) doesn't narrow away the falsy branch of `x && y` at the type
// level (a well-known TS limitation), even though it does at runtime — this gives
// Breakdown's items/calcs/totals arrays their real (falsy-value-free) element types.
function truthy<T>(value: T | false | 0 | '' | null | undefined): value is T {
  return !!value;
}

// A breakdown row label for one source of pulls: the pull icon plus what it is.
function PullSource({ label }: { label: string }) {
  return (
    <span className="ak-event-pull-source">
      <PullIcon /> {label}
    </span>
  );
}

// An event's Orundum (and pulls) total, opening a per-source breakdown on hover/tap.
// Shared by the card view (Event) and the compact list view (EventRow). Nothing when
// the event gives no pull currency at all.
export function EventOrundum({ event }: { event: EventType }) {
  const {
    origPrime,
    hhPermits,
    dailyFreePulls,
    bannerPermits,
    freePullsEstimated,
    intCerts,
    intCertsIncluded,
    link,
  } = event;
  const hasIntCertsValue = intCertsIncluded && intCerts;
  if (!(origPrime || hhPermits || dailyFreePulls || bannerPermits || hasIntCertsValue)) return null;
  return (
    // The Orundum value itself is the hover/click trigger now — no
    // separate "Orundum" label needed, and no duplicate icon either.
    <InfoButton
      label={
        <span className="ak-event-orundum">
          <Orundum withPulls>{calcEventOrundum(event)}</Orundum>
        </span>
      }
    >
      <Breakdown
        // Every pull is worth the same 600 Orundum, so the three pull
        // sources share the pull icon and are told apart by a label.
        items={[
          origPrime && <OriginitePrimeIcon key="op" />,
          hhPermits && <PullSource key="hh" label="Store & rewards" />,
          // Estimated from the banner type's usual free pulls when the
          // wiki hasn't described this banner yet (see bannerRules.ts).
          dailyFreePulls && (
            <PullSource
              key="daily"
              label={`Free daily pull${freePullsEstimated ? ' (estimated)' : ''}`}
            />
          ),
          bannerPermits && (
            <PullSource
              key="banner"
              label={`Banner ten-roll${freePullsEstimated ? ' (estimated)' : ''}`}
            />
          ),
          hasIntCertsValue && <IntCertsIcon key="ic" />,
        ].filter(truthy)}
        calcs={[
          origPrime && `${origPrime} × 180`,
          hhPermits && `${hhPermits} × 600`,
          dailyFreePulls && `${dailyFreePulls} days × 600`,
          bannerPermits && `${bannerPermits} × 600`,
          hasIntCertsValue && `${intCerts} × 5`,
        ].filter(truthy)}
        totals={[
          origPrime && orundumFromOP(origPrime),
          hhPermits && orundumFromHH(hhPermits),
          dailyFreePulls && orundumFromHH(dailyFreePulls),
          bannerPermits && orundumFromHH(bannerPermits),
          hasIntCertsValue && orundumFromIntCerts(intCerts),
        ].filter(truthy)}
      />
      Source:{' '}
      <a href={link ?? undefined} target="_blank" rel="noopener noreferrer">
        arknights.wiki.gg
      </a>
    </InfoButton>
  );
}
