import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Stethoscope,
  SlidersHorizontal,
  Dna,
  Activity,
  Lock,
  Send
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> 4. Live in Prototype Today (Leverage Right Now)
            </h2>
            <Link to="/trial-matching">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8 shadow-subtle">
                <Send className="w-3.5 h-3.5 mr-1.5" /> Open Trial Matching
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you are currently conducting your <strong>UC-CCC Transcriptomics RNA-seq Cohort Analysis</strong>, you do not need to wait for roadmap features. The following core tools are <strong>100% operational</strong> and ready for your workflow:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm pt-1">
            <div className="p-4 rounded-xl bg-surface border border-border space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <SlidersHorizontal className="w-4 h-4 text-accent shrink-0" />
                  <span>Cohort Filtering</span>
                  <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono ml-auto">
                    Live
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use the <strong>Cohort Builder (<Link to="/cohort-builder" className="text-primary hover:underline font-mono">/cohort-builder</Link>)</strong> to filter patient populations by clinical phenotypes, stages, and biomarkers using mCODE and GA4GH Beacon v2 standards.
                </p>
              </div>
              <Link to="/cohort-builder" className="pt-2">
                <Button size="sm" variant="outline" className="w-full text-xs h-7 border-border text-foreground">
                  Launch Cohort Builder <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Dna className="w-4 h-4 text-primary shrink-0" />
                  <span>Differential Expression</span>
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-mono ml-auto">
                    Live
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Load cohorts directly into the <strong>RNA-seq Workspace (<Link to="/workspace" className="text-primary hover:underline font-mono">/workspace</Link>)</strong> to run bulk transcriptomics, DESeq2 GLMs (<code className="font-mono text-[11px] bg-card px-1 rounded">~ batch + condition</code>), Volcano plots, PCA, and heatmaps.
                </p>
              </div>
              <Link to="/workspace" className="pt-2">
                <Button size="sm" variant="outline" className="w-full text-xs h-7 border-border text-foreground">
                  Launch RNA-seq Studio <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Activity className="w-4 h-4 text-accent shrink-0" />
                  <span>Pathway Enrichment</span>
                  <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono ml-auto">
                    Live
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Push differentially expressed gene lists into the <strong>GSEA Pathways Studio (<Link to="/pathways/gsea" className="text-primary hover:underline font-mono">/pathways/gsea</Link>)</strong> to run enrichment analyses against MSigDB Hallmark, Reactome, and KEGG.
                </p>
              </div>
              <Link to="/pathways/gsea" className="pt-2">
                <Button size="sm" variant="outline" className="w-full text-xs h-7 border-border text-foreground">
                  Launch GSEA Studio <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Upcoming Roadmap Integrations & Data Breadth */}
        <section className="space-y-4 p-6 rounded-2xl bg-card border border-border shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <GitFork className="w-5 h-5 text-primary" /> 5. Upcoming Roadmap Integrations & Data Breadth
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To transition from our current sandboxed state to a fully integrated, multi-institutional health system network, we are actively developing the following roadmap tiers:
          </p>

          <div className="space-y-3 text-sm">
            {/* 1. Epic Cosmos */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground flex-wrap">
                <Globe className="w-4 h-4 text-accent shrink-0" />
                <span>Epic Cosmos Federated Research Network</span>
                <Badge variant="outline" className="border-accent/40 text-accent text-[10px] font-mono ml-auto">
                  In Development (Roadmap)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Expands clinical data reach beyond UChicago Medicine, enabling federated queries across millions of de-identified patient records nationwide while preserving institutional differential privacy budgets.
              </p>
            </div>

            {/* 2. Epic Genomics Module */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground flex-wrap">
                <Dna className="w-4 h-4 text-primary shrink-0" />
                <span>Epic Genomics Module</span>
                <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono ml-auto">
                  In Development (Roadmap)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                While genomic annotations currently query ClinVar and cBioPortal, native Epic Genomics integration will enable direct ingestion of clinical-grade genomic reports and discrete somatic variants into the <strong>Omics View (<Link to="/omics-view" className="text-primary hover:underline font-mono">/omics-view</Link>)</strong>.
              </p>
            </div>

            {/* 3. Epic MyChart Integration */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground flex-wrap">
                <Lock className="w-4 h-4 text-accent shrink-0" />
                <span>Epic MyChart Integration</span>
                <Badge variant="outline" className="border-accent/40 text-accent text-[10px] font-mono ml-auto">
                  In Development (Roadmap)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bridges researchers and patients for direct patient-reported outcomes (PROs) and dynamic patient consent management feeding directly into the <strong>Dynamic Consent Console (<Link to="/consent-console" className="text-primary hover:underline font-mono">/consent-console</Link>)</strong>.
              </p>
            </div>

            {/* 4. Clinical Trial & Cohort Breadth */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-foreground flex-wrap">
                <SlidersHorizontal className="w-4 h-4 text-primary shrink-0" />
                <span>Clinical Trial Coverage & Rare Cohort Ingestion</span>
                <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono ml-auto">
                  Active Ingestion
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Expanding <strong>Trial Matching (<Link to="/trial-matching" className="text-primary hover:underline font-mono">/trial-matching</Link>)</strong> across the broader UChicago oncology trial portfolio (KRAS G12C, HER2-ADC, MET/EGFR bispecifics, and CAR-T), while expanding beyond deep cohorts (Invasive Breast: 4,280 patients; High-Grade Serous Ovarian: 2,150 patients) to rare subtypes (Metaplastic Breast Carcinoma, Intrahepatic Cholangiocarcinoma).
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
            Note: The roadmap items represent architectural and data-ingestion expansion goals for institutional deployment. Current demonstration modules operate on consented synthetic and de-identified data.
          </p>
        </section>
      </div>
    </Layout>
  );
}
