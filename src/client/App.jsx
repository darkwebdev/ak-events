import React, { useEffect, useState } from 'react';
import { useStorage } from './hooks/useStorage.js';
import { useFeatureFlag } from './utils/featureFlags.js';
import { calcDailyOrundum, calcTotalOrundum, pullsFromOrundum } from './utils/orundum.js';
import {
  filterUpcomingEvents,
  calculateSelectedEventData,
  calculateLatestEventStart,
} from './utils/events.js';

import { ArknightsAccount } from './components/ArknightsAccount';
import { CurrentlyOwned } from './components/CurrentlyOwned';
import { DailyOrundum } from './components/DailyOrundum';
import { EventsList } from './components/EventsList';
import { TotalOrundum } from './components/TotalOrundum';
import { Header } from './components/Header';

import defaultSettings from './settings.json';
import defaultPlayerStatus from './playerStatus.json';
import './App.css';

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [settings, setSettings] = useStorage('ak-events-settings', defaultSettings);
  const [playerStatus, setPlayerStatus] = useStorage(
    'ak-events-player-status',
    defaultPlayerStatus
  );
  const [arkAuth, setArkAuth] = useStorage('ak-events-arknights-auth', null);
  // Whether the user has opted in to counting a rerun's Intelligence Certificates
  // (event.intCerts, a scraped maximum — see extractIntCertsFromHtml on the server)
  // toward its Orundum total. Keyed by event name; only reruns with scraped data
  // show the checkbox at all (see Event/index.jsx).
  const [intCertsIncluded, setIntCertsIncluded] = useStorage('ak-events-int-certs-included', {});
  // Off by default in every environment, including staging — turn it on in a given
  // browser via the ?ff_accountImport=1 URL param (sticks after that, see
  // utils/featureFlags.js) or `localStorage.setItem('ak-events-flag-accountImport',
  // 'true')` directly. Still logs the player out of their live game session on
  // every fetch (see ArknightsAccount's own warning) with no fix, only an accepted
  // limitation — that's the reason this stays gated rather than shipping wide open.
  const [accountImportEnabled] = useFeatureFlag('accountImport', false);

  const updateSetting = (key, property, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [property]: value },
    }));
  };

  const setAllSettingsEnabled = (enabled) => {
    setSettings((prev) =>
      Object.fromEntries(Object.entries(prev).map(([key, s]) => [key, { ...s, enabled }]))
    );
  };

  const updatePlayerStatus = (key, value) => {
    setPlayerStatus((prev) => ({ ...prev, [key]: value }));
  };

  const handleAccountFetched = (data) => {
    updatePlayerStatus('orundum', data.orundum);
    updatePlayerStatus('op', data.originitePrime);
    updatePlayerStatus('hhPermits', data.headhuntingPermits);
  };

  const toggleIntCertsIncluded = (eventName, checked) => {
    setIntCertsIncluded((prev) => ({ ...prev, [eventName]: checked }));
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('./data/events.json');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }
    fetchEvents();
  }, []);

  const playerOrundumTotal =
    playerStatus.orundum + playerStatus.op * 180 + playerStatus.hhPermits * 600;

  const rawFutureEvents = filterUpcomingEvents(events, new Date());
  // Only reruns actually carry a scraped `intCerts` value — every other event is
  // passed through untouched, so calcEventOrundum's existing origPrime/hhPermits
  // math is unaffected by this merge.
  const futureEvents = rawFutureEvents.map((event) =>
    event.intCerts != null ? { ...event, intCertsIncluded: !!intCertsIncluded[event.name] } : event
  );

  const handleEventToggle = (eventName) => {
    setSelectedEvents((prev) => {
      const newSelected = new Set(prev);

      if (newSelected.has(eventName)) {
        // Unchecking: only remove this event
        newSelected.delete(eventName);
      } else {
        // Checking: add this event and all previous events
        const eventIndex = futureEvents.findIndex((e) => e.name === eventName);
        for (let i = 0; i <= eventIndex; i++) {
          newSelected.add(futureEvents[i].name);
        }
      }

      return newSelected;
    });
  };

  const { selectedList, daysUntilLastEvent } = calculateSelectedEventData(
    futureEvents,
    selectedEvents
  );
  const dailyOrundum = calcDailyOrundum(settings);
  const totalDailyOrundum = dailyOrundum * daysUntilLastEvent;
  const totalOrundum = calcTotalOrundum(
    futureEvents,
    selectedEvents,
    totalDailyOrundum,
    playerOrundumTotal
  );

  return (
    <>
      <Header totalPulls={pullsFromOrundum(totalOrundum)} />

      <div className="ak-main-content">
        <EventsList
          filteredEvents={futureEvents}
          selectedEvents={selectedEvents}
          onEventToggle={handleEventToggle}
          onToggleIntCerts={toggleIntCertsIncluded}
          settingsTotal={dailyOrundum}
          playerOrundumTotal={playerOrundumTotal}
        />

        <div className="ak-aside-column">
          {accountImportEnabled && (
            <ArknightsAccount
              authState={arkAuth}
              setAuthState={setArkAuth}
              onFetched={handleAccountFetched}
            />
          )}

          <CurrentlyOwned
            owned={playerStatus}
            updateOwned={updatePlayerStatus}
            totalOwned={playerOrundumTotal}
          />

          <DailyOrundum
            settings={settings}
            updateSetting={updateSetting}
            setAllSettingsEnabled={setAllSettingsEnabled}
            settingsTotal={dailyOrundum}
          />

          <TotalOrundum
            latestEventStart={calculateLatestEventStart(selectedList)}
            totalOrundum={totalOrundum}
            totalEventsOrundum={calcTotalOrundum(futureEvents, selectedEvents, 0, 0)}
            eventsOrundumCalc={`from ${selectedList.length} event${
              selectedList.length === 1 ? '' : 's'
            }`}
            totalDailyOrundum={totalDailyOrundum}
            dailyOrundumCalc={`${Math.floor(dailyOrundum)} × ${daysUntilLastEvent} day${
              daysUntilLastEvent === 1 ? '' : 's'
            }`}
            playerOrundumTotal={playerOrundumTotal}
          />
        </div>
      </div>
    </>
  );
}
