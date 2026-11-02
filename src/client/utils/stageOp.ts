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
  fetchedAt: string;
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
export function opForSanity(stages: OpStage[], budget: number): { op: number; sanity: number } {
  const sorted = [...stages].sort((a, b) => a.ap / a.op - b.ap / b.op);
  let op = 0;
  let sanity = 0;
  for (const stage of sorted) {
    if (sanity + stage.ap > budget) break;
    sanity += stage.ap;
    op += stage.op;
  }
  return { op, sanity };
}

export interface StageOpSummary {
  // Groups playable now with something left to claim, and those only playable on a
  // rerun (not counted in opLeft).
  available: GroupSummary[];
  rerunOnly: GroupSummary[];
  opLeft: number;
  sanityLeft: number;
  rerunOnlyOp: number;
  // Every one-time Originite Prime reward in the game, claimed or not.
  totalGameOp: number;
  // Sanity to spend on stages by the deadline (now + per-day × days), and the
  // Originite Prime that clears.
  budget: number;
  plan: { op: number; sanity: number };
}

export function summarizeStageOp(
  data: StageOpData,
  progress: StageProgress | null,
  { now, days, sanityPerDay }: { now: Date; days: number; sanityPerDay: number }
): StageOpSummary {
  const claimed = new Set(progress?.claimed ?? []);
  const available: GroupSummary[] = [];
  const rerunOnly: GroupSummary[] = [];
  let totalGameOp = 0;
  for (const group of data.groups) {
    const summary = summarizeGroup(group, claimed);
    totalGameOp += summary.totalOp;
    if (summary.op === 0) continue;
    (isAvailableNow(group, now) ? available : rerunOnly).push(summary);
  }
  const budget = (sanityNow(progress, now) ?? 0) + Math.max(0, sanityPerDay) * days;
  return {
    available,
    rerunOnly,
    opLeft: available.reduce((n, g) => n + g.op, 0),
    sanityLeft: available.reduce((n, g) => n + g.sanity, 0),
    rerunOnlyOp: rerunOnly.reduce((n, g) => n + g.op, 0),
    totalGameOp,
    budget,
    plan: opForSanity(
      available.flatMap((g) => g.unclaimed),
      budget
    ),
  };
}
