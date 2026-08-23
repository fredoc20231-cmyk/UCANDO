import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SmartLaunchModal } from "@/components/SmartLaunchModal";
import { Patient360Record } from "@shared/api";
import { PatientOrbitView } from "@/components/PatientOrbitView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  User,
  Activity,
  ShieldCheck,
  Dna,
  Image as ImageIcon,
  FlaskConical,
  FileText,
  ExternalLink,
  Zap,
  Lock,
  Stethoscope,
  Pill,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Play,
  Database,
  Home,
  HeartPulse,
  Users,
  TrendingUp,
  ArrowLeft
} from "lucide-react";

export default function Patient360() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("id") || "UC-CCC-89421";

  const [record, setRecord] = useState<Patient360Record | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline");
  const [viewMode, setViewMode] = useState<"orbit" | "tab">("orbit");
  const [smartLaunching, setSmartLaunching] = useState<string | null>(null);
  const [smartModalOpen, setSmartModalOpen] = useState(false);
  const [smartPlatform, setSmartPlatform] = useState<"omics" | "imaging">("omics");
  const [smartTargetUrl, setSmartTargetUrl] = useState("https://cronus.life/");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/beacon/patient/360?id=${encodeURIComponent(patientId)}`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load patient 360:", err);
        setLoading(false);
      });
  }, [patientId]);

  const triggerSmartLaunch = (platform: "omics" | "imaging") => {
    setSmartLaunching(platform);
    setSmartPlatform(platform);
    setSmartTargetUrl(platform === "omics" ? "https://cronus.life/" : "https://viewer.ohif.org/");
    setTimeout(() => {
      setSmartLaunching(null);
      setSmartModalOpen(true);
    }, 400);
  };

  if (loading || !record) {
    return (
      <Layout>
        <div className="p-12 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          Loading Clinician Patient 360 record...
        </div>
      </Layout>
    );
  }

  const { demographics, consent, timeline, genomics, imaging, labs, infusions, biospecimens, notes } = record;

  // Format lab data for Recharts CA 15-3 trend
  const ca153Data = labs
    .filter((l) => l.marker === "CA 15-3")
    .map((l) => ({ date: l.date, value: l.value, cutoff: 30 }));

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Top Demographics Header & Consent Banner */}
        <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[#00CC96]/15 text-[#00CC96] border-[#00CC96]/30 font-semibold text-xs rounded-full">
                  {demographics.consentStatus} Patient
                </Badge>
                <span className="font-mono text-xs text-primary font-semibold">MRN: {demographics.mrn}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-xs text-[#00CC96] font-semibold">Tokenized ID: {demographics.deIdentifiedId}</span>
              </div>

              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Patient 360: {demographics.id}
              </h1>

              <p className="text-xs text-muted-foreground">
                {demographics.age} y/o {demographics.gender} • {demographics.ethnicity} • <strong className="text-foreground">{demographics.primaryDiagnosis}</strong> ({demographics.stage})
              </p>
            </div>

            {/* SMART Launch Action Toolbar & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-0.5 bg-muted border border-border rounded-lg mr-2">
                <button
                  type="button"
                  onClick={() => setViewMode("orbit")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === "orbit"
                      ? "bg-primary text-white shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Orbit View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("tab")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === "tab"
                      ? "bg-primary text-white shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tab View
                </button>
              </div>

              <Button
                size="sm"
                onClick={() => triggerSmartLaunch("omics")}
                disabled={smartLaunching === "omics"}
                className="bg-primary hover:bg-[#4C59E6] text-white font-semibold text-xs h-8 shadow-subtle rounded-lg"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                {smartLaunching === "omics" ? "Launching Context..." : "SMART Launch: Multiomics"}
              </Button>

              <Button
                size="sm"
                onClick={() => triggerSmartLaunch("imaging")}
                disabled={smartLaunching === "imaging"}
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs h-8 shadow-subtle rounded-lg"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                {smartLaunching === "imaging" ? "Launching OHIF..." : "Launch Imaging (OHIF)"}
              </Button>
            </div>
          </div>

          {/* Dynamic Consent Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Dynamic Consent Active: </span>
                <span className="text-slate-700 dark:text-slate-300">Verified via OPA Policy Engine ({consent.lastVerified})</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/40">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Research Use
              </Badge>
              <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/40">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Biospecimens
              </Badge>
              <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/40">
                <CheckCircle2 className="w-3 h-3 mr-1" /> AI Training
              </Badge>
              <Badge variant="outline" className="border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/40">
                Commercial Sharing Restricted
              </Badge>
            </div>
          </div>

          {/* OMOP CDM Harmonization & Date-Shifting De-Identification Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">OMOP CDM v5.4 Schema Standardized: </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Person ID: <code className="text-sky-600 dark:text-sky-300 font-semibold">{demographics.person_id || "synthetic-omop-uuid-89421"}</code> • Date-Shift Offset: <code className="text-amber-600 dark:text-amber-300 font-semibold">{record.dateShiftOffsetDays > 0 ? `+${record.dateShiftOffsetDays}` : record.dateShiftOffsetDays} days</code> (Preserves Longitudinal Event Intervals)
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 text-[10px]">
              Vanderbilt SD Safe Harbor Method
            </Badge>
          </div>
        </div>

        {/* Render Patient Orbit View when in orbit mode */}
        {viewMode === "orbit" && (
          <PatientOrbitView
            patient={record}
            onSelectTab={(tabKey) => {
              setActiveTab(tabKey);
              setViewMode("tab");
            }}
          />
        )}

        {/* Tabbed Clinical Explorer */}
        <div className={viewMode === "orbit" ? "hidden" : "block space-y-4"}>
          {/* Back to Orbit View navigation bar */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Viewing Patient Detail Domain:</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase font-mono font-bold text-[10px]">
                {activeTab}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setViewMode("orbit")}
              className="h-8 px-3 text-xs font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Patient Orbit View</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 overflow-x-auto flex flex-wrap">
            <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 mr-1.5" /> Longitudinal Timeline
            </TabsTrigger>
            <TabsTrigger value="genomics" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Dna className="w-3.5 h-3.5 mr-1.5" /> Multiomics ({genomics.length})
            </TabsTrigger>
            <TabsTrigger value="imaging" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Imaging Studies ({imaging.length})
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> Labs & Biomarkers
            </TabsTrigger>
            <TabsTrigger value="infusions" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Pill className="w-3.5 h-3.5 mr-1.5" /> Meds & Infusions ({infusions.length})
            </TabsTrigger>
            <TabsTrigger value="biospecimens" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <FlaskConical className="w-3.5 h-3.5 mr-1.5" /> Biospecimen Lineage ({biospecimens.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> De-ID Notes ({notes.length})
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Home className="w-3.5 h-3.5 mr-1.5" /> Demographics & Social
            </TabsTrigger>
            <TabsTrigger value="response" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Treatment Response
            </TabsTrigger>
            <TabsTrigger value="recovery" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <HeartPulse className="w-3.5 h-3.5 mr-1.5" /> Recovery & Survivorship
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Longitudinal Timeline */}
          <TabsContent value="timeline" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-maroon" />
                  Longitudinal Patient Journey (Diagnosis → Treatment → Recurrence → Survival)
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Events chronologically mapped from Epic, Multiomics & PACS</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {timeline.map((evt) => (
                  <div key={evt.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 ${
                        evt.severity === "critical"
                          ? "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"
                          : evt.severity === "severe"
                          ? "bg-amber-500"
                          : "bg-sky-500"
                      }`}
                    />

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-semibold">{evt.date}</span>
                          <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                            {evt.category}
                          </Badge>
                          <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                            Spoke: {evt.sourceSpoke.toUpperCase()}
                          </Badge>
                        </div>
                        {evt.smartLaunchAvailable && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => triggerSmartLaunch(evt.type === "imaging" ? "imaging" : "omics")}
                            className="h-6 text-[10px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                          >
                            <Zap className="w-3 h-3 mr-1" /> SMART Launch
                          </Button>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{evt.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Multiomics Summary */}
          <TabsContent value="genomics" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Called Genomic Variants & BioCompute Provenance
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Written back from Multiomics Analysis Platform into FHIR MolecularSequence</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => triggerSmartLaunch("omics")}
                  className="bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white text-xs h-8"
                >
                  <Zap className="w-3.5 h-3.5 mr-1" /> Open Multiomics Workspace
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 uppercase text-[10px] font-mono border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Gene</th>
                      <th className="p-3">HGVS Variant</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">VAF %</th>
                      <th className="p-3">Pathogenicity</th>
                      <th className="p-3">Read Depth</th>
                      <th className="p-3">Pipeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {genomics.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white font-mono text-xs">{v.gene}</td>
                        <td className="p-3 font-mono text-sky-600 dark:text-sky-300 font-semibold">{v.hgvs}</td>
                        <td className="p-3">{v.variantType}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.vafPercent}%</td>
                        <td className="p-3">
                          <Badge
                            className={
                              v.pathogenicity === "Pathogenic"
                                ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800/60"
                                : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60"
                            }
                          >
                            {v.pathogenicity}
                          </Badge>
                        </td>
                        <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{v.readDepth}x</td>
                        <td className="p-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">{v.pipelineVersion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Imaging Studies */}
          <TabsContent value="imaging" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    Digital Radiology & Whole Slide Pathology Studies
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">DICOMweb QIDO/WADO indexed studies with integrated OHIF viewer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {imaging.map((img) => (
                  <div key={img.studyId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-sky-950 text-sky-300 border-sky-800">
                          {img.modality}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">{img.studyDate}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{img.bodyPart}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{img.findingsSummary}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500 font-mono">{img.instancesCount} instances</span>
                      <Button
                        size="sm"
                        onClick={() => triggerSmartLaunch("imaging")}
                        className="h-7 text-[11px] bg-sky-600 hover:bg-sky-700 text-white"
                      >
                        <Play className="w-3 h-3 mr-1" /> OHIF Viewer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: OMOP Measurements */}
          <TabsContent value="labs" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary dark:text-sky-400" />
                    OMOP Measurement Domain — LOINC Standardized Biomarkers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    Domain: Measurement • Vocabulary: LOINC v2.74 • Standardized Clinical Observation
                  </p>
                </div>
                <Badge variant="outline" className="border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 text-[10px] font-mono">
                  Ref Cutoff: &lt; 30.0 U/mL
                </Badge>
              </div>

              {/* Recharts Chart */}
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ca153Data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 80]} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="LOINC:17861-6 CA 15-3 (U/mL)" stroke="#0284c7" strokeWidth={3} dot={{ r: 5, fill: "#0284c7" }} />
                    <Line type="monotone" dataKey="cutoff" name="Normal Upper Limit" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* OMOP Measurement Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 uppercase text-[10px] font-mono border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">Date (Shifted)</th>
                      <th className="p-2.5">OMOP Concept ID & Label</th>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Unit Concept</th>
                      <th className="p-2.5">Ref Range</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {(record.measurements && record.measurements.length > 0 ? record.measurements : labs.map(l => ({
                      measurement_id: l.marker,
                      measurement_date: l.date,
                      measurement_concept_id: `LOINC: ${l.marker}`,
                      value_as_number: l.value,
                      unit_concept_id: l.unit,
                      range: l.referenceRange,
                      flag: l.status
                    }))).map((m: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono">
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">{m.measurement_date || m.date}</td>
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{m.measurement_concept_id || m.marker}</td>
                        <td className="p-2.5 font-bold text-sky-600 dark:text-sky-300">{m.value_as_number || m.value}</td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">{m.unit_concept_id || m.unit}</td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">{m.range_high ? `< ${m.range_high}` : m.referenceRange || "< 30.0 U/mL"}</td>
                        <td className="p-2.5">
                          <Badge
                            className={
                              (m.flag || m.status) === "Normal"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                                : (m.flag || m.status) === "High Risk"
                                ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 animate-pulse"
                                : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                            }
                          >
                            {m.flag || m.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 5: OMOP Drug Exposures */}
          <TabsContent value="infusions" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-primary dark:text-sky-400" />
                  OMOP DrugExposure Domain — RxNorm Standardized Regimens
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Domain: DrugExposure • Vocabulary: RxNorm v2024 • Chemotherapy & Immunotherapy Exposure
                </p>
              </div>

              <div className="space-y-3">
                {(record.drugExposures && record.drugExposures.length > 0 ? record.drugExposures : infusions.map(i => ({
                  drug_exposure_id: i.id,
                  drug_concept_id: i.drugName,
                  drug_exposure_start_date: i.startDate,
                  drug_exposure_end_date: i.endDate,
                  quantity: i.dose,
                  route: i.route,
                  cycle: i.cycle,
                  status: i.status
                }))).map((drug: any) => (
                  <div key={drug.drug_exposure_id || drug.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{drug.drug_concept_id || drug.drugName}</span>
                        <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{drug.quantity || drug.dose}</Badge>
                      </div>
                      <Badge className={drug.status === "Active" ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}>
                        {drug.status}
                      </Badge>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400">
                      Start Date (Shifted): <strong className="text-slate-700 dark:text-slate-300">{drug.drug_exposure_start_date || drug.startDate}</strong> {drug.drug_exposure_end_date ? `• End: ${drug.drug_exposure_end_date}` : ""} • {drug.cycle || ""} • {drug.route}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 6: Biospecimens */}
          <TabsContent value="biospecimens" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-brand-maroon" />
                Human Tissue Resource Center (HTRC) Biospecimen Lineage
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {biospecimens.map((spec) => (
                  <div key={spec.specimenId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-brand-maroon dark:text-rose-300 font-bold">{spec.specimenId}</span>
                      <Badge variant="outline" className="border-slate-300 dark:border-teal-500/30 text-slate-700 dark:text-teal-300 bg-slate-100 dark:bg-teal-950/40">
                        {spec.storageTemp}
                      </Badge>
                    </div>

                    <p className="font-bold text-slate-900 dark:text-white">{spec.type}</p>
                    <p className="text-slate-500 dark:text-slate-400">{spec.anatomicSite} • {spec.volume}</p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                      <span>LIMS: {spec.limsBarcode}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{spec.lineageStage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 7: OMOP Notes */}
          <TabsContent value="notes" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary dark:text-sky-400" />
                  OMOP Note Domain — NLP De-Identified Unstructured Text
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Domain: Note • Automated Identifier Scrubbing (nlp_scrubbed: true) • Safe Harbor Redactions
                </p>
              </div>

              <div className="space-y-3">
                {(record.omopNotes && record.omopNotes.length > 0 ? record.omopNotes : notes.map(n => ({
                  note_id: n.noteId,
                  note_date: n.date,
                  note_class: n.noteType === "Oncology Progress Note" ? "Progress Note" : "Radiology Impression",
                  note_text: n.deIdentifiedContent,
                  nlp_scrubbed: true,
                  safeHarborRedactionsCount: n.safeHarborRedactionsCount,
                  authorRole: n.authorRole
                }))).map((n: any) => (
                  <div key={n.note_id || n.noteId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{n.note_class || n.noteType} — {n.authorRole}</span>
                        <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]">
                          nlp_scrubbed: {String(n.nlp_scrubbed ?? true)}
                        </Badge>
                      </div>
                      <span className="text-slate-500 font-mono text-[10px]">{n.note_date || n.date}</span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{n.note_text || n.deIdentifiedContent}</p>

                    <div className="pt-2 text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Safe Harbor Scrubbed ({n.safeHarborRedactionsCount || 4} tokens redacted)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB: Demographics & Social Determinants of Health */}
          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-primary dark:text-sky-400" />
                  Demographics
                </h3>
                <dl className="grid grid-cols-2 gap-y-2.5 text-xs font-mono">
                  <dt className="text-slate-500 dark:text-slate-400">Age</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{demographics.age}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Sex</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{demographics.sex}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Race</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{demographics.race}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Ethnicity</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{demographics.ethnicity}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Preferred Language</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{record.socialDeterminants?.preferredLanguage || "English"}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Insurance Status</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{record.socialDeterminants?.insuranceStatus || "Unknown"}</dd>
                </dl>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary dark:text-sky-400" />
                  Social Determinants of Health
                </h3>
                <dl className="grid grid-cols-2 gap-y-2.5 text-xs font-mono">
                  <dt className="text-slate-500 dark:text-slate-400">Housing Stability</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{record.socialDeterminants?.housingStability || "Unknown"}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Transportation Access</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{record.socialDeterminants?.transportationAccess || "Unknown"}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Food Security</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{record.socialDeterminants?.foodSecurity || "Unknown"}</dd>
                  <dt className="text-slate-500 dark:text-slate-400">Employment Status</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold">{record.socialDeterminants?.employmentStatus || "Unknown"}</dd>
                  <dt className="text-slate-500 dark:text-slate-400 col-span-2">Support System</dt>
                  <dd className="text-slate-900 dark:text-white font-semibold col-span-2">{record.socialDeterminants?.supportSystem || "Unknown"}</dd>
                </dl>
              </div>
            </div>
          </TabsContent>

          {/* TAB: Treatment Response */}
          <TabsContent value="response" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary dark:text-sky-400" />
                Treatment Response Assessments
              </h3>
              <div className="space-y-3">
                {(record.treatmentResponses || []).map((tr) => (
                  <div key={tr.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{tr.treatmentName}</span>
                      <Badge
                        className={
                          tr.responseCategory === "Complete Response"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                            : tr.responseCategory === "Partial Response"
                            ? "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800"
                            : tr.responseCategory === "Progressive Disease"
                            ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                        }
                      >
                        {tr.responseCategory}
                      </Badge>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                      {tr.date} • Assessed via {tr.assessmentMethod}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">{tr.notes}</p>
                  </div>
                ))}
                {(!record.treatmentResponses || record.treatmentResponses.length === 0) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No treatment response assessments recorded yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB: Recovery & Survivorship */}
          <TabsContent value="recovery" className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-primary dark:text-sky-400" />
                Recovery & Survivorship Status
              </h3>
              {record.recovery ? (
                <>
                  <dl className="grid grid-cols-2 gap-y-2.5 text-xs font-mono">
                    <dt className="text-slate-500 dark:text-slate-400">Survivorship Phase</dt>
                    <dd className="text-slate-900 dark:text-white font-semibold">{record.recovery.survivorshipPhase}</dd>
                    <dt className="text-slate-500 dark:text-slate-400">Functional Status</dt>
                    <dd className="text-slate-900 dark:text-white font-semibold">{record.recovery.functionalStatus} ({record.recovery.functionalStatusScale})</dd>
                    <dt className="text-slate-500 dark:text-slate-400">Last Assessment</dt>
                    <dd className="text-slate-900 dark:text-white font-semibold">{record.recovery.lastAssessmentDate}</dd>
                    <dt className="text-slate-500 dark:text-slate-400 col-span-2">Follow-Up Schedule</dt>
                    <dd className="text-slate-700 dark:text-slate-300 col-span-2 font-sans">{record.recovery.followUpSchedule}</dd>
                  </dl>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">Late Effects Monitoring</p>
                    <ul className="space-y-1.5">
                      {record.recovery.lateEffectsMonitoring.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">No survivorship data recorded yet.</p>
              )}
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* SMART Launch Multiomics & Imaging Frame Modal */}
      <SmartLaunchModal
        isOpen={smartModalOpen}
        onClose={() => setSmartModalOpen(false)}
        patientId={demographics?.id || patientId}
        platformName={smartPlatform === "omics" ? "PhoenixMO Multiomics Platform" : "OHIF DICOMweb Imaging Viewer"}
        targetUrl={smartTargetUrl}
      />
    </Layout>
  );
}
