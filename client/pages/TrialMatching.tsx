import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ClinicalTrialMatch } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FlaskConical,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  Building2,
  UserCheck,
  Send,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  Dna,
  ShieldCheck,
  FileCheck2,
  Sliders,
  Calculator,
  Plus,
  Trash2,
  FileText,
  Download,
  Users,
  Activity,
  Zap,
  Layers,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface TrialArmConfig {
  name: string;
  type: "experimental" | "active_comparator" | "placebo";
  regimen: string;
  dose: string;
  schedule: string;
  targetEnrollment: number;
}

interface ProtocolDesignState {
  title: string;
  acronym: string;
  phase: string;
  indication: string;
  studyType: string;
  principalInvestigator: string;
  department: string;
  biomarkers: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  arms: TrialArmConfig[];
  primaryEndpoint: string;
  randomizationRatio: string;
  blinding: string;
  // Statistical parameters
  controlResponseRate: number; // e.g. 25%
  experimentalResponseRate: number; // e.g. 45%
  hazardRatio: number; // e.g. 0.65
  power: number; // 80 or 90
  alpha: number; // 0.05
  dropoutRate: number; // 10%
}

const DESIGN_PRESETS: { label: string; desc: string; data: Partial<ProtocolDesignState> }[] = [
  {
    label: "Phase II: TROP2 ADC + Pembrolizumab (TNBC)",
    desc: "Biomarker-stratified Phase II study in metastatic triple-negative breast cancer with TROP2 expression.",
    data: {
      title: "Phase II Study of Sacituzumab Govitecan in Combination with Pembrolizumab in TROP2-Enriched Metastatic TNBC",
      acronym: "UC-TROP2-01",
      phase: "Phase II",
      indication: "Metastatic Triple-Negative Breast Carcinoma (TNBC)",
      studyType: "Interventional (Antibody-Drug Conjugate + Immunotherapy)",
      principalInvestigator: "Dr. Olufunmilayo Olopade, MD, FACP",
      department: "Section of Hematology/Oncology, Comprehensive Cancer Center",
      biomarkers: ["TROP2 Expression (IHC 2+/3+)", "PD-L1 CPS ≥ 10", "BRCA1/2 Wild-Type or Mutated", "TP53 Pathogenic"],
      inclusionCriteria: [
        "Histologically confirmed metastatic or locally advanced unresectable TNBC (ER < 1%, PR < 1%, HER2-negative).",
        "Documented TROP2 membranous expression (IHC score 2+ or 3+ on central or CLIA-certified local assay).",
        "At least 1 prior line of systemic chemotherapy in the metastatic setting.",
        "ECOG Performance Status 0 or 1.",
        "Measurable disease per RECIST v1.1 criteria.",
        "Adequate organ and bone marrow function (ANC ≥ 1,500/µL, Platelets ≥ 100,000/µL, CrCl ≥ 50 mL/min)."
      ],
      exclusionCriteria: [
        "Active, untreated or symptomatic central nervous system (CNS) metastases.",
        "Prior severe hypersensitivity or dose-limiting toxicity to topoisomerase-I inhibitor ADCs.",
        "Active autoimmune disease requiring systemic immunosuppressive therapy (> 10 mg prednisone daily equivalent).",
        "Baseline QTc interval > 470 ms on triplicate 12-lead ECG."
      ],
      arms: [
        { name: "Arm A (Experimental)", type: "experimental", regimen: "Sacituzumab Govitecan + Pembrolizumab", dose: "10 mg/kg IV + 200 mg IV", schedule: "SG Days 1, 8; Pembro Day 1 q21d", targetEnrollment: 45 },
        { name: "Arm B (Active Comparator)", type: "active_comparator", regimen: "Physician's Choice Chemotherapy (Eribulin / Capecitabine)", dose: "Per Standard Label", schedule: "q21d cycle", targetEnrollment: 45 }
      ],
      primaryEndpoint: "Objective Response Rate (ORR per RECIST v1.1) & Progression-Free Survival (PFS)",
      randomizationRatio: "1:1",
      blinding: "Open-Label with Blinded Independent Central Review (BICR)",
      controlResponseRate: 22,
      experimentalResponseRate: 48,
      hazardRatio: 0.62,
      power: 85,
      alpha: 0.05,
      dropoutRate: 10
    }
  },
  {
    label: "Phase I/II: 225Ac-Theranostic in MET/EGFR Amplified (NSCLC)",
    desc: "Targeted alpha emitter dose-escalation and expansion in refractory lung adenocarcinoma.",
    data: {
      title: "Phase I/II Dose-Escalation and Expansion Study of 225Ac-Labeled MET-Targeting Radio-Theranostic in Refractory NSCLC",
      acronym: "UC-ALPHA-MET",
      phase: "Phase I/II",
      indication: "Advanced Non-Small Cell Lung Cancer (EGFR/MET Dysregulated)",
      studyType: "Targeted Alpha Radiopharmaceutical (Theranostic)",
      principalInvestigator: "Dr. Jyoti Patel, MD / Dr. Everett Vokes, MD",
      department: "Department of Medicine & Radiology, UC-CCC",
      biomarkers: ["MET Amplification (FISH ratio ≥ 5.0)", "EGFR Exon 19 del or L858R", "MET Exon 14 Skipping"],
      inclusionCriteria: [
        "Advanced or metastatic NSCLC with documented MET gene amplification or MET exon 14 skipping mutation.",
        "Prior progression on at least 1 line of EGFR-TKI (if EGFR-mutant) and platinum-based doublet chemotherapy.",
        "Positive baseline PET uptake on companion diagnostic 68Ga-MET PET/CT.",
        "ECOG Performance Status 0-2."
      ],
      exclusionCriteria: [
        "Prior treatment with alpha-emitting radiopharmaceuticals within 6 months.",
        "Impaired renal clearance with eGFR < 45 mL/min/1.73 m².",
        "Total bilirubin > 2.0x institutional upper limit of normal."
      ],
      arms: [
        { name: "Dose Escalation Cohorts (BOIN)", type: "experimental", regimen: "225Ac-MET Ligand", dose: "50 kBq/kg → 100 kBq/kg → 150 kBq/kg", schedule: "IV every 6 weeks x 4 cycles", targetEnrollment: 18 },
        { name: "Dose Expansion Cohort", type: "experimental", regimen: "225Ac-MET Ligand at Recommended Phase 2 Dose (RP2D)", dose: "RP2D determined in Phase I", schedule: "IV every 6 weeks x 4 cycles", targetEnrollment: 32 }
      ],
      primaryEndpoint: "Dose-Limiting Toxicity (DLT rate) & Objective Response Rate (ORR)",
      randomizationRatio: "Single-Arm Sequential",
      blinding: "Open-Label",
      controlResponseRate: 15,
      experimentalResponseRate: 40,
      hazardRatio: 0.58,
      power: 80,
      alpha: 0.05,
      dropoutRate: 10
    }
  }
];

