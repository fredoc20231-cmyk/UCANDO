import "dotenv/config";
import express from "express";
import cors from "cors";
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
  handleGeminiCopilot
} from "./routes/beacon";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
  app.get("/api/beacon/imaging/details", handleGetImagingDetails);
  app.get("/api/beacon/trials", handleGetTrialMatches);
  app.get("/api/beacon/audit", handleGetAuditLogs);
  app.get("/api/beacon/data-quality", handleGetDataQuality);
  app.get("/api/beacon/admin/stats", handleGetAdminStats);
  app.post("/api/beacon/consent/update", handleUpdateConsent);
  app.post("/api/beacon/patient/register", handleRegisterPatient);
  app.post("/api/beacon/gemini-copilot", handleGeminiCopilot);

  return app;
}
