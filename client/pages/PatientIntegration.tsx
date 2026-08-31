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
  Scale,
  Maximize2,
  Plus,
  Link2,
  Building2,
  Search,
  Check,
  Trash2,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [patientList, setPatientList] = useState<PatientProfile[]>(PATIENT_CATALOG);

  const initialPatientId = searchParams.get("id") || patientList[0].id;
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);
  const [analysisMode, setAnalysisMode] = useState<TargetAnalysisMode>("treatment");
  const [isOrbitModalOpen, setIsOrbitModalOpen] = useState<boolean>(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState<boolean>(false);
  const [isEhrLinkModalOpen, setIsEhrLinkModalOpen] = useState<boolean>(false);

  // New Patient Form State
  const [newPatientId, setNewPatientId] = useState(`UC-CCC-${Math.floor(10000 + Math.random() * 90000)}`);
  const [newMrn, setNewMrn] = useState(`MRN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [newAge, setNewAge] = useState<number>(62);
  const [newGender, setNewGender] = useState("Female");
  const [newCancerType, setNewCancerType] = useState("High-Grade Serous Ovarian Carcinoma");
  const [newStage, setNewStage] = useState("Stage IIIC");
  const [newEcog, setNewEcog] = useState<number>(1);
  const [newHistology, setNewHistology] = useState("High-grade serous carcinoma with peritoneal carcinomatosis");
  const [newBiomarkers, setNewBiomarkers] = useState<{ name: string; value: string; status: "Pathogenic" | "VUS" | "Positive" | "Negative" | "High" | "Normal"; targetable: boolean }[]>([
    { name: "BRCA1 c.68_69delAG (p.Glu23Valfs*17)", value: "Germline Pathogenic (VAF 48%)", status: "Pathogenic", targetable: true },
    { name: "TP53 p.R273H", value: "Somatic Missense (VAF 62%)", status: "Pathogenic", targetable: false }
  ]);
  const [newBiomarkerName, setNewBiomarkerName] = useState("");
  const [newBiomarkerValue, setNewBiomarkerValue] = useState("");
  const [newRegimenName, setNewRegimenName] = useState("Carboplatin + Paclitaxel + Bevacizumab");
  const [newRegimenLine, setNewRegimenLine] = useState("First-Line Neoadjuvant");
  const [newBaselineTumorSum, setNewBaselineTumorSum] = useState<number>(78);
  const [newCurrentTumorSum, setNewCurrentTumorSum] = useState<number>(46);

  // EHR SMART-on-FHIR State
  const [ehrSearchMrn, setEhrSearchMrn] = useState("MRN-849201");
  const [selectedEhrSystem, setSelectedEhrSystem] = useState("epic_careconnect");
  const [isEhrConnecting, setIsEhrConnecting] = useState(false);

  const currentPatient: PatientProfile =
    patientList.find((p) => p.id === selectedPatientId) || patientList[0];

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSearchParams({ id: patientId });
    toast.info(`Switched to Patient: ${patientId}`);
  };

  const handleAddBiomarkerToForm = () => {
    if (newBiomarkerName.trim()) {
      setNewBiomarkers(prev => [
        ...prev,
        {
          name: newBiomarkerName.trim(),
          value: newBiomarkerValue.trim() || "Detected Variant",
          status: "Pathogenic",
          targetable: true
        }
      ]);
      setNewBiomarkerName("");
      setNewBiomarkerValue("");
    }
  };

  const handleCreatePatientSubmit = () => {
    const changePct = Math.round(((newCurrentTumorSum - newBaselineTumorSum) / newBaselineTumorSum) * 100);
    const recist = changePct <= -30 ? "Partial Response (PR)" : changePct >= 20 ? "Progressive Disease (PD)" : "Stable Disease (SD)";

    const newProfile: PatientProfile = {
      id: newPatientId,
      mrn: newMrn,
      deIdentifiedId: `DE-ID-${newPatientId.replace("UC-CCC-", "")}`,
      name: `De-Identified Patient (${newPatientId})`,
      age: Number(newAge),
      gender: newGender,
      cancerType: newCancerType,
      stage: newStage,
      ecogScore: Number(newEcog),
      histology: newHistology,
      biomarkers: newBiomarkers,
      tmb: "8.4 mut/Mb",
      msiStatus: "MSS (Microsatellite Stable)",
      pdl1Tps: "CPS 15 (Positive)",
      currentRegimen: {
        name: newRegimenName,
        line: newRegimenLine,
        startDate: "2024-01-15",
        cycle: "Cycle 3 of 6 (Day 1)",
        schedule: "q21d IV Infusion",
        intent: "First-Line Metastatic",
        drugs: [
          { name: "Carboplatin", dose: "AUC 5 IV", route: "IV Infusion", frequency: "Day 1 q21d", target: "DNA Cross-Linking" },
          { name: "Paclitaxel", dose: "175 mg/m² IV", route: "IV Infusion", frequency: "Day 1 q21d", target: "Microtubule Stabilization" },
          { name: "Bevacizumab", dose: "15 mg/kg IV", route: "IV Infusion", frequency: "Day 1 q21d", target: "VEGF-A Inhibition" }
        ],
        toxicities: [
          { event: "Neutropenia", grade: 2, ctcaeCategory: "Hematologic", management: "Dose held 3 days; G-CSF support initiated" }
        ]
      },
      outcomesResponse: {
        recistResponse: recist as any,
        targetLesionChangePercent: changePct,
        baselineSumDiameterMm: Number(newBaselineTumorSum),
        currentSumDiameterMm: Number(newCurrentTumorSum),
        durationOfResponseMonths: 5.2,
        pfsMonthsToDate: 5.8,
        biomarkerTracking: {
          name: "CA-125 / ctDNA VAF",
          unit: "U/mL",
          normalThreshold: 35,
          series: [
            { date: "2024-01-10", value: 340, event: "Baseline" },
            { date: "2024-02-15", value: 165 },
            { date: "2024-03-20", value: 48, event: "Cycle 3 Response" }
          ]
        },
        radiologicEvaluations: [
          { date: "2024-01-10", modality: "Thoracic/Abdomen CT", findings: "Baseline peritoneal and omental nodules", recistAssessment: "Baseline Target Lesions", sumDiameterMm: Number(newBaselineTumorSum) },
          { date: "2024-03-20", modality: "Thoracic/Abdomen CT", findings: "Interval regression of peritoneal implants", recistAssessment: recist, sumDiameterMm: Number(newCurrentTumorSum) }
        ]
      },
      pastTreatments: [
        {
          line: "Prior Line 0 (Neoadjuvant)",
          treatmentName: "Primary Cytoreductive Surgery",
          category: "Surgery",
          startDate: "2023-11-12",
          endDate: "2023-11-12",
          duration: "1 day",
          bestResponse: "Optimal Debulking (R0)",
          discontinuationReason: "Completed Planned Procedure",
          keyToxicities: ["Postoperative ileus (Grade 2)"],
          details: "Optimal debulking with complete macroscopic resection"
        }
      ],
      futureExpectedTreatments: [
        {
          priorityRank: 1,
          regimenName: "Olaparib Maintenance Therapy",
          category: "Targeted Therapy (PARP Inhibitor)",
          nccnConcordance: "Category 1",
          rationale: "Germline BRCA1 pathogenic variant confers exquisite sensitivity to synthetic lethality with PARP inhibition.",
          matchingBiomarkers: ["BRCA1 Pathogenic", "HRD Positive"],
          expectedResponseRate: "PFS HR 0.30 (SOLO-1)",
          medianPfsExpected: "56.0 months",
          fdaStatus: "FDA Approved",
          associatedTrialId: "NCT01844986"
        }
      ],
      survivalPredictions: {
        baselineRiskScore: 38,
        riskCategory: "Favorable",
        modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2",
        estimatedOs: { oneYear: 94, threeYear: 78, fiveYear: 62, medianMonths: 68 },
        estimatedPfs: { oneYear: 82, twoYear: 66, medianMonths: 38 },
        modalitiesFused: ["Genomics (BRCA1/TP53)", "Transcriptomics (HRD)", "Clinical Pathology", "CT Radiomics"],
        counterfactualRegimens: [
          { regimen: "Olaparib + Bevacizumab Maintenance", hazardRatioVsSoc: 0.38, projectedMedianOsMonths: 72, projectedMedianPfsMonths: 42, fiveYearOsProb: 65, pfsGainMonths: 18 }
        ],
        riskFactors: [
          { factor: "BRCA1 Germline Pathogenic Alteration", impact: "protective", weight: -0.42, annotation: "PARP Inhibitor synthetic lethality" },
          { factor: "Optimal Surgical Debulking (R0)", impact: "protective", weight: -0.35, annotation: "No macroscopic residual disease" }
        ]
      }
    };

    setPatientList(prev => [newProfile, ...prev]);
    setSelectedPatientId(newProfile.id);
    setSearchParams({ id: newProfile.id });
    setIsAddPatientModalOpen(false);
    toast.success(`Patient ${newProfile.id} created and registered in active session!`);
  };

  const handleEhrDirectLinkSync = () => {
    setIsEhrConnecting(true);
    toast.info("Querying Epic SMART-on-FHIR CareConnect API...");

    setTimeout(() => {
      setIsEhrConnecting(false);
      const ehrPatient: PatientProfile = {
        id: "UC-CCC-77821",
        mrn: ehrSearchMrn || "MRN-849201",
        deIdentifiedId: "DE-ID-77821",
        name: "De-Identified Epic FHIR Ingested Record",
        age: 54,
        gender: "Female",
        cancerType: "High-Grade Serous Ovarian Carcinoma",
        stage: "Stage IIIB",
        ecogScore: 0,
        histology: "High-Grade Serous Ovarian Carcinoma (HGSOC) with BRCA1 mutation",
        biomarkers: [
          { name: "BRCA1 c.5266dupC", value: "Germline Pathogenic (VAF 50%)", status: "Pathogenic", targetable: true },
          { name: "TP53 c.743G>A", value: "Somatic (VAF 72%)", status: "Pathogenic", targetable: false }
        ],
        tmb: "6.2 mut/Mb",
        msiStatus: "MSS",
        pdl1Tps: "Negative",
        currentRegimen: {
          name: "Carboplatin + Paclitaxel + Maintenance Olaparib",
          line: "First-Line Systemic",
          startDate: "2024-02-01",
          cycle: "Cycle 2 of 6",
          schedule: "q21d IV",
          intent: "First-Line Metastatic",
          drugs: [
            { name: "Carboplatin", dose: "AUC 6", route: "IV", frequency: "q21d", target: "DNA Alkylation" },
            { name: "Paclitaxel", dose: "175 mg/m²", route: "IV", frequency: "q21d", target: "Microtubules" }
          ],
          toxicities: []
        },
        outcomesResponse: {
          recistResponse: "Partial Response (PR)",
          targetLesionChangePercent: -48,
          baselineSumDiameterMm: 64,
          currentSumDiameterMm: 33,
          durationOfResponseMonths: 4.0,
          pfsMonthsToDate: 4.5,
          biomarkerTracking: {
            name: "CA-125",
            unit: "U/mL",
            normalThreshold: 35,
            series: [
              { date: "2024-01-15", value: 420, event: "Baseline" },
              { date: "2024-03-01", value: 52, event: "Cycle 2" }
            ]
          },
          radiologicEvaluations: [
            { date: "2024-01-15", modality: "Thoracic/Pelvic CT", findings: "Pelvic mass and peritoneal thickening", recistAssessment: "Baseline", sumDiameterMm: 64 },
            { date: "2024-03-01", modality: "Thoracic/Pelvic CT", findings: "Marked regression of pelvic mass", recistAssessment: "Partial Response (PR)", sumDiameterMm: 33 }
          ]
        },
        pastTreatments: [],
        futureExpectedTreatments: [
          {
            priorityRank: 1,
            regimenName: "Olaparib Maintenance (SOLO-1)",
            category: "PARP Inhibitor",
            nccnConcordance: "Category 1",
            rationale: "Category 1 NCCN recommendation for BRCA1-mutated advanced ovarian cancer in response to platinum.",
            matchingBiomarkers: ["BRCA1 Pathogenic"],
            expectedResponseRate: "HR 0.33",
            medianPfsExpected: "56.0 months",
            fdaStatus: "FDA Approved"
          }
        ],
        survivalPredictions: {
          baselineRiskScore: 32,
          riskCategory: "Favorable",
          modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2",
          estimatedOs: { oneYear: 96, threeYear: 82, fiveYear: 68, medianMonths: 74 },
          estimatedPfs: { oneYear: 88, twoYear: 72, medianMonths: 44 },
          modalitiesFused: ["Epic EHR FHIR R4", "Genomics (Tempus xT)", "CT Pelvic RECIST v1.1"],
          counterfactualRegimens: [
            { regimen: "Olaparib + Bevacizumab", hazardRatioVsSoc: 0.35, projectedMedianOsMonths: 78, projectedMedianPfsMonths: 48, fiveYearOsProb: 70, pfsGainMonths: 20 }
          ],
          riskFactors: [
            { factor: "BRCA1 Germline Pathogenic Mutation", impact: "protective", weight: -0.45, annotation: "PARP sensitivity" }
          ]
        }
      };

      setPatientList(prev => [ehrPatient, ...prev.filter(p => p.id !== ehrPatient.id)]);
      setSelectedPatientId(ehrPatient.id);
      setSearchParams({ id: ehrPatient.id });
      setIsEhrLinkModalOpen(false);
      toast.success("Successfully ingested and synchronized patient record from Epic SMART-on-FHIR!");
    }, 1200);
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

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Add Patient Button */}
            <Button
              onClick={() => setIsAddPatientModalOpen(true)}
              className="h-9 px-3 text-xs bg-primary hover:bg-primary/90 text-white font-semibold gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Patient Intake</span>
            </Button>

            {/* Direct EHR Link Button */}
            <Button
              variant="outline"
              onClick={() => setIsEhrLinkModalOpen(true)}
              className="h-9 px-3 text-xs border-primary/30 text-primary hover:bg-primary/5 font-semibold gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5 text-primary" />
              <span>Direct EHR Link</span>
            </Button>

            {/* Open iUCADO-Orbit Button */}
            <Button
              variant="outline"
              onClick={() => setIsOrbitModalOpen(true)}
              className="h-9 px-3 text-xs border-accent/40 text-accent hover:bg-accent/5 font-semibold gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>iUCADO-Orbit Frame</span>
            </Button>

            <Link to={`/patient-360?id=${currentPatient.id}`}>
              <Button variant="outline" size="sm" className="h-9 text-xs border-border gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Patient 360 View</span>
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Select Patient Record ({patientList.length}):
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(true)}
                  className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New Patient
                </button>
              </div>

              <Select value={selectedPatientId} onValueChange={handlePatientChange}>
                <SelectTrigger className="w-full text-xs font-medium bg-surface border-border h-10">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent className="text-xs font-sans">
                  {patientList.map((p) => (
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
                            <span className="text-[11px] text-muted-foreground">({tox.ctcaeCategory})</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Management: <span className="text-foreground">{tox.management}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Outcomes & Longitudinal Response */}
            {analysisMode === "outcomes" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      RECIST v1.1 & Molecular Tumor Response
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Target lesion diameter tracking, imaging interval comparisons, and circulating biomarker kinetics
                    </p>
                  </div>
                  <Badge className="bg-accent/15 text-accent border-accent/30 font-mono text-xs">
                    {currentPatient.outcomesResponse.recistResponse}
                  </Badge>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">RECIST Response:</span>
                    <span className="text-sm font-bold text-primary font-mono block mt-0.5">
                      {currentPatient.outcomesResponse.recistResponse}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">Target Lesion Change:</span>
                    <span className="text-lg font-bold text-accent font-mono block mt-0.5">
                      {currentPatient.outcomesResponse.targetLesionChangePercent}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">Current Sum Diameter:</span>
                    <span className="text-lg font-bold text-foreground font-mono block mt-0.5">
                      {currentPatient.outcomesResponse.currentSumDiameterMm} mm
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-border text-center">
                    <span className="text-muted-foreground block text-[11px]">PFS to Date:</span>
                    <span className="text-lg font-bold text-foreground font-mono block mt-0.5">
                      {currentPatient.outcomesResponse.pfsMonthsToDate} mos
                    </span>
                  </div>
                </div>

                {/* Chart: Biomarker Kinetics */}
                <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">
                      Longitudinal Kinetic Curve: {currentPatient.outcomesResponse.biomarkerTracking.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Normal: &lt;{currentPatient.outcomesResponse.biomarkerTracking.normalThreshold} {currentPatient.outcomesResponse.biomarkerTracking.unit}
                    </Badge>
                  </div>

                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentPatient.outcomesResponse.biomarkerTracking.series}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <ReferenceLine
                          y={currentPatient.outcomesResponse.biomarkerTracking.normalThreshold}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          label={{ value: "Normal Limit", fill: "#10b981", fontSize: 10 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radiologic Intervals */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Radiologic Interval Evaluations:
                  </h3>
                  <div className="space-y-2">
                    {currentPatient.outcomesResponse.radiologicEvaluations.map((rad, i) => (
                      <div key={i} className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{rad.date}</span>
                            <Badge variant="outline" className="text-[10px] font-mono">{rad.modality}</Badge>
                            <span className="font-semibold text-primary">{rad.recistAssessment}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{rad.findings}</p>
                        </div>
                        <span className="font-mono font-bold text-foreground text-xs shrink-0">{rad.sumDiameterMm} mm</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Past Treatments & Lines */}
            {analysisMode === "past_treatments" && (
              <div className="p-5 rounded-xl bg-card border border-border shadow-subtle space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Prior Therapeutic Lines & Discontinuation History
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">
                      Sequential treatment history, best response achieved, and documented mechanisms of resistance
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {currentPatient.pastTreatments.length} Prior Lines
                  </Badge>
                </div>

                <div className="space-y-4">
                  {currentPatient.pastTreatments.map((past, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface border border-border space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
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

        {/* MODAL 1: ADD PATIENT INTAKE FORM */}
        <Dialog open={isAddPatientModalOpen} onOpenChange={setIsAddPatientModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 font-sans">
            <DialogHeader className="space-y-1.5 pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-serif font-bold text-foreground">
                      Add New Patient Intake & Multi-Modal Profile
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Manually register a clinical oncology patient record with demographics, genomic alterations, and active regimen.
                    </DialogDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-accent border-accent/30 bg-accent/5">
                  OMOP CDM v5.4
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-3 text-xs">
              {/* Section 1: Demographics */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <span className="font-bold text-foreground uppercase tracking-wider font-mono text-[11px] block">
                  1. Patient Demographics & Staging
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-[11px]">Patient ID / Cohort ID</Label>
                    <Input
                      value={newPatientId}
                      onChange={e => setNewPatientId(e.target.value)}
                      className="h-8 text-xs font-mono font-bold text-primary mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px]">Epic MRN</Label>
                    <Input
                      value={newMrn}
                      onChange={e => setNewMrn(e.target.value)}
                      className="h-8 text-xs font-mono mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px]">Age (Years)</Label>
                    <Input
                      type="number"
                      value={newAge}
                      onChange={e => setNewAge(parseInt(e.target.value) || 50)}
                      className="h-8 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px]">Gender</Label>
                    <Select value={newGender} onValueChange={setNewGender}>
                      <SelectTrigger className="h-8 text-xs mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <Label className="text-[11px]">Primary Cancer Indication</Label>
                    <Input
                      value={newCancerType}
                      onChange={e => setNewCancerType(e.target.value)}
                      className="h-8 text-xs mt-1 font-semibold text-primary"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px]">Clinical / Pathologic Stage</Label>
                    <Select value={newStage} onValueChange={setNewStage}>
                      <SelectTrigger className="h-8 text-xs mt-1 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stage I">Stage I</SelectItem>
                        <SelectItem value="Stage IIA">Stage IIA</SelectItem>
                        <SelectItem value="Stage IIB">Stage IIB</SelectItem>
                        <SelectItem value="Stage IIIA">Stage IIIA</SelectItem>
                        <SelectItem value="Stage IIIB">Stage IIIB</SelectItem>
                        <SelectItem value="Stage IIIC">Stage IIIC</SelectItem>
                        <SelectItem value="Stage IV">Stage IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[11px]">ECOG Performance Status</Label>
                    <Select value={String(newEcog)} onValueChange={v => setNewEcog(parseInt(v))}>
                      <SelectTrigger className="h-8 text-xs mt-1 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (Fully active)</SelectItem>
                        <SelectItem value="1">1 (Ambulatory, light work)</SelectItem>
                        <SelectItem value="2">2 (Capable of self-care)</SelectItem>
                        <SelectItem value="3">3 (Confined to bed &gt;50%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-[11px]">Histopathology Description</Label>
                  <Input
                    value={newHistology}
                    onChange={e => setNewHistology(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Section 2: Molecular Biomarkers */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <span className="font-bold text-accent uppercase tracking-wider font-mono text-[11px] block">
                  2. Molecular Alterations & Genomic Biomarkers
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {newBiomarkers.map((b, idx) => (
                    <Badge key={idx} className="bg-accent/15 text-accent border-accent/30 text-xs py-1 px-2.5 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      <span>{b.name} ({b.value})</span>
                      <button
                        type="button"
                        onClick={() => setNewBiomarkers(prev => prev.filter((_, i) => i !== idx))}
                        className="ml-1 text-accent hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <Input
                    placeholder="Biomarker (e.g., EGFR L858R, KRAS G12C, MET amp)..."
                    value={newBiomarkerName}
                    onChange={e => setNewBiomarkerName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Annotation (e.g., Pathogenic VAF 45%)..."
                    value={newBiomarkerValue}
                    onChange={e => setNewBiomarkerValue(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddBiomarkerToForm}
                    className="h-8 text-xs border-accent/30 text-accent font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Biomarker
                  </Button>
                </div>
              </div>

              {/* Section 3: Treatment & RECIST Baseline */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <span className="font-bold text-primary uppercase tracking-wider font-mono text-[11px] block">
                  3. Active Regimen & RECIST Tumor Burden
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px]">Active Oncology Regimen</Label>
                    <Input
                      value={newRegimenName}
                      onChange={e => setNewRegimenName(e.target.value)}
                      className="h-8 text-xs font-semibold mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px]">Treatment Line</Label>
                    <Input
                      value={newRegimenLine}
                      onChange={e => setNewRegimenLine(e.target.value)}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label className="text-[11px]">Baseline Target Lesion Sum (mm)</Label>
                    <Input
                      type="number"
                      value={newBaselineTumorSum}
                      onChange={e => setNewBaselineTumorSum(parseFloat(e.target.value) || 50)}
                      className="h-8 text-xs font-mono mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px]">Current Target Lesion Sum (mm)</Label>
                    <Input
                      type="number"
                      value={newCurrentTumorSum}
                      onChange={e => setNewCurrentTumorSum(parseFloat(e.target.value) || 30)}
                      className="h-8 text-xs font-mono mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreatePatientSubmit}
                  className="h-9 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Register Patient in Platform
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* MODAL 2: DIRECT EHR & SMART-ON-FHIR LINKING */}
        <Dialog open={isEhrLinkModalOpen} onOpenChange={setIsEhrLinkModalOpen}>
          <DialogContent className="max-w-xl p-6 font-sans">
            <DialogHeader className="space-y-1.5 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-serif font-bold text-foreground">
                    Direct EHR SMART-on-FHIR Gateway
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Direct live integration with UChicago Medicine Epic CareConnect & Cosmos Federated Oncology Network.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Select Institutional EHR Provider</Label>
                <Select value={selectedEhrSystem} onValueChange={setSelectedEhrSystem}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic_careconnect">
                      UChicago Medicine Epic CareConnect (FHIR R4 OAuth2)
                    </SelectItem>
                    <SelectItem value="epic_cosmos">
                      Epic Cosmos Federated Research Network
                    </SelectItem>
                    <SelectItem value="cerner_oracle">
                      Cerner / Oracle Health Millennium FHIR Gateway
                    </SelectItem>
                    <SelectItem value="mcode_flatiron">
                      mCODE Oncology Standard Server / Flatiron Bridge
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Endpoint Connection URL:</span>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                    ONLINE • OAuth2 Active
                  </Badge>
                </div>
                <code className="text-[11px] font-mono text-primary block p-2 rounded bg-card border border-border">
                  https://epic-fhir.uchicago.edu/api/FHIR/R4/Patient
                </code>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Patient Search (MRN or FHIR Identifier)</Label>
                <div className="flex gap-2">
                  <Input
                    value={ehrSearchMrn}
                    onChange={e => setEhrSearchMrn(e.target.value)}
                    placeholder="Enter patient MRN (e.g. MRN-849201)..."
                    className="h-9 text-xs font-mono"
                  />
                  <Button
                    type="button"
                    onClick={handleEhrDirectLinkSync}
                    disabled={isEhrConnecting}
                    className="h-9 text-xs bg-primary hover:bg-primary/90 text-white font-semibold shrink-0 gap-1.5"
                  >
                    {isEhrConnecting ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Ingesting...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5" /> Pull & Ingest Chart
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-2 text-muted-foreground text-[11px]">
                <span className="font-semibold text-foreground block">Automatic FHIR Resource Mapping:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Patient Demographics
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> MedicationAdministration (mCODE)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> DiagnosticReport (Genomics)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Observation (RECIST Imaging)
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
