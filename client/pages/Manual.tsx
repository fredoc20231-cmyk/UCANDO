import React from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  ChevronRight,
  Database,
  Lock,
  Globe
} from "lucide-react";

export default function Manual() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="space-y-4 text-center border-b border-slate-200 dark:border-slate-800 pb-8">
          <Badge className="bg-brand-maroon text-white text-xs px-3 py-1 mx-auto">
            Documentation & Platform Architecture
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Beacon Cancer Data Commons Operational Manual
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A comprehensive guide for clinicians, oncologists, biostatisticians, and administrators evaluating and deploying the UCCANDO / Beacon oncology integration hub.
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-maroon" /> 1. Platform Overview
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            The Beacon Cancer Data Commons (UCCANDO) is a governed, multi-modal oncology data integration platform designed to break down siloes between electronic health records (EHR), high-throughput genomics pipelines, DICOM imaging archives, and clinical trial matching registries. It enables real-time cohort discovery, longitudinal patient timeline visualization, and automated OPA policy-driven data sharing across participating cancer center spokes.
          </p>
        </section>

        {/* Section 2: Core Modules */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-maroon" /> 2. Core Modules Summary
          </h2>
          <div className="space-y-3 text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800/80">
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Clinician Patient 360:</strong> Longitudinal timeline integrating diagnoses, treatments, lab toxicities, genomic VCFs, DICOM CT/PET slices, and SMART-on-FHIR launch tools.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Visual Cohort Builder:</strong> Feasibility query builder over demographics, SNOMED/ICD-10 diagnoses, genomic variants, and survival outcomes with differential privacy budget protection.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Clinical Trial Matching:</strong> Biomarker and inclusion/exclusion matching engine against active clinical protocols.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Dynamic Consent Console:</strong> Patient-facing and governance consent management with granular toggles for AI training, biospecimen sharing, and recontact privileges.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Imaging & Digital Pathology Workspace:</strong> Zero-footprint DICOMweb viewer supporting CT/PET axial slices, whole slide image (WSI) H&E pathology, and AI tumor purity overlays.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Multiomics & Genomics Explorer:</strong> High-throughput somatic/germline VCF variant table, OncoPrint mutation matrix, and biological pathway enrichment scores.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Governance & IRB Charter:</strong> OPA policy rules, data access request workflow, and IRB charter enforcement.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Immutable WORM Audit Dashboard:</strong> SOC2 Type II cryptographically signed access event stream enforcing compliance invariants.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">OMOP & mCODE Data Quality Hub:</strong> Automated vocabulary normalization and HL7 mCODE completeness scoring.
            </div>
            <div className="pt-2">
              <strong className="text-slate-900 dark:text-white">Global Integrations Hub:</strong> Federated launchpad for Epic EHR, Epic Cosmos, ClinVar, cBioPortal, GDC, and ClinicalTrials.gov.
            </div>
          </div>
        </section>

        {/* Section 3: User Personas & Roles */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-maroon" /> 3. User Roles & Scoped Permissions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">Attending Oncologist (MD)</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Full line-level clinical patient record access, SMART-on-FHIR launch tools, DICOM image viewing, and trial enrollment requests.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">Lead Bioinformatician</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                De-identified cohort querying, multiomics VCF inspection, pathway enrichment analysis, and JupyterLab research workspace access.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm block">IRB & Compliance Officer</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                OPA policy governance, WORM audit log review, dynamic consent audit, and data access request approvals.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Data & Privacy Statement */}
        <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 4. Data Synthetic Status & HIPAA Compliance
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            All data currently displayed in this interactive demonstration platform is strictly <strong>synthetic and de-identified</strong>. No actual Protected Health Information (PHI) is stored or processed. Production deployment of this common requires institutional IRB approval, OAuth2 / OIDC authentication with healthcare identity providers, and active BAA agreements.
          </p>
        </section>

        {/* Section 5: Getting Started Guide */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-maroon" /> 5. Getting Started Checklist
          </h2>
          <ol className="list-decimal list-inside space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
            <li className="pl-1">Select your active role persona in the header dropdown (e.g. Dr. Alex Rivera, MD or Lead Bioinformatician).</li>
            <li className="pl-1">Navigate to <strong>Clinician Patient 360</strong> to inspect patient <code className="font-mono bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-xs">UC-BEACON-89421</code> longitudinal history.</li>
            <li className="pl-1">Open <strong>Visual Cohort Builder</strong> to run de-identified feasibility queries and apply disease presets.</li>
            <li className="pl-1">Explore <strong>Global Integrations</strong> to model SMART-on-FHIR launches into EHRs and public genomics resources.</li>
            <li className="pl-1">Review <strong>Audit & Compliance</strong> to verify WORM-signed SOC2 event records.</li>
          </ol>
        </section>
      </div>
    </Layout>
  );
}
