import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HubAndSpokeVisualizer } from "@/components/HubAndSpokeVisualizer";
import { HubStats, SpokeConnection } from "@shared/api";
import { institutionConfig } from "@/config/institution";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Dna,
  Image as ImageIcon,
  FlaskConical,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  ChevronRight,
  ExternalLink,
  Layers,
  Lock,
  FileCode,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  LineChart,
  BarChart2,
  PieChart,
  Database
} from "lucide-react";

export default function Index() {
  const [stats, setStats] = useState<HubStats | null>(null);
  const [spokes, setSpokes] = useState<SpokeConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/beacon/stats").then((r) => r.json()),
      fetch("/api/beacon/spokes").then((r) => r.json())
    ])
      .then(([statsData, spokesData]) => {
        setStats(statsData);
        setSpokes(spokesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hub data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-8 font-sans">
        
        {/* Master Hero Banner */}
        <div className="relative rounded-2xl bg-card border border-border p-6 md:p-8 overflow-hidden shadow-subtle">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs shadow-subtle">
                  {institutionConfig.fullName}
                </Badge>
                <Badge variant="outline" className="border-border bg-surface text-foreground text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-accent" /> HIPAA Consented Ecosystem
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight">
                Central Oncology Integration Hub & Governed Data Commons
              </h1>

              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed font-sans">
                {institutionConfig.platformName} connects every consented {institutionConfig.shortName} oncology patient and translational dataset into a single, HIPAA-compliant, AI-ready integration spine. Seamlessly unifies Epic EHR, publication-grade RNA-seq analytics, digital radiology, pathology WSI, biospecimen lineage, and clinical trial matching under real-time OPA consent governance.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link to="/omics-view">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-5 shadow-subtle">
                    <Layers className="w-4 h-4 mr-2" /> Launch Omics View
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                <Link to="/workspace">
                  <Button variant="outline" className="border-border bg-card hover:bg-muted text-foreground font-semibold text-xs h-9 px-4 shadow-subtle">
                    <Dna className="w-4 h-4 mr-2 text-accent" /> RNA-seq Analytics
                  </Button>
                </Link>

                <Link to="/patient-360?id=UC-CCC-89421">
                  <Button variant="outline" className="border-border bg-card hover:bg-muted text-foreground font-semibold text-xs h-9 px-4 shadow-subtle">
                    <Users className="w-4 h-4 mr-2 text-primary" /> Clinician Patient 360 Orbit
                  </Button>
                </Link>

                <Link to="/cohort-builder">
                  <Button variant="outline" className="border-border bg-card hover:bg-muted text-foreground font-semibold text-xs h-9 px-4 shadow-subtle">
                    <SlidersHorizontal className="w-4 h-4 mr-2 text-accent" /> Cohort Query Builder
                  </Button>
                </Link>
              </div>
            </div>

            {/* Featured Platform DNA Orb Logo Badge (Scaled 50% smaller) */}
            <div className="hidden lg:flex flex-col items-center justify-center p-2 rounded-xl bg-surface border border-border shadow-subtle shrink-0">
              <img
                src={institutionConfig.logoPath}
                alt={`${institutionConfig.platformName} Logo`}
                className="h-20 w-auto max-w-[90px] object-contain rounded-lg border border-border bg-card p-0.5"
              />
              <span className="text-[9px] font-bold text-primary font-mono mt-1 tracking-wider uppercase">
                {institutionConfig.platformName} Core
              </span>
            </div>
          </div>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border space-y-1 hover:border-primary/40 transition-colors shadow-subtle">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Consented Patients</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {stats ? stats.totalConsentedPatients.toLocaleString() : "104,280"}
            </p>
            <p className="text-[10px] text-accent flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> 100% Consent Verified
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1 hover:border-primary/40 transition-colors shadow-subtle">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>RNA-seq & Multiomics</span>
              <Dna className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {stats ? stats.totalOmicsProfiles.toLocaleString() : "84,910"}
            </p>
            <p className="text-[10px] text-muted-foreground">DESeq2, WES, Proteomics</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1 hover:border-primary/40 transition-colors shadow-subtle">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Imaging Accessions</span>
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {stats ? stats.totalImagingStudies.toLocaleString() : "462,100"}
            </p>
            <p className="text-[10px] text-muted-foreground">PET/CT, MRI, OHIF DICOM</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1 hover:border-primary/40 transition-colors shadow-subtle">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Biospecimen Lineage</span>
              <FlaskConical className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {stats ? stats.totalBiospecimens.toLocaleString() : "1,240,500"}
            </p>
            <p className="text-[10px] text-muted-foreground">HTRC Cryo & FFPE Blocks</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1 hover:border-primary/40 transition-colors shadow-subtle">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>Active Workspaces</span>
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {stats ? stats.activeWorkspaces : "342"}
            </p>
            <p className="text-[10px] text-muted-foreground">GPU Research Sandboxes</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-1 hover:border-primary/40 transition-colors shadow-subtle">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
              <span>OPA Enforcement</span>
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">
              {stats ? stats.opaPolicyEnforcementsToday.toLocaleString() : "49,210"}
            </p>
            <p className="text-[10px] text-accent font-semibold">Real-time Zero-Trust</p>
          </div>
        </div>

        {/* Interactive Hub-and-Spoke Visual Architecture Diagram */}
        {loading ? (
          <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-border">
            Initializing {institutionConfig.platformName} Architecture Visualizer...
          </div>
        ) : (
          <HubAndSpokeVisualizer spokes={spokes} dataZones={stats ? stats.dataZones : []} />
        )}

        {/* Featured Clinical & Scientific Applications Launchpad */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                {institutionConfig.platformName} Clinical & Scientific Research Portals
              </h3>
              <p className="text-xs text-muted-foreground">
                Unified oncology analytics suite and governed data commons portals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Premier Card: Omics View (RNA-seq & 8 Other Omics + Integrations) */}
            <div className="p-5 rounded-2xl bg-card border-2 border-primary/40 space-y-3 flex flex-col justify-between hover:border-primary transition-all shadow-subtle group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                    <Dna className="w-5 h-5" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono font-bold">
                    9 Omics Layers & Integrations
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Omics View
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Comprehensive multi-omics workspace integrating publication-grade <strong>RNA-seq transcriptomics</strong> alongside <strong>8 other omics modalities and integrations</strong>: Somatic & Germline Genomics (WES/WGS variants, OncoPrint matrix), Epigenomics, Proteomics, Phosphoproteomics, Metabolomics, Single-Cell RNA-seq, Spatial Transcriptomics, and Radiomics with PhoenixMO and BioCompute IEEE 2791 provenance.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">RNA-seq + 8 Omics & PhoenixMO</span>
                <Link to="/omics-view" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                  Launch Omics View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Clinician Patient 360 */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between hover:border-primary/50 transition-all shadow-subtle group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-surface border border-border text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Clinician View
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Clinician Patient 360 Orbit
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Radial Patient Orbit View with 6 domain satellites: EHR Demographics, Genomics & Omics, Metabolomics, Lab Results, Pathology WSI, and Radiology DICOM (OHIF).
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">Patient: UC-CCC-89421</span>
                <Link to="/patient-360?id=UC-CCC-89421" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                  Open Orbit View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Visual Cohort Builder */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between hover:border-accent/50 transition-all shadow-subtle group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-surface border border-border text-accent">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Researcher View
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-foreground group-hover:text-accent transition-colors">
                  Visual Cohort Query Builder
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Query demographics, ICD-10/SNOMED codes, genomic biomarkers (gene, VAF, expression), treatment lines, and outcomes with live de-identified patient counts.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">De-identified Analytics</span>
                <Link to="/cohort-builder" className="text-accent font-semibold flex items-center gap-1 hover:underline">
                  Open Query Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: Dynamic Consent Console */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between hover:border-accent/50 transition-all shadow-subtle group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-surface border border-border text-accent">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Governance / Patient
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-foreground group-hover:text-accent transition-colors">
                  Dynamic Consent Console
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Granular toggles for research use, recontact, biospecimens, AI model training, and partner data sharing with withdraw-anytime propagation under 24h.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">OPA Policy Driven</span>
                <Link to="/consent-console" className="text-accent font-semibold flex items-center gap-1 hover:underline">
                  Inspect Console <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 5: Imaging Launch Hub (OHIF) */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between hover:border-primary/50 transition-all shadow-subtle group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-surface border border-border text-primary">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Imaging & Pathology
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Imaging Launch Hub (OHIF)
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  DICOMweb cloud PACS integration launching the OHIF Viewer for PET/CT, multi-parametric MRI, and Whole Slide Pathology imaging.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">OHIF / DICOMweb</span>
                <Link to="/imaging-hub" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                  Open Imaging Hub <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 6: Admin Census Dashboard */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 flex flex-col justify-between hover:border-primary/50 transition-all shadow-subtle group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-surface border border-border text-primary">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Administration
                  </Badge>
                </div>
                <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Admin Census & Registration
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time oncology patient census, dynamic disease & treatment bucket aggregation, and live patient registration console.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono text-[11px]">Live Census Stream</span>
                <Link to="/admin" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                  Open Admin Census <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}
