import React from 'react';
import { OrundumIcon } from '../Orundum/OrundumIcon.jsx';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import { SparkIcon } from '../Operator/SparkIcon.jsx';
import './index.css';

// Every icon renders via its *real* component, at its real deployed size (the same
// className each one actually uses in the app) — same "can't drift from what the site
// actually looks like" principle as Typography's type scale, rather than a blown-up
// reference rendering that would stop matching the real UI the moment either changes.
const ICONS = [
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
    render: () => <SparkIcon />,
  },
];

export function Icons({ label }) {
  return (
    <div className="ak-icons">
      {label && <div className="ak-icons-label">{label}</div>}
      <div className="ak-icons-grid">
        {ICONS.map((icon) => (
          <div key={icon.name} className="ak-icons-swatch">
            <div className="ak-icons-swatch-preview">{icon.render()}</div>
            <div className="ak-icons-swatch-name">{icon.name}</div>
            <div className="ak-icons-swatch-usage">{icon.usage}</div>
            <div className="ak-icons-swatch-file">public/images/{icon.file}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
