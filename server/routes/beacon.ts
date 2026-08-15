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

  // 3. GEMINI_API_KEY check
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    res.json({
      status: "Config Required",
      message: "GEMINI_API_KEY is currently set to placeholder. Please confirm your API key value in environment settings.",
      response: `[Gemini High Copilot Simulation]: Analyzed query "${prompt.slice(0, 100)}" against mCODE records. Found 3 matching high-confidence pathogenic biomarkers (BRCA1, TP53, PD-L1).`
    });
    return;
  }

  try {
    const systemPrompt = "You are Gemini High, an expert AI oncology assistant for UCANDO. Analyze clinical notes, multiomics, and mCODE FHIR data accurately, concisely, and adhering strictly to HIPAA de-identification invariants.";

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
                { text: `${systemPrompt}\n\nPatient Context:\n${patientContext || "De-identified Stage III Breast Cancer patient UC-CCC-89421 with BRCA1 pathogenic variant"}\n\nUser Question:\n${prompt}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message || "No response generated from Gemini API.";

    res.json({
      status: data?.error ? "API Error" : "Success",
      model: "gemini-3.5-flash",
      response: textOutput
    });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      status: "Error",
      message: "Failed to call Google Gemini API: " + (err?.message || "Unknown error")
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
