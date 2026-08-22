import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './index.css';

export function OperatorBadge({ operator }) {
  const { name, star, class: opClass, limited, icon } = operator;
  const src = icon ? normalizeImageSrc(icon) : null;
  const title = [name, star ? `${star}★` : null, opClass].filter(Boolean).join(' · ');

  return (
    <div className={`ak-operator-badge${limited ? ' limited' : ''}`} title={title}>
      {src ? (
        <img className="ak-operator-icon" src={src} alt={name} />
      ) : (
        <span className="ak-operator-icon ak-operator-icon-fallback">{name?.[0]}</span>
      )}
      {limited && <span className="ak-operator-limited-tag">LIMITED</span>}
    </div>
  );
}
