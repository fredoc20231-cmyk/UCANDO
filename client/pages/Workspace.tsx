import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { VolcanoPlot } from "@/components/scientific/VolcanoPlot";
import { PcaPlot } from "@/components/scientific/PcaPlot";
import { HeatmapMatrix } from "@/components/scientific/HeatmapMatrix";
import { DifferentialExpressionTable } from "@/components/scientific/DifferentialExpressionTable";
import { GeneExpressionBoxplot } from "@/components/scientific/GeneExpressionBoxplot";
import { EnrichmentBarPlot } from "@/components/scientific/EnrichmentBarPlot";
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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    selectedGene
  } = useRnaSeq();

  const [activeTab, setActiveTab] = useState<"overview" | "volcano" | "pca" | "heatmap" | "table" | "pathways">("overview");
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleRunAnalysis = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      toast.success("DESeq2 model fitted with current parameters and Wald test re-evaluated.");
    }, 450);
  };

  const handleResetDefaults = () => {
    setPadjThreshold(0.05);
    setLfcThreshold(1.0);
    setNormalizationMethod("DESeq2 Median of Ratios");
    setDesignFormula("~ batch + condition");
    setBatchCovariate("Batch (Sequencing Center)");
    setMultiTestingCorrection("Benjamini-Hochberg (FDR)");
    toast.info("Restored default statistical parameters.");
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col min-h-0 bg-background font-sans">
        
        {/* Module Page Header & Compact Toolbar */}
        <div className="border-b border-border bg-card/80 px-4 sm:px-6 py-3">
          <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
                  RNA-seq Analysis Workspace
                </h1>
                <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
                  GLM Engine
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Integrated differential transcript quantification, dimensional reduction, unsupervised clustering, and pathway activity scoring.
              </p>
            </div>

            {/* Compact Toolbar Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDefaults}
                className="h-8 px-2.5 text-xs border-border text-muted-foreground hover:text-foreground gap-1.5"
                title="Reset Parameters to Default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </Button>

              <Button
                size="sm"
                onClick={handleRunAnalysis}
                disabled={isRecalculating}
                className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-subtle gap-1.5"
              >
                <Play className={`w-3.5 h-3.5 ${isRecalculating ? "animate-spin" : ""}`} />
                <span>{isRecalculating ? "Refitting GLM..." : "Run Analysis"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stable Two-Pane Desktop Layout with Independent Scrolling */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 max-w-[1700px] w-full mx-auto">
          
          {/* Left Pane: Dataset & Model Configuration (Independently Scrolling) */}
          <aside className="w-full lg:w-[340px] xl:w-[360px] border-b lg:border-b-0 lg:border-r border-border bg-card/50 lg:overflow-y-auto p-4 space-y-5 shrink-0 text-xs">
            
            {/* 1. Dataset Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  <span>Cohort Dataset</span>
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">N={activeDataset.sampleCount}</span>
              </div>

              <Select value={activeDataset.id} onValueChange={(val) => selectDataset(val)}>
                <SelectTrigger className="h-9 text-xs bg-background border-border">
                  <SelectValue placeholder="Select dataset" />
                </SelectTrigger>
                <SelectContent className="font-sans text-xs">
                  {allDatasets.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-[11px] text-muted-foreground leading-tight">
                {activeDataset.description}
              </div>
            </div>

            {/* 2. Experimental Contrast */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                <span>Experimental Contrast</span>
              </Label>
              <div className="p-2.5 rounded-md bg-surface border border-border space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Test (Contrast):</span>
                  <span className="font-semibold text-primary">{activeDataset.primaryContrast.groupA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference (Baseline):</span>
                  <span className="font-semibold text-foreground">{activeDataset.primaryContrast.groupB}</span>
                </div>
              </div>
            </div>

            {/* 3. Statistical Model & Normalization */}
            <div className="space-y-3 pt-3 border-t border-border">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Model & Normalization</span>
              </Label>

              <div>
                <Label className="text-[11px] text-muted-foreground">Normalization Method</Label>
                <Select value={normalizationMethod} onValueChange={setNormalizationMethod}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs">
                    <SelectItem value="DESeq2 Median of Ratios">DESeq2 Median of Ratios (rlog)</SelectItem>
                    <SelectItem value="TMM (edgeR)">TMM (Trimmed Mean of M-values)</SelectItem>
                    <SelectItem value="TPM">TPM (Transcripts Per Kilobase Million)</SelectItem>
                    <SelectItem value="FPKM-UQ">FPKM-UQ (Upper Quartile)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[11px] text-muted-foreground">Statistical Design Formula</Label>
                <Input
                  value={designFormula}
                  onChange={(e) => setDesignFormula(e.target.value)}
                  className="mt-1 h-8 text-xs font-mono bg-background border-border"
                />
              </div>

              <div>
                <Label className="text-[11px] text-muted-foreground">Batch Covariate</Label>
                <Select value={batchCovariate} onValueChange={setBatchCovariate}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs">
                    <SelectItem value="Batch (Sequencing Center)">Batch (Sequencing Center)</SelectItem>
                    <SelectItem value="None (Unadjusted)">None (Unadjusted)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[11px] text-muted-foreground">Multiple Testing Correction</Label>
                <Select value={multiTestingCorrection} onValueChange={setMultiTestingCorrection}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans text-xs">
                    <SelectItem value="Benjamini-Hochberg (FDR)">Benjamini-Hochberg (FDR)</SelectItem>
                    <SelectItem value="Bonferroni">Bonferroni (FWER)</SelectItem>
                    <SelectItem value="Storey q-value">Storey q-value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 4. Significance & Effect Thresholds */}
            <div className="space-y-3 pt-3 border-t border-border">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-accent" />
                <span>Significance Thresholds</span>
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
            <div className="p-3 rounded-md bg-surface border border-border space-y-1.5">
              <div className="font-semibold text-foreground text-[11px]">Active Results Summary</div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Significantly Upregulated:</span>
                <span className="font-mono font-bold text-primary tabular-nums">+{upregulatedCount}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Significantly Downregulated:</span>
                <span className="font-mono font-bold text-accent tabular-nums">-{downregulatedCount}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Nonsignificant:</span>
                <span className="font-mono text-muted-foreground tabular-nums">{nonsignificantCount}</span>
              </div>
            </div>

          </aside>

          {/* Right Pane: Responsive Scientific Results & Visualizations (Independently Scrolling) */}
          <section className="flex-1 lg:overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* View Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border">
              <div className="flex flex-wrap items-center gap-1 bg-surface p-0.5 rounded-md border border-border">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Workspace Overview
                </button>
                <button
                  onClick={() => setActiveTab("volcano")}
                  className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                    activeTab === "volcano"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Volcano Plot
                </button>
                <button
                  onClick={() => setActiveTab("pca")}
                  className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                    activeTab === "pca"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  PCA / UMAP
                </button>
                <button
                  onClick={() => setActiveTab("heatmap")}
                  className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                    activeTab === "heatmap"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Heatmap
                </button>
                <button
                  onClick={() => setActiveTab("table")}
                  className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                    activeTab === "table"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Results Table
                </button>
                <button
                  onClick={() => setActiveTab("pathways")}
                  className={`px-3 py-1.5 rounded text-xs font-sans font-medium transition-colors ${
                    activeTab === "pathways"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pathways (GSEA)
                </button>
              </div>

              {selectedGene && (
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span>Selected: </span>
                  <span className="font-bold text-foreground px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                    {selectedGene.geneSymbol}
                  </span>
                </div>
              )}
            </div>

            {/* Render Active View or Multi-card Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Row 1: Volcano Plot & PCA / UMAP side by side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <VolcanoPlot />
                  <PcaPlot />
                </div>

                {/* Row 2: Clustered Heatmap & Gene Expression Boxplot */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <HeatmapMatrix />
                  <GeneExpressionBoxplot />
                </div>

                {/* Row 3: Differential Expression Table */}
                <DifferentialExpressionTable />

                {/* Row 4: Pathway Enrichment */}
                <EnrichmentBarPlot />
              </div>
            )}

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
                <GeneExpressionBoxplot />
              </div>
            )}

            {activeTab === "pathways" && (
              <div className="space-y-6">
                <EnrichmentBarPlot />
              </div>
            )}

          </section>

        </div>
      </div>
    </Layout>
  );
};

export default Workspace;
