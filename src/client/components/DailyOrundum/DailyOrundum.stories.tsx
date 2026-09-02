import React from 'react';
import { DailyOrundum } from './index.jsx';
import { calcDailyOrundum } from '../../utils/orundum.js';
import type { Settings } from '../../types.js';

// Mock settings for DailyOrundum story
const mockSettings: Settings = {
  Annihilation: { weeklyOrundum: 1700, enabled: true },
  'New Annihilation': { biMonthlyOrundum: 1500, weeklyOrundum: 100, enabled: true },
  Missions: { weeklyOrundum: 1200, enabled: true },
  'Green Cert T1': { monthlyOrundum: 600, monthlyHH: 2, enabled: false },
  'Green Cert T2': { monthlyHH: 2, enabled: false },
  'Monthly Card': { dailyOrundum: 200, monthlyOP: 6, enabled: true },
  'Monthly Login': { monthlyHH: 1, enabled: false },
};
const mockSettingsTotal = calcDailyOrundum(mockSettings);

export default {
  title: 'Components/DailyOrundum',
  component: DailyOrundum,
};

export function Default() {
  return (
    <DailyOrundum
      settings={mockSettings}
      updateSetting={() => {}}
      setAllSettingsEnabled={() => {}}
      settingsTotal={mockSettingsTotal}
    />
  );
}

const allEnabledSettings: Settings = {
  Annihilation: { weeklyOrundum: 1700, enabled: true },
  'New Annihilation': { biMonthlyOrundum: 1500, weeklyOrundum: 100, enabled: true },
  Missions: { weeklyOrundum: 1200, enabled: true },
  'Green Cert T1': { monthlyOrundum: 600, monthlyHH: 2, enabled: true },
  'Green Cert T2': { monthlyHH: 2, enabled: true },
  'Monthly Card': { dailyOrundum: 200, monthlyOP: 6, enabled: true },
  'Monthly Login': { monthlyHH: 1, enabled: true },
};
const allEnabledTotal = calcDailyOrundum(allEnabledSettings);

export function AllEnabled() {
  return (
    <DailyOrundum
      settings={allEnabledSettings}
      updateSetting={() => {}}
      setAllSettingsEnabled={() => {}}
      settingsTotal={allEnabledTotal}
    />
  );
}

const noneEnabledSettings: Settings = {
  Annihilation: { weeklyOrundum: 1700, enabled: false },
  'New Annihilation': { biMonthlyOrundum: 1500, weeklyOrundum: 100, enabled: false },
  Missions: { weeklyOrundum: 1200, enabled: false },
  'Green Cert T1': { monthlyOrundum: 600, monthlyHH: 2, enabled: false },
  'Green Cert T2': { monthlyHH: 2, enabled: false },
  'Monthly Card': { dailyOrundum: 200, monthlyOP: 6, enabled: false },
  'Monthly Login': { monthlyHH: 1, enabled: false },
};

export function NoneEnabled() {
  return (
    <DailyOrundum
      settings={noneEnabledSettings}
      updateSetting={() => {}}
      setAllSettingsEnabled={() => {}}
      settingsTotal={0}
    />
  );
}
