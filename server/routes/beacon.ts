import { RequestHandler } from "express";
import * as beaconRepo from "../data/beaconRepository";
import { queryGdcCohort, GdcCohortFilters } from "../services/gdcClient";
import { getCachedCohort, setCachedCohort } from "../data/cohortCache";

// In-memory rate limiter for Gemini Copilot: max 10 requests per minute per IP
const ipRateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const timestamps = (ipRateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  timestamps.push(now);
  ipRateLimitMap.set(ip, timestamps);
  return true;
}

export const handleGetHubStats: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getHubStats());
};

export const handleGetSpokes: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getSpokes());
};

export const handleGetPatient360: RequestHandler = (req, res) => {
  const patientId = (req.query.id as string) || "UC-CCC-89421";
  res.json(beaconRepo.getPatient360(patientId));
};

export const handleGetMultiOmicsRiskScore: RequestHandler = (req, res) => {
  const patientId = (req.query.id as string) || "UC-CCC-89421";
  res.json(beaconRepo.computeMultiOmicsRiskScore(patientId));
};

export const handleGetApiContracts: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getApiContracts());
};

export const handleGetIRBCharter: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getIRBCharter());
};

export const handleCohortQuery: RequestHandler = (req, res) => {
  const filters = req.body || {};
  res.json(beaconRepo.queryCohort(filters));
};

export const handleGetMultiomics: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getMultiomics());
};

export const handleGetImagingDetails: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getImagingDetails());
};

export const handleGetTrialMatches: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getTrialMatches());
};

export const handleGetAuditLogs: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getAuditLogs());
};

export const handleGetDataQuality: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getDataQuality());
};

export const handleGetAdminStats: RequestHandler = (_req, res) => {
  res.json(beaconRepo.getAdminStats());
};

const VALID_CONSENT_TYPES = ["researchUse", "recontactGranted", "biospecimensUse", "aiModelTraining", "commercialSharing"];

export const handleUpdateConsent: RequestHandler = (req, res) => {
  const { patientId, consentType, enabled, permissions } = req.body || {};

  if (patientId !== undefined && typeof patientId !== "string") {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "patientId must be a string." });
    return;
  }

  if (permissions !== undefined) {
    if (typeof permissions !== "object" || permissions === null || Array.isArray(permissions)) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "permissions must be an object." });
      return;
    }
    const invalidKeys = Object.keys(permissions).filter((k) => !VALID_CONSENT_TYPES.includes(k));
    if (invalidKeys.length > 0) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: `Unknown consent permission key(s): ${invalidKeys.join(", ")}` });
      return;
    }
    for (const v of Object.values(permissions)) {
      if (typeof v !== "boolean") {
        res.status(400).json({ error: "VALIDATION_ERROR", message: "Every permission value must be a boolean." });
        return;
      }
    }
  } else if (consentType !== undefined && !VALID_CONSENT_TYPES.includes(consentType)) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: `Unknown consentType: '${consentType}'. Must be one of: ${VALID_CONSENT_TYPES.join(", ")}` });
    return;
  }

  res.json(beaconRepo.updateConsent(patientId, consentType, enabled, permissions));
};

export const handleRegisterPatient: RequestHandler = (req, res) => {
  const body = req.body || {};

  // Validate types and bound string lengths -- this data gets rendered
  // directly in the UI (Patient360, Admin dashboard), so malformed or
  // oversized input should be rejected here rather than silently accepted.
  const stringFields: string[] = ["name", "mrn", "diagnosis", "primarySite", "gender", "treatment"];
  for (const field of stringFields) {
    if (body[field] !== undefined && body[field] !== null) {
      if (typeof body[field] !== "string") {
        res.status(400).json({ error: "VALIDATION_ERROR", message: `Field '${field}' must be a string.` });
        return;
      }
      if (body[field].length > 200) {
        res.status(400).json({ error: "VALIDATION_ERROR", message: `Field '${field}' exceeds 200 characters.` });
        return;
      }
    }
  }
  if (body.age !== undefined && body.age !== null) {
    const ageNum = Number(body.age);
    if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 130) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Field 'age' must be a number between 0 and 130." });
      return;
    }
  }

  const patientData = body;
  res.json(beaconRepo.registerPatient(patientData));
};

