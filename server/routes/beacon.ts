import { RequestHandler } from "express";
import * as beaconRepo from "../data/beaconRepository";

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

export const handleUpdateConsent: RequestHandler = (req, res) => {
  const { patientId, consentType, enabled, permissions } = req.body || {};
  res.json(beaconRepo.updateConsent(patientId, consentType, enabled, permissions));
};

export const handleRegisterPatient: RequestHandler = (req, res) => {
  const patientData = req.body || {};
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
