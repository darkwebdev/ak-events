import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import { SparkIcon } from './SparkIcon.jsx';
import './index.css';

export function Operator({ operator }) {
  const { name, star, class: opClass, limited, icon, sparkCost } = operator;
  const src = icon ? normalizeImageSrc(icon) : null;
  // A 6★ operator normally costs 300 Headhunting Data Contracts to spark; 200 marks
  // one currently discounted by the wiki's rotating reduced-cost promotion. 5★
  // operators don't have a "reduced" tier — they're always at their (much lower)
  // spark price — but get the same accent color as a reduced 6★, since both are
  // "a better-than-default spark deal" as distinct from a plain LIMITED/full-price tag.
  const sparkAccent = sparkCost != null && (star === 5 || sparkCost < 300);
  const title = [
    name,
    star ? `${star}★` : null,
    opClass,
    sparkCost != null ? `Spark at ${sparkCost}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={`ak-operator-badge${limited ? ' limited' : ''}`} title={title}>
      {src ? (
        <img className="ak-operator-icon" src={src} alt={name} />
      ) : (
        <span className="ak-operator-icon ak-operator-icon-fallback">{name?.[0]}</span>
      )}
      {sparkCost != null && (
        <span className={`ak-operator-tag${sparkAccent ? ' reduced' : ''}`}>
          <SparkIcon className="ak-operator-tag-icon" />
          {sparkCost}
        </span>
      )}
      {sparkCost == null && limited && <span className="ak-operator-tag">LIMITED</span>}
    </div>
  );
}
