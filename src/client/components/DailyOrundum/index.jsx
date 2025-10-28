import React from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';
import { orundumFromOP, orundumFromHH } from '../../utils/orundum.js';

export function DailyOrundum({ settings, updateSetting, settingsTotal }) {
  return (
    <div className="ak-aside">
      <h3 className="ak-aside-title">Daily Orundum Equivalent</h3>
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
                {settings.Annihilation.weeklyOrundum} weekly Orundum
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
                <div>{settings['New Annihilation'].biMonthlyOrundum} Orundum every 2 months</div>
                <div>
                  + {settings['New Annihilation'].weeklyOrundum} increased weekly Orundum cap
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
                {settings.Missions.weeklyOrundum} weekly Orundum
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
                <div>{settings['Green Cert T1'].monthlyOrundum} monthly Orundum</div>
                <div>+ {settings['Green Cert T1'].monthlyHH} monthly HH Permits</div>
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
                {settings['Green Cert T2'].monthlyHH} monthly HH Permits
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
                <div>{settings['Monthly Card'].dailyOrundum} daily Orundum</div>
                <div>+ {settings['Monthly Card'].monthlyOP} monthly OP</div>
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
                <div>{settings['Monthly Login'].monthlyHH} monthly HH Permit</div>
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
            <span className="ak-aside-name">Total Orundum</span>
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
