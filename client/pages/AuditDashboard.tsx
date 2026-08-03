import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Activity, ShieldCheck, Flame, AlertCircle } from "lucide-react";

export default function AuditDashboard() {
  return (
    <PlaceholderPage
      title="Audit & Compliance Dashboard"
      subtitle="Immutable access logs, PHI access heatmaps, consent withdrawal events, and incident response runbook launcher."
      badge="Append-Only WORM Storage"
      icon={<Activity className="w-6 h-6 text-emerald-400" />}
      specs={[
        "Immutable Append-Only Ledger: WORM (Write Once Read Many) tamper-evident storage with SHA-256 cryptographic hashing.",
        "PHI Access Heatmaps: Real-time visual monitoring of patient record views categorized by department, role, and time.",
        "Consent Withdrawal Audit: Track consent withdrawal propagation events across all 7 platform spokes with timestamp verification.",
        "SIEM Streaming & Incident Runbooks: Automated OpenTelemetry event streaming to enterprise SIEM with ≤1h anomaly detection."
      ]}
    />
  );
}