function buildLivePlatformContext(): string {
  try {
    const hubStats = beaconRepo.getHubStats();
    const trials = beaconRepo.getTrialMatches();
    const adminStats = beaconRepo.getAdminStats();

    const activeTrialSummary = (trials || [])
      .slice(0, 4)
      .map((t: any) => `- ${t.trialId || t.name || "NCT-TRIAL"}: ${t.title || t.condition || "Oncology Protocol"} (${t.phase || "Phase 2/3"})`)
      .join("\n");

    const cancerTypes = (adminStats.patientsByCancerType || [])
      .slice(0, 5)
      .map((c: any) => `${c.cancerType} (${c.count} patients)`)
      .join(", ");

    return `LIVE UCANDO PLATFORM CONTEXT:
- Total Consented Patients: ${hubStats.totalConsentedPatients}
- Total Biospecimens: ${hubStats.totalBiospecimens}
- Available Cohort/Disease Categories: ${cancerTypes || "Breast, Lung, Colorectal, Ovarian, Pancreatic"}
- Active Clinical Trials in Trial Matching: ${trials.length} protocols available
${activeTrialSummary}
- Connected Platform Tools:
  * Patient 360 Orbit (/patient-360): Longitudinal OMOP CDM records & radial domain view
  * Patient Integration (/patient-integration): Target analysis (RECIST kinetics, CTCAE, DeepSurv survival prediction)
  * Cohort Builder (/cohort-builder): mCODE & GA4GH Beacon v2 cohort filtering with differential privacy
  * RNA-seq Workspace (/workspace): Bulk transcriptomics, DESeq2 GLMs (~ batch + condition), Volcano, PCA, Heatmaps
  * Omics View (/omics-view): Somatic/Germline variants, PhoenixMO OncoPrint, BioCompute IEEE 2791
  * GSEA Pathways Studio (/pathways/gsea): MSigDB Hallmark, Reactome, and KEGG enrichment
  * Imaging Launch / OHIF (/imaging-hub): PET/CT DICOM viewer & digital pathology WSI
  * Dynamic Consent Console (/consent-console): Open Policy Agent (OPA) fine-grained permissions
  * Trial Matching (/trial-matching): ClinicalTrials.gov molecular pre-screening
  * iUCADO-Orbit (/iucado-orbit): Literature evidence synthesis grounded in PubMed & NCCN guidelines
- Global Integrations:
  * Live: Epic EHR SMART-on-FHIR sandbox, NCI GDC live external cohort discovery
  * Public: ClinVar genomic annotations, cBioPortal cancer genomics
  * Roadmap: Epic Cosmos federated research network, Epic Genomics, Epic MyChart`;
  } catch (err) {
    return "LIVE UCANDO PLATFORM CONTEXT: Patient 360 (/patient-360), Patient Integration (/patient-integration), Cohort Builder (/cohort-builder), RNA-seq Workspace (/workspace), Omics View (/omics-view), Trial Matching (/trial-matching), Imaging Hub (/imaging-hub), Dynamic Consent (/consent-console), iUCADO-Orbit (/iucado-orbit).";
  }
}

