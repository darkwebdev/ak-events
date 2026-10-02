import React, { useEffect, useRef, useState } from 'react';
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
import { Dust } from './components/Dust';
import { DailyOrundum } from './components/DailyOrundum';
import { EventsList } from './components/EventsList';
import { TotalOrundum } from './components/TotalOrundum';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import {
  OwnedOperatorsContext,
  BannerProgressContext,
  type OwnedOperators,
} from './ownedOperators.js';

import defaultSettings from './settings.json';
import defaultPlayerStatus from './playerStatus.json';
import type {
  ArkAuth,
  DailySetting,
  Event,
  IntCertsIncludedMap,
  PlayerStatus,
  Settings,
} from './types.js';
import type { BannerProgress, FetchAccountDataResult } from './utils/arkCharsApi.js';
import './App.css';

// How often to recheck events.json for events that weren't there on the previous
// check — the scraper (see scrape.yml) only updates it once a day, so this doesn't
// need to be aggressive; it just needs to notice a change sometime during a tab left
// open across that daily update.
const EVENTS_POLL_INTERVAL_MS = 5 * 60 * 1000;
const NEW_EVENTS_NOTICE_DURATION_MS = 5000;

// Persists the event names seen as of the last successful fetch, so a fresh page
// load (not just a tab left open across a poll) can also tell "an event that was
// already here last visit" apart from "one that showed up since" — plain useState
// wouldn't survive a reload, and useStorage's re-render-on-every-write isn't needed
// for a value this only ever gets read from once per fetch.
const KNOWN_EVENT_NAMES_STORAGE_KEY = 'ak-events-known-event-names';

