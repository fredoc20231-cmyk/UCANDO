import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { handleDemo } from "./routes/demo";
import {
  handleGetHubStats,
  handleGetSpokes,
  handleGetPatient360,
  handleGetMultiOmicsRiskScore,
  handleGetApiContracts,
  handleGetIRBCharter,
  handleCohortQuery,
  handleGetMultiomics,
  handleGetImagingDetails,
  handleGetTrialMatches,
  handleGetAuditLogs,
  handleGetDataQuality,
  handleUpdateConsent,
  handleRegisterPatient,
  handleGetAdminStats,
  handleGdcCohortQuery,
  handleGeminiCopilot
} from "./routes/beacon";

export function createServer() {
  const app = express();

  // Trust the first hop proxy (Cloud Run, Netlify, or any managed load
  // balancer sits in front of this app in production). Without this,
  // req.ip resolves to the proxy's IP for every request, which silently
  // breaks the per-IP rate limiter on the Gemini endpoint -- all traffic
  // would appear to come from one IP and share one rate limit bucket.
  app.set("trust proxy", 1);

  // Security headers. CSP is intentionally left disabled here rather than
  // configured with a guessed policy -- a misconfigured CSP silently
  // breaks the app in ways that are easy to miss without a full live
  // regression pass. Enable and tune it deliberately, with real browser
  // testing, before relying on it.
  app.use(helmet({ contentSecurityPolicy: false }));

  // CORS: same-origin by default (the SPA and API are served from the
  // same Express app). Set ALLOWED_ORIGINS as a comma-separated env var
  // only if this API needs to be called from a different origin.
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim());
  app.use(
    cors(
      allowedOrigins && allowedOrigins.length > 0
        ? { origin: allowedOrigins }
        : {}
    )
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Health check for uptime monitoring / load balancer probes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // UCANDO Oncology Data Commons API
  app.get("/api/beacon/stats", handleGetHubStats);
  app.get("/api/beacon/spokes", handleGetSpokes);
  app.get("/api/beacon/patient/360", handleGetPatient360);
  app.get("/api/beacon/patient/risk-score", handleGetMultiOmicsRiskScore);
  app.get("/api/beacon/contracts", handleGetApiContracts);
  app.get("/api/beacon/governance/charter", handleGetIRBCharter);

  app.post("/api/beacon/cohort/query", handleCohortQuery);
  app.get("/api/beacon/cohort/query", handleCohortQuery);
  app.get("/api/beacon/omics", handleGetMultiomics);
  app.get("/api/beacon/external-cohort/gdc", handleGdcCohortQuery);
  app.get("/api/beacon/imaging/details", handleGetImagingDetails);
  app.get("/api/beacon/trials", handleGetTrialMatches);
  app.get("/api/beacon/audit", handleGetAuditLogs);
  app.get("/api/beacon/data-quality", handleGetDataQuality);
  app.get("/api/beacon/admin/stats", handleGetAdminStats);
  app.post("/api/beacon/consent/update", handleUpdateConsent);
  app.post("/api/beacon/patient/register", handleRegisterPatient);
  app.post("/api/beacon/gemini-copilot", handleGeminiCopilot);

  // 404 for unmatched API routes specifically (must come after all real
  // /api routes, before the SPA catch-all is added in node-build.ts)
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "NOT_FOUND", message: `No API route for ${req.method} ${req.path}` });
  });

  // Global error handler -- catches anything thrown or rejected in a
  // route handler that wasn't already caught locally, so a bug in one
  // endpoint returns a clean JSON 500 instead of crashing the process or
  // leaking a stack trace to the client.
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error in request pipeline:", err);
    if (res.headersSent) return;
    res.status(500).json({ error: "INTERNAL_ERROR", message: "An unexpected error occurred." });
  });

  return app;
}
