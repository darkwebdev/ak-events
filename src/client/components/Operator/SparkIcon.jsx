import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';

export function SparkIcon({ className }) {
  return (
    <img
      className={className}
      src={normalizeImageSrc('/images/icon-spark-token.svg')}
      alt="Spark"
    />
  );
}
