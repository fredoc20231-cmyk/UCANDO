import React from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Layers,
  Sparkles,
  GitFork,
  Cpu,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCode
} from "lucide-react";

export default function Architecture() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Page Header */}
        <div className="space-y-4 text-center border-b border-slate-200 dark:border-slate-800 pb-8">
          <Badge className="bg-primary dark:bg-brand-maroon text-white text-xs px-3 py-1 mx-auto">
            Interoperability & Data Model Specification
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Architecture & Platform Vision
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Technical blueprint defining UCANDO’s OMOP CDM foundation, multi-modal hub-and-spoke network, and future production roadmap.
          </p>
        </div>

        {/* Section 1: Foundation: OMOP Common Data Model */}
        <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-primary dark:text-sky-400" /> 1. Foundation: OMOP Common Data Model
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            UCANDO’s synthetic patient records are structured on the OMOP Common Data Model (CDM v5.4) standard with date-shifted de-identification, the same class of methodology used by premier clinical research data repositories such as Vanderbilt University’s Synthetic Derivative. By harmonizing demographics, condition occurrences (ICD-10/SNOMED), measurements (LOINC), drug exposures (RxNorm), and NLP-scrubbed notes under standardized vocabulary concept IDs, UCANDO is inherently interoperable with standard clinical research tooling and OHDSI analytical pipelines from day one. Date-shifting preserves exact longitudinal time intervals between clinical events while making absolute dates non-identifying.
          </p>
        </section>

        {/* Section 2: Beyond a Single-Institution Repository */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary dark:text-sky-400" /> 2. Beyond a Single-Institution Repository
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Traditional research datamarts serve as static, single-institution mirrors of EHR data. UCANDO expands this vision into a multi-modal, federated integration commons capable of connecting diverse clinical, genomic, and imaging modalities across institutional boundaries.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3 font-bold w-1/4">Capability</th>
                  <th className="p-3 font-bold w-3/8 text-slate-600 dark:text-slate-400">Single-Institution Repository<br />(e.g. Synthetic Derivative model)</th>
                  <th className="p-3 font-bold w-3/8 text-primary dark:text-cyan-400">UCANDO Target Architecture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Data Scope</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">Single institution, historical EHR mirror</td>
                  <td className="p-3 text-slate-900 dark:text-slate-100 font-semibold bg-slate-50/50 dark:bg-slate-950/30">
                    Multi-modal: EHR, multi-omics, imaging, real-time trial matching
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Data Types</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">Structured codes + free-text notes</td>
                  <td className="p-3 text-slate-900 dark:text-slate-100 font-semibold bg-slate-50/50 dark:bg-slate-950/30">
                    Structured codes, raw multi-omic pipelines, DICOM imaging, structured notes
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Network Model</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">Single-site</td>
                  <td className="p-3 text-slate-900 dark:text-slate-100 font-semibold bg-slate-50/50 dark:bg-slate-950/30">
                    Hub-and-spoke, multi-site governed network (see Global Integrations)
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">AI Capability</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">None / manual query</td>
                  <td className="p-3 text-slate-900 dark:text-slate-100 font-semibold bg-slate-50/50 dark:bg-slate-950/30">
                    Embedded AI assistant (iUCANDO) with planned continuous-learning models
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Roadmap */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitFork className="w-5 h-5 text-primary dark:text-sky-400" /> 3. Production Deployment Roadmap
          </h2>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Multi-omic Ingestion Pipelines at Scale</span>
                <Badge variant="outline" className="border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-mono ml-auto">
                  (Planned)
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated ingestion of FASTQ/BAM raw reads with Dragen v4 variant calling and FHIR MolecularSequence resource write-backs.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Federated Multi-Institution Querying</span>
                <Badge variant="outline" className="border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-mono ml-auto">
                  (Planned)
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Consortium networks modeled on the NCI Genomic Data Commons (GDC) with cross-site differential privacy query budgets.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Real-Time Clinical Data Streaming</span>
                <Badge variant="outline" className="border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-mono ml-auto">
                  (Planned)
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kafka event stream pipelines for immediate bedside-to-bench alerting on clinical trial eligibility and adverse toxicity events.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2 border-t border-slate-100 dark:border-slate-800">
            Note: The items listed above represent architectural goals and roadmap targets for a future production deployment, and do not represent active capabilities of the current synthetic demonstration prototype.
          </p>
        </section>
      </div>
    </Layout>
  );
}
