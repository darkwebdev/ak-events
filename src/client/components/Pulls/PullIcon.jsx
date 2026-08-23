import React from 'react';
import { normalizeImageSrc } from '../../utils/images.js';

export function PullIcon({ className }) {
  return <img className={className} src={normalizeImageSrc('/images/icon-pull.svg')} alt="Pull" />;
}