function loadKnownEventNames(): Set<string> | null {
  try {
    const raw = localStorage.getItem(KNOWN_EVENT_NAMES_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

function saveKnownEventNames(names: Set<string>) {
  try {
    localStorage.setItem(KNOWN_EVENT_NAMES_STORAGE_KEY, JSON.stringify([...names]));
  } catch {
    // Storage can be unavailable (private browsing, quota) — losing this is harmless,
    // it just means the next visit won't have a "since last time" baseline either.
  }
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEventsNotice, setNewEventsNotice] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useStorage<Settings>('ak-events-settings', defaultSettings);
  const [playerStatus, setPlayerStatus] = useStorage<PlayerStatus>(
    'ak-events-player-status',
    defaultPlayerStatus
  );
  const [arkAuth, setArkAuth] = useStorage<ArkAuth | null>('ak-events-arknights-auth', null);
  // The linked account's roster as last fetched, for marking owned operators on
  // banners — kept across reloads like the rest of the account snapshot, since
  // fetching again logs the game session out.
  const [ownedOperators, setOwnedOperators] = useStorage<OwnedOperators | null>(
    'ak-events-arknights-roster',
    null
  );
  const [bannerProgress, setBannerProgress] = useStorage<BannerProgress | null>(
    'ak-events-arknights-banner-progress',
    null
  );
  // Whether the user has opted in to counting a rerun's Intelligence Certificates
  // (event.intCerts, a scraped maximum — see extractIntCertsFromHtml on the server)
  // toward its Orundum total. Keyed by event name; only reruns with scraped data
  // show the checkbox at all (see Event/index.jsx).
  const [intCertsIncluded, setIntCertsIncluded] = useStorage<IntCertsIncludedMap>(
    'ak-events-int-certs-included',
    {}
  );
  // Off by default in every environment, including staging — turn it on in a given
  // browser via the ?ff_accountImport=1 URL param (sticks after that, see
  // utils/featureFlags.js) or `localStorage.setItem('ak-events-flag-accountImport',
  // 'true')` directly. Still logs the player out of their live game session on
  // every fetch (see ArknightsAccount's own warning) with no fix, only an accepted
  // limitation — that's the reason this stays gated rather than shipping wide open.
  const [accountImportEnabled] = useFeatureFlag('accountImport', false);
  // The animated smoke and dust over the page (see components/Dust), ?ff_dust=1.
  const [dustEnabled] = useFeatureFlag('dust', false);

  // On phones the sidebar is a panel over the page, opened from the header — see
  // App.css. Escape closes it.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const asideScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Chromium can route mouse-wheel input over this sticky, internally-scrollable
    // sidebar to the page's own scroller instead of the sidebar itself — a real,
    // reproducible quirk (confirmed by tracing: window.scrollY moves while this
    // element's own scrollTop stays put) that a wheel listener on the element itself
    // does NOT reliably fix, even non-passive with preventDefault: Chromium classifies
    // the *nested* sticky scroll region incorrectly at the compositor level, before
    // that listener ever gets a say. Listening on the document instead and deciding
    // by hand whether the pointer is over the sidebar sidesteps that per-element
    // misclassification, since a document-level non-passive listener isn't subject to
    // it — this is a deliberate workaround for a browser quirk, not the normal way to
    // do this.
    const onWheel = (event: WheelEvent) => {
      const el = asideScrollRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const overAside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!overAside) return;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) return;
      el.scrollTop += event.deltaY;
      event.preventDefault();
    };
    document.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => document.removeEventListener('wheel', onWheel, { capture: true });
  }, []);

  const updateSetting = (key: string, property: keyof DailySetting, value: boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [property]: value },
    }));
  };

  const setAllSettingsEnabled = (enabled: boolean) => {
    setSettings((prev) =>
      Object.fromEntries(Object.entries(prev).map(([key, s]) => [key, { ...s, enabled }]))
    );
  };

  const updatePlayerStatus = (key: keyof PlayerStatus, value: number) => {
    setPlayerStatus((prev) => ({ ...prev, [key]: value }));
  };

  const handleAccountFetched = (data: FetchAccountDataResult) => {
    updatePlayerStatus('orundum', data.orundum);
    updatePlayerStatus('op', data.originitePrime);
    // A ten-roll permit is ten pulls on any banner a single permit works on.
    updatePlayerStatus('hhPermits', data.headhuntingPermits + 10 * data.tenHeadhuntingPermits);
    setOwnedOperators(data.roster);
    setBannerProgress(data.bannerProgress);
  };

  const toggleIntCertsIncluded = (eventName: string, checked: boolean) => {
    setIntCertsIncluded((prev) => ({ ...prev, [eventName]: checked }));
  };

  useEffect(() => {
    // Seeded from localStorage (the last visit's saved names) rather than starting
    // empty, so a plain page reload — not just an already-open tab left running
    // across a poll — can also notice "new since I was last here". null means truly
    // never-before-seen (nothing saved yet), which is what keeps the very first-ever
    // load from notifying about every event as "new".
    let knownNames = loadKnownEventNames();
    async function fetchEvents() {
      try {
        const response = await fetch('./data/events.json');
        const data = (await response.json()) as Event[];
        if (knownNames) {
          const newlyAdded = data.filter((event) => !knownNames!.has(event.name));
          if (newlyAdded.length === 1) {
            setNewEventsNotice(`New event: ${newlyAdded[0].name}`);
          } else if (newlyAdded.length > 1) {
            setNewEventsNotice(`${newlyAdded.length} new events added`);
          }
        }
        knownNames = new Set(data.map((event) => event.name));
        saveKnownEventNames(knownNames);
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }
    fetchEvents();
    const interval = setInterval(fetchEvents, EVENTS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!newEventsNotice) return undefined;
    const timeout = setTimeout(() => setNewEventsNotice(null), NEW_EVENTS_NOTICE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [newEventsNotice]);

  const playerOrundumTotal =
    playerStatus.orundum + playerStatus.op * 180 + playerStatus.hhPermits * 600;

  const rawFutureEvents = filterUpcomingEvents(events, new Date());
  // Only reruns actually carry a scraped `intCerts` value — every other event is
  // passed through untouched, so calcEventOrundum's existing origPrime/hhPermits
  // math is unaffected by this merge.
  const futureEvents = rawFutureEvents.map((event) =>
    event.intCerts != null ? { ...event, intCertsIncluded: !!intCertsIncluded[event.name] } : event
  );

  const handleEventToggle = (eventName: string) => {
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
      {dustEnabled && <Dust />}
      {newEventsNotice && <Toast message={newEventsNotice} />}

      <Header
        totalPulls={pullsFromOrundum(totalOrundum)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <div className="ak-main-content">
        <OwnedOperatorsContext.Provider value={accountImportEnabled ? ownedOperators : null}>
          <BannerProgressContext.Provider value={accountImportEnabled ? bannerProgress : null}>
            <EventsList
              filteredEvents={futureEvents}
              selectedEvents={selectedEvents}
              onEventToggle={handleEventToggle}
              onToggleIntCerts={toggleIntCertsIncluded}
            />
          </BannerProgressContext.Provider>
        </OwnedOperatorsContext.Provider>

        {sidebarOpen && (
          // Phones only (hidden on wider screens): dims the page, and a tap closes.
          <div
            className="ak-sidebar-backdrop"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div id="ak-sidebar" className={`ak-aside-column${sidebarOpen ? ' open' : ''}`}>
          <button
            type="button"
            className="ak-sidebar-close"
            aria-label="Close pulls and income"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
          <div className="ak-aside-scroll" ref={asideScrollRef}>
            {accountImportEnabled && (
              <ArknightsAccount
                authState={arkAuth}
                setAuthState={setArkAuth}
                onFetched={handleAccountFetched}
                onLogout={() => {
                  setOwnedOperators(null);
                  setBannerProgress(null);
                }}
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
      </div>
    </>
  );
}
