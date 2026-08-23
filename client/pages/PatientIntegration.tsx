import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { PATIENT_CATALOG, PatientProfile } from "@/data/patientIntegrationData";
import { IucadoOrbitFrameModal } from "@/components/IucadoOrbitFrameModal";
import {
  Users,
  Stethoscope,
  Activity,
  Pill,
  Clock,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sliders,
  Dna,
  FileText,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Layers,
  HeartPulse,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { toast } from "sonner";

export type TargetAnalysisMode =
  | "treatment"
  | "outcomes"
  | "past_treatments"
  | "future_treatment"
  | "survival_prediction"
  | "evidence_synthesis";

export default function PatientIntegration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPatientId = searchParams.get("id") || PATIENT_CATALOG[0].id;

  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);
  const [analysisMode, setAnalysisMode] = useState<TargetAnalysisMode>("treatment");
  const [isOrbitModalOpen, setIsOrbitModalOpen] = useState<boolean>(false);

  const currentPatient: PatientProfile =
    PATIENT_CATALOG.find((p) => p.id === selectedPatientId) || PATIENT_CATALOG[0];

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSearchParams({ id: patientId });
    toast.info(`Switched to Patient: ${patientId}`);
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
              <Link to="/patient-360" className="hover:text-primary transition-colors">
                Patient 360 Orbit
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary font-semibold">Patient Integration</span>
            </div>
            <h1 className="font-serif font-bold text-2xl text-foreground flex items-center gap-2.5">
              <Stethoscope className="w-6 h-6 text-primary" />
              <span>Patient Integration & Multi-Modal Clinical Analytics</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Longitudinal treatment tracking, RECIST outcomes, survival modeling, and evidence-grounded decision support
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Open iUCADO-Orbit Button */}
            <Button
              onClick={() => setIsOrbitModalOpen(true)}
              className="h-9 px-3.5 text-xs bg-primary text-primary-foreground font-medium shadow-subtle gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>Launch iUCADO-Orbit Frame</span>
            </Button>

            <Link to={`/patient-360?id=${currentPatient.id}`}>
              <Button variant="outline" size="sm" className="h-9 text-xs border-border gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Patient 360 Orbit View</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Two-Pane Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (4 cols): Patient Selector & Clinical Profile */}
          <div className="lg:col-span-4 space-y-4">
            {/* 1. Patient Selector Card */}
            <div className="p-4 rounded-xl bg-card border border-border shadow-subtle space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Select Patient Record:
              </label>
              <Select value={selectedPatientId} onValueChange={handlePatientChange}>
                <SelectTrigger className="w-full text-xs font-medium bg-surface border-border h-10">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent className="text-xs font-sans">
                  {PATIENT_CATALOG.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="cursor-pointer py-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {p.id} • {p.cancerType}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {p.stage} • Age {p.age} • {p.gender}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Patient Demographics & Molecular Profile Card */}
            <div className="p-4 rounded-xl bg-card border border-border shadow-subtle space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block">{currentPatient.deIdentifiedId}</span>
                  <h3 className="font-serif font-bold text-base text-foreground">{currentPatient.id}</h3>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
                  {currentPatient.stage}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-surface border border-border/80">
                  <span className="text-muted-foreground block">Age / Gender:</span>
                  <span className="font-bold text-foreground">{currentPatient.age}yo {currentPatient.gender}</span>
                </div>
                <div className="p-2 rounded bg-surface border border-border/80">
                  <span className="text-muted-foreground block">ECOG Performance:</span>
                  <span className="font-bold text-foreground">Score {currentPatient.ecogScore} (Ambulatory)</span>
                </div>
                <div className="p-2 rounded bg-surface border border-border/80">
                  <span className="text-muted-foreground block">TMB Burden:</span>
                  <span className="font-bold text-accent font-mono">{currentPatient.tmb}</span>
                </div>
                <div className="p-2 rounded bg-surface border border-border/80">
                  <span className="text-muted-foreground block">MSI Status:</span>
                  <span className="font-bold text-foreground font-mono">{currentPatient.msiStatus}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-muted-foreground block mb-1">Pathology & Histology:</span>
                <p className="text-foreground text-[11px] bg-surface p-2 rounded border border-border/80">
                  {currentPatient.histology}
                </p>
              </div>

              {/* Biomarker Badges */}
              <div className="space-y-1.5">
                <span className="font-semibold text-muted-foreground block">Pathogenic & Targetable Biomarkers:</span>
                <div className="space-y-1.5">
                  {currentPatient.biomarkers.map((b, i) => (
                    <div key={i} className="p-2 rounded-lg bg-surface/80 border border-border flex items-center justify-between">
                      <div>
                        <span className="font-bold text-primary block text-[11px] font-mono">{b.name}</span>
                        <span className="text-[10px] text-muted-foreground">{b.value}</span>
                      </div>
                      {b.targetable && (
                        <Badge variant="outline" className="text-[9px] font-mono border-accent/40 text-accent">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Target Analysis Selector Navigation Menu */}
            <div className="p-3 rounded-xl bg-card border border-border shadow-subtle space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 block">
                Target Analysis Modes:
              </span>

              <button
                onClick={() => setAnalysisMode("treatment")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisMode === "treatment"
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  <span>1. Treatment & Active Regimen</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setAnalysisMode("outcomes")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisMode === "outcomes"
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>2. Outcomes & Longitudinal Response</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setAnalysisMode("past_treatments")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisMode === "past_treatments"
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>3. Past Treatments & Lines</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setAnalysisMode("future_treatment")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisMode === "future_treatment"
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>4. Future Expected Treatment & CDS</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setAnalysisMode("survival_prediction")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisMode === "survival_prediction"
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>5. Anticipated Outcomes & Survival</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setAnalysisMode("evidence_synthesis")}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisMode === "evidence_synthesis"
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>6. iUCADO-Orbit Evidence Synthesis</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>

          {/* Right Column (8 cols): Interactive Target Analysis Workbench */}
          <div className="lg:col-span-8 space-y-4">
            {/* Mode 1: Treatment & Regimen */}
            {analysisMode === "treatment" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      Active Regimen & Drug Administration
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Prescribed oncology regimen, cycle schedule, and toxicity monitoring
                    </p>
                  </div>
                  <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-xs">
                    {currentPatient.currentRegimen.intent}
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{currentPatient.currentRegimen.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">{currentPatient.currentRegimen.line}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 text-muted-foreground">
                    <div><span className="font-semibold text-foreground">Cycle Status:</span> {currentPatient.currentRegimen.cycle}</div>
                    <div><span className="font-semibold text-foreground">Schedule:</span> {currentPatient.currentRegimen.schedule}</div>
                    <div><span className="font-semibold text-foreground">Started:</span> {currentPatient.currentRegimen.startDate}</div>
                  </div>
                </div>

                {/* Drugs Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Regimen Components & Mechanisms:
                  </h3>
                  <div className="overflow-x-auto border border-border rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-surface text-muted-foreground font-mono uppercase text-[10px] border-b border-border">
                        <tr>
                          <th className="py-2.5 px-3">Agent</th>
                          <th className="py-2.5 px-3">Dose & Route</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Molecular Target</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-sans">
                        {currentPatient.currentRegimen.drugs.map((drug, i) => (
                          <tr key={i} className="hover:bg-muted/40 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-foreground">{drug.name}</td>
                            <td className="py-2.5 px-3 font-mono text-muted-foreground">{drug.dose} ({drug.route})</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{drug.frequency}</td>
                            <td className="py-2.5 px-3 font-mono text-primary font-semibold">{drug.target}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Toxicity & Adverse Event Tracker */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    CTCAE v5.0 Toxicity & Adverse Event Management:
                  </h3>
                  <div className="space-y-2">
                    {currentPatient.currentRegimen.toxicities.map((tox, i) => (
                      <div key={i} className="p-3 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{tox.event}</span>
                            <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">
                              Grade {tox.grade}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-mono">({tox.ctcaeCategory})</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{tox.management}</p>
                        </div>
                        <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] shrink-0 font-mono">
                          Managed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Outcomes & Response */}
            {analysisMode === "outcomes" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Activity className="w-5 h-5 text-accent" />
                      RECIST 1.1 Outcomes & Longitudinal Kinetics
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Tumor burden response, serum biomarkers, and progression-free duration
                    </p>
                  </div>
                  <Badge className="bg-accent/15 text-accent border-accent/30 font-mono text-xs">
                    {currentPatient.outcomesResponse.recistResponse}
                  </Badge>
                </div>

                {/* Response Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">RECIST Change:</span>
                    <span className="text-lg font-bold font-mono text-accent">
                      {currentPatient.outcomesResponse.targetLesionChangePercent > 0 ? "+" : ""}
                      {currentPatient.outcomesResponse.targetLesionChangePercent}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">Target Lesion Sum:</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {currentPatient.outcomesResponse.currentSumDiameterMm} mm
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      (from {currentPatient.outcomesResponse.baselineSumDiameterMm} mm)
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">Duration of Response:</span>
                    <span className="text-lg font-bold font-mono text-primary">
                      {currentPatient.outcomesResponse.durationOfResponseMonths} mos
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">PFS to Date:</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {currentPatient.outcomesResponse.pfsMonthsToDate} mos
                    </span>
                  </div>
                </div>

                {/* Biomarker Kinetic Chart */}
                <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-foreground">
                        {currentPatient.outcomesResponse.biomarkerTracking.name}
                      </h3>
                      <span className="text-[11px] text-muted-foreground">
                        Normal threshold: &lt; {currentPatient.outcomesResponse.biomarkerTracking.normalThreshold} {currentPatient.outcomesResponse.biomarkerTracking.unit}
                      </span>
                    </div>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={currentPatient.outcomesResponse.biomarkerTracking.series}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--foreground)" }} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--foreground)" }} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const dataPoint = payload[0].payload;
                              return (
                                <div className="p-2.5 rounded-lg bg-card border border-border shadow-elevated text-xs font-sans">
                                  <div className="font-bold text-foreground">{label}</div>
                                  <div className="text-accent font-mono font-bold">
                                    {dataPoint.value} {currentPatient.outcomesResponse.biomarkerTracking.unit}
                                  </div>
                                  {dataPoint.event && (
                                    <div className="text-[11px] text-muted-foreground mt-0.5">{dataPoint.event}</div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <ReferenceLine
                          y={currentPatient.outcomesResponse.biomarkerTracking.normalThreshold}
                          stroke="#157F8F"
                          strokeDasharray="4 4"
                          label={{ value: "Normal Limit", fill: "#157F8F", fontSize: 10, position: "insideTopRight" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#7D1B2D"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#7D1B2D" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radiologic Evaluations Log */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Radiology & Imaging Assessment Timeline:
                  </h3>
                  <div className="space-y-2">
                    {currentPatient.outcomesResponse.radiologicEvaluations.map((rad, i) => (
                      <div key={i} className="p-3 rounded-lg bg-surface border border-border space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground font-mono">{rad.date} • {rad.modality}</span>
                          <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
                            {rad.recistAssessment}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{rad.findings}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Past Treatments */}
            {analysisMode === "past_treatments" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Prior Systemic Lines, Surgeries & Radiotherapy
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Complete history of previous lines, interventions, and discontinuation rationale
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-border">
                    {currentPatient.pastTreatments.length} Prior Interventions
                  </Badge>
                </div>

                <div className="space-y-4">
                  {currentPatient.pastTreatments.map((past, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface border border-border space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-primary block uppercase">{past.line}</span>
                          <h3 className="font-bold text-sm text-foreground">{past.treatmentName}</h3>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
                          {past.category}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground text-[11px]">
                        <div><span className="font-semibold text-foreground">Timeline:</span> {past.startDate} to {past.endDate}</div>
                        <div><span className="font-semibold text-foreground">Duration:</span> {past.duration}</div>
                        <div><span className="font-semibold text-foreground">Best Response:</span> <span className="font-bold text-accent">{past.bestResponse}</span></div>
                      </div>

                      <div className="p-2.5 rounded bg-card border border-border/60 text-[11px]">
                        <span className="font-semibold text-foreground block mb-0.5">Clinical Summary & Discontinuation Reason:</span>
                        <p className="text-muted-foreground">{past.details} ({past.discontinuationReason})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 4: Future Expected Treatment & Clinical Decision Support */}
            {analysisMode === "future_treatment" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Future Expected Treatments & Decision Support
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Molecular Tumor Board AI recommendations ranked by NCCN evidence category
                    </p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                    NCCN Grounded
                  </Badge>
                </div>

                <div className="space-y-4">
                  {currentPatient.futureExpectedTreatments.map((fut, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface border border-border space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                            #{fut.priorityRank}
                          </span>
                          <div>
                            <h3 className="font-bold text-sm text-foreground">{fut.regimenName}</h3>
                            <span className="text-[11px] text-muted-foreground">{fut.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
                            {fut.nccnConcordance}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-mono border-accent/40 text-accent">
                            {fut.fdaStatus}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-foreground leading-relaxed bg-card p-3 rounded-lg border border-border/60">
                        {fut.rationale}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-card border border-border/60">
                          <span className="text-muted-foreground block">Expected ORR / Benefit:</span>
                          <span className="font-bold text-accent font-mono">{fut.expectedResponseRate}</span>
                        </div>
                        <div className="p-2 rounded bg-card border border-border/60">
                          <span className="text-muted-foreground block">Projected Median PFS:</span>
                          <span className="font-bold text-primary font-mono">{fut.medianPfsExpected}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-muted-foreground">Actionable Biomarkers:</span>
                          {fut.matchingBiomarkers.map((bm, j) => (
                            <Badge key={j} variant="outline" className="font-mono text-[10px] border-border bg-card">
                              {bm}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsOrbitModalOpen(true);
                          }}
                          className="h-7 text-xs text-accent hover:text-accent font-medium gap-1"
                        >
                          <span>Synthesize Literature</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 5: Anticipated Outcomes & Survival Prediction */}
            {analysisMode === "survival_prediction" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Anticipated Outcomes & Multi-Modal Survival Prediction
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      DeepSurv Cox Proportional Hazards Model fusing Genomics, Transcriptomics, and Radiomics
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
                    Risk Category: {currentPatient.survivalPredictions.riskCategory}
                  </Badge>
                </div>

                {/* Survival Probabilities Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">1-Year Overall Survival:</span>
                    <span className="text-lg font-bold font-mono text-accent">
                      {currentPatient.survivalPredictions.estimatedOs.oneYear}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">3-Year Overall Survival:</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {currentPatient.survivalPredictions.estimatedOs.threeYear}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">5-Year Overall Survival:</span>
                    <span className="text-lg font-bold font-mono text-primary">
                      {currentPatient.survivalPredictions.estimatedOs.fiveYear}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">Expected Median OS:</span>
                    <span className="text-lg font-bold font-mono text-foreground">
                      {currentPatient.survivalPredictions.estimatedOs.medianMonths} mos
                    </span>
                  </div>
                </div>

                {/* Counterfactual Regimen Modeling */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Counterfactual Regimen Simulation & Survival Gains:
                  </h3>
                  <div className="space-y-3">
                    {currentPatient.survivalPredictions.counterfactualRegimens.map((cf, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-surface border border-border space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{cf.regimen}</span>
                          <Badge variant="outline" className="font-mono text-[10px] text-accent border-accent/40">
                            HR vs SOC: {cf.hazardRatioVsSoc}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                          <div><span className="font-semibold text-foreground">Projected Median OS:</span> <span className="font-mono font-bold text-primary">{cf.projectedMedianOsMonths} mos</span></div>
                          <div><span className="font-semibold text-foreground">Projected Median PFS:</span> <span className="font-mono font-bold text-accent">{cf.projectedMedianPfsMonths} mos</span></div>
                          <div><span className="font-semibold text-foreground">PFS Gain vs Baseline:</span> <span className="font-mono font-bold text-accent">+{cf.pfsGainMonths} mos</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multi-Modal Feature Impact Weights */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Fused Multi-Modal Covariates & Risk Attribution:
                  </h3>
                  <div className="space-y-1.5">
                    {currentPatient.survivalPredictions.riskFactors.map((rf, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground">{rf.factor}</span>
                          <p className="text-[11px] text-muted-foreground">{rf.annotation}</p>
                        </div>
                        <Badge
                          className={`font-mono text-[10px] ${
                            rf.impact === "protective"
                              ? "bg-accent/15 text-accent border-accent/30"
                              : "bg-destructive/15 text-destructive border-destructive/30"
                          }`}
                        >
                          {rf.impact === "protective" ? "Protective (" : "Adverse ("}
                          {rf.weight > 0 ? "+" : ""}{rf.weight})
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 6: Evidence Synthesis & iUCADO-Orbit Direct */}
            {analysisMode === "evidence_synthesis" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      iUCADO-Orbit Patient Evidence Synthesis
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Evidence reasoning generated for {currentPatient.cancerType} ({currentPatient.stage})
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsOrbitModalOpen(true)}
                    className="h-8 text-xs bg-primary text-primary-foreground font-medium gap-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Frame</span>
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary font-serif text-sm">
                      Clinical Question for {currentPatient.id}:
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
                      Level 1B Evidence
                    </Badge>
                  </div>
                  <p className="text-foreground leading-relaxed bg-card p-3 rounded-lg border border-border/80">
                    What is the optimal evidence-based sequencing for a {currentPatient.age}yo patient with {currentPatient.cancerType} ({currentPatient.stage}) harboring {currentPatient.biomarkers[0]?.name} following standard first-line therapy?
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      onClick={() => setIsOrbitModalOpen(true)}
                      className="text-xs bg-primary text-primary-foreground font-medium h-8 gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span>Launch Full iUCADO-Orbit Consensus Engine</span>
                    </Button>
                    <Link to="/workspace">
                      <Button variant="outline" className="text-xs h-8 border-border">
                        Explore in RNA-seq Workspace
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expandable iUCADO-Orbit Frame Modal */}
        <IucadoOrbitFrameModal
          isOpen={isOrbitModalOpen}
          onClose={() => setIsOrbitModalOpen(false)}
          initialQuery={`Optimal targeted therapy and antibody-drug conjugate sequencing for ${currentPatient.cancerType} (${currentPatient.stage}) harboring ${currentPatient.biomarkers[0]?.name}`}
        />
      </div>
    </Layout>
  );
}
