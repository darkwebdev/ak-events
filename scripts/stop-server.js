#!/usr/bin/env node
// Stop a server listening on a given TCP port (default: 5173).
// macOS/Linux only (relies on `lsof`). Exits 0 even when no process is found.

import { execSync } from 'child_process';

const port = process.env.PORT || process.argv[2] || '5173';

try {
  const out = execSync(`lsof -ti tcp:${port}`, { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
  if (!out) {
    console.log(`No process listening on port ${port}`);
    process.exit(0);
  }
  const pids = out.split(/\s+/).filter(Boolean);
  for (const pid of pids) {
    try {
      process.kill(Number(pid));
      console.log(`Stopped process: ${pid}`);
    } catch (e) {
      console.error(`Failed to kill pid ${pid}:`, e && e.message);
    }
  }
} catch (e) {
  // lsof returns non-zero/throws when no process found; treat as no-op
  console.log(`No process listening on port ${port}`);
}

process.exit(0);
