import React, { useEffect, useState } from 'react'
import { useStorage } from './hooks/useStorage.js';
import { calcDailyOrundum, calcEventOrundum, calcTotalOrundum, pullsFromOrundum } from './utils/orundum.js';
import { filterUpcomingEvents, calculateSelectedEventData, calculateLatestEventStart } from './utils/events.js';

import { CurrentlyOwned } from './components/CurrentlyOwned'
import { DailyOrundum } from './components/DailyOrundum'
import { EventsList } from './components/EventsList'
import { TotalOrundum } from './components/TotalOrundum'
import { Header } from './components/Header'

import defaultSettings from './settings.json';
import defaultPlayerStatus from './playerStatus.json';
import './App.css'

export default function App() {
  const [events, setEvents] = useState([])
  const [selectedEvents, setSelectedEvents] = useState(new Set())
  const [settings, setSettings] = useStorage('ak-events-settings', defaultSettings);
  const [playerStatus, setPlayerStatus] = useStorage('ak-events-player-status', defaultPlayerStatus);

  const updateSetting = (key, property, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [property]: value }
    }))
  }

  const updatePlayerStatus = (key, value) => {
    setPlayerStatus(prev => ({ ...prev, [key]: value }))
  }

  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('./data/events.json')
        const data = await response.json()
        setEvents(data.map(e => ({ ...e, orundum: calcEventOrundum(e) })))
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    }
    fetchEvents()
  }, [])

  const dailyOrundum = calcDailyOrundum(settings);
  console.log('dailyOrundum', dailyOrundum)

  const playerOrundumTotal = playerStatus.orundum + (playerStatus.op * 180) + (playerStatus.hhPermits * 600)

  // Filter events to only show future events
  const today = new Date()
  const filteredEvents = filterUpcomingEvents(events, today)

  const handleEventToggle = (eventName) => {
    setSelectedEvents(prev => {
      const newSelected = new Set(prev)
      
      if (newSelected.has(eventName)) {
        // Unchecking: only remove this event
        newSelected.delete(eventName)
      } else {
        // Checking: add this event and all previous events
        const eventIndex = filteredEvents.findIndex(e => e.name === eventName)
        for (let i = 0; i <= eventIndex; i++) {
          newSelected.add(filteredEvents[i].name)
        }
      }
      
      return newSelected
    })
  }

  const { selectedList, daysUntilLastEvent } = calculateSelectedEventData(filteredEvents, selectedEvents);
  const totalDailyOrundum = dailyOrundum * daysUntilLastEvent;
  const totalOrundum = calcTotalOrundum(filteredEvents, selectedEvents, totalDailyOrundum, playerOrundumTotal);
  const totalPulls = pullsFromOrundum(totalOrundum);

  // Compute values for total section
  const totalEventsOrundum = calcTotalOrundum(filteredEvents, selectedEvents, 0, 0);
  const latestEventStart = calculateLatestEventStart(selectedList);

  return (
    <>

      <Header totalPulls={totalPulls} />

      <div className="ak-main-content">
        <EventsList 
          filteredEvents={filteredEvents}
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
            latestEventStart={latestEventStart}
            totalOrundum={totalOrundum}
            totalEventsOrundum={calcTotalOrundum(filteredEvents, selectedEvents, 0, 0)}
            eventsOrundumCalc={`from ${selectedList.length} event(s)`}
            totalDailyOrundum={totalDailyOrundum}
            dailyOrundumCalc={`${Math.floor(dailyOrundum)} × ${daysUntilLastEvent} days`}
            playerOrundumTotal={playerOrundumTotal}
          />
        </div>
      </div>
    </>
  )
}