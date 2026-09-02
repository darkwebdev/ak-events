import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';
import './index.css';

interface IntCertsIconProps {
  className?: string;
}

// className always includes the default `ak-int-certs-icon` sizing rather than
// requiring every caller to pass it — an <img> with no explicit width/height falls
// back to the source SVG's own dimensions (huge) if a caller forgets it.
export function IntCertsIcon({ className }: IntCertsIconProps) {
  return (
    <img
      className={`ak-int-certs-icon${className ? ` ${className}` : ''}`}
      src={normalizeImageSrc('/images/icon-int-certs.svg') ?? undefined}
      alt="Intelligence Certificates"
      title="Intelligence Certificates"
    />
  );
}
