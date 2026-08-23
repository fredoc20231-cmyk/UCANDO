import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { CohortQueryResponse, CohortFilterCriteria } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dna,
  FlaskConical,
  Activity
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
  { symbol: "BRCA1", name: "BRCA1 DNA Repair", color: "#157F8F" },
  { symbol: "BRCA2", name: "BRCA2 DNA Repair", color: "#0E5E6B" },
  { symbol: "TP53", name: "Tumor Protein 53", color: "#7D1B2D" },
  { symbol: "PIK3CA", name: "PI3-Kinase Alpha", color: "#9E2A3E" },
  { symbol: "EGFR", name: "EGF Receptor", color: "#0D8269" },
  { symbol: "ERBB2", name: "HER2 Oncogene", color: "#B45309" }
];

export default function CohortBuilder() {
  const navigate = useNavigate();
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

  const launchInRnaSeqWorkspace = () => {
    navigate("/workspace");
  };

  const getExportJson = () => {
    if (!cohortData) return "{}";
    if (exportFormat === "beacon") {
      return cohortData.ga4ghBeaconQueryJson || "{}";
    }
    return cohortData.mcodeQueryJson || "{}";
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <SlidersHorizontal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif text-foreground">Visual Cohort Query Builder</h1>
                  <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                    De-identified Enclave Tier 1
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Multi-attribute cohort stratification across 98,450 consented cancer patients, integrated with mCODE FHIR and GA4GH Beacon v2.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setExportModalOpenFormat("mcode");
                  setExportModalOpen(true);
                }}
                className="text-xs border-border hover:bg-muted text-foreground"
              >
                <Code className="w-3.5 h-3.5 mr-1.5 text-accent" /> Export mCODE FHIR
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setExportModalOpenFormat("beacon");
                  setExportModalOpen(true);
                }}
                className="text-xs border-border hover:bg-muted text-foreground"
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-primary" /> GA4GH Query
              </Button>
              <Button
                size="sm"
                onClick={launchInRnaSeqWorkspace}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-subtle"
              >
                <Dna className="w-3.5 h-3.5 mr-1.5" /> Launch in RNA-seq Platform
              </Button>
            </div>
          </div>

          {/* Preset Chips & Privacy Budget Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-border">
            <div className="lg:col-span-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Clinical Presets:
              </span>
              <Button
                size="sm"
                variant={activePreset === "brca" ? "default" : "outline"}
                onClick={() => applyPreset("brca")}
                className={`text-xs h-7 rounded-md font-semibold ${
                  activePreset === "brca"
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                BRCA1/2 PARP Cohort
              </Button>
              <Button
                size="sm"
                variant={activePreset === "tnbc" ? "default" : "outline"}
                onClick={() => applyPreset("tnbc")}
                className={`text-xs h-7 rounded-md font-semibold ${
                  activePreset === "tnbc"
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                Triple Negative Breast (TNBC)
              </Button>
              <Button
                size="sm"
                variant={activePreset === "lung_egfr" ? "default" : "outline"}
                onClick={() => applyPreset("lung_egfr")}
                className={`text-xs h-7 rounded-md font-semibold ${
                  activePreset === "lung_egfr"
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                NSCLC EGFR Mutated
              </Button>
            </div>

            {/* Differential Privacy Budget Indicator */}
            <div className="p-2.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
                <span className="text-muted-foreground font-sans">Differential Privacy:</span>
              </div>
              <span className="font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/30 tabular-nums">
                {cohortData ? cohortData.privacyBudgetRemainingEpsilon : 98.4} / 100.0 ε
              </span>
            </div>
          </div>
        </div>

        {/* Query Layout: Left Criteria Filter Sidebar + Right Analytics Main */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Query Filter Sidebar */}
          <div className="lg:col-span-1 space-y-5 p-5 rounded-xl bg-card border border-border shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-sm font-bold text-foreground flex items-center gap-2 font-serif">
                <Filter className="w-4 h-4 text-accent" /> Filter Criteria
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-[11px] text-muted-foreground hover:text-foreground px-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>

            {/* Diagnoses Filter */}
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
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
                          ? "bg-accent/10 border-accent/40 text-foreground font-semibold"
                          : "bg-surface border-border text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                      onClick={() => toggleDiagnosis(diag)}
                    >
                      <Checkbox checked={isChecked} className="mt-0.5 border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                      <span className="leading-snug">{diag}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Disease Stage */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
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
                          ? "bg-primary text-primary-foreground border-primary shadow-subtle"
                          : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Genomic Biomarkers */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
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
                          ? "bg-accent/10 border-accent/40 text-foreground"
                          : "bg-surface border-border text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isChecked} className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                        <span className="font-mono font-bold text-foreground">{gene.symbol}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{gene.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Biospecimen & Specimen Required */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  filters.hasBiospecimen
                    ? "bg-accent/10 border-accent/40 text-foreground font-semibold"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  const newF = { ...filters, hasBiospecimen: !filters.hasBiospecimen };
                  setFilters(newF);
                  fetchCohortData(newF);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-accent" />
                  <span>LIMS Biospecimen Available</span>
                </div>
                <Checkbox checked={filters.hasBiospecimen} className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
              </label>
            </div>
          </div>

          {/* Analytics Main Workspace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Live Cohort Count Headline Stat */}
            <div className="p-5 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-4 shadow-subtle">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">
                  Matching Cohort Subgroup
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-primary font-mono tabular-nums">
                    {loading ? "Calculating..." : cohortData?.filteredCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans">
                    out of <strong className="text-foreground">98,450</strong> total consented Commons patients
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-accent/10 text-accent border-accent/30 text-xs px-3 py-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Dynamic OPA Verified
                </Badge>
              </div>
            </div>

            {/* Tabs for Kaplan-Meier & Mutation Frequency & Standards Spec */}
            <Tabs defaultValue="survival" className="space-y-4">
              <TabsList className="bg-muted border border-border p-1 rounded-lg">
                <TabsTrigger
                  value="survival"
                  className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground transition-all"
                >
                  <TrendingDown className="w-3.5 h-3.5 mr-1.5 text-accent" /> Kaplan-Meier Survival Curve
                </TabsTrigger>
                <TabsTrigger
                  value="breakdown"
                  className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground transition-all"
                >
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-primary" /> Mutations & Subtypes
                </TabsTrigger>
                <TabsTrigger
                  value="inspector"
                  className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> mCODE & GA4GH Query Spec
                </TabsTrigger>
              </TabsList>

              {/* Kaplan-Meier Survival Tab */}
              <TabsContent value="survival" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold font-serif text-foreground">Overall Survival (5-Year Kaplan-Meier Estimate)</h3>
                    <p className="text-xs text-muted-foreground">
                      Calculated across {cohortData?.filteredCount.toLocaleString()} matched cohort records with 95% confidence interval bands.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
                      Log-Rank p = 0.0031
                    </Badge>
                    <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                      HR = 0.48 [95% CI: 0.31-0.74]
                    </Badge>
                  </div>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cohortData?.kaplanMeier || []}>
                      <defs>
                        <linearGradient id="survivalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#157F8F" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#157F8F" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" label={{ value: "Months Post-Diagnosis", position: "insideBottom", offset: -5, fill: "var(--muted-foreground)", fontSize: 11 }} />
                      <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} label={{ value: "Survival %", angle: -90, position: "insideLeft", fill: "var(--muted-foreground)", fontSize: 11 }} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", fontSize: "12px", color: "var(--foreground)" }}
                        formatter={(val: number) => [`${val}%`, "Survival Probability"]}
                        labelFormatter={(m) => `Month ${m}`}
                      />
                      <Area type="monotone" dataKey="survivalRate" stroke="#157F8F" strokeWidth={2.5} fillOpacity={1} fill="url(#survivalGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* At Risk Table */}
                <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs font-mono">
                  {cohortData?.kaplanMeier.map((pt) => (
                    <div key={pt.month} className="p-2 rounded-lg bg-surface border border-border">
                      <span className="text-[10px] text-muted-foreground block">Mo {pt.month}</span>
                      <span className="font-bold text-foreground tabular-nums">{pt.survivalRate}%</span>
                      <span className="text-[9px] text-muted-foreground block mt-0.5 tabular-nums">{pt.atRisk} at risk</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Mutation Frequencies Tab */}
              <TabsContent value="breakdown" className="p-6 rounded-xl bg-card border border-border space-y-6 shadow-subtle">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mutation Frequencies Bar Chart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                      Top Mutation Frequencies in Cohort
                    </h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cohortData?.mutationFrequencies || []} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis type="number" domain={[0, 60]} stroke="var(--muted-foreground)" fontSize={11} unit="%" />
                          <YAxis type="category" dataKey="gene" stroke="var(--muted-foreground)" fontSize={11} width={60} />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", fontSize: "12px", color: "var(--foreground)" }}
                            formatter={(val: number) => [`${val}%`, "Frequency"]}
                          />
                          <Bar dataKey="percentage" fill="#157F8F" radius={[0, 4, 4, 0]}>
                            {cohortData?.mutationFrequencies.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? "#7D1B2D" : "#157F8F"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Stage Distribution Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                      Stage Distribution Breakdown
                    </h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cohortData?.stageDistribution || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={11} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", fontSize: "12px", color: "var(--foreground)" }}
                            formatter={(val: number) => [`${val} patients`, "Count"]}
                          />
                          <Bar dataKey="count" fill="#7D1B2D" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Inspector Tab */}
              <TabsContent value="inspector" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                    Structured GA4GH Beacon v2 & mCODE JSON Payload
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyText(getExportJson())}
                    className="h-7 text-xs border-border hover:bg-muted text-foreground"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1 text-primary" /> : <Copy className="w-3 h-3 mr-1 text-muted-foreground" />}
                    {copied ? "Copied" : "Copy Payload"}
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-surface border border-border font-mono text-[11px] text-foreground overflow-x-auto max-h-72">
                  <pre>{getExportJson()}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Export Dialog */}
        <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
          <DialogContent className="max-w-2xl bg-card border-border text-foreground shadow-elevated">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-serif text-foreground flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Export Cohort Data ({exportFormat.toUpperCase()})
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Exporting {cohortData?.filteredCount.toLocaleString()} de-identified patient records adhering to Safe Harbor rules.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="p-3 rounded-lg bg-surface border border-border font-mono text-[11px] max-h-60 overflow-y-auto">
                <pre>{getExportJson()}</pre>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Checksum: <code className="font-mono text-foreground">sha256:7e8b9a...</code></span>
                <Button
                  onClick={() => {
                    handleCopyText(getExportJson());
                    setExportModalOpen(false);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-subtle"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download Export Package
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
