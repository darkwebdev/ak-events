import React, { type ReactNode } from 'react';
import { OrundumIcon } from '../Orundum/OrundumIcon.jsx';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import { SparkIcon } from '../Operator/SparkIcon.jsx';
import { IntCertsIcon } from '../IntCertsIcon';
import './index.css';

interface IconEntry {
  name: string;
  usage: string;
  file: string;
  previewBackground?: string;
  render: () => ReactNode;
}

// Every icon renders via its *real* component, at its real deployed size (the same
// className each one actually uses in the app) — same "can't drift from what the site
// actually looks like" principle as Typography's type scale, rather than a blown-up
// reference rendering that would stop matching the real UI the moment either changes.
const ICONS: IconEntry[] = [
  {
    name: 'Orundum',
    usage: 'OrundumIcon',
    file: 'icon-orundum-red.svg',
    render: () => <OrundumIcon />,
  },
  {
    name: 'Originite Prime',
    usage: 'OriginitePrimeIcon',
    file: 'icon-diamond-yellow.svg',
    render: () => <OriginitePrimeIcon />,
  },
  {
    name: 'Pull / Headhunting Permit',
    usage: 'PullIcon',
    file: 'icon-pull.svg',
    render: () => <PullIcon />,
  },
  {
    name: 'Spark',
    usage: 'SparkIcon',
    file: 'icon-spark-token.svg',
    // The icon's dark-brown fill is baked in for its one real usage — inside the gold
    // .ak-operator-tag background — and is illegible on the neutral swatch background
    // every other icon here previews fine against, so this preview stands in for the
    // real tag background instead.
    previewBackground: 'color-mix(in srgb, var(--ak-limited) 80%, transparent)',
    render: () => <SparkIcon />,
  },
  {
    name: 'Intelligence Certificates',
    usage: 'IntCertsIcon',
    file: 'icon-int-certs.svg',
    render: () => <IntCertsIcon />,
  },
];

interface IconsProps {
  label?: string;
}

export function Icons({ label }: IconsProps) {
  return (
    <div className="ak-icons">
      {label && <div className="ak-icons-label">{label}</div>}
      <div className="ak-icons-grid">
        {ICONS.map((icon) => (
          <div key={icon.name} className="ak-icons-swatch">
            <div
              className="ak-icons-swatch-preview"
              style={icon.previewBackground ? { background: icon.previewBackground } : undefined}
            >
              {icon.render()}
            </div>
            <div className="ak-icons-swatch-name">{icon.name}</div>
            <div className="ak-icons-swatch-usage">{icon.usage}</div>
            <div className="ak-icons-swatch-file">public/images/{icon.file}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
