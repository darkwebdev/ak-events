import { normalizeEventName } from './gameData.js';
import type { ActivityTable, StageTable } from '../types.js';

// Builds public/data/stage_op.json: every stage that pays a one-time Originite
// Prime reward (stage_table's `diamondOnceDrop`, paid on the first 3-star clear),
// grouped the way the game lists them — main story episodes, supply stages, the
// permanent Side Story / Intermezzi archive, and limited events. The client joins
// this with the linked account's own stage progress (ak-account's myStages) to
// count the Originite Prime still to claim, and the sanity that takes.

export interface ZoneTable {
  zones: Record<
    string,
    { zoneID: string; type: string; zoneNameFirst?: string | null; zoneNameSecond?: string | null }
  >;
}

export interface RetroTable {
  // Permanent (archived) Side Stories and Intermezzi.
  retroActList: Record<string, { retroId: string; type: string; name: string; index: number }>;
  // Every archived stage, by the same stage id as its original run.
  stageList: Record<string, { zoneId: string; [key: string]: unknown }>;
  zoneToRetro: Record<string, string>;
}

// standard: the normal stage. adverse: a main episode's Adverse environment
// (tough_*). challenge: Challenge Mode (#f#). sixStar: the newer 6-star mode (#s).
export type StageMode = 'standard' | 'adverse' | 'challenge' | 'sixStar';

export interface OpStage {
  id: string;
  code: string;
  name: string;
  // Sanity per attempt. A failed attempt refunds most of it in-game; this is the
  // cost of one successful clear.
  ap: number;
  op: number;
  mode: StageMode;
}

// main: a main story episode. supply: the permanent supply stages (CE-1 etc).
// sideStory / intermezzi: archived events, playable any time (after unlocking them
// with Event Crystals). event: a limited event, only playable while it (or a rerun)
// is on.
export type StageGroupKind = 'main' | 'supply' | 'sideStory' | 'intermezzi' | 'event';

export interface StageGroup {
  id: string;
  kind: StageGroupKind;
  name: string;
  // For kind "event": when its latest known run starts and ends (Unix seconds), so
  // the client can tell "on right now" from "rerun only" by its own clock. Null when
  // the EN client has no run with stages for it.
  startTime?: number | null;
  endTime?: number | null;
  // For kind "event": a story event (Side Story or Story Collection), the kind that
  // can come back as a rerun. Minigame events (Duel Channel, Icebreaker Games, April
  // Fools…) only count while they're on.
  story?: boolean;
  stages: OpStage[];
}

// No timestamp on purpose: the daily job only commits when the stage list itself
// changed.
export interface StageOpData {
  groups: StageGroup[];
}

interface RawStage {
  stageId?: string;
  stageType?: string;
  difficulty?: string;
  zoneId?: string;
  code?: string;
  name?: string | null;
  apCost?: number;
  diamondOnceDrop?: number;
}

function stageMode(id: string, stage: RawStage): StageMode {
  if (id.includes('#s')) return 'sixStar';
  if (id.includes('#f#') || stage.difficulty === 'FOUR_STAR') return 'challenge';
  if (stage.difficulty === 'SIX_STAR') return 'sixStar';
  if (id.startsWith('tough_')) return 'adverse';
  return 'standard';
}

function toOpStage(id: string, stage: RawStage): OpStage {
  return {
    id,
    code: stage.code ?? id,
    name: stage.name ?? '',
    ap: Math.max(0, stage.apCost ?? 0),
    op: stage.diamondOnceDrop ?? 0,
    mode: stageMode(id, stage),
  };
}

