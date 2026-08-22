import React from 'react';
import './index.css';

// Each entry renders with the *real* app styling (either the actual global h1 rule,
// or the app's real component classNames — both already loaded globally via
// App.css/component CSS) rather than reinventing the values here, so this page can't
// drift from what the site actually looks like.
const SCALE = [
  {
    label: 'Page title',
    usage: 'Header <h1>',
    meta: '~2em (browser default) / bold',
    render: () => <h1 className="ak-typography-specimen-h1">Arknights Pull Prophecy</h1>,
  },
  {
    label: 'Hero pull count',
    usage: 'PullCounter (number-flow-react)',
    meta: '2em / bold / accent',
    render: () => <span className="ak-typography-hero-number">128</span>,
  },
  {
    label: 'Aside title',
    usage: '.ak-aside-title',
    meta: '18px / 600',
    render: () => <div className="ak-aside-title">Currently Owned</div>,
  },
  {
    label: 'Base text',
    usage: 'body / default',
    meta: '16px / 400',
    render: () => <span>The quick Doctor commands Rhodes Island.</span>,
  },
  {
    label: 'Label / value row',
    usage: '.ak-aside-label / .ak-aside-name / .ak-aside-value',
    meta: '14px label, 16px value / 600',
    render: () => (
      <div className="ak-aside-label" style={{ cursor: 'default' }}>
        <span className="ak-aside-name">Orundum</span>
        <span className="ak-aside-value">12,345</span>
      </div>
    ),
  },
  {
    label: 'Muted small',
    usage: '.ak-event-type / .ak-breakdown-calc',
    meta: '0.9em–14px / 400',
    render: () => <span className="ak-event-type">Side Story</span>,
  },
  {
    label: 'Micro badge',
    usage: '.ak-operator-limited-tag',
    meta: '8px / 700 / uppercase',
    render: () => (
      <span className="ak-operator-limited-tag" style={{ position: 'static' }}>
        LIMITED
      </span>
    ),
  },
];

export function Typography({ label }) {
  return (
    <div className="ak-typography">
      {label && <div className="ak-typography-label">{label}</div>}

      <div className="ak-typography-group">
        <h4 className="ak-typography-group-title">Font family</h4>
        <div className="ak-typography-family">Arial, sans-serif</div>
      </div>

      <div className="ak-typography-group">
        <h4 className="ak-typography-group-title">Type scale</h4>
        <div className="ak-typography-scale">
          {SCALE.map((entry) => (
            <div key={entry.label} className="ak-typography-row">
              <div className="ak-typography-specimen">{entry.render()}</div>
              <div className="ak-typography-row-meta">
                <div className="ak-typography-row-label">{entry.label}</div>
                <div className="ak-typography-row-usage">{entry.usage}</div>
                <div className="ak-typography-row-detail">{entry.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