export const handleGeminiCopilot: RequestHandler = async (req, res) => {
  const { prompt, patientContext } = req.body || {};

  // 1. Validate prompt input
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0 || prompt.length > 2000) {
    res.status(400).json({
      error: "Prompt must be a non-empty string under 2000 characters."
    });
    return;
  }

  // 2. Rate limiter check (max 10 requests per minute per IP)
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.ip || "127.0.0.1";
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      error: "Too many requests. Please wait a minute before trying again."
    });
    return;
  }

  // Gather live platform context
  const livePlatformContext = buildLivePlatformContext();

  // Helper for generating structured contextual platform answers when API key is not provided
  const generateSimulatedPlatformResponse = (q: string, context?: string) => {
    const query = q.toLowerCase();

    if (query.includes("protocol") || query.includes("study") || query.includes("design")) {
      return `### Proposed Study Protocol: Multi-Omic Characterization of Therapy Resistance

**1. Primary Objective:**
Investigate longitudinal transcriptomic and genomic mechanisms of secondary resistance following targeted kinase or antibody-drug conjugate (ADC) therapy.

**2. Target Cohort & Patient Selection:**
- **Primary Tool:** Open **Cohort Builder** (/cohort-builder) to filter by tumor stage, somatic driver mutations, and biospecimen availability.
- **Cohort Filters:** Stage IIIB-IV Adenocarcinoma with baseline NGS + RNA-seq.
- **Consent Enforcement:** Verify permissions via **Consent Console** (/consent-console) with OPA policy checks.

**3. Recommended Omics Pipelines & Tools:**
- **Data Ingestion:** Upload FASTQ or count matrices in **Data Ingestion** (/data/upload).
- **Differential Expression:** Configure DESeq2 GLM (\`~ batch + condition\`) in **RNA-seq Workspace** (/workspace).
- **Pathway Enrichment:** Run GSEA across Hallmark, Reactome, and KEGG in **GSEA Pathways** (/pathways/gsea).
- **Co-Mutation Matrix:** Inspect somatic variants and OncoPrint in **Omics View** (/omics-view).

**4. Imaging & Clinical Correlates:**
- Review pre/post therapy imaging in **Imaging Launch (OHIF)** (/imaging-hub) with RECIST 1.1 tumor burden tracking.
- Track longitudinal response, CTCAE toxicities, and survival curves in **Patient Integration** (/patient-integration).

**5. Evidence Grounding:**
- Cross-reference landmark trials in **iUCADO-Orbit** (/iucado-orbit) for GRADE Level 1A/1B clinical trial evidence.`;
    }

    if (query.includes("trial") || query.includes("match") || query.includes("protocol")) {
      return `### Clinical Trial Recommendations via Platform Concierge

Based on the live UCANDO Trial Matching registry:
1. **Trial Matching (/trial-matching):** There are active protocols matching targeted biomarkers (such as KEYNOTE-522, OlympiA PARP inhibitor maintenance, and DESTINY-Breast04).
2. **Patient Integration (/patient-integration):** Inspect the patient's molecular tumor board ranking and NCCN concordance ratings.
3. **iUCADO-Orbit (/iucado-orbit):** Synthesize published trial outcomes and hazard ratios for these candidate regimens.`;
    }

    if (query.includes("deseq2") || query.includes("rna-seq") || query.includes("expression") || query.includes("volcano") || query.includes("pathway")) {
      return `### UCANDO Transcriptomics & RNA-seq Guide

1. **Data Ingestion:** Upload FASTQ, counts, or processed tables at **Data Ingestion** (/data/upload).
2. **Experimental Design:** Set formula (\`~ batch + condition\`, \`~ splines::ns(time, df=3)\`) via the Statistical Design Modal in **RNA-seq Workspace** (/workspace).
3. **Exploration Studio:** Inspect Volcano plots with adjustable FDR / Log2FC thresholds, 3D PCA / UMAP clusters, and hierarchical clustering Heatmaps.
4. **Pathway GSEA:** Run preranked Gene Set Enrichment across Hallmark, Reactome, and KEGG databases in **GSEA Pathways** (/pathways/gsea).`;
    }

    if (query.includes("cohort") || query.includes("filter") || query.includes("mcode") || query.includes("beacon")) {
      return `### Cohort Discovery & Filtering via Platform Concierge

1. **Cohort Builder (/cohort-builder):** Interactively filter by diagnosis, stage, biomarker mutations, and biospecimens under differential privacy budgets.
2. **Global Integrations (/global-integrations):** Query external NCI GDC cohorts live and inspect FHIR mCODE bundles.
3. **Omics View (/omics-view):** Launch PhoenixMO multi-omics risk scores and OncoPrint analysis for discovered cohorts.`;
    }

    if (query.includes("patient") || query.includes("360") || query.includes("orbit") || query.includes("omop")) {
      return `### Patient Domain & Clinical Analytics in UCANDO

- **Patient 360 Orbit (/patient-360):** Radial domain visualization connecting OMOP CDM v5.4 conditions, drug infusions, LOINC biomarkers, and DICOM imaging studies.
- **Patient Integration (/patient-integration):** Longitudinal treatment tracker, RECIST 1.1 response curves, CTCAE adverse event logs, and DeepSurv ML survival risk scores.
- **iUCADO-Orbit (/iucado-orbit):** Clinical evidence reasoning engine providing PICO trial search and GRADE guideline consensus.`;
    }

    return `### iUCANDO Platform-Aware Research Concierge

**Platform Context:** ${context || "UCANDO Enterprise Cancer Data Commons"}

Analyzed your inquiry against UCANDO's live platform assets:
1. **Clinical & OMOP Data:** Accessible via **Patient 360 Orbit** (/patient-360) and **Patient Integration** (/patient-integration).
2. **Cohort Discovery:** Filter 98,000+ consented records via **Cohort Builder** (/cohort-builder).
3. **Transcriptomics & Genomics:** Ready for contrast analysis with DESeq2 in **RNA-seq Workspace** (/workspace) and **Omics View** (/omics-view).
4. **Clinical Trials:** Match candidate protocols in **Trial Matching** (/trial-matching) or synthesize evidence in **iUCADO-Orbit** (/iucado-orbit).

*Which tool, trial, or dataset would you like to explore?*`;
  };

  // 3. GEMINI_API_KEY check
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    res.json({
      status: "Success",
      model: "iUCANDO-Phoenix-Core",
      response: generateSimulatedPlatformResponse(prompt, patientContext)
    });
    return;
  }

  try {
    const systemPrompt = `You are the Platform-Aware Research Concierge for UCANDO (The University of Chicago Comprehensive Cancer Center Data Commons Operations).
You have knowledge of what tools, trials, and datasets exist on this platform. When a user asks a research or clinical question, proactively recommend the specific UCANDO tool, trial, or dataset most relevant to their question (e.g. 'Trial Matching has 3 active protocols for BRCA1-mutated patients' or 'Cohort Builder can filter by that biomarker'). Be specific about which page or feature to use. If you don't have enough information in the platform context to answer confidently, say so clearly rather than guessing.

${livePlatformContext}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nPatient/User Context:\n${patientContext || "UC-CCC Enterprise Cancer Data Commons"}\n\nUser Question:\n${prompt}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message || generateSimulatedPlatformResponse(prompt, patientContext);

    res.json({
      status: data?.error ? "API Error" : "Success",
      model: "gemini-3.5-flash",
      response: textOutput
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.json({
      status: "Fallback",
      model: "iUCANDO-Phoenix-Core",
      response: generateSimulatedPlatformResponse(prompt, patientContext)
    });
  }
};

export const handleGdcCohortQuery: RequestHandler = async (req, res) => {
  const filters: GdcCohortFilters = {
    primarySite: (req.query.primarySite as string) || undefined,
    diseaseType: (req.query.diseaseType as string) || undefined,
    projectId: (req.query.projectId as string) || undefined
  };

  const filterSignature = JSON.stringify(filters);
  const cached = getCachedCohort(filterSignature);
  if (cached) {
    res.json({ ...(cached.result as object), cached: true, cachedAt: cached.cachedAt });
    return;
  }

  try {
    const result = await queryGdcCohort(filters);
    setCachedCohort(filterSignature, filters as Record<string, unknown>, result);
    res.json({ ...result, cached: false });
  } catch (err: any) {
    console.error("GDC API query failed:", err);
    res.status(502).json({
      error: "GDC_UNREACHABLE",
      message:
        "Could not reach the live GDC Genomic Data Commons API. This is a connectivity issue (network egress, GDC downtime, or timeout) -- not a query with zero matches. " +
        (err?.message || "Unknown error")
    });
  }
};
