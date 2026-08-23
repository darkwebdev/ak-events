import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './index.css';

export function OperatorBadge({ operator }) {
  const { name, star, class: opClass, limited, icon, sparkCost } = operator;
  const src = icon ? normalizeImageSrc(icon) : null;
  // A 6★ operator normally costs 300 Headhunting Data Contracts to spark; 200 marks
  // one currently discounted by the wiki's rotating reduced-cost promotion.
  const reducedSpark = sparkCost != null && star === 6 && sparkCost < 300;
  const title = [
    name,
    star ? `${star}★` : null,
    opClass,
    sparkCost != null ? `Spark at ${sparkCost}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  let tagWord = null;
  if (sparkCost != null) tagWord = 'SPARK';
  else if (limited) tagWord = 'LIMIT';
  const tagText = [tagWord, sparkCost != null ? sparkCost : null]
    .filter((v) => v !== null && v !== undefined)
    .join(' ');

  return (
    <div className={`ak-operator-badge${limited ? ' limited' : ''}`} title={title}>
      {src ? (
        <img className="ak-operator-icon" src={src} alt={name} />
      ) : (
        <span className="ak-operator-icon ak-operator-icon-fallback">{name?.[0]}</span>
      )}
      {tagText && (
        <span className={`ak-operator-tag${reducedSpark ? ' reduced' : ''}`}>{tagText}</span>
      )}
    </div>
  );
}
