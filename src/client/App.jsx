import React, { useEffect, useState } from 'react';
import { useStorage } from './hooks/useStorage.js';
import { calcDailyOrundum, calcTotalOrundum, pullsFromOrundum } from './utils/orundum.js';
import {
  filterUpcomingEvents,
  calculateSelectedEventData,
  calculateLatestEventStart,
} from './utils/events.js';

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

  const updateSetting = (key, property, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [property]: value },
    }));
  };

  const updatePlayerStatus = (key, value) => {
    setPlayerStatus((prev) => ({ ...prev, [key]: value }));
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

  const futureEvents = filterUpcomingEvents(events, new Date());

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
          settingsTotal={dailyOrundum}
          playerOrundumTotal={playerOrundumTotal}
        />

        <div className="ak-aside-column">
          <CurrentlyOwned
            owned={playerStatus}
            updateOwned={updatePlayerStatus}
            totalOwned={playerOrundumTotal}
          />

          <DailyOrundum
            settings={settings}
            updateSetting={updateSetting}
            settingsTotal={dailyOrundum}
          />

          <TotalOrundum
            latestEventStart={calculateLatestEventStart(selectedList)}
            totalOrundum={totalOrundum}
            totalEventsOrundum={calcTotalOrundum(futureEvents, selectedEvents, 0, 0)}
            eventsOrundumCalc={`from ${selectedList.length} event(s)`}
            totalDailyOrundum={totalDailyOrundum}
            dailyOrundumCalc={`${Math.floor(dailyOrundum)} × ${daysUntilLastEvent} days`}
            playerOrundumTotal={playerOrundumTotal}
          />
        </div>
      </div>
    </>
  );
}
