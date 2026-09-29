import { createContext } from 'react';

// The linked account's operators, as their potential rank (0 = Potential 1 … 5 =
// maxed), keyed by the game's operator id (ResolvedBannerOperator.charId). Null when
// no account's roster has been fetched — then nothing is marked owned.
export type OwnedOperators = Record<string, number>;

export const OwnedOperatorsContext = createContext<OwnedOperators | null>(null);
