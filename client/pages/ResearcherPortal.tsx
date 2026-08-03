import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Layers, Database, Shield, Cpu } from "lucide-react";

export default function ResearcherPortal() {
  return (
    <PlaceholderPage
      title="Researcher Portal Home"
      subtitle="Dataset catalog cards with DUO data-use labels, request-access workflow, workspace launcher, saved cohorts, and usage quotas."
      badge="Governed Research Workspace"
      icon={<Layers className="w-6 h-6 text-purple-400" />}
      specs={[
        "Dataset Catalog Cards: Standardized DUO (Data Use Ontology) labels (e.g. DUO:0000006 - Health/Medical/Biomedical Research).",
        "Request-Access Workflow: IRB protocol validation, access review queues, and automatic credential provisioning.",
        "Workspace Launcher: Spins up de-identified Jupyter, RStudio, and GPU cluster environments with pre-loaded OMOP tables.",
        "Usage Quotas & Billing: Real-time GPU compute tracking, privacy budgets, and storage limits."
      ]}
    />
  );
}
