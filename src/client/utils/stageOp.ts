// Originite Prime still to claim from stages: public/data/stage_op.json (every
// stage with a one-time Originite Prime reward, see src/server/lib/stageOp.ts)
// joined with the linked account's own stage progress.
import type { OpStage, StageGroup, StageOpData } from '../../server/lib/stageOp.js';

export type { OpStage, StageGroup, StageOpData };

// The game regains 1 sanity every 6 minutes.
export const SANITY_REGEN_MINUTES = 6;
export const NATURAL_SANITY_PER_DAY = (24 * 60) / SANITY_REGEN_MINUTES;

// What the last account fetch said about stages and sanity. Only stages cleared
// with 3 stars are kept: that's when the one-time reward is paid, and the rest of
// myStages isn't needed here.
export interface StageProgress {
  claimed: string[];
  sanity: number | null;
  maxSanity: number | null;
  // Unexpired sanity potions at the fetch. Optional: snapshots from before it
  // was added don't have it.
  potions?: SanityPotion[];
  fetchedAt: string;
}

export interface SanityPotion {
  sanity: number;
  count: number;
  // Unix seconds, or null when it never expires.
  expiresAt: number | null;
}

// The Monthly Card's daily Emergency Sanity Booster (checkin_table's monthlySubItem).
export const MONTHLY_CARD_SANITY_PER_DAY = 80;

// Sanity in potions still unexpired at `now`.
export function potionSanity(progress: StageProgress | null, now: Date): number {
  const t = now.getTime() / 1000;
  return (progress?.potions ?? [])
    .filter((p) => p.expiresAt == null || p.expiresAt > t)
    .reduce((n, p) => n + p.sanity * p.count, 0);
}

export interface GroupSummary {
  group: StageGroup;
  // Stages whose reward hasn't been claimed yet, in the group's own order.
  unclaimed: OpStage[];
  op: number;
  totalOp: number;
  sanity: number;
}

// Whether a group's stages can be played right now: main story, supply stages and
// the Side Story / Intermezzi archive always; a limited event only while it (or a
// rerun of it) is on.
export function isAvailableNow(group: StageGroup, now: Date): boolean {
  if (group.kind !== 'event') return true;
  const t = now.getTime() / 1000;
  return (
    group.startTime != null && group.endTime != null && group.startTime <= t && t <= group.endTime
  );
}

export function summarizeGroup(group: StageGroup, claimed: ReadonlySet<string>): GroupSummary {
  const unclaimed = group.stages.filter((s) => !claimed.has(s.id));
  return {
    group,
    unclaimed,
    op: unclaimed.reduce((n, s) => n + s.op, 0),
    totalOp: group.stages.reduce((n, s) => n + s.op, 0),
    sanity: unclaimed.reduce((n, s) => n + s.ap, 0),
  };
}

// Sanity right now, from the snapshot taken at the last account fetch plus natural
// regen since then (only up to the cap — sanity over it from potions doesn't
// regenerate). Null when the snapshot has no sanity (an older backend).
export function sanityNow(progress: StageProgress | null, now: Date): number | null {
  if (!progress || progress.sanity == null) return null;
  const { sanity, maxSanity } = progress;
  if (maxSanity == null || sanity >= maxSanity) return sanity;
  const minutes = (now.getTime() - new Date(progress.fetchedAt).getTime()) / 60000;
  const regained = Math.max(0, Math.floor(minutes / SANITY_REGEN_MINUTES));
  return Math.min(maxSanity, sanity + regained);
}

// How much Originite Prime a sanity budget clears: cheapest stages first, which is
// the most Originite Prime for the sanity since every stage pays the same 1.
// Assumes each stage is cleared with 3 stars on the first try and ignores what has
// to be cleared first to unlock it.
export interface SanityPlan {
  op: number;
  sanity: number;
  stages: number;
}

export function opForSanity(stages: OpStage[], budget: number): SanityPlan {
  const sorted = [...stages].sort((a, b) => a.ap / a.op - b.ap / b.op);
  let op = 0;
  let sanity = 0;
  let count = 0;
  for (const stage of sorted) {
    if (sanity + stage.ap > budget) break;
    sanity += stage.ap;
    op += stage.op;
    count += 1;
  }
  return { op, sanity, stages: count };
}

export interface StageOpSummary {
  // Groups playable now with something left to claim, and events that have ended
  // (back only if they rerun; not counted in opLeft) — story events and the rest
  // (Duel Channel, Icebreaker Games…) apart.
  available: GroupSummary[];
  // Events whose next run (a scheduled rerun) hasn't started yet.
  upcoming: GroupSummary[];
  ended: GroupSummary[];
  endedOther: GroupSummary[];
  opLeft: number;
  sanityLeft: number;
  endedOp: number;
  endedOtherOp: number;
  // Every one-time Originite Prime reward in the game, claimed or not.
  totalGameOp: number;
  // Unclaimed stages you can play now.
  stagesLeft: number;
  // Sanity and sanity in potions on hand now, and by the deadline (now + natural
  // regen / potions gained per day × days).
  sanity: { now: number; byDeadline: number };
  potions: { now: number; byDeadline: number };
  // What all of it clears: today, and by the deadline.
  planNow: SanityPlan;
  plan: SanityPlan;
}

export function summarizeStageOp(
  data: StageOpData,
  progress: StageProgress | null,
  {
    now,
    days,
    sanityPerDay,
    potionSanityPerDay = 0,
  }: {
    now: Date;
    days: number;
    // Natural regen the user puts into stages.
    sanityPerDay: number;
    // Potions gained a day (the Monthly Card's).
    potionSanityPerDay?: number;
  }
): StageOpSummary {
  const claimed = new Set(progress?.claimed ?? []);
  const available: GroupSummary[] = [];
  const upcoming: GroupSummary[] = [];
  const ended: GroupSummary[] = [];
  const endedOther: GroupSummary[] = [];
  let totalGameOp = 0;
  for (const group of data.groups) {
    const summary = summarizeGroup(group, claimed);
    totalGameOp += summary.totalOp;
    if (summary.op === 0) continue;
    if (isAvailableNow(group, now)) available.push(summary);
    else if (group.startTime != null && group.startTime * 1000 > now.getTime()) {
      upcoming.push(summary);
    } else (group.story === false ? endedOther : ended).push(summary);
  }
  const sanity0 = sanityNow(progress, now) ?? 0;
  const potions0 = potionSanity(progress, now);
  const sanity = { now: sanity0, byDeadline: sanity0 + Math.max(0, sanityPerDay) * days };
  const potions = { now: potions0, byDeadline: potions0 + Math.max(0, potionSanityPerDay) * days };
  const playable = available.flatMap((g) => g.unclaimed);
  return {
    available,
    upcoming,
    ended,
    endedOther,
    opLeft: available.reduce((n, g) => n + g.op, 0),
    sanityLeft: available.reduce((n, g) => n + g.sanity, 0),
    endedOp: ended.reduce((n, g) => n + g.op, 0),
    endedOtherOp: endedOther.reduce((n, g) => n + g.op, 0),
    totalGameOp,
    stagesLeft: playable.length,
    sanity,
    potions,
    planNow: opForSanity(playable, sanity.now + potions.now),
    plan: opForSanity(playable, sanity.byDeadline + potions.byDeadline),
  };
}
