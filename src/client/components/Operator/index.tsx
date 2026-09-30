import React, { useContext } from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import { SparkIcon } from './SparkIcon.jsx';
import type { ResolvedBannerOperator } from '../../types.js';
import { OwnedOperatorsContext } from '../../ownedOperators.js';
import { InfoButton } from '../InfoButton';
import './index.css';

interface OperatorProps {
  operator: ResolvedBannerOperator;
}

// The operator's own page on the wiki the app's data comes from.
function wikiUrl(name: string): string {
  return `https://arknights.wiki.gg/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`;
}

export function Operator({ operator }: OperatorProps) {
  const { name, charId, star, class: opClass, limited, icon, sparkCost } = operator;
  // The linked account's potential rank for this operator (0 = Potential 1), if owned.
  const owned = useContext(OwnedOperatorsContext);
  const potentialRank = charId && owned ? owned[charId] : undefined;
  const isOwned = potentialRank != null;
  const src = icon ? normalizeImageSrc(icon) : null;
  // A 6★ operator normally costs 300 Headhunting Data Contracts to spark (the plain
  // LIMITED yellow); 200 marks one currently discounted by the wiki's rotating
  // reduced-cost promotion (orange). 5★ operators don't have a "reduced" tier —
  // they're always at their own (much lower) spark price (dark orange).
  let tagVariant: string | null = null;
  if (sparkCost != null) {
    if (star === 5) tagVariant = 'spark-75';
    else if (sparkCost < 300) tagVariant = 'spark-200';
  }

  const badgeClassName = [
    'ak-operator-badge',
    limited && 'limited',
    isOwned && 'owned',
    // Lets the icon's own border color match the tag's color below it (see
    // .ak-operator-badge.spark-200/.spark-75 in index.css) — without this, a
    // reduced-cost operator's border stayed the plain LIMITED yellow while its tag
    // was orange, looking disconnected.
    tagVariant,
  ]
    .filter(Boolean)
    .join(' ');

  // Tapping (or hovering) the badge shows who it is — a native `title` tooltip never
  // appears on a phone. The tap stays with the popup instead of selecting the event.
  return (
    <InfoButton
      plain
      isolateClick
      label={
        <div className={badgeClassName}>
          {isOwned && (
            <span className="ak-operator-owned" aria-label="Owned">
              ✓
            </span>
          )}
          {src ? (
            <img className="ak-operator-icon" src={src} alt={name} />
          ) : (
            <span className="ak-operator-icon ak-operator-icon-fallback">{name?.[0]}</span>
          )}
          {sparkCost != null && (
            <span className={`ak-operator-tag${tagVariant ? ` ${tagVariant}` : ''}`}>
              <SparkIcon className="ak-operator-tag-icon" />
              {sparkCost}
            </span>
          )}
          {sparkCost == null && limited && <span className="ak-operator-tag">LIMITED</span>}
        </div>
      }
    >
      <div className="ak-operator-popup">
        <strong>{name}</strong>
        <div>
          {[star ? `${star}★` : null, opClass, limited ? 'Limited' : null]
            .filter(Boolean)
            .join(' · ')}
        </div>
        {sparkCost != null && <div>Spark: {sparkCost} Headhunting Data Contracts</div>}
        {isOwned && <div>Owned · Potential {potentialRank + 1}</div>}
        <a href={wikiUrl(name)} target="_blank" rel="noopener noreferrer">
          arknights.wiki.gg
        </a>
      </div>
    </InfoButton>
  );
}
