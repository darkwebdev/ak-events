// Parses arkpedia.net's Next.js pages, which embed their full data as a
// `__NEXT_DATA__` JSON script tag rather than exposing a stable API endpoint (the
// site's own `/_next/data/<buildId>/...` route works too, but buildId changes on
// every deploy, so it's not something to depend on directly — parsing the tag out of
// a normal page fetch is what stays correct across arkpedia's own redeploys).
function extractNextData(html) {
  if (!html) return null;
  const m = html.match(/__NEXT_DATA__"\s*type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
}

// Parse arkpedia.net/events into an array of
// { name, dateStr, isPredicted } — `dateStr` is already the plain "YYYY/MM/DD–
// YYYY/MM/DD" shape parseDateRange accepts directly (no "Global:"/"CN:" label to
// strip, unlike the wiki's own combined-cell format). `isPredicted: true` marks a
// CN→Global lag estimate for an event not yet confirmed for Global, rather than an
// official date — callers should surface that distinction to the user rather than
// presenting it as confirmed.
function parseArkpediaEventsList(html) {
  const data = extractNextData(html);
  const events = data?.props?.pageProps?.events;
  if (!Array.isArray(events)) return [];
  return events
    .filter((e) => e.name && e.dateRange)
    .map((e) => ({
      name: e.name,
      dateStr: e.dateRange,
      isPredicted: !!e.isPredicted,
    }));
}

// Parse a single arkpedia.net event detail page (arkpedia.net/events/<name>) into
// { dateStr, isPredicted, bannerName, featuredOperators, headhuntingPermits }.
// featuredOperators is [{ name, rarity, percent }] — percent is the rate-up chance,
// which the wiki's own banner pages don't expose. headhuntingPermits is summed from
// any reward-store item literally named "Headhunting Permit" (quantity × stock);
// null if the page has no such item, which callers should treat as "unknown" (fall
// back to the wiki), not "zero" — most events simply don't sell permits at all.
function parseArkpediaEventDetail(html) {
  const data = extractNextData(html);
  const props = data?.props?.pageProps;
  if (!props) return null;

  let headhuntingPermits = null;
  for (const store of props.rewardStores || []) {
    for (const item of store.items || []) {
      if (item.name !== 'Headhunting Permit') continue;
      if (item.stock === '∞' || item.stock == null) continue;
      const stock = parseInt(item.stock, 10);
      const quantity = parseInt(item.quantity, 10);
      if (Number.isNaN(stock) || Number.isNaN(quantity)) continue;
      headhuntingPermits = (headhuntingPermits || 0) + stock * quantity;
    }
  }

  return {
    dateStr: props.dateRange || null,
    isPredicted: !!props.isPredicted,
    bannerName: props.bannerName || null,
    featuredOperators: Array.isArray(props.featuredOperators) ? props.featuredOperators : [],
    headhuntingPermits,
  };
}

export { parseArkpediaEventsList, parseArkpediaEventDetail };
