import { createContext } from 'react';
import type { BannerProgress } from './utils/arkCharsApi.js';

// The linked account's operators, as their potential rank (0 = Potential 1 … 5 =
// maxed), keyed by the game's operator id (ResolvedBannerOperator.charId). Null when
// no account's roster has been fetched — then nothing is marked owned.
export type OwnedOperators = Record<string, number>;

export const OwnedOperatorsContext = createContext<OwnedOperators | null>(null);

// The linked account's banner-specific progress (contracts, banner ten-roll permits,
// pulls per Limited banner) — see BannerProgress. Null when not fetched.
export const BannerProgressContext = createContext<BannerProgress | null>(null);
