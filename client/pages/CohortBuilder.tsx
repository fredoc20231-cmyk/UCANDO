import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CohortQueryResponse, CohortFilterCriteria } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  SlidersHorizontal,
  Users,
  Filter,
  BarChart3,
  Code,
  Download,
  CheckCircle2,
  Sparkles,
  Search,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Layers,
  FileCode,
  Check,
  Copy,
  Info,
  ChevronRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Area,
  AreaChart
} from "recharts";

const AVAILABLE_DIAGNOSES = [
  "Invasive Breast Carcinoma",
  "Non-Small Cell Lung Cancer",
  "High-Grade Serous Ovarian Cancer",
  "Colorectal Adenocarcinoma",
  "Pancreatic Ductal Adenocarcinoma"
];

const AVAILABLE_STAGES = ["Stage I", "Stage II", "Stage III", "Stage IV"];

const AVAILABLE_GENES = [
  { symbol: "BRCA1", name: "BRCA1 DNA Repair", color: "#38bdf8" },
  { symbol: "BRCA2", name: "BRCA2 DNA Repair", color: "#818cf8" },
  { symbol: "TP53", name: "Tumor Protein 53", color: "#f43f5e" },
  { symbol: "PIK3CA", name: "PI3-Kinase Alpha", color: "#a855f7" },
  { symbol: "EGFR", name: "EGF Receptor", color: "#34d399" },
  { symbol: "ERBB2", name: "HER2 Oncogene", color: "#f59e0b" }
];