// The episode a main-story stage belongs to: main_15-01 / tough_15-01 / st_15-01 /
// sub_03-1-1 → 15 / 15 / 15 / 3. Episodes 15+ live in their own launch-event zones
// (act2mainss_zone1 …) rather than main_15, so the zone alone isn't enough.
// Training stages (tr_26) carry no episode number, so they take their zone's.
function episodeFromId(id: string): number | null {
  const m = /^(?:main|tough|easy|st|sub|hard)_(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

function episodeOf(id: string, zoneId: string, zoneEpisodes: Map<string, number>): number | null {
  const fromId = episodeFromId(id);
  if (fromId != null) return fromId;
  const fromZone = /^main_(\d+)$/.exec(zoneId);
  if (fromZone) return Number(fromZone[1]);
  return zoneEpisodes.get(zoneId) ?? null;
}

const MODE_ORDER: Record<StageMode, number> = { standard: 0, adverse: 1, challenge: 2, sixStar: 3 };

// Stage table order is the game's own order within a zone, which is what the
// in-game stage map follows — keep it, but put each stage's harder modes after all
// the standard ones so a group reads 1-1, 1-2, … then the challenges.
function sortStages(stages: OpStage[]): OpStage[] {
  return stages
    .map((s, i) => ({ s, i }))
    .sort((a, b) => MODE_ORDER[a.s.mode] - MODE_ORDER[b.s.mode] || a.i - b.i)
    .map(({ s }) => s);
}

// Side Stories are TYPE_ACT<n>SIDE / TYPE_ACT9D0 (several share that template) or
// displayType SIDESTORY; Story Collections are MINISTORY (older ones TYPE_ACT<n>D0/D5).
function isStoryEvent(entry: object): boolean {
  const activity = entry as { type?: unknown; displayType?: unknown };
  const type = String(activity.type ?? '');
  return (
    activity.displayType === 'SIDESTORY' ||
    activity.displayType === 'MINISTORY' ||
    type === 'MINISTORY' ||
    /^TYPE_ACT\d+(SIDE|D0|D5)$/.test(type)
  );
}

export function buildStageOpData({
  stageTable,
  zoneTable,
  activityTable,
  retroTable,
}: {
  stageTable: StageTable;
  zoneTable: ZoneTable;
  activityTable: ActivityTable;
  retroTable: RetroTable;
}): StageOpData {
  const zones = zoneTable.zones ?? {};
  const zoneToActivity = (activityTable.zoneToActivity ?? {}) as Record<string, string>;
  const activities = activityTable.basicInfo ?? {};
  const retroStages = retroTable.stageList ?? {};
  const retroActs = retroTable.retroActList ?? {};
  const zoneToRetro = retroTable.zoneToRetro ?? {};

  const mainGroups = new Map<number, { zoneNames: Set<string>; stages: OpStage[] }>();
  const supply: OpStage[] = [];
  const retroGroups = new Map<string, OpStage[]>();
  const eventGroups = new Map<string, { activityIds: Set<string>; stages: OpStage[] }>();

  const zoneEpisodes = new Map<string, number>();
  for (const [id, raw] of Object.entries(stageTable.stages ?? {}) as [string, RawStage][]) {
    const episode = episodeFromId(id);
    if (episode != null && raw?.zoneId && !zoneEpisodes.has(raw.zoneId)) {
      zoneEpisodes.set(raw.zoneId, episode);
    }
  }

  for (const [id, raw] of Object.entries(stageTable.stages ?? {}) as [string, RawStage][]) {
    if (!raw || !(raw.diamondOnceDrop && raw.diamondOnceDrop > 0)) continue;
    const stage = toOpStage(id, raw);
    const zoneId = raw.zoneId ?? '';

    if (raw.stageType === 'MAIN' || raw.stageType === 'SUB') {
      const episode = episodeOf(id, zoneId, zoneEpisodes);
      if (episode == null) continue;
      const group = mainGroups.get(episode) ?? { zoneNames: new Set<string>(), stages: [] };
      const zone = zones[zoneId];
      const zoneName = zone?.zoneNameSecond || zone?.zoneNameFirst;
      if (zoneName) group.zoneNames.add(zoneName);
      group.stages.push(stage);
      mainGroups.set(episode, group);
      continue;
    }
    if (raw.stageType === 'DAILY') {
      supply.push(stage);
      continue;
    }
    if (raw.stageType !== 'ACTIVITY') continue;

    const retro = retroStages[id];
    const retroId = retro ? zoneToRetro[retro.zoneId] : undefined;
    if (retroId && retroActs[retroId]) {
      retroGroups.set(retroId, [...(retroGroups.get(retroId) ?? []), stage]);
      continue;
    }
    const activityId = zoneToActivity[zoneId];
    const activity = activityId ? activities[activityId] : undefined;
    if (!activity) continue;
    const key = normalizeEventName(activity.name);
    const group = eventGroups.get(key) ?? { activityIds: new Set<string>(), stages: [] };
    group.activityIds.add(activityId);
    group.stages.push(stage);
    eventGroups.set(key, group);
  }

  const groups: StageGroup[] = [];

  for (const [episode, { zoneNames, stages }] of [...mainGroups].sort((a, b) => a[0] - b[0])) {
    const title = [...zoneNames][0];
    groups.push({
      id: `episode_${episode}`,
      kind: 'main',
      name: title ? `Episode ${episode}: ${title}` : `Episode ${episode}`,
      stages: sortStages(stages),
    });
  }
  if (supply.length) {
    groups.push({
      id: 'supply',
      kind: 'supply',
      name: 'Supply stages',
      stages: sortStages(supply),
    });
  }
  for (const [retroId, stages] of [...retroGroups].sort(
    (a, b) =>
      (retroActs[a[0]].type === 'SIDESTORY' ? 0 : 1) -
        (retroActs[b[0]].type === 'SIDESTORY' ? 0 : 1) ||
      retroActs[a[0]].index - retroActs[b[0]].index
  )) {
    const act = retroActs[retroId];
    groups.push({
      id: retroId,
      kind: act.type === 'SIDESTORY' ? 'sideStory' : 'intermezzi',
      name: act.name,
      stages: sortStages(stages),
    });
  }

  // A rerun is its own activity (act42sre) sharing the original's stage ids, so its
  // run times come from any activity with the same name — the latest one wins.
  const runsByName = new Map<string, { startTime: number; endTime: number }>();
  for (const activity of Object.values(activities)) {
    if (!activity.startTime || !activity.endTime) continue;
    const key = normalizeEventName(activity.name);
    const prev = runsByName.get(key);
    if (!prev || activity.endTime > prev.endTime) {
      runsByName.set(key, { startTime: activity.startTime, endTime: activity.endTime });
    }
  }
  const eventEntries = [...eventGroups].map(([key, { activityIds, stages }]) => {
    const [firstId] = [...activityIds];
    const name = String(activities[firstId].name).replace(/\s*-\s*Rerun\s*$/i, '');
    const run = runsByName.get(key);
    return {
      id: firstId,
      kind: 'event' as const,
      name,
      startTime: run?.startTime ?? null,
      endTime: run?.endTime ?? null,
      story: isStoryEvent(activities[firstId]),
      stages: sortStages(stages),
    };
  });
  // Newest first: what's on now or coming back soon is what people look for.
  eventEntries.sort((a, b) => (b.endTime ?? 0) - (a.endTime ?? 0));
  groups.push(...eventEntries);

  return { groups };
}
