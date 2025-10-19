import React from 'react';
import { InfoButton } from '../InfoButton';
import { Orundum } from '../Orundum';

export function DailyOrundum({ settings, updateSetting, settingsTotal }) {
  return (
    <div className="ak-aside">
      <h3 className="ak-aside-title">Daily Orundum Equivalent</h3>
      <div className="ak-aside-list">
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['Annihilation'].enabled}
              onChange={(e) => updateSetting('Annihilation', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">Annihilation</span>
            <span className="ak-aside-value"><Orundum>{settings['Annihilation'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['Missions'].enabled}
              onChange={(e) => updateSetting('Missions', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">Missions</span>
            <span className="ak-aside-value"><Orundum>{settings['Missions'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['Green Cert T1'].enabled}
              onChange={(e) => updateSetting('Green Cert T1', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">Green Cert T1</span>
            <span className="ak-aside-value"><Orundum>{settings['Green Cert T1'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['Green Cert T2'].enabled}
              onChange={(e) => updateSetting('Green Cert T2', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">Green Cert T2</span>
            <span className="ak-aside-value"><Orundum>{settings['Green Cert T2'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['Monthly Card'].enabled}
              onChange={(e) => updateSetting('Monthly Card', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">Monthly Card</span>
            <span className="ak-aside-value"><Orundum>{settings['Monthly Card'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['OP from Monthly card'].enabled}
              onChange={(e) => updateSetting('OP from Monthly card', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">OP from Monthly card</span>
            <span className="ak-aside-value"><Orundum>{settings['OP from Monthly card'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['Orundum from new Anni every 2 months'].enabled}
              onChange={(e) => updateSetting('Orundum from new Anni every 2 months', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">Orundum from new Anni every 2 months</span>
            <span className="ak-aside-value"><Orundum>{settings['Orundum from new Anni every 2 months'].value}</Orundum></span>
          </label>
        </div>
        <div className="ak-aside-item">
          <label className="ak-aside-label">
            <input 
              type="checkbox" 
              checked={settings['1 HH from Monthly log in'].enabled}
              onChange={(e) => updateSetting('1 HH from Monthly log in', 'enabled', e.target.checked)}
            />
            <span className="ak-aside-name">1 HH from Monthly log in</span>
            <span className="ak-aside-value"><Orundum>{settings['1 HH from Monthly log in'].value}</Orundum></span>
          </label>
        </div>
      </div>
      <div className="ak-aside-total">
        <div className="ak-aside-item">
          <div className="ak-aside-label">
            <span className="ak-aside-name">
              <InfoButton label="Total Orundum">
                Total daily orundum: {settingsTotal} (sum of enabled sources)
              </InfoButton>
            </span>
            <span className="ak-aside-value"><Orundum withPulls pullsPrecision={1}>{settingsTotal}</Orundum></span>
          </div>
        </div>
      </div>
    </div>
  );
}