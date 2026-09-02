import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './SparkIcon.css';

interface SparkIconProps {
  className?: string;
}

// className always includes the default `ak-spark-icon` sizing rather than requiring
// every caller to pass it — a plain <img> with no explicit width/height falls back to
// the source SVG's own size (huge) if a caller forgets it, or if this is used
// somewhere .ak-operator-tag-icon's own stylesheet (Operator/index.css) never loads
// (e.g. the Typography Storybook page, which imports this icon directly without the
// rest of Operator).
export function SparkIcon({ className }: SparkIconProps) {
  return (
    <img
      className={`ak-spark-icon${className ? ` ${className}` : ''}`}
      src={normalizeImageSrc('/images/icon-spark-token.svg') ?? undefined}
      alt="Spark"
    />
  );
}
