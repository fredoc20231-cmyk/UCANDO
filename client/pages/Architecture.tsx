import React from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { institutionConfig } from "@/config/institution";
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
  FileCode,
  Scale,
  HelpCircle,
  Stethoscope
} from "lucide-react";

export default function Architecture() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans">
        {/* Page Header */}
        <div className="space-y-4 text-center border-b border-border pb-8">
          <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1 mx-auto">
            Interoperability & Data Model Specification
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
            Data Architecture & Platform Vision
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
            Technical blueprint defining {institutionConfig.platformName}’s OMOP CDM foundation, multi-modal hub-and-spoke network, and future production roadmap.
          </p>
        </div>

        {/* Section 1: Foundation: OMOP Common Data Model */}
        <section className="space-y-3 p-6 rounded-2xl bg-card border border-border shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> 1. Foundation: OMOP Common Data Model
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {institutionConfig.platformName}’s synthetic patient records are structured on the OMOP Common Data Model (CDM v5.4) standard with date-shifted de-identification, the same class of methodology used by premier clinical research data repositories such as Vanderbilt University’s Synthetic Derivative. By harmonizing demographics, condition occurrences (ICD-10/SNOMED), measurements (LOINC), drug exposures (RxNorm), and NLP-scrubbed notes under standardized vocabulary concept IDs, {institutionConfig.platformName} is inherently interoperable with standard clinical research tooling and OHDSI analytical pipelines from day one. Date-shifting preserves exact longitudinal time intervals between clinical events while making absolute dates non-identifying.
          </p>
        </section>

        {/* Section 2: How UCANDO Differs From General Clinical AI Tools */}
        <section className="space-y-4 p-6 rounded-2xl bg-card border border-border shadow-subtle">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" /> 2. How {institutionConfig.platformName} Differs From General Clinical AI Tools
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              General medical AI assistants synthesize published medical literature for point-of-care clinicians. In contrast, {institutionConfig.platformName} is an institution-grounded data commons and action spine that connects local electronic health records, high-throughput omics pipelines, and clinical trial registries.
            </p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface text-foreground uppercase font-mono text-[10px] border-b border-border">
                  <th className="p-3 font-bold w-1/4">Capability</th>
                  <th className="p-3 font-bold w-3/8 text-muted-foreground">General Clinical Q&amp;A Tools (e.g. OpenEvidence)</th>
                  <th className="p-3 font-bold w-3/8 text-primary">{institutionConfig.platformName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Data grounding</td>
                  <td className="p-3 text-muted-foreground">General medical literature</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    This institution's own patients, trials, and cohorts
                  </td>
                </tr>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Recommendations</td>
                  <td className="p-3 text-muted-foreground">General best-practice answers</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    Points to a specific internal trial, dataset, or tool
                  </td>
                </tr>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Scope</td>
                  <td className="p-3 text-muted-foreground">Read-only Q&amp;A</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    Q&amp;A plus direct action (cohort building, trial matching, consent management)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-muted-foreground italic pt-2 border-t border-border">
            This is a difference in scope and data grounding, not a claim of superior clinical accuracy or validation. General clinical AI tools serve a different, complementary purpose.
          </p>
        </section>

        {/* Section 3: Beyond a Single-Institution Repository */}
        <section className="space-y-4 p-6 rounded-2xl bg-card border border-border shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> 3. Beyond a Single-Institution Repository
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Traditional research datamarts serve as static, single-institution mirrors of EHR data. {institutionConfig.platformName} expands this vision into a multi-modal, federated integration commons capable of connecting diverse clinical, genomic, and imaging modalities across institutional boundaries.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface text-foreground uppercase font-mono text-[10px] border-b border-border">
                  <th className="p-3 font-bold w-1/4">Capability</th>
                  <th className="p-3 font-bold w-3/8 text-muted-foreground">Single-Institution Repository<br />(e.g. Synthetic Derivative model)</th>
                  <th className="p-3 font-bold w-3/8 text-primary">{institutionConfig.platformName} Target Architecture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Data Scope</td>
                  <td className="p-3 text-muted-foreground">Single institution, historical EHR mirror</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    Multi-modal: EHR, multi-omics, imaging, real-time trial matching
                  </td>
                </tr>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Data Types</td>
                  <td className="p-3 text-muted-foreground">Structured codes + free-text notes</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    Structured codes, raw multi-omic pipelines, DICOM imaging, structured notes
                  </td>
                </tr>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">Network Model</td>
                  <td className="p-3 text-muted-foreground">Single-site</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    Hub-and-spoke, multi-site governed network (see Global Integrations)
                  </td>
                </tr>
                <tr className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">AI Capability</td>
                  <td className="p-3 text-muted-foreground">None / manual query</td>
                  <td className="p-3 text-foreground font-semibold bg-surface/50">
                    Platform-Aware Research Concierge (iUCANDO) connecting across all tools and trials
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Live in Prototype Today */}
        <section className="space-y-4 p-6 rounded-2xl bg-card border border-border shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 4. Live in Prototype Today
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {institutionConfig.platformName} differentiates itself from conventional download-and-query repositories by embedding active intelligence and multi-modal synthesis directly into the user experience today.
          </p>

          <div className="space-y-3 text-sm pt-1">
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                <span>Platform-Aware Research Concierge</span>
                <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono ml-auto">
                  Live in Prototype
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                iUCANDO is embedded across every page as a live platform concierge, capable of recommending internal trials, cohorts, and DESeq2 RNA-seq parameters in context.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Layers className="w-4 h-4 text-accent shrink-0" />
                <span>Unified Multi-Modal Record & Patient Integration</span>
                <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono ml-auto">
                  Live in Prototype
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patient 360 and Patient Integration combine demographics, RECIST 1.1 curves, genomics, imaging, labs, and DeepSurv survival estimates in a single view structured on the OMOP Common Data Model.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Roadmap */}
        <section className="space-y-4 p-6 rounded-2xl bg-card border border-border shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <GitFork className="w-5 h-5 text-primary" /> 5. Production Deployment Roadmap
          </h2>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Multi-omic Ingestion Pipelines at Scale</span>
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono ml-auto">
                  (Planned)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated ingestion of FASTQ/BAM raw reads with Dragen v4 variant calling and FHIR MolecularSequence resource write-backs.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Federated Multi-Institution Querying</span>
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono ml-auto">
                  (Planned)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consortium networks modeled on the NCI Genomic Data Commons (GDC) with cross-site differential privacy query budgets.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Real-Time Clinical Data Streaming</span>
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono ml-auto">
                  (Planned)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kafka event stream pipelines for immediate bedside-to-bench alerting on clinical trial eligibility and adverse toxicity events.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
            Note: The items listed above represent architectural goals and roadmap targets for a future production deployment, and do not represent active capabilities of the current synthetic demonstration prototype.
          </p>
        </section>
      </div>
    </Layout>
  );
}
