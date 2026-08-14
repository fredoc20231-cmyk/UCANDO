import path from "node:path";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
// NOTE: Express 5's router (path-to-regexp v7+) no longer accepts a bare "*"
// wildcard; it must be a named wildcard parameter like "*splat".
app.get("/*splat", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});

// Catch anything that slips past Express's own error handling (e.g. an
// error thrown outside a request context). Log it clearly and exit --
// Cloud Run (or any container orchestrator) will restart the container
// automatically. Staying alive with a corrupted process state is worse
// than a clean, logged restart.
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught exception, exiting:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled promise rejection, exiting:", reason);
  process.exit(1);
});
