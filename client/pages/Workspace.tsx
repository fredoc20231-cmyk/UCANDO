import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq, DESIGN_FORMULA_OPTIONS } from "@/context/RnaSeqContext";
import { VolcanoPlot } from "@/components/scientific/VolcanoPlot";
import { PcaPlot } from "@/components/scientific/PcaPlot";
import { HeatmapMatrix } from "@/components/scientific/HeatmapMatrix";
import { DifferentialExpressionTable } from "@/components/scientific/DifferentialExpressionTable";
import { GeneExpressionBoxplot } from "@/components/scientific/GeneExpressionBoxplot";
import { EnrichmentBarPlot } from "@/components/scientific/EnrichmentBarPlot";
import { ExperimentalDesignModal } from "@/components/ExperimentalDesignModal";
import { 
  SlidersHorizontal, 
  Database, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Play, 
  RotateCcw, 
  Filter, 
  HelpCircle,
  FileCode,
  Share2,
  Check,
  Dna,
  PieChart,
  LineChart,
  Sparkles,
  Info,
  GitFork,
  Cpu,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Workspace: React.FC = () => {
  const {
    activeDataset,
    allDatasets,
    selectDataset,
    padjThreshold,
    setPadjThreshold,
    lfcThreshold,
    setLfcThreshold,
    normalizationMethod,
    setNormalizationMethod,
    designFormula,
    setDesignFormula,
    batchCovariate,
    setBatchCovariate,
    multiTestingCorrection,
    setMultiTestingCorrection,
    geneSearchQuery,
    setGeneSearchQuery,
    upregulatedCount,
    downregulatedCount,
    nonsignificantCount,
    selectedGene,
    isDesignModalOpen,
    setIsDesignModalOpen,
    sequencingPlatform,
    uploadInputType,
    groupsList
  } = useRnaSeq();

  const [activeTab, setActiveTab] = useState<"overview" | "volcano" | "pca" | "heatmap" | "table" | "pathways">("overview");
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      toast.success("GLM dispersion fits and Wald statistics updated.");
    }, 500);
  };

  const handleResetDefaults = () => {
    setPadjThreshold(0.01);
    setLfcThreshold(1.0);
    setNormalizationMethod("DESeq2 Median of Ratios");
    setDesignFormula("~ batch + condition");
    setBatchCovariate("Batch (Sequencing Center)");
    setMultiTestingCorrection("Benjamini-Hochberg (FDR)");
    toast.info("Parameters reset to publication defaults (FDR ≤ 0.01, |log₂FC| ≥ 1.0).");
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col min-h-0 bg-background font-sans">
        {/* Workspace Toolbar / Header */}
        <div className="border-b border-border bg-card px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-foreground tracking-tight">
                Analysis Workspace
              </span>
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                DESeq2 GLM
              </Badge>
            </div>
            
            <div className="h-4 w-px bg-border hidden sm:block" />
            
            <div className="text-xs text-muted-foreground hidden md:block">
              Dataset: <span className="font-semibold text-foreground">{activeDataset.name}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDesignModalOpen(true)}
              className="text-xs border-primary/40 text-primary hover:bg-primary/5 h-8 font-mono"
            >
              <GitFork className="w-3.5 h-3.5 mr-1" /> Configure Design & Platform
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="text-xs border-border hover:bg-muted text-muted-foreground h-8"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
            </Button>

            <Button
              size="sm"
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 shadow-subtle"
            >
              <Play className={`w-3.5 h-3.5 mr-1.5 ${isRecalculating ? "animate-spin" : ""}`} />
              {isRecalculating ? "Refitting GLM..." : "Run Analysis"}
            </Button>
          </div>
        </div>

        {/* Workspace Two-Pane Body */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* LEFT PANE: Dataset Selector, Model Settings & Thresholds */}
          <aside className="w-full lg:w-80 lg:shrink-0 border-r border-border bg-card p-4 overflow-y-auto space-y-5 lg:h-[calc(100vh-130px)]">
            
            {/* 1. Dataset Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  <span>1. Reference Dataset</span>
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">N={activeDataset.sampleCount}</span>
              </div>

              <Select value={activeDataset.id} onValueChange={(val) => selectDataset(val)}>
                <SelectTrigger className="h-9 text-xs bg-surface border-border">
                  <SelectValue placeholder="Select dataset" />
                </SelectTrigger>
                <SelectContent className="font-sans text-xs bg-card border-border">
                  {allDatasets.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-[11px] text-muted-foreground leading-tight font-sans">
                {activeDataset.description}
              </div>
            </div>

            {/* 2. Experimental Contrast & Groups */}
            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                  <span>2. Experimental Contrast</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setIsDesignModalOpen(true)}
                  className="text-[10px] text-primary hover:underline font-mono"
                >
                  Edit Groups
                </button>
              </div>
              <div className="p-2.5 rounded-md bg-surface border border-border space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Test Group:</span>
                  <span className="font-semibold text-primary">{activeDataset.primaryContrast.groupA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-semibold text-foreground">{activeDataset.primaryContrast.groupB}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
                  <span>Total Groups:</span>
                  <span className="text-accent font-bold">{groupsList.length} groups configured</span>
                </div>
              </div>
            </div>

            {/* 3. Statistical Model & Normalization */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  <span>3. Model & Formula</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setIsDesignModalOpen(true)}
                  className="text-[10px] text-accent hover:underline font-mono"
                >
                  Design Modal
                </button>
              </div>

              {/* Statistical Design Formula Dropdown Menu */}
              <div>
                <Label className="text-[11px] text-muted-foreground font-mono">Statistical Design Formula</Label>
                <Select value={designFormula} onValueChange={setDesignFormula}>
                  <SelectTrigger className="mt-1 h-8 text-xs font-mono bg-surface border-border text-foreground">
                    <SelectValue placeholder="Select design formula..." />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs bg-card border-border max-h-72">
                    {DESIGN_FORMULA_OPTIONS.map((opt) => (
                      <SelectItem key={opt.formula} value={opt.formula} className="text-xs font-mono py-1.5">
                        <div className="space-y-0.5">
                          <div className="font-bold text-primary">{opt.formula}</div>
                          <div className="text-[10px] text-muted-foreground font-sans">{opt.label}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Normalization Method */}
              <div>
                <Label className="text-[11px] text-muted-foreground">Normalization Method</Label>
                <Select value={normalizationMethod} onValueChange={setNormalizationMethod}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-surface border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs bg-card border-border">
                    <SelectItem value="DESeq2 Median of Ratios">DESeq2 Median of Ratios (rlog)</SelectItem>
                    <SelectItem value="TMM (edgeR)">TMM (Trimmed Mean of M-values)</SelectItem>
                    <SelectItem value="TPM">TPM (Transcripts Per Kilobase Million)</SelectItem>
                    <SelectItem value="FPKM-UQ">FPKM-UQ (Upper Quartile)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Batch Covariate */}
              <div>
                <Label className="text-[11px] text-muted-foreground">Batch Covariate</Label>
                <Select value={batchCovariate} onValueChange={setBatchCovariate}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-surface border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs bg-card border-border">
                    <SelectItem value="Batch (Sequencing Center)">Batch (Sequencing Center)</SelectItem>
                    <SelectItem value="None (Unadjusted)">None (Unadjusted)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Multiple Testing Correction */}
              <div>
                <Label className="text-[11px] text-muted-foreground">Multiple Testing Correction</Label>
                <Select value={multiTestingCorrection} onValueChange={setMultiTestingCorrection}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-surface border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs bg-card border-border">
                    <SelectItem value="Benjamini-Hochberg (FDR)">Benjamini-Hochberg (FDR)</SelectItem>
                    <SelectItem value="Bonferroni">Bonferroni (FWER)</SelectItem>
                    <SelectItem value="Storey q-value">Storey q-value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 4. Significance & Effect Thresholds */}
            <div className="space-y-3 pt-3 border-t border-border">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
                <Filter className="w-3.5 h-3.5 text-accent" />
                <span>4. Significance Thresholds</span>
              </Label>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">FDR Threshold (padj &le;)</span>
                  <span className="font-mono font-bold text-foreground">{padjThreshold}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0.05, 0.01, 0.001].map((val) => (
                    <button
                      key={val}
                      onClick={() => setPadjThreshold(val)}
                      className={`py-1 rounded text-[11px] font-mono border transition-colors ${
                        padjThreshold === val
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-subtle"
                          : "bg-surface text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      &le; {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">Effect Size (|log₂FC| &ge;)</span>
                  <span className="font-mono font-bold text-foreground">{lfcThreshold} (2^{lfcThreshold}-fold)</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.58, 1.0, 1.5, 2.0].map((val) => (
                    <button
                      key={val}
                      onClick={() => setLfcThreshold(val)}
                      className={`py-1 rounded text-[11px] font-mono border transition-colors ${
                        lfcThreshold === val
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-subtle"
                          : "bg-surface text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      &ge; {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Summary Stats Counter */}
            <div className="p-3 rounded-md bg-surface border border-border space-y-1.5 font-mono">
              <div className="font-semibold text-foreground text-[11px] font-serif">Active Results Summary</div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Significantly Upregulated:</span>
                <span className="font-mono font-bold text-primary tabular-nums">+{upregulatedCount}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Significantly Downregulated:</span>
                <span className="font-mono font-bold text-accent tabular-nums">-{downregulatedCount}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Non-Significant:</span>
                <span className="font-mono text-muted-foreground tabular-nums">{nonsignificantCount}</span>
              </div>
            </div>

            {/* 6. Ingestion Pipeline & Platform Info */}
            <div className="p-3 rounded-md bg-surface border border-border space-y-1 text-xs font-mono">
              <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Instrument & Input</span>
              <p className="text-foreground font-semibold text-[11px] truncate">{sequencingPlatform}</p>
              <Badge
                variant="outline"
                className="text-[9px] border-accent/40 text-accent bg-accent/5 font-mono mt-1"
              >
                {uploadInputType === "raw_fastq"
                  ? "Raw FASTQ (From Scratch)"
                  : uploadInputType === "read_counts"
                  ? "Read Counts (DESeq2)"
                  : "Final Processed Files"}
              </Badge>
            </div>
          </aside>

          {/* RIGHT PANE: Scientific Plots, Dense Tables, and Provenance */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 lg:h-[calc(100vh-130px)] bg-background">
            
            {/* View Mode Tabs Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === "overview"
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Workspace Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("volcano")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === "volcano"
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Volcano Plot
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pca")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === "pca"
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  PCA / UMAP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("heatmap")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === "heatmap"
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Expression Heatmap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("table")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === "table"
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Differential Expression Table
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pathways")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === "pathways"
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  GSEA Pathways
                </button>
              </div>

              {/* Search in genes */}
              <div className="w-full sm:w-64">
                <Input
                  value={geneSearchQuery}
                  onChange={(e) => setGeneSearchQuery(e.target.value)}
                  placeholder="Search gene symbol or Ensembl ID..."
                  className="h-8 text-xs bg-surface border-border font-mono"
                />
              </div>
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Top Row: Volcano & PCA Plots */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <VolcanoPlot />
                  <PcaPlot />
                </div>

                {/* Middle Row: Heatmap Matrix & Selected Gene Boxplot */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <HeatmapMatrix />
                  </div>
                  <div className="xl:col-span-1">
                    <GeneExpressionBoxplot />
                  </div>
                </div>

                {/* Bottom Row: Differential Expression Table */}
                <DifferentialExpressionTable />

                {/* Pathway Enrichment Overview */}
                <EnrichmentBarPlot />
              </div>
            )}

            {/* Individual Tab Displays */}
            {activeTab === "volcano" && (
              <div className="space-y-6">
                <VolcanoPlot />
                <GeneExpressionBoxplot />
              </div>
            )}

            {activeTab === "pca" && (
              <div className="space-y-6">
                <PcaPlot />
              </div>
            )}

            {activeTab === "heatmap" && (
              <div className="space-y-6">
                <HeatmapMatrix />
              </div>
            )}

            {activeTab === "table" && (
              <div className="space-y-6">
                <DifferentialExpressionTable />
              </div>
            )}

            {activeTab === "pathways" && (
              <div className="space-y-6">
                <EnrichmentBarPlot />
              </div>
            )}
          </main>
        </div>

        {/* Modal */}
        <ExperimentalDesignModal
          open={isDesignModalOpen}
          onOpenChange={setIsDesignModalOpen}
        />
      </div>
    </Layout>
  );
};

export default Workspace;
