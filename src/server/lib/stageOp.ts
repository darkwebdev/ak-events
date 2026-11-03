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
  // Where the game's Storyline screen puts it (stage_table's storylines /
  // storylineStorySets) — see annotateStories. Absent for stories the screen
  // doesn't list (collabs, minigames, supply stages).
  info?: StoryInfo;
  stages: OpStage[];
}

// main / sideStory / vignette: the Storyline screen's MAINLINE / SS / COLLECT sets.
export type StoryType = 'main' | 'sideStory' | 'vignette';

export interface StoryInfo {
  type: StoryType;
  // The storyline it's listed under (its id in StageOpData.storylines), and its
  // place there.
  storyline: string | null;
  storylineOrder: number;
  // Main story only: the movement ("Shadow of a Dying Sun").
  movement: string | null;
  // The Storyline screen's "by year" order.
  year: number;
  yearOrder: number;
  // Release (its first run's start, Unix seconds) on the EN and CN servers.
  enStart: number | null;
  cnStart: number | null;
}

export interface Storyline {
  id: string;
  name: string;
  // Main storyline only: its movements, in order.
  movements: string[];
}

export interface SanityItem {
  name: string;
  sanity: number;
}

// No timestamp on purpose: the daily job only commits when the stage list itself
// changed.
export interface StageOpData {
  groups: StageGroup[];
  storylines: Storyline[];
  // Sanity packs by item id, for naming the account's own.
  sanityItems: Record<string, SanityItem>;
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

interface StorySet {
  storySetId: string;
  storySetType: string;
  sortByYear?: number;
  sortWithinYear?: number;
  relevantActivityId?: string | null;
  mainlineData?: { zoneId?: string | null; retroId?: string | null } | null;
  ssData?: { retroActivityId?: string | null } | null;
}

interface StorylineEntry {
  storylineId: string;
  storylineName: string;
  sortId: number;
  locations: Record<
    string,
    {
      locationType: string;
      sortId: number;
      relevantStorySetId?: string | null;
      mainlineSplitData?: { subName?: string | null } | null;
    }
  >;
}

export interface ItemTable {
  items: Record<string, { name?: string }>;
  apSupplies?: Record<string, { id: string; ap: number }>;
}

const STORY_TYPES: Record<string, StoryType> = {
  MAINLINE: 'main',
  SS: 'sideStory',
  COLLECT: 'vignette',
};

// "SHADOW OF A DYING SUN" → "Shadow of a Dying Sun".
function titleCase(text: string): string {
  const small = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'and']);
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

