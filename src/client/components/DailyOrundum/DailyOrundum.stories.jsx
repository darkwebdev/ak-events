import React from 'react';
import { DailyOrundum } from './index.jsx';
// Mock settings for DailyOrundum story
const mockSettings = {
  'Annihilation': { enabled: true, value: 300 },
  'Missions': { enabled: true, value: 50 },
  'Green Cert T1': { enabled: false, value: 0 },
  'Green Cert T2': { enabled: false, value: 0 },
  'Monthly Card': { enabled: true, value: 60 },
  'OP from Monthly card': { enabled: false, value: 0 },
  'Orundum from new Anni every 2 months': { enabled: false, value: 0 },
  '1 HH from Monthly log in': { enabled: false, value: 0 },
};
const mockSettingsTotal = Object.values(mockSettings).reduce(
  (sum, s) => sum + (s.enabled ? s.value : 0),
  0
);

export default {
  title: 'Components/DailyOrundum',
  component: DailyOrundum,
};

export const Default = () => (
  <DailyOrundum
    settings={mockSettings}
    updateSetting={() => {}}
    settingsTotal={mockSettingsTotal}
  />
);

const allEnabledSettings = {
  'Annihilation': { enabled: true, value: 300 },
  'Missions': { enabled: true, value: 50 },
  'Green Cert T1': { enabled: true, value: 100 },
  'Green Cert T2': { enabled: true, value: 200 },
  'Monthly Card': { enabled: true, value: 60 },
  'OP from Monthly card': { enabled: true, value: 30 },
  'Orundum from new Anni every 2 months': { enabled: true, value: 150 },
  '1 HH from Monthly log in': { enabled: true, value: 600 },
};
const allEnabledTotal = Object.values(allEnabledSettings).reduce(
  (sum, s) => sum + (s.enabled ? s.value : 0),
  0
);

export const AllEnabled = () => (
  <DailyOrundum
    settings={allEnabledSettings}
    updateSetting={() => {}}
    settingsTotal={allEnabledTotal}
  />
);

const noneEnabledSettings = {
  'Annihilation': { enabled: false, value: 300 },
  'Missions': { enabled: false, value: 50 },
  'Green Cert T1': { enabled: false, value: 0 },
  'Green Cert T2': { enabled: false, value: 0 },
  'Monthly Card': { enabled: false, value: 60 },
  'OP from Monthly card': { enabled: false, value: 0 },
  'Orundum from new Anni every 2 months': { enabled: false, value: 0 },
  '1 HH from Monthly log in': { enabled: false, value: 0 },
};

export const NoneEnabled = () => (
  <DailyOrundum
    settings={noneEnabledSettings}
    updateSetting={() => {}}
    settingsTotal={0}
  />
);
