import React from 'react';
import './index.css';

const GROUPS = [
  {
    title: 'Surfaces',
    swatches: [
      { token: '--ak-bg', name: 'Page background', mode: 'fill' },
      { token: '--ak-surface', name: 'Card / aside surface', mode: 'fill' },
      { token: '--ak-surface-hover', name: 'Surface (hover)', mode: 'fill' },
    ],
  },
  {
    title: 'Borders',
    swatches: [
      { token: '--ak-border', name: 'Border', mode: 'border' },
      { token: '--ak-border-strong', name: 'Border (strong)', mode: 'border' },
    ],
  },
  {
    title: 'Text & accent',
    swatches: [
      { token: '--ak-text', name: 'Text', mode: 'text' },
      { token: '--ak-text-muted', name: 'Text (muted)', mode: 'text' },
      { token: '--ak-accent', name: 'Accent', mode: 'fill' },
    ],
  },
  {
    title: 'Limited / spark',
    swatches: [
      { token: '--ak-limited', name: 'Limited operator', mode: 'fill' },
      { token: '--ak-limited-text', name: 'Limited text (on above)', mode: 'text-on-limited' },
      { token: '--ak-spark', name: 'Spark cost text', mode: 'text' },
    ],
  },
];

function swatchStyle(token, mode) {
  switch (mode) {
    case 'text':
      return { color: `var(${token})`, background: 'var(--ak-bg)' };
    case 'text-on-limited':
      return { color: `var(${token})`, background: 'var(--ak-limited)' };
    case 'border':
      return { background: 'var(--ak-surface)', border: `3px solid var(${token})` };
    default:
      return { background: `var(${token})` };
  }
}

function ColorSwatch({ token, name, mode }) {
  const showsLabel = mode === 'text' || mode === 'text-on-limited';
  return (
    <div className="ak-palette-swatch">
      <div className="ak-palette-swatch-color" style={swatchStyle(token, mode)}>
        {showsLabel && 'Aa'}
      </div>
      <div className="ak-palette-swatch-name">{name}</div>
      <div className="ak-palette-swatch-token">{token}</div>
    </div>
  );
}

export function Palette({ label }) {
  return (
    <div className="ak-palette">
      {label && <div className="ak-palette-label">{label}</div>}
      {GROUPS.map((group) => (
        <div key={group.title} className="ak-palette-group">
          <h4 className="ak-palette-group-title">{group.title}</h4>
          <div className="ak-palette-swatches">
            {group.swatches.map((s) => (
              <ColorSwatch key={s.token} token={s.token} name={s.name} mode={s.mode} />
            ))}
          </div>
        </div>
      ))}

      <div className="ak-palette-group">
        <h4 className="ak-palette-group-title">Readability sample</h4>
        <div className="ak-palette-sample ak-palette-sample-bg">
          <div className="ak-palette-sample-title">On page background</div>
          <p>
            The quick <strong>Doctor</strong> commands Rhodes Island through{' '}
            <span className="ak-palette-sample-muted">muted secondary text</span> and an{' '}
            <span className="ak-palette-sample-accent">accent link</span>.
          </p>
        </div>
        <div className="ak-palette-sample ak-palette-sample-surface">
          <div className="ak-palette-sample-title">On card surface</div>
          <p>
            The quick <strong>Doctor</strong> commands Rhodes Island through{' '}
            <span className="ak-palette-sample-muted">muted secondary text</span> and an{' '}
            <span className="ak-palette-sample-accent">accent link</span>.
          </p>
        </div>
        <div className="ak-palette-sample ak-palette-sample-hover">
          <div className="ak-palette-sample-title">On hover (e.g. a clickable event row)</div>
          <p>
            The quick <strong>Doctor</strong> commands Rhodes Island through{' '}
            <span className="ak-palette-sample-muted">muted secondary text</span> and an{' '}
            <span className="ak-palette-sample-accent">accent link</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
