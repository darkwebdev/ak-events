// Parse date strings like "2025/10/14–2025/11/04" or "2025-10-14 - 2025-11-04"
// into { start: 'YYYY-MM-DD'|null, end: 'YYYY-MM-DD'|null }.
function parseDateRange(dateStr) {
  if (!dateStr) return { start: null, end: null };

  const m = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/g);
  if (m && m.length > 0) {
    const s = m[0];
    const parts = s.split(/\D/).filter(Boolean);
    const yyyy = parts[0];
    const mm = parts[1].padStart(2, '0');
    const dd = parts[2].padStart(2, '0');
    const start = `${yyyy}-${mm}-${dd}`;

    let end = null;
    if (m.length > 1) {
      const s2 = m[1];
      const parts2 = s2.split(/\D/).filter(Boolean);
      const yyyy2 = parts2[0];
      const mm2 = parts2[1].padStart(2, '0');
      const dd2 = parts2[2].padStart(2, '0');
      end = `${yyyy2}-${mm2}-${dd2}`;
    }

    return { start, end };
  }
  return { start: null, end: null };
}

export { parseDateRange };
