/** Shared display formatters for the marketplace UI. */

/**
 * Approximate distance for display. The brief (design.md §8/§9) requires
 * approximate distance only — never exact coordinates.
 */
export function formatDistance(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) {
    return 'Distance unavailable';
  }

  if (meters < 1000) {
    const rounded = Math.round(meters / 10) * 10;
    return `~${rounded} m`;
  }
  return `~${(meters / 1000).toFixed(1)} km`;
}

/** Brazilian Real, no cents when the value is whole. */
export function formatPriceBRL(value: number): string {
  const hasCents = value % 1 !== 0;
  return `R$ ${value.toFixed(hasCents ? 2 : 0).replace('.', ',')}`;
}

/** Pound sterling, no cents when the value is whole. */
export function formatPriceGBP(value: number): string {
  const hasCents = value % 1 !== 0;
  return `£${value.toFixed(hasCents ? 2 : 0)}`;
}
