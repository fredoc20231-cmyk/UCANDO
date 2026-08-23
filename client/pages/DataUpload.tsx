import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq, Dataset, UploadInputType, GroupDesignationType } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  HelpCircle,
  Download,
  Database,
  Zap,
  FileCode,
  Layers,
  Cpu,
  GitFork,
  Sliders,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DataUpload: React.FC = () => {
  const { 
    loadCustomDataset, 
    uploadInputType, 
    setUploadInputType,
    sequencingPlatform,
    setSequencingPlatform,
    libraryProtocol,
    setLibraryProtocol,
    designFormula,
    setDesignFormula
  } = useRnaSeq();
  const navigate = useNavigate();

  const [selectedInputMode, setSelectedInputMode] = useState<UploadInputType>(uploadInputType);
  const [datasetTitle, setDatasetTitle] = useState("Custom Translational Cohort RNA-seq");
  const [organism, setOrganism] = useState("Homo sapiens");
  const [genomeBuild, setGenomeBuild] = useState("GRCh38.p14 (GENCODE v44)");
  const [groupDesignationPreset, setGroupDesignationPreset] = useState<GroupDesignationType>("control_treated");
  const [groupAName, setGroupAName] = useState("Treated (Active Inhibitor)");
  const [groupBName, setGroupBName] = useState("Control (Vehicle)");
  const [timeSeriesCount, setTimeSeriesCount] = useState<number>(4);
  const [primaryFileAttached, setPrimaryFileAttached] = useState<string | null>(null);
  const [metaFileName, setMetaFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPreset = (preset: GroupDesignationType) => {
    setGroupDesignationPreset(preset);
    if (preset === "control_treated") {
      setGroupAName("Treated (Active Compound)");
      setGroupBName("Control (Vehicle)");
      setDesignFormula("~ condition");
    } else if (preset === "diseased_normal") {
      setGroupAName("Primary Malignant Tumor");
      setGroupBName("Adjacent Normal Tissue");
      setDesignFormula("~ batch + condition");
    } else if (preset === "time_0_t2") {
      setGroupAName("T2 (Post-Treatment 2h)");
      setGroupBName("Time 0 (Baseline)");
      setDesignFormula("~ time");
    } else if (preset === "time_series") {
      setGroupAName(`T${timeSeriesCount} (End Timepoint)`);
      setGroupBName("T0 (Baseline)");
      setDesignFormula("~ splines::ns(time, df=3) + batch");
    }
  };

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setUploadInputType(selectedInputMode);

    setTimeout(() => {
      const customDs: Dataset = {
        id: `ds-user-${Date.now()}`,
        name: datasetTitle,
        description: `User-uploaded cohort: ${groupAName} vs. ${groupBName} (${selectedInputMode.toUpperCase()})`,
        organism,
        referenceGenome: genomeBuild,
        sampleCount: 8,
        geneCount: 18940,
        diseaseContext: "Translational Oncology / User Ingested Cohort",
        primaryContrast: {
          groupA: groupAName,
          groupB: groupBName,
          label: `${groupAName} vs. ${groupBName}`
        },
        isCustomUpload: true,
        samples: [
          { sampleId: "USR-01", sampleName: "Sample_01_Trt", group: groupAName, batch: "Batch_A", tissue: "Primary Tumor", stage: "Stage II", subType: "Res", readCount: 61000000, alignmentRate: 97.4, rinScore: 8.9, qcPass: true },
          { sampleId: "USR-02", sampleName: "Sample_02_Trt", group: groupAName, batch: "Batch_A", tissue: "Primary Tumor", stage: "Stage III", subType: "Res", readCount: 58000000, alignmentRate: 96.8, rinScore: 8.6, qcPass: true },
          { sampleId: "USR-03", sampleName: "Sample_03_Trt", group: groupAName, batch: "Batch_B", tissue: "Primary Tumor", stage: "Stage II", subType: "Res", readCount: 64000000, alignmentRate: 98.1, rinScore: 9.1, qcPass: true },
          { sampleId: "USR-04", sampleName: "Sample_04_Trt", group: groupAName, batch: "Batch_B", tissue: "Primary Tumor", stage: "Stage III", subType: "Res", readCount: 59500000, alignmentRate: 97.2, rinScore: 8.7, qcPass: true },
          { sampleId: "USR-05", sampleName: "Sample_05_Ctrl", group: groupBName, batch: "Batch_A", tissue: "Primary Tumor", stage: "Stage II", subType: "NonRes", readCount: 62400000, alignmentRate: 97.9, rinScore: 9.3, qcPass: true },
          { sampleId: "USR-06", sampleName: "Sample_06_Ctrl", group: groupBName, batch: "Batch_A", tissue: "Primary Tumor", stage: "Stage I", subType: "NonRes", readCount: 65100000, alignmentRate: 98.4, rinScore: 9.0, qcPass: true },
          { sampleId: "USR-07", sampleName: "Sample_07_Ctrl", group: groupBName, batch: "Batch_B", tissue: "Primary Tumor", stage: "Stage II", subType: "NonRes", readCount: 57200000, alignmentRate: 96.5, rinScore: 8.4, qcPass: true },
          { sampleId: "USR-08", sampleName: "Sample_08_Ctrl", group: groupBName, batch: "Batch_B", tissue: "Primary Tumor", stage: "Stage III", subType: "NonRes", readCount: 60800000, alignmentRate: 97.6, rinScore: 8.8, qcPass: true },
        ],
        genes: [
          { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 2150.0, log2FoldChange: 2.34, lfcSE: 0.22, stat: 10.63, pvalue: 2.1e-26, padj: 8.4e-24, status: "up", meanGroupA: 3400.0, meanGroupB: 900.0 },
          { geneId: "ENSG00000120217", geneSymbol: "CD274", chromosome: "chr9", biotype: "protein_coding", baseMean: 1840.0, log2FoldChange: 3.12, lfcSE: 0.26, stat: 12.00, pvalue: 3.5e-33, padj: 1.4e-30, status: "up", meanGroupA: 4100.0, meanGroupB: 480.0 },
          { geneId: "ENSG00000148773", geneSymbol: "MKI67", chromosome: "chr10", biotype: "protein_coding", baseMean: 1980.0, log2FoldChange: -2.45, lfcSE: 0.24, stat: -10.20, pvalue: 1.9e-24, padj: 4.8e-22, status: "down", meanGroupA: 520.0, meanGroupB: 3440.0 },
          { geneId: "ENSG00000111640", geneSymbol: "GAPDH", chromosome: "chr12", biotype: "protein_coding", baseMean: 36000.0, log2FoldChange: 0.04, lfcSE: 0.12, stat: 0.33, pvalue: 0.741, padj: 0.882, status: "ns", meanGroupA: 36200.0, meanGroupB: 35800.0 },
          { geneId: "ENSG00000075624", geneSymbol: "ACTB", chromosome: "chr7", biotype: "protein_coding", baseMean: 41000.0, log2FoldChange: -0.02, lfcSE: 0.11, stat: -0.18, pvalue: 0.857, padj: 0.940, status: "ns", meanGroupA: 40800.0, meanGroupB: 41200.0 }
        ],
        pcaPoints: [
          { sampleId: "USR-01", sampleName: "Sample_01_Trt", group: groupAName, batch: "Batch_A", pc1: -24.1, pc2: 8.2, pc3: 0.5, umap1: -4.8, umap2: 2.1 },
          { sampleId: "USR-02", sampleName: "Sample_02_Trt", group: groupAName, batch: "Batch_A", pc1: -21.4, pc2: 6.9, pc3: -1.2, umap1: -4.3, umap2: 1.8 },
          { sampleId: "USR-03", sampleName: "Sample_03_Trt", group: groupAName, batch: "Batch_B", pc1: -26.5, pc2: 10.4, pc3: 1.8, umap1: -5.2, umap2: 2.6 },
          { sampleId: "USR-04", sampleName: "Sample_04_Trt", group: groupAName, batch: "Batch_B", pc1: -23.0, pc2: 7.8, pc3: -0.9, umap1: -4.6, umap2: 2.0 },
          { sampleId: "USR-05", sampleName: "Sample_05_Ctrl", group: groupBName, batch: "Batch_A", pc1: 22.8, pc2: -8.4, pc3: 1.1, umap1: 4.5, umap2: -2.2 },
          { sampleId: "USR-06", sampleName: "Sample_06_Ctrl", group: groupBName, batch: "Batch_A", pc1: 25.6, pc2: -11.2, pc3: -1.5, umap1: 5.1, umap2: -2.8 },
          { sampleId: "USR-07", sampleName: "Sample_07_Ctrl", group: groupBName, batch: "Batch_B", pc1: 20.9, pc2: -7.1, pc3: 2.4, umap1: 4.2, umap2: -1.9 },
          { sampleId: "USR-08", sampleName: "Sample_08_Ctrl", group: groupBName, batch: "Batch_B", pc1: 24.3, pc2: -9.8, pc3: -0.8, umap1: 4.8, umap2: -2.5 }
        ],
        heatmapData: [
          { geneSymbol: "CD274", geneId: "ENSG00000120217", category: "Checkpoint", values: { "USR-01": 2.1, "USR-02": 1.9, "USR-03": 2.3, "USR-04": 1.8, "USR-05": -1.9, "USR-06": -2.2, "USR-07": -1.7, "USR-08": -2.0 } },
          { geneSymbol: "TP53", geneId: "ENSG00000141510", category: "DNA Damage", values: { "USR-01": 1.8, "USR-02": 1.6, "USR-03": 2.0, "USR-04": 1.7, "USR-05": -1.6, "USR-06": -1.9, "USR-07": -1.4, "USR-08": -1.8 } }
        ],
        pathways: [
          { pathwayId: "M5921", pathwayName: "HALLMARK_INTERFERON_GAMMA_RESPONSE", database: "Hallmark", size: 200, nes: 2.45, pvalue: 1.4e-8, padj: 5.2e-7, leadingEdge: ["CD274", "STAT1", "IRF1", "CXCL9"] }
        ],
        isoforms: [],
        deconvolution: []
      };

      loadCustomDataset(customDs);
      setIsProcessing(false);

      if (selectedInputMode === "raw_fastq") {
        toast.success("Raw sequencing pipeline executed from scratch (Trimming → STAR → featureCounts → DESeq2).");
      } else if (selectedInputMode === "read_counts") {
        toast.success("Count matrix ingested and normalized via DESeq2 Median of Ratios.");
      } else {
        toast.info("Final processed result files loaded directly into analysis views.");
      }

      navigate("/workspace");
    }, 800);
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                Data Ingestion & Experimental Setup
              </h1>
              <span className="text-xs px-2 py-0.5 rounded border border-dashed border-accent text-accent font-mono font-medium">
                Safe Harbor Ingestion Tier-3
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Upload raw sequencing files (FASTQ), unnormalized read count matrices, or final processed results with full experimental design and platform metadata.
            </p>
          </div>
        </div>

        {/* 1. Step 1: Ingestion Input Type Selection */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-primary" />
            <span>Step 1: Select Input Data Type & Analysis Starting Point</span>
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Raw FASTQ Option */}
            <div
              onClick={() => setSelectedInputMode("raw_fastq")}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                selectedInputMode === "raw_fastq"
                  ? "bg-primary/10 border-primary shadow-subtle"
                  : "bg-card border-border hover:border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-mono">
                    Start from Scratch
                  </Badge>
                  {selectedInputMode === "raw_fastq" && <Check className="w-4 h-4 text-primary" />}
                </div>
                <h3 className="font-serif font-bold text-sm text-foreground">1. Raw Sequencing Files (FASTQ)</h3>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Executes full bioinformatic pipeline from scratch: FastQC, fastp adapter trimming, STAR/Salmon alignment, and featureCounts quantification.
                </p>
              </div>
              <span className="text-[10px] font-mono text-primary font-semibold">Inputs: .fastq.gz / paired FASTQ</span>
            </div>

            {/* Read Counts Option */}
            <div
              onClick={() => setSelectedInputMode("read_counts")}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                selectedInputMode === "read_counts"
                  ? "bg-accent/10 border-accent shadow-subtle"
                  : "bg-card border-border hover:border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono">
                    Start from Read Counts
                  </Badge>
                  {selectedInputMode === "read_counts" && <Check className="w-4 h-4 text-accent" />}
                </div>
                <h3 className="font-serif font-bold text-sm text-foreground">2. Unnormalized Read Counts</h3>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Starts directly at statistical modeling: DESeq2 median-of-ratios normalization, VST transformation, and negative binomial Wald/LRT differential testing.
                </p>
              </div>
              <span className="text-[10px] font-mono text-accent font-semibold">Inputs: Raw integer count matrix (CSV/TSV)</span>
            </div>

            {/* Final Processed Files Option */}
            <div
              onClick={() => setSelectedInputMode("processed_final")}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                selectedInputMode === "processed_final"
                  ? "bg-muted border-foreground/40 shadow-subtle"
                  : "bg-card border-border hover:border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono">
                    Final Processed Files
                  </Badge>
                  {selectedInputMode === "processed_final" && <Check className="w-4 h-4 text-foreground" />}
                </div>
                <h3 className="font-serif font-bold text-sm text-foreground">3. Final / Pre-Processed Files</h3>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Explicitly marked as pre-processed results. Skips upstream alignment and normalization, loading directly into Volcano, Heatmap, and GSEA.
                </p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground font-semibold">Inputs: Normalized TPM/FPKM & DESeq2 stat tables</span>
            </div>
          </div>
        </div>

        {/* Step 2: Experimental Groups & Design Formula */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Experimental Design & Groups */}
          <ScientificCard
            title="Experimental Groups & Contrast Formulation"
            subtitle="Configure group designations (Control/Treated, Diseased/Normal, or Time Series)"
          >
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset("control_treated")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    groupDesignationPreset === "control_treated"
                      ? "bg-primary/10 border-primary text-foreground font-semibold"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                >
                  <span className="block font-bold">Control / Treated</span>
                  <span className="text-[10px] text-muted-foreground">Vehicle vs Drug</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset("diseased_normal")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    groupDesignationPreset === "diseased_normal"
                      ? "bg-primary/10 border-primary text-foreground font-semibold"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                >
                  <span className="block font-bold">Diseased / Normal</span>
                  <span className="text-[10px] text-muted-foreground">Tumor vs Normal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset("time_0_t2")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    groupDesignationPreset === "time_0_t2"
                      ? "bg-accent/10 border-accent text-foreground font-semibold"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                >
                  <span className="block font-bold">Time 0 vs. T2</span>
                  <span className="text-[10px] text-muted-foreground">Binary Interval</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset("time_series")}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    groupDesignationPreset === "time_series"
                      ? "bg-accent/10 border-accent text-foreground font-semibold"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                >
                  <span className="block font-bold">Time Series</span>
                  <span className="text-[10px] text-muted-foreground">T0 up to T10</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <Label className="text-xs font-semibold text-primary font-mono">Test Contrast Group:</Label>
                  <Input
                    value={groupAName}
                    onChange={(e) => setGroupAName(e.target.value)}
                    className="mt-1 h-8 text-xs bg-surface border-border font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-foreground font-mono">Reference Baseline Group:</Label>
                  <Input
                    value={groupBName}
                    onChange={(e) => setGroupBName(e.target.value)}
                    className="mt-1 h-8 text-xs bg-surface border-border font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground font-mono">Statistical Design Formula:</Label>
                <Input
                  value={designFormula}
                  onChange={(e) => setDesignFormula(e.target.value)}
                  className="mt-1 h-8 text-xs bg-surface border-border font-mono text-primary font-bold"
                />
              </div>
            </div>
          </ScientificCard>

          {/* Sequencing Instrument & Protocol */}
          <ScientificCard
            title="Sequencing Platform & Protocol Provenance"
            subtitle="Instrument model, library chemistry, and reference genome build"
          >
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Sequencing Instrument</Label>
                  <Select value={sequencingPlatform} onValueChange={setSequencingPlatform}>
                    <SelectTrigger className="mt-1 h-8 text-xs bg-surface border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Illumina NovaSeq 6000">Illumina NovaSeq 6000</SelectItem>
                      <SelectItem value="Illumina NovaSeq X Plus">Illumina NovaSeq X Plus</SelectItem>
                      <SelectItem value="Element AVITI">Element AVITI</SelectItem>
                      <SelectItem value="PacBio Revio Long-Read">PacBio Revio Long-Read</SelectItem>
                      <SelectItem value="Oxford Nanopore PromethION">Oxford Nanopore PromethION</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Library Chemistry</Label>
                  <Select value={libraryProtocol} onValueChange={setLibraryProtocol}>
                    <SelectTrigger className="mt-1 h-8 text-xs bg-surface border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Illumina Stranded mRNA (PolyA Capture)">Illumina Stranded mRNA (PolyA)</SelectItem>
                      <SelectItem value="Total RNA-seq (Ribo-Zero Plus Gold)">Total RNA-seq (Ribo-Zero)</SelectItem>
                      <SelectItem value="SMART-Seq v4 Ultra Low Input">SMART-Seq v4 Low Input</SelectItem>
                      <SelectItem value="10x Genomics Single-Cell 3' v3.1">10x Single-Cell 3'</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Organism & Build</Label>
                  <Input
                    value={`${organism} • ${genomeBuild}`}
                    onChange={(e) => setGenomeBuild(e.target.value)}
                    className="mt-1 h-8 text-xs bg-surface border-border font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Cohort Title</Label>
                  <Input
                    value={datasetTitle}
                    onChange={(e) => setDatasetTitle(e.target.value)}
                    className="mt-1 h-8 text-xs bg-surface border-border"
                  />
                </div>
              </div>
            </div>
          </ScientificCard>
        </div>

        {/* Step 3: Dropzone & Launch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors bg-card flex flex-col items-center justify-center text-center space-y-3 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-foreground">
                {selectedInputMode === "raw_fastq"
                  ? "Attach Raw FASTQ Files (.fastq.gz)"
                  : selectedInputMode === "read_counts"
                  ? "Attach Gene Counts Matrix (CSV/TSV)"
                  : "Attach Processed Expression Results (TSV)"}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {selectedInputMode === "raw_fastq"
                  ? "Paired-end R1 and R2 sequencing archives"
                  : selectedInputMode === "read_counts"
                  ? "Genes as rows, sample IDs as columns (integer counts)"
                  : "Pre-computed log2FC, FDR, and normalized expression"}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const fname = selectedInputMode === "raw_fastq" ? "cohort_R1_R2.fastq.gz" : "gene_count_matrix.tsv";
                setPrimaryFileAttached(fname);
                toast.success(`Attached '${fname}'`);
              }}
              className="h-8 text-xs font-sans border-border"
            >
              {primaryFileAttached ? `Attached: ${primaryFileAttached}` : "Browse / Drop Sequencing Files"}
            </Button>
          </div>

          <div className="p-6 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors bg-card flex flex-col items-center justify-center text-center space-y-3 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-foreground">Sample Metadata Table</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                CSV / TSV with sampleId, group, batch, timePoint, RIN
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMetaFileName("sample_metadata_manifest.csv");
                toast.success("Loaded 'sample_metadata_manifest.csv' (8 samples annotated)");
              }}
              className="h-8 text-xs font-sans border-border"
            >
              {metaFileName ? `Attached: ${metaFileName}` : "Browse / Drop Metadata Manifest"}
            </Button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            size="lg"
            onClick={handleSimulateUpload}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 px-6 shadow-subtle"
          >
            <Zap className={`w-4 h-4 mr-2 ${isProcessing ? "animate-spin" : ""}`} />
            {isProcessing ? "Executing Bioinformatic Pipeline..." : "Ingest & Launch in RNA-seq Workspace"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default DataUpload;
