/**
 * Returns a test ID for use as a data-testid attribute.
 *
 * When PUBLIC_BREAKING_CHANGE is 'true', returns an unpredictable string
 * (or undefined) to simulate a regression/breaking change scenario.
 * When 'false' (the default), returns the stable ID provided.
 */
export function getTestId(stableId: string): string | undefined {
  const breakingChange = import.meta.env.PUBLIC_BREAKING_CHANGE;

  if (breakingChange === 'true') {
    // Simulate a breaking change: return a random/complex ID or undefined
    const seed = stableId.length % 3;
    if (seed === 0) {
      return undefined;
    }
    // Generate a deterministic but unrecognisable ID to break locators
    const hash = stableId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const suffix = (hash * 31 + stableId.length * 17).toString(16).padStart(4, '0').slice(-4);
    return `el_x${hash.toString(16)}_${suffix}`;
  }

  return stableId;
}
