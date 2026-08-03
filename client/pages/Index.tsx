import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HubAndSpokeVisualizer } from "@/components/HubAndSpokeVisualizer";
import { HubStats, SpokeConnection } from "@shared/api";
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
  AlertTriangle
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
      <div className="space-y-8 pb-10">
        {/* Master Hero Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-uchicago-dark-maroon/90 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
          {/* Subtle Glow & Background Deco */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-uchicago-maroon hover:bg-uchicago-maroon text-white font-bold px-2.5 py-1 text-xs border border-red-500/40">
                  UChicago Cancer Data Commons
                </Badge>
                <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 bg-cyan-950/40 text-xs font-mono">
                  UCCANDO • Beacon
                </Badge>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-950/40 text-xs">
                  <ShieldCheck className="w-3 h-3 mr-1" /> HIPAA Consented Ecosystem
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Central Oncology Integration Hub & Governed Data Commons
              </h1>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Beacon connects every consented UChicago Cancer Center patient into a single, HIPAA-compliant, AI-ready integration spine. Seamlessly unifies Epic EHR, multiomics, digital radiology, whole slide pathology, biospecimen lineage, and clinical trial matching under real-time OPA consent governance.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link to="/patient-360?id=UC-BEACON-89421">
                  <Button className="bg-uchicago-maroon hover:bg-red-800 text-white font-semibold text-xs h-10 px-5 shadow-lg shadow-red-950/50">
                    <Users className="w-4 h-4 mr-2" /> Launch Clinician Patient 360
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                <Link to="/cohort-builder">
                  <Button variant="outline" className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs h-10 px-4">
                    <SlidersHorizontal className="w-4 h-4 mr-2 text-sky-400" /> Visual Cohort Query Builder
                  </Button>
                </Link>
              </div>
            </div>

            {/* Featured UCCANDO DNA Orb Logo Badge */}
            <div className="hidden lg:flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 shrink-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Ffc7eb0036adc46ad99a19a10591f08da?format=webp&width=800&height=1200"
                alt="UCCANDO Logo"
                className="h-44 w-auto max-w-[200px] object-contain rounded-xl shadow-lg border border-cyan-400/20 bg-slate-950/60 p-1"
              />
              <span className="text-[11px] font-bold text-cyan-300 font-mono mt-2 tracking-widest uppercase">
                UCCANDO
              </span>
            </div>
          </div>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Consented Patients</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {stats ? stats.totalConsentedPatients.toLocaleString() : "104,280"}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Consent Verified
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Multiomics Profiles</span>
              <Dna className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {stats ? stats.totalOmicsProfiles.toLocaleString() : "84,910"}
            </p>
            <p className="text-[10px] text-slate-400">WES, RNA-seq, Proteomics</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Imaging Accessions</span>
              <ImageIcon className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {stats ? stats.totalImagingStudies.toLocaleString() : "462,100"}
            </p>
            <p className="text-[10px] text-slate-400">PET/CT, MRI, Pathology WSI</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Biospecimen Lineage</span>
              <FlaskConical className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {stats ? stats.totalBiospecimens.toLocaleString() : "1,240,500"}
            </p>
            <p className="text-[10px] text-slate-400">HTRC Cryo & FFPE Blocks</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Active Workspaces</span>
              <Layers className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {stats ? stats.activeWorkspaces : "342"}
            </p>
            <p className="text-[10px] text-slate-400">GPU Research Sandboxes</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>OPA Enforcement</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              {stats ? stats.opaPolicyEnforcementsToday.toLocaleString() : "49,210"}
            </p>
            <p className="text-[10px] text-emerald-400">Real-time Zero-Trust</p>
          </div>
        </div>

        {/* Interactive Hub-and-Spoke Visual Architecture Diagram */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
            Initializing Beacon Architecture Visualizer...
          </div>
        ) : (
          <HubAndSpokeVisualizer spokes={spokes} dataZones={stats ? stats.dataZones : []} />
        )}

        {/* Featured Clinical Applications Launchpad */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Beacon Clinical & Research Portals
              </h3>
              <p className="text-xs text-slate-400">
                Custom React components registered inside Builder.io layout composition layer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Patient 360 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-red-500/50 transition-all shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-uchicago-maroon text-white">
                    <Users className="w-5 h-5" />
                  </div>
                  <Badge className="bg-red-950 text-red-300 border-red-800/60 text-[10px]">
                    Clinician View
                  </Badge>
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-red-300 transition-colors">
                  Clinician Patient 360
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Longitudinal clinical timeline (diagnosis → treatment → toxicity → recurrence → survival). Integrated labs, genomics, DICOM imaging, and SMART-on-FHIR launch toolbar.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">Patient: UC-BEACON-89421</span>
                <Link to="/patient-360?id=UC-BEACON-89421" className="text-red-400 font-semibold flex items-center gap-1 hover:underline">
                  Launch View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Cohort Builder */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-sky-950 text-sky-300 border border-sky-800/50">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <Badge className="bg-sky-950 text-sky-300 border-sky-800/60 text-[10px]">
                    Researcher View
                  </Badge>
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-sky-300 transition-colors">
                  Visual Cohort Builder
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Query demographics, ICD-10/SNOMED codes, genomic biomarkers (gene, VAF, expression), treatment lines, and outcomes with live de-identified patient counts.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">De-identified Analytics</span>
                <Link to="/cohort-builder" className="text-sky-400 font-semibold flex items-center gap-1 hover:underline">
                  Open Query Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Dynamic Consent Console */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800/60 text-[10px]">
                    Governance / Patient
                  </Badge>
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  Dynamic Consent Console
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Granular toggles for research use, recontact, biospecimens, AI model training, and partner data sharing with withdraw-anytime propagation under 24h.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">OPA Policy Driven</span>
                <Link to="/consent-console" className="text-emerald-400 font-semibold flex items-center gap-1 hover:underline">
                  Inspect Console <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Builder.io PHI-Free Non-Negotiable Rules Showcase */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800/50">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Builder.io Non-Negotiable Invariants & Component Registry
                </h3>
                <p className="text-xs text-slate-400">
                  Builder.io delivers layout, help text, and visual composition. All PHI is strictly rendered via authenticated React API calls.
                </p>
              </div>
            </div>
            <Badge className="bg-red-950 text-red-300 border-red-800/60">
              PHI-Free Zone Verified
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1. No PHI in CMS
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                No patient identifiers or medical records are ever stored in Builder.io content models.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 2. Component Composition
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Heavy clinical UI (Patient 360, Cohort Builder, DICOM launcher) registered as custom React components.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3. Multi-Environment
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Builder environments (dev → staging → prod) with strict approval gates for layout publishing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4. Business Associate
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Designed to avoid PHI exposure entirely, eliminating vendor PHI liability risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