export default function CohortBuilder() {
  const [filters, setFilters] = useState<CohortFilterCriteria>({
    diagnoses: ["Invasive Breast Carcinoma"],
    stages: ["Stage III", "Stage IV"],
    genes: ["BRCA1", "TP53"],
    hasBiospecimen: true,
    ageRange: [21, 85]
  });

  const [cohortData, setCohortData] = useState<CohortQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>("brca");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportModalOpenFormat] = useState<"mcode" | "beacon" | "csv">("mcode");
  const [copied, setCopied] = useState(false);

  const fetchCohortData = (currentFilters: CohortFilterCriteria) => {
    setLoading(true);
    fetch("/api/beacon/cohort/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentFilters)
    })
      .then((res) => res.json())
      .then((data: CohortQueryResponse) => {
        setCohortData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to query cohort:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCohortData(filters);
  }, []);

  const handleApplyFilters = () => {
    fetchCohortData(filters);
  };

  const handleResetFilters = () => {
    const reset: CohortFilterCriteria = {
      diagnoses: [],
      stages: [],
      genes: [],
      hasBiospecimen: false,
      ageRange: [18, 90]
    };
    setFilters(reset);
    setActivePreset(null);
    fetchCohortData(reset);
  };

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    let newFilters: CohortFilterCriteria = {};

    if (presetName === "brca") {
      newFilters = {
        diagnoses: ["Invasive Breast Carcinoma", "High-Grade Serous Ovarian Cancer"],
        stages: ["Stage III", "Stage IV"],
        genes: ["BRCA1", "BRCA2"],
        hasBiospecimen: true,
        ageRange: [25, 80]
      };
    } else if (presetName === "tnbc") {
      newFilters = {
        diagnoses: ["Invasive Breast Carcinoma"],
        stages: ["Stage II", "Stage III", "Stage IV"],
        genes: ["TP53", "PIK3CA"],
        hasBiospecimen: true,
        ageRange: [21, 75]
      };
    } else if (presetName === "lung_egfr") {
      newFilters = {
        diagnoses: ["Non-Small Cell Lung Cancer"],
        stages: ["Stage III", "Stage IV"],
        genes: ["EGFR", "TP53"],
        hasBiospecimen: true,
        ageRange: [35, 85]
      };
    }

    setFilters(newFilters);
    fetchCohortData(newFilters);
  };

  const toggleDiagnosis = (diag: string) => {
    const current = filters.diagnoses || [];
    const updated = current.includes(diag)
      ? current.filter((d) => d !== diag)
      : [...current, diag];
    const newF = { ...filters, diagnoses: updated };
    setFilters(newF);
    fetchCohortData(newF);
  };

  const toggleStage = (stage: string) => {
    const current = filters.stages || [];
    const updated = current.includes(stage)
      ? current.filter((s) => s !== stage)
      : [...current, stage];
    const newF = { ...filters, stages: updated };
    setFilters(newF);
    fetchCohortData(newF);
  };

  const toggleGene = (geneSymbol: string) => {
    const current = filters.genes || [];
    const updated = current.includes(geneSymbol)
      ? current.filter((g) => g !== geneSymbol)
      : [...current, geneSymbol];
    const newF = { ...filters, genes: updated };
    setFilters(newF);
    fetchCohortData(newF);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary dark:bg-brand-maroon text-white shadow-md">
                <SlidersHorizontal className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Visual Cohort Query Builder</h1>
                  <Badge variant="outline" className="border-sky-500/40 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 text-[10px]">
                    De-identified Analytics Zone
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Federated cross-modal cohort discovery across 98,450 consented UC-CCC Cancer Data Commons patients.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setExportModalOpenFormat("mcode");
                  setExportModalOpen(true);
                }}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <Code className="w-3.5 h-3.5 mr-1.5 text-sky-600 dark:text-sky-400" /> Export mCODE FHIR
              </Button>
              <Button
                onClick={() => {
                  setExportModalOpenFormat("beacon");
                  setExportModalOpen(true);
                }}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" /> GA4GH Beacon Query
              </Button>
              <Button
                onClick={() => {
                  setExportModalOpenFormat("csv");
                  setExportModalOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white font-semibold text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export De-ID Cohort
              </Button>
            </div>
          </div>

          {/* Preset Chips & Privacy Budget Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
            <div className="lg:col-span-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
              </span>
              <Button
                size="sm"
                variant={activePreset === "brca" ? "default" : "outline"}
                onClick={() => applyPreset("brca")}
                className={`text-xs h-7 rounded-full ${
                  activePreset === "brca"
                    ? "bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                BRCA1/2 PARP Cohort
              </Button>
              <Button
                size="sm"
                variant={activePreset === "tnbc" ? "default" : "outline"}
                onClick={() => applyPreset("tnbc")}
                className={`text-xs h-7 rounded-full ${
                  activePreset === "tnbc"
                    ? "bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                Triple Negative Breast Cancer
              </Button>
              <Button
                size="sm"
                variant={activePreset === "lung_egfr" ? "default" : "outline"}
                onClick={() => applyPreset("lung_egfr")}
                className={`text-xs h-7 rounded-full ${
                  activePreset === "lung_egfr"
                    ? "bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                NSCLC EGFR Mutated
              </Button>
            </div>

            {/* Differential Privacy Budget Indicator */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Differential Privacy Budget:</span>
              </div>
              <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                {cohortData ? cohortData.privacyBudgetRemainingEpsilon : 98.4} / 100 ε
              </span>
            </div>
          </div>
        </div>

        {/* Query Layout: Left Criteria Filter Sidebar + Right Analytics Main */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Query Filter Sidebar */}
          <div className="lg:col-span-1 space-y-5 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-sky-400" /> Filter Criteria
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-[11px] text-slate-400 hover:text-white px-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>

            {/* Diagnoses Filter */}
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                1. Oncology Diagnoses
              </Label>
              <div className="space-y-1.5">
                {AVAILABLE_DIAGNOSES.map((diag) => {
                  const isChecked = filters.diagnoses?.includes(diag) || false;
                  return (
                    <label
                      key={diag}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-sky-950/50 border-sky-600/60 text-sky-200"
                          : "bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700"
                      }`}
                      onClick={() => toggleDiagnosis(diag)}
                    >
                      <Checkbox checked={isChecked} className="mt-0.5 border-slate-600" />
                      <span className="leading-snug">{diag}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Disease Stage */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                2. Disease Stage
              </Label>
              <div className="grid grid-cols-2 gap-1.5">
                {AVAILABLE_STAGES.map((stg) => {
                  const isChecked = filters.stages?.includes(stg) || false;
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => toggleStage(stg)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isChecked
                          ? "bg-brand-maroon border-red-600 text-white shadow-md shadow-red-950/40"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Genomic Biomarkers */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                3. Pathogenic Biomarkers
              </Label>
              <div className="space-y-1.5">
                {AVAILABLE_GENES.map((gene) => {
                  const isChecked = filters.genes?.includes(gene.symbol) || false;
                  return (
                    <div
                      key={gene.symbol}
                      onClick={() => toggleGene(gene.symbol)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-slate-950 border-emerald-500/60 text-emerald-300"
                          : "bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isChecked} className="border-slate-600" />
                        <span className="font-mono font-bold text-white">{gene.symbol}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{gene.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Biospecimen & Specimen Required */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  filters.hasBiospecimen
                    ? "bg-amber-950/30 border-amber-500/60 text-amber-300"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
                onClick={() => {
                  const newF = { ...filters, hasBiospecimen: !filters.hasBiospecimen };
                  setFilters(newF);
                  fetchCohortData(newF);
                }}
              >
                <span className="font-semibold">LIMS Biospecimen Available</span>
                <Checkbox checked={filters.hasBiospecimen} className="border-slate-600" />
              </label>
            </div>
          </div>

          {/* Analytics Main Workspace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Live Cohort Count Headline Stat */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Matching Cohort Subgroup
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {loading ? "Calculating..." : cohortData?.filteredCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">
                    out of <strong className="text-slate-200">98,450</strong> total consented Commons patients
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-xs px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Dynamic OPA Governance Evaluated
                </Badge>
              </div>
            </div>

            {/* Tabs for Kaplan-Meier & Mutation Frequency & Standards Spec */}
            <Tabs defaultValue="survival" className="space-y-4">
              <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <TabsTrigger
                  value="survival"
                  className="text-xs data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all"
                >
                  <TrendingDown className="w-3.5 h-3.5 mr-1.5" /> Kaplan-Meier Survival Curve
                </TabsTrigger>
                <TabsTrigger
                  value="breakdown"
                  className="text-xs data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all"
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Mutations & Subtypes
                </TabsTrigger>
                <TabsTrigger
                  value="inspector"
                  className="text-xs data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md text-slate-300 hover:text-white transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 mr-1.5" /> mCODE & GA4GH Query Spec
                </TabsTrigger>
              </TabsList>

              {/* Kaplan-Meier Survival Tab */}
              <TabsContent value="survival" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Overall Survival (5-Year Kaplan-Meier Estimate)</h3>
                    <p className="text-xs text-slate-400">
                      Calculated across {cohortData?.filteredCount.toLocaleString()} matched cohort records with 95% confidence interval bands.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-sky-500/40 text-sky-300 bg-sky-950/40 text-[10px]">
                    OMOP CDM Survival Engine
                  </Badge>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cohortData?.kaplanMeier || []}>
                      <defs>
                        <linearGradient id="survivalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" label={{ value: "Months Post-Diagnosis", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis stroke="#64748b" domain={[0, 100]} label={{ value: "Survival %", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                        formatter={(val: number) => [`${val}%`, "Survival Probability"]}
                        labelFormatter={(m) => `Month ${m}`}
                      />
                      <Area type="monotone" dataKey="survivalRate" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#survivalGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* At Risk Table */}
                <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs font-mono">
                  {cohortData?.kaplanMeier.map((pt) => (
                    <div key={pt.month} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Mo {pt.month}</span>
                      <span className="font-bold text-slate-200">{pt.survivalRate}%</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{pt.atRisk} at risk</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Mutation Frequencies Tab */}
              <TabsContent value="breakdown" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mutation Frequencies Bar Chart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                      Top Mutation Frequencies in Cohort
                    </h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cohortData?.mutationFrequencies || []} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis type="number" domain={[0, 60]} stroke="#64748b" fontSize={11} unit="%" />
                          <YAxis type="category" dataKey="gene" stroke="#94a3b8" fontSize={11} width={60} />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                            formatter={(val: number) => [`${val}%`, "Frequency"]}
                          />
                          <Bar dataKey="percentage" fill="#38bdf8" radius={[0, 4, 4, 0]}>
                            {cohortData?.mutationFrequencies.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? "#f43f5e" : "#38bdf8"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Stage Distribution Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                      Stage Distribution Breakdown
                    </h4>
                    <div className="space-y-3 pt-2">
                      {cohortData?.stageDistribution.map((stg) => (
                        <div key={stg.stage} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-300">{stg.stage}</span>
                            <span className="text-slate-400 font-mono">
                              {stg.count.toLocaleString()} pts ({stg.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-primary dark:bg-brand-maroon h-full rounded-full"
                              style={{ width: `${stg.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Inspector Tab */}
              <TabsContent value="inspector" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-sky-400" />
                    mCODE & GA4GH Standard Query Inspector
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyText(cohortData?.mcodeQueryJson || "")}
                    className="border-slate-700 bg-slate-950 text-xs text-slate-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? "Copied" : "Copy mCODE JSON"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-sky-300 font-bold uppercase">HL7 mCODE FHIR Bundle Query</span>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-200 h-64 overflow-auto shadow-inner">
                      {cohortData?.mcodeQueryJson}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">GA4GH Beacon v2 Specification Query</span>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-200 h-64 overflow-auto shadow-inner">
                      {cohortData?.ga4ghBeaconQueryJson}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* De-identified Sample Patients Preview Table */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  De-Identified Patient Cohort Preview
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Randomized Safe Harbor Token IDs
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                      <th className="py-2 px-3">De-ID Token</th>
                      <th className="py-2 px-3">Age / Gender</th>
                      <th className="py-2 px-3">Primary Diagnosis</th>
                      <th className="py-2 px-3">Stage</th>
                      <th className="py-2 px-3">Biomarker</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                    <tr className="hover:bg-slate-950/60">
                      <td className="py-2.5 px-3 text-sky-300 font-bold">DEID-BEACON-89421</td>
                      <td className="py-2.5 px-3">58 / Female</td>
                      <td className="py-2.5 px-3">Invasive Breast Carcinoma</td>
                      <td className="py-2.5 px-3"><Badge className="bg-red-950 text-red-300 border-red-800 text-[10px]">Stage III</Badge></td>
                      <td className="py-2.5 px-3 text-emerald-400">BRCA1 Pathogenic</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link to="/patient-360?id=UC-BEACON-89421">
                          <Button size="sm" variant="ghost" className="h-7 text-[11px] text-sky-400 hover:text-white px-2">
                            Launch 360 <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="py-2.5 px-3 text-sky-300 font-bold">DEID-BEACON-77102</td>
                      <td className="py-2.5 px-3">62 / Female</td>
                      <td className="py-2.5 px-3">Invasive Breast Carcinoma</td>
                      <td className="py-2.5 px-3"><Badge className="bg-red-950 text-red-300 border-red-800 text-[10px]">Stage IV</Badge></td>
                      <td className="py-2.5 px-3 text-emerald-400">BRCA2 + TP53</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link to="/patient-360?id=UC-BEACON-89421">
                          <Button size="sm" variant="ghost" className="h-7 text-[11px] text-sky-400 hover:text-white px-2">
                            Launch 360 <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-950/60">
                      <td className="py-2.5 px-3 text-sky-300 font-bold">DEID-BEACON-66409</td>
                      <td className="py-2.5 px-3">51 / Female</td>
                      <td className="py-2.5 px-3">High-Grade Serous Ovarian</td>
                      <td className="py-2.5 px-3"><Badge className="bg-red-950 text-red-300 border-red-800 text-[10px]">Stage III</Badge></td>
                      <td className="py-2.5 px-3 text-emerald-400">BRCA1 Pathogenic</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link to="/patient-360?id=UC-BEACON-89421">
                          <Button size="sm" variant="ghost" className="h-7 text-[11px] text-sky-400 hover:text-white px-2">
                            Launch 360 <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Export Dialog */}
        <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-sky-400" /> Export De-identified Cohort Dataset
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Data export request is governed by dynamic OPA policy and IRB-DEMO-0000.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Matched Patient Count</span>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  {cohortData?.filteredCount.toLocaleString()} Cohort Patients
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Differential privacy noise parameter <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">ε = 0.1</code> will be injected into numerical aggregations to guarantee zero re-identification risk.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setExportModalOpen(false)} className="text-xs text-slate-400">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleCopyText(cohortData?.mcodeQueryJson || "");
                    setExportModalOpen(false);
                  }}
                  className="bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white font-semibold text-xs"
                >
                  Confirm & Download Dataset
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
