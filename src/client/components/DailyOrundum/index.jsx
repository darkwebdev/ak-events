import React, { useEffect, useRef } from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { OrundumIcon } from '../Orundum/OrundumIcon.jsx';
import { OriginitePrimeIcon } from '../OriginitePrimeIcon';
import { PullIcon } from '../Pulls/PullIcon.jsx';
import { orundumFromOP, orundumFromHH } from '../../utils/orundum.js';
import './index.css';

export function DailyOrundum({ settings, updateSetting, setAllSettingsEnabled, settingsTotal }) {
  const enabledFlags = Object.values(settings).map((s) => s.enabled);
  const allEnabled = enabledFlags.every(Boolean);
  const noneEnabled = enabledFlags.every((enabled) => !enabled);
  // HTML checkboxes don't support an `indeterminate` JSX prop — it's a DOM-only
  // property, not a reflected attribute, so it has to be set imperatively.
  const allCheckboxRef = useRef(null);
  useEffect(() => {
    if (allCheckboxRef.current) allCheckboxRef.current.indeterminate = !allEnabled && !noneEnabled;
  }, [allEnabled, noneEnabled]);

  return (
    <div className="ak-aside ak-daily-orundum">
      <h3 className="ak-aside-title">
        Daily <OrundumIcon /> Equivalent
      </h3>
      <div className="ak-aside-item">
        <label className="ak-aside-label">
          <input
            ref={allCheckboxRef}
            type="checkbox"
            checked={allEnabled}
            onChange={(e) => setAllSettingsEnabled(e.target.checked)}
          />
          <span className="ak-aside-name">All</span>
        </label>
      </div>
      <div className="ak-aside-list">
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings.Annihilation.enabled}
              onChange={(e) => updateSetting('Annihilation', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Annihilation">
                <OrundumIcon />
                {settings.Annihilation.weeklyOrundum} weekly
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>{settings.Annihilation.weeklyOrundum / 7}</Orundum>
            </span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings['New Annihilation'].enabled}
              onChange={(e) => updateSetting('New Annihilation', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Rotating Bi-Monthly Annihilation">
                <div>
                  <OrundumIcon />
                  {settings['New Annihilation'].biMonthlyOrundum} every 2 months
                </div>
                <div>
                  + <OrundumIcon />
                  {settings['New Annihilation'].weeklyOrundum} increased weekly cap
                </div>
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>
                {settings['New Annihilation'].biMonthlyOrundum / 60 +
                  settings['New Annihilation'].weeklyOrundum / 7}
              </Orundum>
            </span>
          </label>
        </div>

        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings.Missions.enabled}
              onChange={(e) => updateSetting('Missions', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Daily & Weekly Missions">
                <OrundumIcon />
                {settings.Missions.weeklyOrundum} weekly
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>{settings.Missions.weeklyOrundum / 7}</Orundum>
            </span>
          </label>
        </div>

        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings['Green Cert T1'].enabled}
              onChange={(e) => updateSetting('Green Cert T1', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Commendations Store 1">
                <div>
                  <OrundumIcon />
                  {settings['Green Cert T1'].monthlyOrundum} monthly
                </div>
                <div>
                  + <PullIcon />
                  {settings['Green Cert T1'].monthlyHH} monthly
                </div>
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>
                {settings['Green Cert T1'].monthlyOrundum / 30 +
                  orundumFromHH(settings['Green Cert T1'].monthlyHH) / 30}
              </Orundum>
            </span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings['Green Cert T2'].enabled}
              onChange={(e) => updateSetting('Green Cert T2', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Commendations Store 2">
                <PullIcon />
                {settings['Green Cert T2'].monthlyHH} monthly
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>{orundumFromHH(settings['Green Cert T2'].monthlyHH) / 30}</Orundum>
            </span>
          </label>
        </div>

        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings['Monthly Card'].enabled}
              onChange={(e) => updateSetting('Monthly Card', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Monthly Card">
                <div>
                  <OrundumIcon />
                  {settings['Monthly Card'].dailyOrundum} daily
                </div>
                <div>
                  + <OriginitePrimeIcon />
                  {settings['Monthly Card'].monthlyOP} monthly
                </div>
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>
                {settings['Monthly Card'].dailyOrundum +
                  orundumFromOP(settings['Monthly Card'].monthlyOP) / 30}
              </Orundum>
            </span>
          </label>
        </div>

        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input
              type="checkbox"
              checked={settings['Monthly Login'].enabled}
              onChange={(e) => updateSetting('Monthly Login', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">
              <InfoButton label="Daily Sign-in">
                <div>
                  <PullIcon />
                  {settings['Monthly Login'].monthlyHH} monthly
                </div>
              </InfoButton>
            </span>
            <span className="ak-aside-value">
              <Orundum>{orundumFromHH(settings['Monthly Login'].monthlyHH) / 30}</Orundum>
            </span>
          </label>
        </div>
      </div>
      <div className="ak-aside-total">
        <div className="ak-aside-item">
          <div className="ak-aside-label">
            <span className="ak-aside-name">Total</span>
            <span className="ak-aside-value">
              <Orundum withPulls pullsPrecision={1}>
                {settingsTotal}
              </Orundum>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
