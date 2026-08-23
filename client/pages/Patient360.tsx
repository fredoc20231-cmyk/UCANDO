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
        <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
          Loading Clinician Patient 360 record...
        </div>
      </Layout>
    );
  }

  const { demographics, consent, timeline, genomics, imaging, labs, infusions, biospecimens, notes } = record;

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
                <Badge className="bg-accent/15 text-accent border-accent/30 font-semibold text-xs rounded-full font-mono">
                  {demographics.consentStatus} Patient
                </Badge>
                <span className="font-mono text-xs text-primary font-semibold">MRN: {demographics.mrn}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-xs text-accent font-semibold">Tokenized ID: {demographics.deIdentifiedId}</span>
              </div>

              <h1 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Patient 360: {demographics.id}
              </h1>

              <p className="text-xs text-muted-foreground font-sans">
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
                      ? "bg-card text-foreground shadow-subtle"
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
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tab View
                </button>
              </div>

              <Link to="/workspace">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10 font-semibold text-xs h-8"
                >
                  <Dna className="w-3.5 h-3.5 mr-1.5" />
                  RNA-seq Platform
                </Button>
              </Link>

              <Button
                size="sm"
                onClick={() => triggerSmartLaunch("omics")}
                disabled={smartLaunching === "omics"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 shadow-subtle rounded-lg"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                {smartLaunching === "omics" ? "Launching Context..." : "SMART Multiomics"}
              </Button>

              <Button
                size="sm"
                onClick={() => triggerSmartLaunch("imaging")}
                disabled={smartLaunching === "imaging"}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs h-8 shadow-subtle rounded-lg"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                {smartLaunching === "imaging" ? "Launching OHIF..." : "Imaging (OHIF)"}
              </Button>
            </div>
          </div>

          {/* Dynamic Consent Banner */}
          <div className="p-3.5 rounded-xl bg-surface border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="font-semibold text-foreground">Dynamic Consent Active: </span>
                <span className="text-muted-foreground">Verified via OPA Policy Engine ({consent.lastVerified})</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Research Use
              </Badge>
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Biospecimens
              </Badge>
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono">
                <CheckCircle2 className="w-3 h-3 mr-1" /> AI Training
              </Badge>
              <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/10 font-mono">
                Commercial Sharing Restricted
              </Badge>
            </div>
          </div>

          {/* OMOP CDM Harmonization & Date-Shifting De-Identification Banner */}
          <div className="p-3.5 rounded-xl bg-surface border border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="font-bold text-foreground">OMOP CDM v5.4 Schema Standardized: </span>
                <span className="text-muted-foreground">
                  Person ID: <code className="text-primary font-semibold">{demographics.person_id || "synthetic-omop-uuid-89421"}</code> • Date-Shift Offset: <code className="text-accent font-semibold">{record.dateShiftOffsetDays > 0 ? `+${record.dateShiftOffsetDays}` : record.dateShiftOffsetDays} days</code> (Preserves Longitudinal Event Intervals)
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
              Vanderbilt SD Safe Harbor
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
          <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between shadow-subtle">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground">Viewing Patient Detail Domain:</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase font-mono font-bold text-[10px]">
                {activeTab}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setViewMode("orbit")}
              className="h-8 px-3 text-xs font-bold border-border text-foreground hover:bg-muted transition-all shadow-subtle flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Patient Orbit View</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-muted border border-border p-1 overflow-x-auto flex flex-wrap">
              <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-accent" /> Longitudinal Timeline
              </TabsTrigger>
              <TabsTrigger value="genomics" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <Dna className="w-3.5 h-3.5 mr-1.5 text-primary" /> Multiomics ({genomics.length})
              </TabsTrigger>
              <TabsTrigger value="imaging" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-accent" /> Imaging Studies ({imaging.length})
              </TabsTrigger>
              <TabsTrigger value="labs" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-primary" /> Labs & Biomarkers
              </TabsTrigger>
              <TabsTrigger value="infusions" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <Pill className="w-3.5 h-3.5 mr-1.5 text-accent" /> Meds & Infusions ({infusions.length})
              </TabsTrigger>
              <TabsTrigger value="biospecimens" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-primary" /> Biospecimen Lineage ({biospecimens.length})
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-accent" /> De-ID Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="response" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-primary" /> Treatment Response
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Longitudinal Timeline */}
            <TabsContent value="timeline" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Longitudinal Patient Journey (Diagnosis → Treatment → Recurrence → Survival)
                  </h3>
                  <span className="text-[11px] text-muted-foreground">Mapped from Epic EHR, Multiomics & PACS</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {timeline.map((evt) => (
                    <div key={evt.id} className="relative group">
                      <div
                        className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-card ${
                          evt.severity === "critical"
                            ? "bg-destructive animate-pulse"
                            : evt.severity === "severe"
                            ? "bg-amber-600"
                            : "bg-accent"
                        }`}
                      />

                      <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5 hover:border-accent/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-accent font-semibold">{evt.date}</span>
                            <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                              {evt.category}
                            </Badge>
                            <Badge className="bg-muted text-muted-foreground text-[10px] font-mono">
                              Spoke: {evt.sourceSpoke.toUpperCase()}
                            </Badge>
                          </div>
                          <Badge
                            className={
                              evt.severity === "critical"
                                ? "bg-destructive/15 text-destructive border-destructive/30 text-[10px]"
                                : evt.severity === "severe"
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]"
                                : "bg-accent/15 text-accent border-accent/30 text-[10px]"
                            }
                          >
                            {evt.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-foreground text-sm font-serif">{evt.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans">{evt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Multiomics Summary */}
            <TabsContent value="genomics" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                      <Dna className="w-4 h-4 text-primary" />
                      Called Genomic Variants & BioCompute Provenance
                    </h3>
                    <p className="text-xs text-muted-foreground">Written back from Multiomics Analysis Platform into FHIR MolecularSequence</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/workspace">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-border text-foreground hover:bg-muted"
                      >
                        <Dna className="w-3.5 h-3.5 mr-1 text-accent" /> RNA-seq Workspace
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => triggerSmartLaunch("omics")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 shadow-subtle font-semibold"
                    >
                      <Zap className="w-3.5 h-3.5 mr-1" /> Open UC-MOP Workspace
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface text-muted-foreground uppercase text-[10px] font-mono border-b border-border">
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
                    <tbody className="divide-y divide-border font-mono">
                      {genomics.map((v) => (
                        <tr key={v.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3 font-bold text-primary font-mono text-xs">{v.gene}</td>
                          <td className="p-3 font-mono text-accent font-semibold">{v.hgvs}</td>
                          <td className="p-3 text-muted-foreground">{v.variantType}</td>
                          <td className="p-3 font-mono font-bold text-accent tabular-nums">{v.vafPercent}%</td>
                          <td className="p-3">
                            <Badge
                              className={
                                v.pathogenicity === "Pathogenic"
                                  ? "bg-primary/15 text-primary border-primary/30 text-[10px]"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]"
                              }
                            >
                              {v.pathogenicity}
                            </Badge>
                          </td>
                          <td className="p-3 font-mono text-muted-foreground tabular-nums">{v.readDepth}x</td>
                          <td className="p-3 font-mono text-[10px] text-muted-foreground">{v.pipelineVersion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Imaging Studies */}
            <TabsContent value="imaging" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-accent" />
                      Digital Radiology & Whole Slide Pathology Studies
                    </h3>
                    <p className="text-xs text-muted-foreground">DICOMweb QIDO/WADO indexed studies with integrated OHIF viewer</p>
                  </div>
                  <Link to="/imaging-hub">
                    <Button size="sm" variant="outline" className="text-xs border-border text-foreground hover:bg-muted">
                      <ImageIcon className="w-3.5 h-3.5 mr-1 text-accent" /> Open Imaging Hub
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {imaging.map((img) => (
                    <div key={img.studyId} className="p-4 rounded-xl bg-surface border border-border space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-accent/15 text-accent border-accent/30 font-mono text-[10px]">
                            {img.modality}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">{img.studyDate}</span>
                        </div>
                        <h4 className="font-bold text-xs text-foreground font-serif">{img.bodyPart}</h4>
                        <p className="text-[11px] text-muted-foreground leading-snug">{img.findingsSummary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: OMOP Measurements */}
            <TabsContent value="labs" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div>
                  <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    OMOP Measurement Domain — LOINC Standardized Biomarkers
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    Domain: Measurement • Vocabulary: LOINC v2.74 • Standardized Longitudinal Biomarkers
                  </p>
                </div>

                {/* CA 15-3 Trend Chart */}
                {ca153Data.length > 0 && (
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground font-serif">CA 15-3 Tumor Marker Kinetic Trajectory (U/mL)</span>
                      <span className="text-[10px] font-mono text-muted-foreground">Normal Upper Limit: &lt; 30.0 U/mL</span>
                    </div>
                    <div className="h-44 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ca153Data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={10} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={[0, 150]} />
                          <RechartsTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", fontSize: "11px", color: "var(--foreground)" }} />
                          <Line type="monotone" dataKey="value" stroke="#7D1B2D" strokeWidth={2.5} dot={{ r: 4, fill: "#7D1B2D" }} name="CA 15-3 Value" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 5: OMOP Drug Exposures */}
            <TabsContent value="infusions" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div>
                  <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                    <Pill className="w-4 h-4 text-accent" />
                    OMOP DrugExposure Domain — RxNorm Standardized Regimens
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    Domain: DrugExposure • Vocabulary: RxNorm v2024 • Chemotherapy & Immunotherapy Exposure
                  </p>
                </div>

                <div className="space-y-3">
                  {infusions.map((i) => (
                    <div key={i.id} className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-1.5 font-mono">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm font-serif">{i.drugName}</span>
                          <Badge variant="outline" className="border-border text-muted-foreground">{i.dose}</Badge>
                        </div>
                        <Badge className={i.status === "Active" ? "bg-accent/15 text-accent border-accent/30" : "bg-muted text-muted-foreground"}>
                          {i.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground font-sans">
                        Start Date: <strong className="text-foreground">{i.startDate}</strong> {i.endDate ? `• End: ${i.endDate}` : ""} • {i.cycle || ""} • {i.route}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 6: Biospecimens */}
            <TabsContent value="biospecimens" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  Human Tissue Resource Center (HTRC) Biospecimen Lineage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {biospecimens.map((spec) => (
                    <div key={spec.specimenId} className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-primary font-bold">{spec.specimenId}</span>
                        <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                          {spec.storageTemp}
                        </Badge>
                      </div>

                      <p className="font-bold text-foreground font-serif">{spec.type}</p>
                      <p className="text-muted-foreground">{spec.anatomicSite} • {spec.volume}</p>
                      <div className="pt-2 border-t border-border text-[11px] text-muted-foreground flex justify-between font-mono">
                        <span>LIMS: {spec.limsBarcode}</span>
                        <span className="text-accent font-semibold">{spec.lineageStage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 7: Notes */}
            <TabsContent value="notes" className="space-y-4">
              <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div>
                  <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    OMOP Note Domain — NLP De-Identified Unstructured Text
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    Domain: Note • Automated Identifier Scrubbing (nlp_scrubbed: true) • Safe Harbor Redactions
                  </p>
                </div>

                <div className="space-y-3">
                  {notes.map((n) => (
                    <div key={n.noteId} className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground font-serif text-sm">{n.noteType}</span>
                        <span className="font-mono text-muted-foreground text-[10px]">{n.date} • {n.authorRole}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed font-sans">{n.deIdentifiedContent}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* SMART Launch Multiomics & Imaging Frame Modal */}
        <SmartLaunchModal
          isOpen={smartModalOpen}
          onClose={() => setSmartModalOpen(false)}
          platformName={smartPlatform === "omics" ? "PhoenixMO Multiomics Platform" : "OHIF Digital Imaging Viewer"}
          patientId={demographics?.id || patientId}
          targetUrl={smartTargetUrl}
        />
      </div>
    </Layout>
  );
}
