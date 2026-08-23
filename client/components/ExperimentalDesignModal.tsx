import React, { useState } from "react";
import { useRnaSeq, DESIGN_FORMULA_OPTIONS, GroupDesignationType, UploadInputType } from "@/context/RnaSeqContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  GitFork,
  Sliders,
  Cpu,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Binary,
  FlaskConical,
  Activity,
  FileSpreadsheet,
  FileCode,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface ExperimentalDesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExperimentalDesignModal: React.FC<ExperimentalDesignModalProps> = ({
  open,
  onOpenChange
}) => {
  const {
    designFormula,
    setDesignFormula,
    groupDesignation,
    groupCount,
    groupsList,
    setGroupsList,
    baselineGroup,
    setBaselineGroup,
    contrastGroup,
    setContrastGroup,
    updateExperimentalGroups,
    sequencingPlatform,
    setSequencingPlatform,
    libraryProtocol,
    setLibraryProtocol,
    readType,
    setReadType,
    meanReadDepth,
    setMeanReadDepth,
    uploadInputType,
    setUploadInputType,
    pipelineStartingPointDescription,
    activeDataset
  } = useRnaSeq();

  const [customFormula, setCustomFormula] = useState(designFormula);
  const [selectedPresetType, setSelectedPresetType] = useState<GroupDesignationType>(groupDesignation);
  const [selectedCount, setSelectedCount] = useState<number>(groupCount);
  const [localGroupNames, setLocalGroupNames] = useState<string[]>([...groupsList]);

  const handleApplyPreset = (type: GroupDesignationType, count: number = 2) => {
    setSelectedPresetType(type);
    setSelectedCount(count);
    updateExperimentalGroups(type, count);
    if (type === "control_treated") {
      setLocalGroupNames(["Control (Vehicle)", "Treated (Active Compound)"]);
    } else if (type === "diseased_normal") {
      setLocalGroupNames(["Adjacent Normal Tissue", "Primary Malignant Tumor"]);
    } else if (type === "time_0_t2") {
      setLocalGroupNames(["Time 0 (Baseline)", "T2 (Post-Treatment 2h)"]);
    } else if (type === "time_series") {
      const g: string[] = [];
      for (let i = 0; i <= count; i++) {
        if (i === 0) g.push("T0 (Baseline)");
        else g.push(`T${i} (Timepoint ${i})`);
      }
      setLocalGroupNames(g);
    } else if (type === "subtype") {
      setLocalGroupNames(["Basal-like (TNBC)", "Luminal A (ER+/HER2-)"]);
    }
  };

  const handleGroupNameChange = (index: number, newName: string) => {
    const updated = [...localGroupNames];
    updated[index] = newName;
    setLocalGroupNames(updated);
    setGroupsList(updated);
  };

  const handleSaveAndApply = () => {
    toast.success("Experimental design and sequencing metadata updated.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] overflow-y-auto bg-card border-border text-foreground shadow-elevated">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                Statistical Experimental Design & Sequencing Metadata
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Configure generalized linear model (GLM) formulas, group designations (Control/Treated, Diseased/Normal, T0–T10 Time Series), sequencing platforms, and analysis starting points.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Live Active Context Banner */}
        <div className="p-3.5 rounded-xl bg-surface border border-border grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Active Design Formula</span>
            <span className="font-bold text-primary font-mono text-xs mt-0.5 block">{designFormula}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Groups & Contrast</span>
            <span className="font-bold text-foreground text-xs mt-0.5 block truncate">
              {groupsList.length} groups ({groupsList[0]} vs {groupsList[groupsList.length - 1]})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Sequencing Platform</span>
            <span className="font-bold text-accent text-xs mt-0.5 block truncate">{sequencingPlatform}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Input Pipeline Mode</span>
            <Badge
              className={
                uploadInputType === "raw_fastq"
                  ? "bg-primary/15 text-primary border-primary/30 text-[10px] mt-0.5"
                  : uploadInputType === "read_counts"
                  ? "bg-accent/15 text-accent border-accent/30 text-[10px] mt-0.5"
                  : "bg-muted text-muted-foreground border-border text-[10px] mt-0.5"
              }
            >
              {uploadInputType === "raw_fastq"
                ? "Raw FASTQ (Scratch)"
                : uploadInputType === "read_counts"
                ? "Read Counts (DESeq2)"
                : "Final Processed Files"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="formula" className="space-y-4 pt-1">
          <TabsList className="bg-muted border border-border p-1 rounded-lg grid grid-cols-4">
            <TabsTrigger
              value="formula"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground"
            >
              <GitFork className="w-3.5 h-3.5 mr-1.5 text-primary" />
              1. Statistical Formula
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-accent" />
              2. Groups (T0–T10)
            </TabsTrigger>
            <TabsTrigger
              value="platform"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground"
            >
              <Cpu className="w-3.5 h-3.5 mr-1.5 text-primary" />
              3. Platform & Protocol
            </TabsTrigger>
            <TabsTrigger
              value="input_type"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold text-muted-foreground"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-accent" />
              4. Upload Starting Point
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Statistical Formula Dropdown */}
          <TabsContent value="formula" className="space-y-4 p-4 rounded-xl bg-card border border-border shadow-subtle">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Select Statistical Design Formula (Negative Binomial GLM)
              </Label>
              <p className="text-xs text-muted-foreground">
                Specifies the linear model terms for estimation of dispersions and fold changes via DESeq2.
              </p>
            </div>

            {/* Dropdown Menu for All Formulas */}
            <div className="space-y-2">
              <Select
                value={designFormula}
                onValueChange={(val) => {
                  setDesignFormula(val);
                  setCustomFormula(val);
                }}
              >
                <SelectTrigger className="w-full bg-surface border-border text-foreground font-mono text-xs h-10">
                  <SelectValue placeholder="Select statistical design formula..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground max-h-72">
                  {DESIGN_FORMULA_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.formula}
                      value={opt.formula}
                      className="text-xs font-mono hover:bg-muted cursor-pointer py-2"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-primary">{opt.formula}</div>
                        <div className="text-[11px] text-muted-foreground font-sans">{opt.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Formula Detail Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {DESIGN_FORMULA_OPTIONS.map((opt) => {
                const isSelected = designFormula === opt.formula;
                return (
                  <div
                    key={opt.formula}
                    onClick={() => {
                      setDesignFormula(opt.formula);
                      setCustomFormula(opt.formula);
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-1 ${
                      isSelected
                        ? "bg-accent/10 border-accent text-foreground shadow-subtle"
                        : "bg-surface border-border text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-foreground">{opt.formula}</span>
                      <Badge variant="outline" className="text-[9px] border-border text-muted-foreground">
                        {opt.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">{opt.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Custom Formula Input */}
            <div className="pt-2 border-t border-border space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground font-mono">
                Custom R / DESeq2 Formula Notation:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={customFormula}
                  onChange={(e) => setCustomFormula(e.target.value)}
                  placeholder="e.g. ~ batch + age + condition + genotype:treatment"
                  className="font-mono text-xs bg-surface border-border"
                />
                <Button
                  size="sm"
                  onClick={() => setDesignFormula(customFormula)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shrink-0"
                >
                  Set Custom Formula
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Experimental Groups (T0–T10) */}
          <TabsContent value="groups" className="space-y-4 p-4 rounded-xl bg-card border border-border shadow-subtle">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Experimental Group Designations & Time Series Configuration
              </Label>
              <p className="text-xs text-muted-foreground">
                Set up binary biological contrasts or dense multi-timepoint longitudinal series from T0 up to T10.
              </p>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyPreset("control_treated", 2)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  selectedPresetType === "control_treated"
                    ? "bg-primary/10 border-primary text-foreground shadow-subtle"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-bold block text-foreground font-serif">Control vs. Treated</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Vehicle vs Active Drug</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset("diseased_normal", 2)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  selectedPresetType === "diseased_normal"
                    ? "bg-primary/10 border-primary text-foreground shadow-subtle"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-bold block text-foreground font-serif">Diseased vs. Normal</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Tumor vs Adjacent Normal</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset("time_0_t2", 2)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  selectedPresetType === "time_0_t2"
                    ? "bg-accent/10 border-accent text-foreground shadow-subtle"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-bold block text-foreground font-serif">Time 0 vs. T2</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Binary Timepoint Interval</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset("time_series", 5)}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  selectedPresetType === "time_series"
                    ? "bg-accent/10 border-accent text-foreground shadow-subtle"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-bold block text-foreground font-serif">Time Series (T0–T10)</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Longitudinal Trajectories</span>
              </button>
            </div>

            {/* Time-series point counter slider */}
            {selectedPresetType === "time_series" && (
              <div className="p-3.5 rounded-lg bg-surface border border-border space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground font-mono">
                    Number of Timepoints (T0 to T{selectedCount}):
                  </span>
                  <span className="font-bold text-accent font-mono text-sm tabular-nums">
                    {selectedCount + 1} Points (T0 – T{selectedCount})
                  </span>
                </div>
                <Slider
                  value={[selectedCount]}
                  min={2}
                  max={10}
                  step={1}
                  onValueChange={(vals) => handleApplyPreset("time_series", vals[0])}
                />
                <p className="text-[11px] text-muted-foreground">
                  Using cubic splines model: <code className="font-mono text-primary font-bold">~ splines::ns(time, df=3) + batch</code> for continuous kinetics.
                </p>
              </div>
            )}

            {/* Group Label Editors */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold text-muted-foreground font-mono uppercase">
                Active Group Designations ({localGroupNames.length} groups):
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {localGroupNames.map((gName, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      Group {idx + 1} {idx === 0 ? "(Baseline Ref)" : ""}:
                    </span>
                    <Input
                      value={gName}
                      onChange={(e) => handleGroupNameChange(idx, e.target.value)}
                      className="text-xs font-mono h-7 bg-card border-border"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Platform & Library Protocol Metadata */}
          <TabsContent value="platform" className="space-y-4 p-4 rounded-xl bg-card border border-border shadow-subtle">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Sequencing Instrument & Library Preparation Protocol
              </Label>
              <p className="text-xs text-muted-foreground">
                Captures instrument model, library capture chemistry, and sequencing read architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Platform Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground font-mono">1. Sequencing Platform:</Label>
                <Select value={sequencingPlatform} onValueChange={setSequencingPlatform}>
                  <SelectTrigger className="bg-surface border-border text-xs text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Illumina NovaSeq 6000">Illumina NovaSeq 6000</SelectItem>
                    <SelectItem value="Illumina NovaSeq X Plus">Illumina NovaSeq X Plus</SelectItem>
                    <SelectItem value="Illumina NextSeq 2000">Illumina NextSeq 2000</SelectItem>
                    <SelectItem value="Element AVITI">Element AVITI</SelectItem>
                    <SelectItem value="PacBio Revio Long-Read">PacBio Revio Long-Read</SelectItem>
                    <SelectItem value="Oxford Nanopore PromethION">Oxford Nanopore PromethION</SelectItem>
                    <SelectItem value="Singular G4">Singular G4</SelectItem>
                    <SelectItem value="MGI DNBSEQ-T7">MGI DNBSEQ-T7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Library Protocol */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground font-mono">2. Library Prep Chemistry:</Label>
                <Select value={libraryProtocol} onValueChange={setLibraryProtocol}>
                  <SelectTrigger className="bg-surface border-border text-xs text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Illumina Stranded mRNA (PolyA Capture)">Illumina Stranded mRNA (PolyA Capture)</SelectItem>
                    <SelectItem value="Total RNA-seq (Ribo-Zero Plus Gold)">Total RNA-seq (Ribo-Zero Plus Gold)</SelectItem>
                    <SelectItem value="SMART-Seq v4 Ultra Low Input">SMART-Seq v4 Ultra Low Input</SelectItem>
                    <SelectItem value="10x Genomics Single-Cell 3' v3.1">10x Genomics Single-Cell 3' v3.1</SelectItem>
                    <SelectItem value="Lexogen QuantSeq 3' mRNA-Seq">Lexogen QuantSeq 3' mRNA-Seq</SelectItem>
                    <SelectItem value="Direct RNA Sequencing (Nanopore)">Direct RNA Sequencing (Nanopore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Read Type & Depth */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground font-mono">3. Read Architecture:</Label>
                <Select value={readType} onValueChange={setReadType}>
                  <SelectTrigger className="bg-surface border-border text-xs text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Paired-End 2x150bp">Paired-End 2x150bp (High Resolution)</SelectItem>
                    <SelectItem value="Paired-End 2x100bp">Paired-End 2x100bp</SelectItem>
                    <SelectItem value="Single-End 1x100bp">Single-End 1x100bp</SelectItem>
                    <SelectItem value="Single-End 1x75bp">Single-End 1x75bp (QuantSeq)</SelectItem>
                    <SelectItem value="Long-Read (>10kb Full-Length)">Long-Read (&gt;10kb Full-Length)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mean Read Depth */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground font-mono">4. Target Sequencing Depth:</Label>
                <Input
                  value={meanReadDepth}
                  onChange={(e) => setMeanReadDepth(e.target.value)}
                  placeholder="e.g. 50M paired reads/sample"
                  className="text-xs bg-surface border-border font-mono"
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: Upload Starting Point */}
          <TabsContent value="input_type" className="space-y-4 p-4 rounded-xl bg-card border border-border shadow-subtle">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Input Data Format & Pipeline Starting Point
              </Label>
              <p className="text-xs text-muted-foreground">
                Select your dataset ingestion format. The pipeline execution path dynamically adjusts to prevent redundant processing.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Option 1: Raw Sequencing Files */}
              <div
                onClick={() => setUploadInputType("raw_fastq")}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                  uploadInputType === "raw_fastq"
                    ? "bg-primary/10 border-primary shadow-subtle"
                    : "bg-surface border-border hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/20 text-primary">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground font-serif">1. Raw Sequencing Files (FASTQ / BCL)</span>
                      <Badge className="ml-2 bg-primary/15 text-primary border-primary/30 text-[10px] font-mono">
                        Start All Analysis from Scratch
                      </Badge>
                    </div>
                  </div>
                  {uploadInputType === "raw_fastq" && <Check className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans pl-8">
                  Starts complete end-to-end bioinformatic pipeline from scratch: adapter trimming (<code className="font-mono text-foreground">fastp</code>), splice-aware alignment (<code className="font-mono text-foreground">STAR / Salmon</code>), gene-level quantification (<code className="font-mono text-foreground">featureCounts</code>), and negative binomial dispersion fitting.
                </p>
              </div>

              {/* Option 2: Read Counts */}
              <div
                onClick={() => setUploadInputType("read_counts")}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                  uploadInputType === "read_counts"
                    ? "bg-accent/10 border-accent shadow-subtle"
                    : "bg-surface border-border hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-accent/20 text-accent">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground font-serif">2. Unnormalized Read Counts (Count Matrix)</span>
                      <Badge className="ml-2 bg-accent/15 text-accent border-accent/30 text-[10px] font-mono">
                        Start Analysis from Read Counts
                      </Badge>
                    </div>
                  </div>
                  {uploadInputType === "read_counts" && <Check className="w-4 h-4 text-accent" />}
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans pl-8">
                  Starts downstream statistical modeling from raw integer count table: library size normalization (<code className="font-mono text-foreground">DESeq2 Median of Ratios / VST</code>), empirical Bayes shrinkage, and Wald/LRT differential testing.
                </p>
              </div>

              {/* Option 3: Processed / Final Files */}
              <div
                onClick={() => setUploadInputType("processed_final")}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                  uploadInputType === "processed_final"
                    ? "bg-muted border-foreground/40 shadow-subtle"
                    : "bg-surface border-border hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground font-serif">3. Final / Pre-Processed Result Files</span>
                      <Badge variant="outline" className="ml-2 border-border text-muted-foreground text-[10px] font-mono">
                        Explicitly Labeled: Final Processed Files
                      </Badge>
                    </div>
                  </div>
                  {uploadInputType === "processed_final" && <Check className="w-4 h-4 text-foreground" />}
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans pl-8">
                  Explicitly marked as pre-processed results. Skips upstream alignment and normalization entirely, directly populating Volcano plots, Heatmaps, PCA/UMAP embeddings, and GSEA enrichment modules.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs border-border hover:bg-muted"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSaveAndApply}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-subtle"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Save & Apply Experimental Design
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExperimentalDesignModal;
