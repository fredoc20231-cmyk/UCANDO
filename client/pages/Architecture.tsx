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

        {/* Section 3: Advanced Capabilities */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary dark:text-sky-400" /> 3. Advanced Capabilities
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Honesty Tiered Architecture Matrix
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            UCANDO differentiates itself from conventional download-and-query repositories by embedding active intelligence and multi-modal synthesis directly into the user experience, while maintaining clear transparency regarding current prototype features versus planned research capabilities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Live in Prototype 1 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    AI-Native Interface
                  </h3>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 text-[10px] font-mono shrink-0">
                    Live in Prototype
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  iUCANDO, an embedded conversational assistant available on every page (not a bolt-on chatbot).
                </p>
              </div>
            </div>

            {/* Live in Prototype 2 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Unified Multi-Modal Record
                  </h3>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 text-[10px] font-mono shrink-0">
                    Live in Prototype
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  A single Patient 360 view spanning demographics, omics, imaging, labs, treatment response, and recovery in one interface.
                </p>
              </div>
            </div>

            {/* Planned 1 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    Predictive Relapse & Response Modeling
                  </h3>
                  <Badge variant="outline" className="border-amber-300 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/30 text-[10px] font-mono shrink-0">
                    Planned
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Models trained on longitudinal outcomes to flag early relapse risk and predict treatment response, pending validation framework and IRB approval for model deployment.
                </p>
              </div>
            </div>

            {/* Planned 2 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    Federated Cross-Institution Learning
                  </h3>
                  <Badge variant="outline" className="border-amber-300 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/30 text-[10px] font-mono shrink-0">
                    Planned
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Privacy-preserving model training across UCANDO spoke sites without moving patient-level data off-site, modeled on federated learning architectures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Roadmap */}
        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitFork className="w-5 h-5 text-primary dark:text-sky-400" /> 4. Production Deployment Roadmap
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
