import React, { useEffect, useState } from 'react'
import { useStorage } from './hooks/useStorage.js';
import { calcEventOrundum, calcTotalOrundum, pullsFromOrundum } from './utils/orundum.js';
import { getEffectiveEnd } from './utils/dates.js'

import { PullCounter } from './components/PullCounter'
import { CurrentlyOwned } from './components/CurrentlyOwned'
import { DailyOrundum } from './components/DailyOrundum'
import { EventsList } from './components/EventsList'

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
      [key]: {
        ...prev[key],
        [property]: value
      }
    }))
  }

  const updatePlayerStatus = (key, value) => {
    setPlayerStatus(prev => ({
      ...prev,
      [key]: value
    }))
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

  // Calculate totals
  const dailyOrundum = Object.values(settings).reduce((sum, setting) => {
    return setting.enabled ? sum + setting.value : sum
  }, 0)

  const playerOrundumTotal = playerStatus.orundum + (playerStatus.op * 180) + (playerStatus.hhPermits * 600)

  // Filter events to only show future events
  const today = new Date()
  today.setHours(23, 59, 59, 999) // Set to end of today to include today's events
  
  const filteredEvents = events.filter(event => {
    const eventEnd = getEffectiveEnd(event);
    if (!eventEnd) return false;
    return eventEnd >= today;
  })

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

  // Compute grand total orundum and pulls (matches EventsList logic)
  const selectedList = filteredEvents.filter(ev => selectedEvents.has(ev.name));
  const maxDays = selectedList.length > 0
    ? Math.max(...selectedList.map(event => {
        const start = event.globalStart || event.cnStart ? new Date(event.globalStart || event.cnStart) : null;
        if (!start) return 0;
        const now = new Date();
        now.setHours(0,0,0,0);
        return Math.max(0, Math.ceil((start - now) / (1000 * 60 * 60 * 24)));
      }))
    : 0;
  const totalDailyOrundum = dailyOrundum * maxDays;
  const totalOrundum = calcTotalOrundum(filteredEvents, selectedEvents, totalDailyOrundum, playerOrundumTotal);
  const totalPulls = pullsFromOrundum(totalOrundum);

  return (
    <div className="ak-root">

      <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em' }}>
        Arknights Pull Prophecy
        {totalPulls > 0 ? (
          <PullCounter value={totalPulls} />
        ) : (
          <img src="images/icon-diamond-black.svg" alt="Diamond icon" style={{ height: '2.5rem', verticalAlign: 'middle' }} />
        )}
      </h1>

      <div className="ak-container">
        <div className="ak-main-content">
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
        </div>

        <EventsList 
          filteredEvents={filteredEvents}
          selectedEvents={selectedEvents}
          onEventToggle={handleEventToggle}
          settingsTotal={dailyOrundum}
          playerOrundumTotal={playerOrundumTotal}
        />
        </div>
      </div>
    </div>
  )
}