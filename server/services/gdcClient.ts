/**
 * GDC (NCI Genomic Data Commons) API Client
 *
 * Concept credit: the "query a national data commons to build a cohort,
 * fetch only metadata on demand rather than storing everything locally"
 * pattern is inspired by MINDS (Multimodal Integration of Oncology Data
 * System), Tripathi et al., Rasool Lab, Moffitt Cancer Center --
 * see https://github.com/lab-rasool/MINDS and Tripathi et al., "Building
 * Flexible, Scalable, and Machine Learning-Ready Multimodal Oncology
 * Datasets," Sensors 24(5), 1634, 2024.
 *
 * This is an ORIGINAL implementation written for UCANDO -- no MINDS code
 * is copied or ported. This client talks directly to the GDC's real,
 * public, unauthenticated REST API at https://api.gdc.cancer.gov. No API
 * key is required for this tier of query (case/file counts, facet
 * aggregations, and public case metadata) -- GDC's controlled-access data
 * (e.g. raw sequencing files) requires a dbGaP-authorized token, which is
 * NOT implemented here, matching MINDS' own "query for metadata, don't
 * bulk-download controlled data" philosophy.
 *
 * IMPORTANT ENVIRONMENT NOTE: this client could not be live-tested from
 * the development sandbox this was written in, because that sandbox's
 * network egress allowlist does not include api.gdc.cancer.gov. It should
 * work correctly once deployed to an environment with normal outbound
 * internet access (e.g. Google Cloud Run), matching the GDC API's
 * documented contract at https://docs.gdc.cancer.gov/API/Users_Guide/Search_and_Retrieval/.
 * Verify the live round-trip after deployment before relying on it.
 */

const GDC_API_BASE = "https://api.gdc.cancer.gov";
const REQUEST_TIMEOUT_MS = 10000;

export interface GdcCohortFilters {
  primarySite?: string;
  diseaseType?: string;
  projectId?: string; // e.g. "TCGA-BRCA"
}

export interface GdcCohortResult {
  totalCases: number;
  facets: {
    primarySite: { key: string; count: number }[];
    diseaseType: { key: string; count: number }[];
    project: { key: string; count: number }[];
  };
  sampleCases: {
    caseId: string;
    submitterId: string;
    project: string;
    primarySite: string;
    diseaseType: string;
  }[];
  source: "GDC Genomic Data Commons (live)";
  queriedAt: string;
}

function buildGdcFilters(filters: GdcCohortFilters): Record<string, unknown> | undefined {
  const clauses: Record<string, unknown>[] = [];

  if (filters.primarySite) {
    clauses.push({ op: "in", content: { field: "cases.primary_site", value: [filters.primarySite] } });
  }
  if (filters.diseaseType) {
    clauses.push({ op: "in", content: { field: "cases.disease_type", value: [filters.diseaseType] } });
  }
  if (filters.projectId) {
    clauses.push({ op: "in", content: { field: "cases.project.project_id", value: [filters.projectId] } });
  }

  if (clauses.length === 0) return undefined;
  if (clauses.length === 1) return clauses[0];
  return { op: "and", content: clauses };
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Query the live GDC /cases endpoint for cohort discovery: total matching
 * case count, facet aggregations (primary site / disease type / project),
 * and a small sample of matching case metadata. Does not download or store
 * any file-level or controlled-access data.
 */
export async function queryGdcCohort(filters: GdcCohortFilters): Promise<GdcCohortResult> {
  const gdcFilters = buildGdcFilters(filters);
  const params = new URLSearchParams({
    size: "10",
    fields: "case_id,submitter_id,project.project_id,primary_site,disease_type",
    facets: "primary_site,disease_type,project.project_id"
  });
  if (gdcFilters) {
    params.set("filters", JSON.stringify(gdcFilters));
  }

  const url = `${GDC_API_BASE}/cases?${params.toString()}`;
  const res = await fetchWithTimeout(url);

  if (!res.ok) {
    throw new Error(`GDC API returned HTTP ${res.status}`);
  }

  const json = await res.json();
  const hits = json?.data?.hits ?? [];
  const aggregations = json?.data?.aggregations ?? {};
  const total = json?.data?.pagination?.total ?? 0;

  const extractBuckets = (agg: any): { key: string; count: number }[] =>
    (agg?.buckets ?? []).map((b: any) => ({ key: b.key, count: b.doc_count }));

  return {
    totalCases: total,
    facets: {
      primarySite: extractBuckets(aggregations.primary_site),
      diseaseType: extractBuckets(aggregations.disease_type),
      project: extractBuckets(aggregations["project.project_id"])
    },
    sampleCases: hits.map((h: any) => ({
      caseId: h.case_id,
      submitterId: h.submitter_id,
      project: h.project?.project_id ?? "Unknown",
      primarySite: h.primary_site ?? "Unknown",
      diseaseType: h.disease_type ?? "Unknown"
    })),
    source: "GDC Genomic Data Commons (live)",
    queriedAt: new Date().toISOString()
  };
}
