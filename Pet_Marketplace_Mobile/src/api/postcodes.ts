/**
 * Thin wrapper around `api.postcodes.io` — the Royal Mail-derived public
 * service we use to turn a UK postcode into a coarse area (city/district/
 * region) plus approximate coordinates.
 *
 * Why postcodes.io and not the backend:
 *  - Public endpoint, no API key, no per-app quota.
 *  - We only need area-level data; we deliberately don't capture
 *    street/number to keep the PII footprint small (UK GDPR).
 *  - A backend proxy is the Phase 2 path if we later need caching or
 *    auditing; this wrapper is intentionally kept small so swapping the
 *    base URL is the only change needed.
 *
 * NOT logging the postcode value anywhere: it is PII. Callers that surface
 * errors must use generic copy and never echo the postcode back into logs.
 */

const POSTCODES_BASE_URL = 'https://api.postcodes.io';
const LOOKUP_TIMEOUT_MS = 8_000;

/**
 * UK postcode shape (outward + inward). Accepts mixed-case and an optional
 * single internal space; we re-normalise to canonical "OUT IN" before any
 * network call or storage.
 *
 * Pattern source: official Royal Mail BS 7666 simplified regex, restricted
 * to non-special postcodes (BFPO/Crown deps not supported on purpose).
 */
const POSTCODE_REGEX = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;

export type PostcodeLookupErrorCode =
  | 'INVALID_FORMAT'
  | 'NOT_FOUND'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'SERVER';

export class PostcodeLookupError extends Error {
  constructor(
    readonly code: PostcodeLookupErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'PostcodeLookupError';
  }
}

/**
 * Area-level result we feed back into the address form. Field names mirror
 * the columns we already persist in `addresses` so the caller can map 1:1
 * without re-shaping.
 */
export interface PostcodeLookupResult {
  /** Canonical postcode (uppercase, single space between outward/inward). */
  postcode: string;
  /** Approximate centroid latitude (WGS84). */
  latitude: number;
  /** Approximate centroid longitude (WGS84). */
  longitude: number;
  /** Local authority district (e.g. "Westminster"). May be null in remote areas. */
  adminDistrict: string | null;
  /** Region (e.g. "London", "South East"). May be null in Scotland/NI. */
  region: string | null;
  /** Country within the UK ("England" | "Scotland" | "Wales" | "Northern Ireland"). */
  country: string | null;
}

interface PostcodesIoOk {
  status: 200;
  result: {
    postcode: string;
    latitude: number;
    longitude: number;
    admin_district: string | null;
    region: string | null;
    country: string | null;
  };
}

interface PostcodesIoError {
  status: number;
  error?: string;
}

/**
 * Returns a canonicalised postcode (`"sw1a1aa"` → `"SW1A 1AA"`) when the
 * input matches the UK shape, or `null` when it doesn't. Pure — never
 * touches the network. Use this both for inline validation and to build
 * the URL for `lookupPostcode`.
 */
export function normalisePostcode(value: string): string | null {
  const trimmed = value.trim();
  const match = POSTCODE_REGEX.exec(trimmed);
  if (!match) {
    return null;
  }
  // Group references are guaranteed by the regex, but TS's strict tuple
  // typing doesn't infer that — guard explicitly.
  const outward = match[1];
  const inward = match[2];
  if (!outward || !inward) {
    return null;
  }
  return `${outward.toUpperCase()} ${inward.toUpperCase()}`;
}

/**
 * Resolve a UK postcode into its area-level metadata. Throws
 * `PostcodeLookupError` on any failure — the caller maps the code to a
 * user-facing message via i18n.
 *
 * Format errors are raised BEFORE the network call, so a fat-fingered
 * input never leaks to postcodes.io.
 */
export async function lookupPostcode(
  rawPostcode: string,
): Promise<PostcodeLookupResult> {
  const canonical = normalisePostcode(rawPostcode);
  if (!canonical) {
    throw new PostcodeLookupError('INVALID_FORMAT');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);

  let response: Response;
  try {
    // postcodes.io tolerates the internal space; we still encode just in case
    // a future path component is added.
    response = await fetch(
      `${POSTCODES_BASE_URL}/postcodes/${encodeURIComponent(canonical)}`,
      {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      },
    );
  } catch (error) {
    clearTimeout(timeout);
    if (isAbortError(error)) {
      throw new PostcodeLookupError('TIMEOUT');
    }
    throw new PostcodeLookupError('NETWORK');
  }
  clearTimeout(timeout);

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.status === 404) {
    throw new PostcodeLookupError('NOT_FOUND');
  }

  if (!response.ok) {
    throw new PostcodeLookupError('SERVER');
  }

  if (!isOkPayload(body)) {
    throw new PostcodeLookupError('SERVER');
  }

  const r = body.result;
  return {
    postcode: r.postcode,
    latitude: r.latitude,
    longitude: r.longitude,
    adminDistrict: r.admin_district ?? null,
    region: r.region ?? null,
    country: r.country ?? null,
  };
}

function isOkPayload(value: unknown): value is PostcodesIoOk {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PostcodesIoOk> & {
    result?: Record<string, unknown>;
  };
  if (candidate.status !== 200) return false;
  const result = candidate.result;
  if (!result || typeof result !== 'object') return false;
  return (
    typeof result.postcode === 'string' &&
    typeof result.latitude === 'number' &&
    typeof result.longitude === 'number'
  );
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = (error as { name?: unknown }).name;
  return name === 'AbortError';
}

// Re-export the error type as a runtime hint that postcodes.io is the SOURCE
// of any user-facing field we use to populate the address form. If we ever
// swap providers, only this file changes.
export const POSTCODE_PROVIDER = 'postcodes.io';
// Silence the unused-export linter while keeping the error body type
// addressable for future tests / proxies without re-importing.
export type { PostcodesIoError as _PostcodesIoError };
