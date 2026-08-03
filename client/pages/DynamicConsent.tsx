import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Lock, ShieldCheck, FileCheck, RefreshCw } from "lucide-react";

export default function DynamicConsent() {
  return (
    <PlaceholderPage
      title="Dynamic Consent Console"
      subtitle="Patient-facing consent wizard for research use, recontact, biospecimens, AI model training, and partner data sharing."
      badge="OPA Policy Enforcement"
      icon={<Lock className="w-6 h-6 text-emerald-400" />}
      specs={[
        "Granular Consent Toggles: Research use, recontact, biospecimens, AI model training, commercial partner sharing.",
        "Withdraw-Anytime Guarantee: Consent withdrawal propagates across all downstream spokes and research zones within 24 hours.",
        "Plain-Language Summaries: Plain English/Spanish summaries of IRB clauses and data protection policies.",
        "Audit Receipts & Ledger: Cryptographic receipt generated upon consent update and saved to WORM audit store."
      ]}
    />
  );
}
