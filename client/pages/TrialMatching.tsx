import { PlaceholderPage } from "@/components/PlaceholderPage";
import { GitPullRequest, Search, Globe, Users } from "lucide-react";

export default function TrialMatching() {
  return (
    <PlaceholderPage
      title="Trial Matching & GA4GH Beacon Endpoint"
      subtitle="Eligibility rule engine driven by mCODE FHIR, genomic biomarker matching, and GA4GH Beacon v2 federated discovery API."
      badge="GA4GH Beacon v2 API"
      icon={<GitPullRequest className="w-6 h-6 text-amber-400" />}
      specs={[
        "mCODE-Driven Eligibility Rules: Automatic matching against ClinicalTrials.gov and UChicago investigator-initiated precision trials.",
        "Genomic Biomarker Matching: Match patients based on specific variant alleles, TMB (Tumor Mutational Burden), and MSI status.",
        "GA4GH Beacon v2 Endpoint: Global discoverability query interface allowing external research nodes to query variant presence without exposing PHI.",
        "Referral Workflow: Streamlined clinical trial coordinator referral pipeline with automated IRB eligibility checks."
      ]}
    />
  );
}
