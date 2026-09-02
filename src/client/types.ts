// Shared client-side shapes. Event/banner shapes are the same JSON contract
// src/server/scrape.ts writes to public/data/events.json — reusing the server's own
// types (rather than re-declaring an equivalent shape here) means the two can't
// silently drift apart.
import type { ProcessedEvent, ResolvedBanner, ResolvedBannerOperator } from '../server/types.js';

export type { ResolvedBanner, ResolvedBannerOperator };

// event.intCerts (see extractIntCertsFromHtml on the server) is a scraped ceiling,
// not a guaranteed reward — intCertsIncluded is the user's own per-event opt-in into
// counting it, merged onto the raw ProcessedEvent client-side (see App.tsx) rather
// than coming from the server at all.
export interface Event extends ProcessedEvent {
  intCertsIncluded?: boolean;
}

export type SelectedEvents = Set<string>;

export interface PlayerStatus {
  orundum: number;
  op: number;
  hhPermits: number;
}

// One entry in settings.json — each key (e.g. "Annihilation", "Green Cert T1") is a
// recurring Orundum/Headhunting-Permit source the user can toggle on/off; which of
// the optional fields are present depends on that source's own cadence (daily/
// weekly/bi-monthly/monthly), see calcDailyOrundum in utils/orundum.ts.
export interface DailySetting {
  enabled: boolean;
  dailyOrundum?: number;
  weeklyOrundum?: number;
  biMonthlyOrundum?: number;
  monthlyOrundum?: number;
  monthlyOP?: number;
  monthlyHH?: number;
}

export type Settings = Record<string, DailySetting>;

// A completed Yostar login (see arkCharsApi.ts) — the credentials needed to re-fetch
// the linked account's own data, persisted client-side so a page reload doesn't
// require re-authenticating.
export interface ArkAuth {
  channelUid: string;
  yostarToken: string;
  server: string;
}

// The last successfully fetched account snapshot, shown in ArknightsAccount without
// needing another live fetch (which re-logs the account out of the game) just to
// redisplay data already fetched once.
export interface LinkedAccount {
  nickName: string | null;
  level: number | null;
  avatarUrl: string | null;
}

// Per-event opt-in state for Intelligence Certificates, keyed by event name — see
// Event.intCertsIncluded above for how this gets merged onto the raw event data.
export type IntCertsIncludedMap = Record<string, boolean>;
