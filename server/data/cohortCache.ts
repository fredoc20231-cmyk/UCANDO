/**
 * COHORT QUERY CACHE
 *
 * Concept: mirrors MINDS' "query -> cohort -> fetch metadata on demand"
 * pattern -- a cohort query result is cached by its filter signature so
 * repeated views of the same cohort don't re-hit the external API, and so
 * a future "saved cohorts" feature has a real place to persist results.
 *
 * CURRENT STATE: in-memory Map, matching every other data store already
 * in this codebase (registeredPatients, consentStore, etc). This resets
 * on server restart -- fine for a demo, NOT fine for production.
 *
 * PRODUCTION SEAM: this module exports the same get/set/list interface a
 * real database-backed implementation would need. Swapping to a real
 * Postgres table (e.g. via the `pg` package reading process.env.DATABASE_URL,
 * which Cloud SQL or any managed Postgres would provide) means rewriting
 * only the three functions below -- nothing in the routes or client code
 * that calls this module needs to change.
 */

export interface CachedCohortEntry {
  filterSignature: string;
  filters: Record<string, unknown>;
  result: unknown;
  cachedAt: string;
}

const cohortCacheStore = new Map<string, CachedCohortEntry>();

export function getCachedCohort(filterSignature: string): CachedCohortEntry | undefined {
  return cohortCacheStore.get(filterSignature);
}

export function setCachedCohort(filterSignature: string, filters: Record<string, unknown>, result: unknown): void {
  cohortCacheStore.set(filterSignature, {
    filterSignature,
    filters,
    result,
    cachedAt: new Date().toISOString()
  });
}

export function listCachedCohorts(): CachedCohortEntry[] {
  return Array.from(cohortCacheStore.values()).sort(
    (a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime()
  );
}