// Puts each group where the game's Storyline screen lists it: its story type,
// storyline (and movement for the main story), year, and release dates.
function annotateStories(
  groups: StageGroup[],
  {
    stageTable,
    activityTable,
    cnActivityTable,
    retroTable,
  }: {
    stageTable: StageTable;
    activityTable: ActivityTable;
    cnActivityTable: ActivityTable | null;
    retroTable: RetroTable;
  }
): Storyline[] {
  const sets = (stageTable.storylineStorySets ?? {}) as Record<string, StorySet>;
  const lines = Object.values((stageTable.storylines ?? {}) as Record<string, StorylineEntry>).sort(
    (a, b) => a.sortId - b.sortId
  );

  // Each set's own storyline: the one listing it as a STORY_SET (BEFORE/AFTER
  // entries only point at sets that belong to another storyline).
  const placement = new Map<
    string,
    { storyline: string; order: number; movement: string | null }
  >();
  const storylines: Storyline[] = [];
  for (const line of lines) {
    const movements: string[] = [];
    let movement: string | null = null;
    const locations = Object.values(line.locations ?? {}).sort((a, b) => a.sortId - b.sortId);
    locations.forEach((loc, order) => {
      if (loc.locationType === 'MAINLINE_SPLIT' && loc.mainlineSplitData?.subName) {
        movement = titleCase(loc.mainlineSplitData.subName);
        movements.push(movement);
      } else if (loc.locationType === 'STORY_SET' && loc.relevantStorySetId) {
        if (!placement.has(loc.relevantStorySetId)) {
          placement.set(loc.relevantStorySetId, { storyline: line.storylineId, order, movement });
        }
      }
    });
    // The main storyline (the one split into movements) is called "For Tomorrow" in
    // the game; "Main Story" is what people know it as.
    const name = movements.length ? 'Main Story' : line.storylineName;
    storylines.push({ id: line.storylineId, name, movements });
  }

  // Episodes 15+ are archived (permanent_main_*) rather than in a main_<n> zone.
  const retroEpisode = new Map<string, number>();
  for (const [stageId, stage] of Object.entries(retroTable.stageList ?? {})) {
    const retroId = retroTable.zoneToRetro?.[stage.zoneId];
    const episode = episodeFromId(stageId);
    if (retroId && episode != null && !retroEpisode.has(retroId))
      retroEpisode.set(retroId, episode);
  }
  const setFor = new Map<string, StorySet>();
  for (const set of Object.values(sets)) {
    const zone = set.mainlineData?.zoneId;
    const zoneEpisode = zone ? /^main_(\d+)$/.exec(zone) : null;
    if (zoneEpisode) setFor.set(`episode_${zoneEpisode[1]}`, set);
    const mainRetro = set.mainlineData?.retroId;
    if (mainRetro && retroEpisode.has(mainRetro)) {
      setFor.set(`episode_${retroEpisode.get(mainRetro)}`, set);
    }
    if (set.ssData?.retroActivityId) setFor.set(set.ssData.retroActivityId, set);
    if (set.relevantActivityId && set.storySetType !== 'MAINLINE') {
      setFor.set(set.relevantActivityId, set);
    }
  }

  const en = activityTable.basicInfo ?? {};
  const cn = cnActivityTable?.basicInfo ?? {};
  for (const group of groups) {
    // An event's stages are named after its original activity (act42side_01), even
    // when the group came from a rerun's activity id.
    const stagePrefix = group.stages[0]?.id.split('_')[0];
    const set =
      setFor.get(group.id) ??
      (group.kind === 'event' && stagePrefix ? setFor.get(stagePrefix) : undefined);
    if (!set || !STORY_TYPES[set.storySetType]) continue;
    const where = placement.get(set.storySetId);
    const activityId = set.relevantActivityId ?? null;
    group.info = {
      type: STORY_TYPES[set.storySetType],
      storyline: where?.storyline ?? null,
      storylineOrder: where?.order ?? 0,
      movement: where?.movement ?? null,
      year: set.sortByYear ?? 0,
      yearOrder: set.sortWithinYear ?? 0,
      enStart: (activityId && en[activityId]?.startTime) || null,
      cnStart: (activityId && cn[activityId]?.startTime) || null,
    };
  }
  return storylines;
}

function sanityItemsFrom(itemTable: ItemTable | null): Record<string, SanityItem> {
  const out: Record<string, SanityItem> = {};
  for (const supply of Object.values(itemTable?.apSupplies ?? {})) {
    out[supply.id] = { name: itemTable?.items?.[supply.id]?.name ?? supply.id, sanity: supply.ap };
  }
  return out;
}

export function buildStageOpData({
  stageTable,
  zoneTable,
  activityTable,
  retroTable,
  cnActivityTable = null,
  itemTable = null,
}: {
  stageTable: StageTable;
  zoneTable: ZoneTable;
  activityTable: ActivityTable;
  retroTable: RetroTable;
  cnActivityTable?: ActivityTable | null;
  itemTable?: ItemTable | null;
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

  const storylines = annotateStories(groups, {
    stageTable,
    activityTable,
    cnActivityTable,
    retroTable,
  });
  return { groups, storylines, sanityItems: sanityItemsFrom(itemTable) };
}