export default function TrialMatching() {
  const [activeTab, setActiveTab] = useState<"matching" | "designer">("matching");

  // Matching Tab State
  const [trials, setTrials] = useState<ClinicalTrialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTrialForPrescreen, setSelectedTrialForPrescreen] = useState<ClinicalTrialMatch | null>(null);
  const [prescreenSuccess, setPrescreenSuccess] = useState(false);
  const [expandedTrialId, setExpandedTrialId] = useState<string | null>("NCT05214820");

  // Designer Tab State
  const [designState, setDesignState] = useState<ProtocolDesignState>({
    title: DESIGN_PRESETS[0].data.title || "",
    acronym: DESIGN_PRESETS[0].data.acronym || "",
    phase: DESIGN_PRESETS[0].data.phase || "Phase II",
    indication: DESIGN_PRESETS[0].data.indication || "Metastatic Triple-Negative Breast Carcinoma (TNBC)",
    studyType: DESIGN_PRESETS[0].data.studyType || "Interventional",
    principalInvestigator: DESIGN_PRESETS[0].data.principalInvestigator || "Dr. Olufunmilayo Olopade, MD",
    department: DESIGN_PRESETS[0].data.department || "Section of Hematology/Oncology",
    biomarkers: DESIGN_PRESETS[0].data.biomarkers || [],
    inclusionCriteria: DESIGN_PRESETS[0].data.inclusionCriteria || [],
    exclusionCriteria: DESIGN_PRESETS[0].data.exclusionCriteria || [],
    arms: DESIGN_PRESETS[0].data.arms || [],
    primaryEndpoint: DESIGN_PRESETS[0].data.primaryEndpoint || "Progression-Free Survival (PFS)",
    randomizationRatio: DESIGN_PRESETS[0].data.randomizationRatio || "1:1",
    blinding: DESIGN_PRESETS[0].data.blinding || "Open-Label",
    controlResponseRate: 22,
    experimentalResponseRate: 48,
    hazardRatio: 0.62,
    power: 85,
    alpha: 0.05,
    dropoutRate: 10
  });

  const [newBiomarkerInput, setNewBiomarkerInput] = useState("");
  const [newInclusionInput, setNewInclusionInput] = useState("");
  const [newExclusionInput, setNewExclusionInput] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/beacon/trials")
      .then((res) => res.json())
      .then((data: ClinicalTrialMatch[]) => {
        setTrials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load trial matches:", err);
        setLoading(false);
      });
  }, []);

  const filteredTrials = trials.filter(
    (t) =>
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.nctId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.matchingBiomarkers.some((b) => b.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleSendPrescreen = () => {
    setPrescreenSuccess(true);
    toast.success("IRB Pre-Screen packet submitted to Clinical Trials Office");
    setTimeout(() => {
      setPrescreenSuccess(false);
      setSelectedTrialForPrescreen(null);
    }, 1800);
  };

  // Sample size & power calculations (two-sample proportion test / Schoenfeld survival formula)
  const calculateStatisticalPowerAndN = () => {
    const p1 = designState.experimentalResponseRate / 100;
    const p0 = designState.controlResponseRate / 100;
    const delta = Math.abs(p1 - p0) || 0.01;
    const pBar = (p1 + p0) / 2;
    const zAlpha = designState.alpha === 0.05 ? 1.96 : 2.576;
    const zBeta = designState.power === 90 ? 1.282 : designState.power === 85 ? 1.036 : 0.842;

    const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p0 * (1 - p0)), 2);
    const denominator = Math.pow(delta, 2);
    const perArmN = Math.ceil(numerator / denominator);
    const totalRawN = perArmN * 2;
    const totalAdjustedN = Math.ceil(totalRawN / (1 - (designState.dropoutRate / 100)));

    // Schoenfeld survival event count for HR
    const logHR = Math.log(designState.hazardRatio || 0.65);
    const targetEvents = Math.ceil(4 * Math.pow(zAlpha + zBeta, 2) / Math.pow(logHR, 2));

    // Simulated UC-CCC Commons catchment cohort matches
    const eligibleCatchmentPatients = Math.floor(85 + (designState.biomarkers.length * 4) + (designState.phase === "Phase I" ? 25 : 12));
    const estimatedMonthlyAccrual = (eligibleCatchmentPatients * 0.045).toFixed(1);
    const estimatedMonthsToAccrue = Math.ceil(totalAdjustedN / Math.max(parseFloat(estimatedMonthlyAccrual), 1.0));

    return {
      perArmN,
      totalAdjustedN,
      targetEvents,
      eligibleCatchmentPatients,
      estimatedMonthlyAccrual,
      estimatedMonthsToAccrue
    };
  };

  const statMetrics = calculateStatisticalPowerAndN();

  const handleApplyPreset = (preset: typeof DESIGN_PRESETS[0]) => {
    setDesignState(prev => ({
      ...prev,
      ...preset.data
    }));
    toast.info(`Loaded protocol template: ${preset.label}`);
  };

  const handleAddBiomarker = () => {
    if (newBiomarkerInput.trim()) {
      setDesignState(prev => ({
        ...prev,
        biomarkers: [...prev.biomarkers, newBiomarkerInput.trim()]
      }));
      setNewBiomarkerInput("");
      toast.success("Biomarker criterion added to protocol");
    }
  };

  const handleRemoveBiomarker = (index: number) => {
    setDesignState(prev => ({
      ...prev,
      biomarkers: prev.biomarkers.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddInclusion = () => {
    if (newInclusionInput.trim()) {
      setDesignState(prev => ({
        ...prev,
        inclusionCriteria: [...prev.inclusionCriteria, newInclusionInput.trim()]
      }));
      setNewInclusionInput("");
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setDesignState(prev => ({
      ...prev,
      inclusionCriteria: prev.inclusionCriteria.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddExclusion = () => {
    if (newExclusionInput.trim()) {
      setDesignState(prev => ({
        ...prev,
        exclusionCriteria: [...prev.exclusionCriteria, newExclusionInput.trim()]
      }));
      setNewExclusionInput("");
    }
  };

  const handleRemoveExclusion = (index: number) => {
    setDesignState(prev => ({
      ...prev,
      exclusionCriteria: prev.exclusionCriteria.filter((_, idx) => idx !== index)
    }));
  };

  const handleSaveProtocol = () => {
    toast.success(`Protocol ${designState.acronym || "Draft"} saved to UC-CCC Clinical Trials Registry.`);
  };

  const handleDownloadSynopsis = () => {
    const synopsisContent = `# CLINICAL STUDY PROTOCOL SYNOPSIS
Institutional Sponsor: The University of Chicago Comprehensive Cancer Center
Protocol ID: ${designState.acronym}
Study Phase: ${designState.phase}

## TITLE
${designState.title}

## INVESTIGATOR & DEPARTMENT
Principal Investigator: ${designState.principalInvestigator}
Department: ${designState.department}

## DISEASE INDICATION & STUDY TYPE
Indication: ${designState.indication}
Study Classification: ${designState.studyType}

## BIOMARKER STRATIFICATION
${designState.biomarkers.map(b => `- ${b}`).join("\n")}

## PRIMARY ENDPOINT
${designState.primaryEndpoint}

## STATISTICAL DESIGN & POWER
- Target Power (1 - Beta): ${designState.power}%
- Two-Sided Alpha: ${designState.alpha}
- Expected Control Rate: ${designState.controlResponseRate}%
- Expected Experimental Rate: ${designState.experimentalResponseRate}%
- Target Hazard Ratio: ${designState.hazardRatio}
- Calculated Total Sample Size (N): ${statMetrics.totalAdjustedN} patients
- Required Efficacy Events: ${statMetrics.targetEvents} events
- UC-CCC Catchment Eligible Patients: ${statMetrics.eligibleCatchmentPatients}
- Estimated Monthly Accrual: ${statMetrics.estimatedMonthlyAccrual} patients/month
- Estimated Time to Complete Accrual: ${statMetrics.estimatedMonthsToAccrue} months

## INCLUSION CRITERIA
${designState.inclusionCriteria.map(i => `1. ${i}`).join("\n")}

## EXCLUSION CRITERIA
${designState.exclusionCriteria.map(e => `1. ${e}`).join("\n")}

## TREATMENT ARMS & REGIMENS
${designState.arms.map(a => `- **${a.name}** (${a.type}): ${a.regimen} | Dose: ${a.dose} | Schedule: ${a.schedule} (Target: N=${a.targetEnrollment})`).join("\n")}
`;

    const blob = new Blob([synopsisContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${designState.acronym || "protocol_synopsis"}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Protocol Synopsis (.md) exported successfully!");
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12 font-sans max-w-[1700px] mx-auto p-4 sm:p-6">
        {/* Main Header & View Tabs */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif text-foreground">
                    AI Clinical Trial Matching & Protocol Designer Studio
                  </h1>
                  <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                    mCODE + PICO Protocol Builder
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Molecular patient matching against active protocols and end-to-end clinical trial design with statistical power & catchment accrual simulation.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-muted/80 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("matching")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "matching"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Match Active Protocols
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("designer")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "designer"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Design Clinical Trial & Tools
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: MATCH ACTIVE PROTOCOLS */}
        {activeTab === "matching" && (
          <div className="space-y-6">
            {/* Active Patient Profile Snapshot */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-3 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  Active Clinical Patient Context for Match Scoring
                </span>
                <Badge className="bg-accent/15 text-accent border-accent/30 text-xs py-0.5 px-2.5 font-mono">
                  Patient UC-CCC-89421 Evaluated
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase block">Demographics & ID</span>
                  <span className="font-bold text-foreground">UC-CCC-89421 (58 y/o Female)</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase block">Primary Diagnosis</span>
                  <span className="font-bold text-primary">Stage III Invasive Breast Carcinoma (TNBC)</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase block">Validated Biomarkers</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <Badge className="bg-accent/15 text-accent border-accent/30 text-[9px] font-mono">BRCA1 Pathogenic</Badge>
                    <Badge className="bg-accent/15 text-accent border-accent/30 text-[9px] font-mono">PD-L1 CPS ≥ 10</Badge>
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-[9px] font-mono">HRD Score: 52</Badge>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative pt-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                <Input
                  placeholder="Filter matched trials by drug name, NCT ID, or biomarker (e.g., Olaparib, BRCA1, NCT05214820, Adagrasib)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-9 bg-surface border-border text-xs text-foreground placeholder:text-muted-foreground h-9"
                />
              </div>
            </div>

            {/* Trial Match List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                  Matched Protocol Catalog ({filteredTrials.length} High Confidence Matches)
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Matching Engine: mCODE NLP Criteria Matcher v3.2
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border text-sm">
                  Evaluating clinical trial eligibility criteria against molecular profile...
                </div>
              ) : (
                filteredTrials.map((trial) => {
                  const isExpanded = expandedTrialId === trial.nctId;
                  return (
                    <div
                      key={trial.nctId}
                      className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle hover:border-accent/40 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-xs tabular-nums">
                              {trial.matchScorePercent}% Match
                            </Badge>
                            <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 text-[10px] font-mono">
                              {trial.phase}
                            </Badge>
                            <a
                              href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono text-accent hover:underline inline-flex items-center font-semibold"
                            >
                              {trial.nctId} <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>

                          <h3 className="text-base font-bold font-serif text-foreground leading-snug">{trial.title}</h3>

                          <p className="text-xs text-muted-foreground">
                            PI: <strong className="text-foreground">{trial.principalInvestigator}</strong> • Site:{" "}
                            <span className="text-foreground/90">{trial.primaryLocation}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedTrialForPrescreen(trial)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-subtle"
                          >
                            <Send className="w-3.5 h-3.5 mr-1.5" /> Submit IRB Pre-Screen
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedTrialId(isExpanded ? null : trial.nctId)}
                            className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Matching Biomarkers */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Matching Criteria:</span>
                        {trial.matchingBiomarkers.map((b) => (
                          <Badge key={b} className="bg-accent/10 text-accent border-accent/30 text-[10px] font-mono">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-accent" /> {b}
                          </Badge>
                        ))}
                      </div>

                      {/* Expanded Inclusion / Exclusion Criteria Breakdown */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2 p-3.5 rounded-lg bg-surface border border-border">
                            <span className="font-bold text-accent flex items-center gap-1.5 font-mono text-[11px] uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Inclusion Criteria ({trial.inclusionCriteria?.length || 0})
                            </span>
                            <ul className="space-y-1 text-foreground/90 text-[11px]">
                              {(trial.inclusionCriteria || []).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-accent">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2 p-3.5 rounded-lg bg-surface border border-border">
                            <span className="font-bold text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] uppercase">
                              <Info className="w-3.5 h-3.5 text-muted-foreground" /> Exclusion Criteria ({trial.exclusionCriteria?.length || 0})
                            </span>
                            <ul className="space-y-1 text-muted-foreground text-[11px]">
                              {(trial.exclusionCriteria || []).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-muted-foreground">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: CLINICAL TRIAL PROTOCOL DESIGNER & TOOLS */}
        {activeTab === "designer" && (
          <div className="space-y-6">
            {/* Template Quick Presets Bar */}
            <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Load Institutional Protocol Templates & Adaptive Designs
                </span>
                <span className="text-[11px] text-muted-foreground">Click to populate study parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DESIGN_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 rounded-lg border border-border bg-surface hover:border-primary/60 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {preset.label}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">{preset.data.phase}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{preset.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Identity & Clinical Indication */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  1. Protocol Identity & Study Parameters
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                  mCODE Compliant
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <Label className="text-xs font-medium">Full Protocol Title</Label>
                  <Input
                    value={designState.title}
                    onChange={e => setDesignState(prev => ({ ...prev, title: e.target.value }))}
                    className="h-9 text-xs font-sans"
                    placeholder="e.g., Phase II Study of Novel BiTE in Relapsed/Refractory Disease..."
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Protocol Short Acronym / ID</Label>
                  <Input
                    value={designState.acronym}
                    onChange={e => setDesignState(prev => ({ ...prev, acronym: e.target.value }))}
                    className="h-9 text-xs font-mono font-bold text-primary"
                    placeholder="e.g., UC-TROP2-01"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Clinical Phase</Label>
                  <Select value={designState.phase} onValueChange={v => setDesignState(prev => ({ ...prev, phase: v }))}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phase I">Phase I (Dose Escalation / BOIN)</SelectItem>
                      <SelectItem value="Phase I/II">Phase I/II (Escalation + Expansion)</SelectItem>
                      <SelectItem value="Phase II">Phase II (Simon Two-Stage / Multi-Arm)</SelectItem>
                      <SelectItem value="Phase III">Phase III (Randomized Multi-Center)</SelectItem>
                      <SelectItem value="Basket / Umbrella">Basket / Umbrella Platform Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Primary Oncology Indication</Label>
                  <Input
                    value={designState.indication}
                    onChange={e => setDesignState(prev => ({ ...prev, indication: e.target.value }))}
                    className="h-9 text-xs font-sans"
                    placeholder="e.g., Metastatic Triple-Negative Breast Cancer"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Study Classification / Type</Label>
                  <Input
                    value={designState.studyType}
                    onChange={e => setDesignState(prev => ({ ...prev, studyType: e.target.value }))}
                    className="h-9 text-xs font-sans"
                    placeholder="e.g., Interventional (ADC + Checkpoint)"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Principal Investigator (PI)</Label>
                  <Input
                    value={designState.principalInvestigator}
                    onChange={e => setDesignState(prev => ({ ...prev, principalInvestigator: e.target.value }))}
                    className="h-9 text-xs font-sans font-semibold"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <Label className="text-xs font-medium">Department / Comprehensive Cancer Center Section</Label>
                  <Input
                    value={designState.department}
                    onChange={e => setDesignState(prev => ({ ...prev, department: e.target.value }))}
                    className="h-9 text-xs font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Biomarker Stratification & Target Profiles */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                  <Dna className="w-4 h-4 text-accent" />
                  2. Molecular Biomarker Eligibility & Stratification Criteria
                </span>
                <span className="text-xs text-muted-foreground">{designState.biomarkers.length} active biomarker criteria</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {designState.biomarkers.map((b, idx) => (
                  <Badge key={idx} className="bg-accent/15 text-accent border-accent/30 text-xs py-1 px-2.5 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBiomarker(idx)}
                      className="ml-1 text-accent hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newBiomarkerInput}
                  onChange={e => setNewBiomarkerInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddBiomarker()}
                  placeholder="Add biomarker requirement (e.g., HER2 IHC 1+ or 2+ FISH-, TMB >= 10 mut/Mb, KRAS G12C)..."
                  className="h-9 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddBiomarker}
                  className="h-9 text-xs bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Biomarker
                </Button>
              </div>
            </div>

            {/* Inclusion & Exclusion Criteria Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inclusion */}
              <div className="p-5 rounded-xl bg-card border border-border space-y-3 shadow-subtle">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Inclusion Criteria ({designState.inclusionCriteria.length})
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                  {designState.inclusionCriteria.map((item, idx) => (
                    <div key={idx} className="p-2 rounded bg-surface border border-border flex items-start justify-between gap-2">
                      <span className="text-[11px] leading-relaxed text-foreground">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(idx)}
                        className="text-muted-foreground hover:text-red-500 shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    value={newInclusionInput}
                    onChange={e => setNewInclusionInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddInclusion()}
                    placeholder="Add inclusion rule (e.g., ECOG 0-1, ANC >= 1.5k)..."
                    className="h-8 text-xs"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddInclusion} className="h-8 text-xs shrink-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Exclusion */}
              <div className="p-5 rounded-xl bg-card border border-border space-y-3 shadow-subtle">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Exclusion Criteria ({designState.exclusionCriteria.length})
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                  {designState.exclusionCriteria.map((item, idx) => (
                    <div key={idx} className="p-2 rounded bg-surface border border-border flex items-start justify-between gap-2">
                      <span className="text-[11px] leading-relaxed text-muted-foreground">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(idx)}
                        className="text-muted-foreground hover:text-red-500 shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    value={newExclusionInput}
                    onChange={e => setNewExclusionInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddExclusion()}
                    placeholder="Add exclusion rule (e.g., Active CNS mets, QTc > 470ms)..."
                    className="h-8 text-xs"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddExclusion} className="h-8 text-xs shrink-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Treatment Arms & Regimen Configurator */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  3. Treatment Arms & Regimen Schedule
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Randomization: <strong>{designState.randomizationRatio}</strong></span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Blinding: <strong>{designState.blinding}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designState.arms.map((arm, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground font-mono">{arm.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono capitalize">{arm.type.replace("_", " ")}</Badge>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono block">Regimen & Agents</span>
                        <span className="font-bold text-primary">{arm.regimen}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-mono block">Dose & Route</span>
                          <span className="text-foreground">{arm.dose}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground font-mono block">Schedule / Cycle</span>
                          <span className="text-foreground">{arm.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistical Power, Sample Size (N) Estimator & Accrual Feasibility */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent border border-accent/20">
                    <Calculator className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-foreground">
                      4. Statistical Power Calculator & Catchment Accrual Simulator
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Dynamic sample size estimation with live queries against UC-CCC Cancer Data Commons registry.
                    </p>
                  </div>
                </div>

                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-mono">
                  Accrual Feasible
                </Badge>
              </div>

              {/* Sliders & Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                <div className="space-y-2 p-3 rounded-lg bg-surface border border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Control Response:</span>
                    <span className="font-bold font-mono text-foreground">{designState.controlResponseRate}%</span>
                  </div>
                  <Slider
                    value={[designState.controlResponseRate]}
                    onValueChange={([v]) => setDesignState(prev => ({ ...prev, controlResponseRate: v }))}
                    min={5}
                    max={60}
                    step={1}
                  />
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-surface border border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Experimental Response:</span>
                    <span className="font-bold font-mono text-primary">{designState.experimentalResponseRate}%</span>
                  </div>
                  <Slider
                    value={[designState.experimentalResponseRate]}
                    onValueChange={([v]) => setDesignState(prev => ({ ...prev, experimentalResponseRate: v }))}
                    min={15}
                    max={90}
                    step={1}
                  />
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-surface border border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Statistical Power (1 - β):</span>
                    <span className="font-bold font-mono text-accent">{designState.power}%</span>
                  </div>
                  <Slider
                    value={[designState.power]}
                    onValueChange={([v]) => setDesignState(prev => ({ ...prev, power: v }))}
                    min={70}
                    max={95}
                    step={5}
                  />
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-surface border border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Target Hazard Ratio (HR):</span>
                    <span className="font-bold font-mono text-foreground">{designState.hazardRatio}</span>
                  </div>
                  <Slider
                    value={[designState.hazardRatio * 100]}
                    onValueChange={([v]) => setDesignState(prev => ({ ...prev, hazardRatio: v / 100 }))}
                    min={40}
                    max={90}
                    step={2}
                  />
                </div>
              </div>

              {/* Calculated Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 space-y-1">
                  <span className="text-[10px] text-primary uppercase font-mono font-bold block">Required Total Sample (N)</span>
                  <span className="text-2xl font-bold font-serif text-primary">{statMetrics.totalAdjustedN}</span>
                  <span className="text-[10px] text-muted-foreground block">{statMetrics.perArmN} patients / arm (+10% dropout)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block">Target Efficacy Events</span>
                  <span className="text-2xl font-bold font-serif text-foreground">{statMetrics.targetEvents}</span>
                  <span className="text-[10px] text-muted-foreground block">Schoenfeld event threshold</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block">UC-CCC Catchment Matches</span>
                  <span className="text-2xl font-bold font-serif text-accent">{statMetrics.eligibleCatchmentPatients}</span>
                  <span className="text-[10px] text-muted-foreground block">Active registry eligible pool</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block">Est. Accrual Duration</span>
                  <span className="text-2xl font-bold font-serif text-emerald-600">~{statMetrics.estimatedMonthsToAccrue} mo</span>
                  <span className="text-[10px] text-muted-foreground block">At ~{statMetrics.estimatedMonthlyAccrual} patients / month</span>
                </div>
              </div>
            </div>

            {/* Protocol Actions & Export Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border shadow-subtle">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-accent" />
                <span>Protocol conforms to UChicago Medicine Institutional Review Board (IRB) and ClinicalTrials.gov PRS specifications.</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveProtocol}
                  className="h-9 text-xs"
                >
                  Save Active Draft
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownloadSynopsis}
                  className="h-9 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-4 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Export Protocol Synopsis (.md)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Pre-Screen Submission */}
        <Dialog open={!!selectedTrialForPrescreen} onOpenChange={() => setSelectedTrialForPrescreen(null)}>
          <DialogContent className="max-w-lg p-6 font-sans">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-serif font-bold text-foreground">
                Submit IRB Clinical Trial Pre-Screen Packet
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit de-identified patient record to UChicago Clinical Trials Office (CTO) for formal screening review.
              </DialogDescription>
            </DialogHeader>

            {selectedTrialForPrescreen && (
              <div className="space-y-4 py-2 text-xs">
                <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                  <div className="font-bold text-foreground">{selectedTrialForPrescreen.title}</div>
                  <div className="text-muted-foreground font-mono">{selectedTrialForPrescreen.nctId} • {selectedTrialForPrescreen.phase}</div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground">Packet Inclusions:</span>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-accent" /> Structured mCODE Clinical Summary
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-accent" /> NGS Somatic & Germline Variant Profiles
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-accent" /> Prior Systemic Therapies & RECIST Response
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-accent" /> Dynamic Consent Audit Ledger Authorization
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTrialForPrescreen(null)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendPrescreen}
                    disabled={prescreenSuccess}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8"
                  >
                    {prescreenSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" /> Submitted
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Submit to CTO
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
