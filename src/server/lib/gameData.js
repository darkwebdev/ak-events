// Helpers for the game's own official data (activity_table.json/stage_table.json —
// see config.js for the URLs), used as the primary source for event dates and
// Originite Prime rewards. See the "estimated future events + immediate/over-time
// correctness" strategy this implements: confirmed official data first, falling back
// to the wiki's own heuristic extraction (parser.js) only where this doesn't reach.

// Wiki/arkpedia event names carry decorations (bracketed tags, "Rerun", "Part N")
// that the game's own internal activity name doesn't (or vice versa) — e.g. wiki's
// "Stronghold Protocol Alliance Part 2" vs the game data's "Stronghold Protocol:
// Alliance", or wiki's "When Elegies Are Ashes" vs the game data's "When Elegies Are
// Ashes - Rerun". Normalizing both sides to the same bare form is what makes an exact
// match possible across sources that don't otherwise agree on formatting.
function normalizeEventName(name) {
  if (!name) return '';
  return name
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[:,'’"]/g, '')
    .replace(/\bRerun\b/gi, ' ')
    .replace(/\bPart\s*\d+\b/gi, ' ')
    .replace(/\s*-\s*(?=\s|$)/g, ' ') // a now-dangling hyphen left by stripping "Rerun"/tags around it
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Find the activity_table.json `basicInfo` entry matching `eventName`, or null if
// none matches exactly after normalization. Deliberately exact-only (not fuzzy) —
// this data feeds dates and reward calculations directly, so a wrong match would be
// worse than no match; an unmatched event just falls back to the wiki.
//
// Rejects any candidate whose endTime has already passed (relative to `now`, real
// time by default — injectable for tests). A rerun doesn't always get its own
// separate activity_table entry the moment it's announced/listed on the wiki — until
// the EN client build actually adds one, the only entry sharing that normalized name
// can be the *original* run's, sometimes years past. Matching that would silently
// attach a long-past date to what the wiki is currently listing as upcoming, which is
// worse than not matching at all — the wiki/arkpedia fallback path only ever deals in
// current-or-upcoming events, so it should still get a chance instead.
function findActivity(activityTable, eventName, now = Date.now()) {
  if (!activityTable || !activityTable.basicInfo || !eventName) return null;
  const target = normalizeEventName(eventName);
  if (!target) return null;
  const nowSeconds = now / 1000;
  for (const activity of Object.values(activityTable.basicInfo)) {
    if (normalizeEventName(activity.name) !== target) continue;
    if (activity.endTime && activity.endTime < nowSeconds) continue;
    return activity;
  }
  return null;
}

// Convert an activity's startTime/endTime (Unix seconds) to the same
// { globalDateStr } shape parseDateRange already expects elsewhere in the pipeline,
// so this can slot into the same processing path as wiki-sourced dates.
function activityDateStr(activity) {
  if (!activity || !activity.startTime || !activity.endTime) return null;
  const fmt = (unixSeconds) =>
    new Date(unixSeconds * 1000).toISOString().slice(0, 10).replace(/-/g, '/');
  return `${fmt(activity.startTime)}–${fmt(activity.endTime)}`;
}

// Sum the one-time Originite Prime completion reward (the `diamondOnceDrop` field —
// "diamond" is the game data's internal name for Originite Prime) across every stage
// belonging to `activityId`. Verified against a real event: matches the wiki's own
// extracted value exactly. Returns null (not 0) both when no stages are found at all
// *and* when the sum comes to zero — confirmed in real data (Stronghold Protocol:
// Alliance, an AUTOCHESS_SEASON activity) that a special event type can have its own
// stage_table.json entries with diamondOnceDrop: 0 on every one, because it earns
// Originite Prime through a separate season/milestone system this method doesn't
// reach, not because the event truly gives none. A standard side-story event
// genuinely awarding zero would be unusual enough that treating a computed zero as
// "inconclusive, let the wiki fallback try instead" is the safer default.
function originitePrimeFromStages(activityId, stageTable) {
  if (!activityId || !stageTable || !stageTable.stages) return null;
  const prefix = `${activityId}_`;
  let total = 0;
  let found = false;
  for (const [stageId, stage] of Object.entries(stageTable.stages)) {
    if (!stageId.startsWith(prefix)) continue;
    found = true;
    total += stage.diamondOnceDrop || 0;
  }
  return found && total > 0 ? total : null;
}

export { normalizeEventName, findActivity, activityDateStr, originitePrimeFromStages };
