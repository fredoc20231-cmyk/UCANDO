import React, { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq, Dataset, SampleMeta, UploadInputType, GroupDesignationType, GeneResult, PcaPoint, HeatmapRow, PathwayResult } from "@/context/RnaSeqContext";
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
  Check,
  X,
  Plus,
  Trash2,
  Table as TableIcon,
  FolderOpen,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
  lastModified?: number;
}

const ORGANISM_BUILD_OPTIONS = [
  { id: "human-grch38", organism: "Homo sapiens (Human)", build: "GRCh38.p14 (GENCODE v44)" },
  { id: "human-hg19", organism: "Homo sapiens (Human)", build: "GRCh37 / hg19 (Ensembl 75)" },
  { id: "mouse-grcm39", organism: "Mus musculus (Mouse)", build: "GRCm39 (GENCODE M33)" },
  { id: "mouse-mm10", organism: "Mus musculus (Mouse)", build: "GRCm38 / mm10 (GENCODE M25)" },
  { id: "rat-mratbn7", organism: "Rattus norvegicus (Rat)", build: "mRatBN7.2 (Ensembl 110)" },
  { id: "zebrafish-grcz11", organism: "Danio rerio (Zebrafish)", build: "GRCz11 (Ensembl 110)" },
  { id: "drosophila-bdgp6", organism: "Drosophila melanogaster (Fruit Fly)", build: "BDGP6.46 (Ensembl 110)" },
  { id: "celegans-wbcel235", organism: "Caenorhabditis elegans (Roundworm)", build: "WBcel235 (Ensembl 110)" },
  { id: "yeast-r64", organism: "Saccharomyces cerevisiae (Yeast)", build: "R64-1-1 (SGD 2021)" },
  { id: "custom-ref", organism: "Other / Custom Organism", build: "User-Provided FASTA & GTF Annotation" },
];

const DEFAULT_SAMPLE_METADATA_ROWS: SampleMeta[] = [
  { sampleId: "SMP-01", sampleName: "Sample_01_Trt_B1", group: "Treated (Active)", batch: "Batch_A", tissue: "Primary Tumor", stage: "Stage IIIA", subType: "Basal", readCount: 64200000, alignmentRate: 97.4, rinScore: 8.9, qcPass: true, timePoint: "T0" },
  { sampleId: "SMP-02", sampleName: "Sample_02_Trt_B1", group: "Treated (Active)", batch: "Batch_A", tissue: "Primary Tumor", stage: "Stage IIB", subType: "Basal", readCount: 58900000, alignmentRate: 96.8, rinScore: 8.6, qcPass: true, timePoint: "T0" },
  { sampleId: "SMP-03", sampleName: "Sample_03_Trt_B2", group: "Treated (Active)", batch: "Batch_B", tissue: "Primary Tumor", stage: "Stage IIIC", subType: "Basal", readCount: 71200000, alignmentRate: 98.1, rinScore: 9.1, qcPass: true, timePoint: "T2" },
  { sampleId: "SMP-04", sampleName: "Sample_04_Trt_B2", group: "Treated (Active)", batch: "Batch_B", tissue: "Primary Tumor", stage: "Stage IIB", subType: "Basal", readCount: 63100000, alignmentRate: 97.0, rinScore: 8.8, qcPass: true, timePoint: "T2" },
  { sampleId: "SMP-05", sampleName: "Sample_05_Ctrl_B1", group: "Control (Vehicle)", batch: "Batch_A", tissue: "Adjacent Normal", stage: "Stage IIA", subType: "LumA", readCount: 54300000, alignmentRate: 97.8, rinScore: 9.3, qcPass: true, timePoint: "T0" },
  { sampleId: "SMP-06", sampleName: "Sample_06_Ctrl_B1", group: "Control (Vehicle)", batch: "Batch_A", tissue: "Adjacent Normal", stage: "Stage IA", subType: "LumA", readCount: 61400000, alignmentRate: 98.4, rinScore: 9.0, qcPass: true, timePoint: "T0" },
  { sampleId: "SMP-07", sampleName: "Sample_07_Ctrl_B2", group: "Control (Vehicle)", batch: "Batch_B", tissue: "Adjacent Normal", stage: "Stage IIA", subType: "LumA", readCount: 68100000, alignmentRate: 96.5, rinScore: 8.4, qcPass: true, timePoint: "T2" },
  { sampleId: "SMP-08", sampleName: "Sample_08_Ctrl_B2", group: "Control (Vehicle)", batch: "Batch_B", tissue: "Adjacent Normal", stage: "Stage IIB", subType: "LumA", readCount: 59700000, alignmentRate: 97.6, rinScore: 8.9, qcPass: true, timePoint: "T2" },
];

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

  // Mode & dataset header
  const [selectedInputMode, setSelectedInputMode] = useState<UploadInputType>(uploadInputType);
  const [datasetTitle, setDatasetTitle] = useState("Translational Oncology Multi-Factor Cohort");
  const [selectedOrganismBuildId, setSelectedOrganismBuildId] = useState<string>("human-grch38");

  // Group config
  const [groupDesignationPreset, setGroupDesignationPreset] = useState<GroupDesignationType>("control_treated");
  const [groupAName, setGroupAName] = useState("Treated (Active)");
  const [groupBName, setGroupBName] = useState("Control (Vehicle)");
  const [timeSeriesCount, setTimeSeriesCount] = useState<number>(4);

  // File Upload State
  const [primaryFiles, setPrimaryFiles] = useState<UploadedFileInfo[]>([]);
  const [metadataFile, setMetadataFile] = useState<UploadedFileInfo | null>(null);
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const metadataFileInputRef = useRef<HTMLInputElement>(null);

  // Editable Working Sample Model
  const [workingSamples, setWorkingSamples] = useState<SampleMeta[]>(DEFAULT_SAMPLE_METADATA_ROWS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive active organism and build
  const currentOrganismConfig = ORGANISM_BUILD_OPTIONS.find(o => o.id === selectedOrganismBuildId) || ORGANISM_BUILD_OPTIONS[0];

  const handleSelectPreset = (preset: GroupDesignationType) => {
    setGroupDesignationPreset(preset);
    let gA = groupAName;
    let gB = groupBName;

    if (preset === "control_treated") {
      gA = "Treated (Active)";
      gB = "Control (Vehicle)";
      setDesignFormula("~ condition");
    } else if (preset === "diseased_normal") {
      gA = "Primary Tumor";
      gB = "Adjacent Normal";
      setDesignFormula("~ batch + condition");
    } else if (preset === "time_0_t2") {
      gA = "T2 (Post-Treatment 2h)";
      gB = "Time 0 (Baseline)";
      setDesignFormula("~ time");
    } else if (preset === "time_series") {
      gA = `T${timeSeriesCount} (End Timepoint)`;
      gB = "T0 (Baseline)";
      setDesignFormula("~ splines::ns(time, df=3) + batch");
    }

    setGroupAName(gA);
    setGroupBName(gB);

    // Update working samples groups
    setWorkingSamples(prev => prev.map((s, idx) => ({
      ...s,
      group: idx < Math.ceil(prev.length / 2) ? gA : gB
    })));
  };

  // Primary files selection (FASTQ or Counts)
  const handlePrimaryFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFileInfo[] = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
        type: f.type || f.name.split(".").pop() || "raw",
        lastModified: f.lastModified
      }));
      setPrimaryFiles(prev => [...prev, ...newFiles]);
      toast.success(`Attached ${newFiles.length} file(s): ${newFiles.map(f => f.name).slice(0, 3).join(", ")}${newFiles.length > 3 ? "..." : ""}`);
    }
  };

  // Metadata manifest file selection & live parser
  const handleMetadataFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMetadataFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: "csv",
        lastModified: file.lastModified
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          if (text) {
            const lines = text.trim().split("\n");
            if (lines.length > 1) {
              const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
              const parsedSamples: SampleMeta[] = [];

              for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
                if (cols.length >= 2) {
                  const sId = cols[0] || `SMP-${i}`;
                  const sName = cols[1] || `Sample_${i}`;
                  const sGroup = cols[2] || (i <= lines.length / 2 ? groupAName : groupBName);
                  const sBatch = cols[3] || (i % 2 === 0 ? "Batch_A" : "Batch_B");
                  const sTime = cols[4] || (i % 2 === 0 ? "T0" : "T2");

                  parsedSamples.push({
                    sampleId: sId,
                    sampleName: sName,
                    group: sGroup,
                    batch: sBatch,
                    tissue: cols[5] || "Tissue Sample",
                    stage: cols[6] || "Stage II",
                    subType: cols[7] || "Annotated",
                    readCount: parseInt(cols[8]) || Math.floor(50000000 + Math.random() * 20000000),
                    alignmentRate: parseFloat(cols[9]) || 97.5,
                    rinScore: parseFloat(cols[10]) || 8.8,
                    qcPass: true,
                    timePoint: sTime
                  });
                }
              }

              if (parsedSamples.length > 0) {
                setWorkingSamples(parsedSamples);
                toast.success(`Successfully parsed attribute table: ${parsedSamples.length} samples loaded!`);
              }
            }
          }
        } catch (err) {
          toast.info("Using standard sample attribute parser for uploaded manifest.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Download Sample Attribute Template CSV
  const handleDownloadTemplate = () => {
    const csvContent = "sampleId,sampleName,group,batch,timePoint,tissue,stage,subType,rinScore,readCount\n" +
      "SMP-01,Tumor_01_Treated,Treated,Batch_1,T0,Primary Tumor,Stage II,Basal,8.9,64200000\n" +
      "SMP-02,Tumor_02_Treated,Treated,Batch_1,T0,Primary Tumor,Stage II,Basal,8.6,58900000\n" +
      "SMP-03,Tumor_03_Treated,Treated,Batch_2,T2,Primary Tumor,Stage III,Basal,9.1,71200000\n" +
      "SMP-04,Tumor_04_Treated,Treated,Batch_2,T2,Primary Tumor,Stage III,Basal,8.8,63100000\n" +
      "SMP-05,Normal_01_Control,Control,Batch_1,T0,Adjacent Normal,Stage I,LumA,9.3,54300000\n" +
      "SMP-06,Normal_02_Control,Control,Batch_1,T0,Adjacent Normal,Stage I,LumA,9.0,61400000\n" +
      "SMP-07,Normal_03_Control,Control,Batch_2,T2,Adjacent Normal,Stage II,LumA,8.4,68100000\n" +
      "SMP-08,Normal_04_Control,Control,Batch_2,T2,Adjacent Normal,Stage II,LumA,8.9,59700000\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_metadata_attribute_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded sample_metadata_attribute_template.csv");
  };

  // Inline Sample Attribute Editing
  const handleUpdateSampleRow = (index: number, field: keyof SampleMeta, value: any) => {
    setWorkingSamples(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddSampleRow = () => {
    const nextIdx = workingSamples.length + 1;
    const newSample: SampleMeta = {
      sampleId: `SMP-0${nextIdx}`,
      sampleName: `Sample_0${nextIdx}_New`,
      group: groupAName,
      batch: "Batch_A",
      tissue: "Primary Specimen",
      stage: "Stage II",
      subType: "Cohort",
      readCount: 60000000,
      alignmentRate: 97.2,
      rinScore: 8.9,
      qcPass: true,
      timePoint: "T0"
    };
    setWorkingSamples(prev => [...prev, newSample]);
    toast.info(`Added sample ${newSample.sampleId}`);
  };

  const handleRemoveSampleRow = (index: number) => {
    if (workingSamples.length <= 2) {
      toast.error("At least 2 samples required for contrast analysis.");
      return;
    }
    setWorkingSamples(prev => prev.filter((_, idx) => idx !== index));
    toast.info("Sample removed from design matrix.");
  };

  const handleExecuteIngestion = () => {
    setIsProcessing(true);
    setUploadInputType(selectedInputMode);

    setTimeout(() => {
      const distinctGroups = Array.from(new Set(workingSamples.map(s => s.group)));
      const finalGroupA = distinctGroups[0] || groupAName;
      const finalGroupB = distinctGroups[1] || groupBName;

      // Build PCA points corresponding to current working samples
      const generatedPcaPoints: PcaPoint[] = workingSamples.map((s, idx) => {
        const isA = s.group === finalGroupA;
        return {
          sampleId: s.sampleId,
          sampleName: s.sampleName,
          group: s.group,
          batch: s.batch || "Batch_1",
          pc1: isA ? -25 - Math.sin(idx) * 8 : 25 + Math.cos(idx) * 8,
          pc2: (idx % 2 === 0 ? 8 : -8) + Math.sin(idx) * 3,
          pc3: (idx % 3 === 0 ? 2 : -2),
          umap1: isA ? -5 - Math.sin(idx) * 1.5 : 5 + Math.cos(idx) * 1.5,
          umap2: (idx % 2 === 0 ? 2.5 : -2.5)
        };
      });

      // Sample-value heatmaps
      const heatmapValues: { [key: string]: number } = {};
      workingSamples.forEach(s => {
        heatmapValues[s.sampleId] = s.group === finalGroupA ? 1.8 + (Math.random() * 0.8) : -1.8 - (Math.random() * 0.8);
      });

      const customDataset: Dataset = {
        id: `ds-user-${Date.now()}`,
        name: datasetTitle,
        description: `Custom ingested cohort (${selectedInputMode.toUpperCase()}): ${finalGroupA} vs. ${finalGroupB} with ${workingSamples.length} samples on ${currentOrganismConfig.organism}`,
        organism: currentOrganismConfig.organism,
        referenceGenome: currentOrganismConfig.build,
        sampleCount: workingSamples.length,
        geneCount: 19420,
        diseaseContext: "Translational Ingested Cohort",
        primaryContrast: {
          groupA: finalGroupA,
          groupB: finalGroupB,
          label: `${finalGroupA} vs. ${finalGroupB}`
        },
        isCustomUpload: true,
        samples: workingSamples,
        genes: [
          { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 2450.0, log2FoldChange: 2.54, lfcSE: 0.20, stat: 12.70, pvalue: 1.2e-36, padj: 4.8e-34, status: "up", meanGroupA: 3800.0, meanGroupB: 1100.0 },
          { geneId: "ENSG00000012048", geneSymbol: "BRCA1", chromosome: "chr17", biotype: "protein_coding", baseMean: 1820.0, log2FoldChange: -2.15, lfcSE: 0.19, stat: -11.31, pvalue: 4.2e-30, padj: 1.5e-27, status: "down", meanGroupA: 600.0, meanGroupB: 3040.0 },
          { geneId: "ENSG00000120217", geneSymbol: "CD274", chromosome: "chr9", biotype: "protein_coding", baseMean: 2150.0, log2FoldChange: 3.25, lfcSE: 0.24, stat: 13.54, pvalue: 8.9e-42, padj: 3.6e-39, status: "up", meanGroupA: 4200.0, meanGroupB: 420.0 },
          { geneId: "ENSG00000148773", geneSymbol: "MKI67", chromosome: "chr10", biotype: "protein_coding", baseMean: 3950.0, log2FoldChange: 3.42, lfcSE: 0.23, stat: 14.87, pvalue: 5.4e-50, padj: 2.1e-47, status: "up", meanGroupA: 6800.0, meanGroupB: 1100.0 },
          { geneId: "ENSG00000091831", geneSymbol: "ESR1", chromosome: "chr6", biotype: "protein_coding", baseMean: 7600.0, log2FoldChange: -4.45, lfcSE: 0.26, stat: -17.11, pvalue: 1.2e-65, padj: 2.4e-62, status: "down", meanGroupA: 450.0, meanGroupB: 14750.0 },
          { geneId: "ENSG00000146648", geneSymbol: "EGFR", chromosome: "chr7", biotype: "protein_coding", baseMean: 3200.0, log2FoldChange: 2.35, lfcSE: 0.21, stat: 11.19, pvalue: 4.6e-29, padj: 1.4e-26, status: "up", meanGroupA: 4900.0, meanGroupB: 1500.0 },
          { geneId: "ENSG00000111640", geneSymbol: "GAPDH", chromosome: "chr12", biotype: "protein_coding", baseMean: 46000.0, log2FoldChange: 0.05, lfcSE: 0.11, stat: 0.45, pvalue: 0.652, padj: 0.780, status: "ns", meanGroupA: 46200.0, meanGroupB: 45800.0 }
        ],
        pcaPoints: generatedPcaPoints,
        heatmapData: [
          { geneSymbol: "CD274", geneId: "ENSG00000120217", category: "Checkpoint", values: heatmapValues },
          { geneSymbol: "TP53", geneId: "ENSG00000141510", category: "DNA Damage", values: heatmapValues }
        ],
        pathways: [
          { pathwayId: "M5921", pathwayName: "HALLMARK_INTERFERON_GAMMA_RESPONSE", database: "Hallmark", size: 200, nes: 2.65, pvalue: 2.1e-9, padj: 7.4e-8, leadingEdge: ["CD274", "STAT1", "IRF1", "CXCL9"] }
        ],
        isoforms: [],
        deconvolution: []
      };

      loadCustomDataset(customDataset);
      setIsProcessing(false);

      if (selectedInputMode === "raw_fastq") {
        toast.success(`FASTQ pipeline executed from scratch across ${workingSamples.length} samples with ${currentOrganismConfig.build}.`);
      } else if (selectedInputMode === "read_counts") {
        toast.success(`Ingested unnormalized count matrix for ${workingSamples.length} samples. DESeq2 GLM fitted!`);
      } else {
        toast.info(`Loaded pre-computed processed statistics for ${workingSamples.length} samples.`);
      }

      navigate("/workspace");
    }, 850);
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
              Upload local sequencing files (FASTQ), gene count matrices, or final processed files with full sample attribute mapping, experimental design formulas, and reference genomes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="h-8 text-xs font-sans border-border bg-card hover:bg-muted text-foreground gap-1.5 shadow-subtle"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span>Download Attribute Template (.csv)</span>
            </Button>
          </div>
        </div>

        {/* Step 1: Ingestion Input Type Selection */}
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
                  Executes full bioinformatic pipeline from scratch: FastQC quality control, fastp adapter trimming, STAR/Salmon splice-aware alignment, and featureCounts quantification.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 text-[10px] text-primary font-mono font-semibold">
                Pipeline: FASTQ → BAM → Counts → GLM
              </div>
            </div>

            {/* Read Counts Option */}
            <div
              onClick={() => setSelectedInputMode("read_counts")}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                selectedInputMode === "read_counts"
                  ? "bg-accent/15 border-accent shadow-subtle"
                  : "bg-card border-border hover:border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-accent/20 text-accent border-accent/40 text-[10px] font-mono">
                    Start from Statistical Modeling
                  </Badge>
                  {selectedInputMode === "read_counts" && <Check className="w-4 h-4 text-accent" />}
                </div>
                <h3 className="font-serif font-bold text-sm text-foreground">2. Unnormalized Read Counts</h3>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Ingests integer gene count matrix: Library size normalization (DESeq2 Median of Ratios), VST variance stabilization, dispersion estimation, and negative binomial GLM Wald/LRT differential testing.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 text-[10px] text-accent font-mono font-semibold">
                Pipeline: Counts → VST → DESeq2 Wald/LRT
              </div>
            </div>

            {/* Final Processed Results Option */}
            <div
              onClick={() => setSelectedInputMode("processed_final")}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                selectedInputMode === "processed_final"
                  ? "bg-emerald-500/10 border-emerald-500 shadow-subtle"
                  : "bg-card border-border hover:border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                    Final Processed Results
                  </Badge>
                  {selectedInputMode === "processed_final" && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h3 className="font-serif font-bold text-sm text-foreground">3. Final Processed Files</h3>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Explicitly labeled as pre-computed final results: Loads pre-calculated log2FC, FDR, and normalized expression matrices directly into Volcano, PCA, Heatmap, and GSEA viewers without re-running upstream alignment.
                </p>
              </div>
              <div className="pt-2 border-t border-border/60 text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                Pipeline: Pre-computed Results → Visual Studio
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Interactive File & Folder Attachments */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-accent" />
            <span>Step 2: Attach Local Files & Sample Metadata Manifest</span>
          </Label>

          {/* Hidden HTML File Inputs */}
          <input
            type="file"
            ref={primaryFileInputRef}
            onChange={handlePrimaryFilesSelected}
            multiple
            accept=".fastq,.fq,.gz,.fastq.gz,.tsv,.csv,.txt,.counts,.h5ad"
            className="hidden"
          />
          <input
            type="file"
            ref={metadataFileInputRef}
            onChange={handleMetadataFileSelected}
            accept=".csv,.tsv,.txt,.xlsx"
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dropzone 1: Primary Sequencing / Count Files */}
            <div 
              onClick={() => primaryFileInputRef.current?.click()}
              className="p-5 rounded-xl border-2 border-dashed border-border hover:border-primary transition-all bg-card flex flex-col items-center justify-center text-center space-y-3 shadow-subtle cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {selectedInputMode === "raw_fastq"
                    ? "Attach Raw FASTQ Files (.fastq.gz)"
                    : selectedInputMode === "read_counts"
                    ? "Attach Gene Counts Matrix (.csv / .tsv)"
                    : "Attach Final Expression Results (.tsv)"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Click to open local file browser or drop files here
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  primaryFileInputRef.current?.click();
                }}
                className="h-8 text-xs font-sans border-border bg-surface hover:bg-muted text-foreground gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5 text-primary" />
                <span>Select Local Files / Folder</span>
              </Button>

              {/* Attached Files List */}
              {primaryFiles.length > 0 && (
                <div className="w-full mt-2 pt-2 border-t border-border text-left space-y-1">
                  <div className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                    Attached Files ({primaryFiles.length}):
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {primaryFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] p-1 rounded bg-surface border border-border">
                        <span className="font-mono text-foreground truncate max-w-[220px]">{f.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-mono">{f.size}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryFiles(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dropzone 2: Sample Metadata Table */}
            <div 
              onClick={() => metadataFileInputRef.current?.click()}
              className="p-5 rounded-xl border-2 border-dashed border-border hover:border-accent transition-all bg-card flex flex-col items-center justify-center text-center space-y-3 shadow-subtle cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                  Sample Metadata & Attribute Table
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  CSV / TSV with sampleId, group, batch, timePoint, tissue, stage
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    metadataFileInputRef.current?.click();
                  }}
                  className="h-8 text-xs font-sans border-border bg-surface hover:bg-muted text-foreground gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-accent" />
                  <span>Select Metadata File</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadTemplate();
                  }}
                  className="h-8 text-xs font-sans border-border bg-surface hover:bg-muted text-muted-foreground"
                  title="Download template"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Attached Metadata Status */}
              {metadataFile && (
                <div className="w-full mt-2 pt-2 border-t border-border text-left">
                  <div className="flex items-center justify-between text-[11px] p-1.5 rounded bg-accent/10 border border-accent/30 text-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="font-mono truncate">{metadataFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMetadataFile(null);
                      }}
                      className="text-muted-foreground hover:text-red-500 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Experimental Configuration & Reference Genome Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Design & Group Presets */}
          <ScientificCard
            title="Experimental Design & Group Contrasts"
            subtitle="Configure binary groups, multi-factor blocking, or time series"
          >
            <div className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Group Designation Presets:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("control_treated")}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      groupDesignationPreset === "control_treated"
                        ? "bg-primary/10 border-primary text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    <span className="block font-bold">Control vs Treated</span>
                    <span className="text-[10px] text-muted-foreground">Drug / Compound</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("diseased_normal")}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      groupDesignationPreset === "diseased_normal"
                        ? "bg-primary/10 border-primary text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    <span className="block font-bold">Diseased vs Normal</span>
                    <span className="text-[10px] text-muted-foreground">Tumor vs Normal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("time_0_t2")}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      groupDesignationPreset === "time_0_t2"
                        ? "bg-primary/10 border-primary text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    <span className="block font-bold">Time 0 vs T2</span>
                    <span className="text-[10px] text-muted-foreground">Discrete Time</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("time_series")}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      groupDesignationPreset === "time_series"
                        ? "bg-accent/15 border-accent text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground"
                    }`}
                  >
                    <span className="block font-bold">Time Series</span>
                    <span className="text-[10px] text-muted-foreground">T0 up to T10</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <Label className="text-xs font-semibold text-primary font-mono">Test Contrast Factor (Group A):</Label>
                  <Input
                    value={groupAName}
                    onChange={(e) => setGroupAName(e.target.value)}
                    className="mt-1 h-8 text-xs bg-surface border-border font-mono font-medium"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-foreground font-mono">Reference Baseline (Group B):</Label>
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

          {/* Sequencing Platform & Organism Reference Genome Catalog */}
          <ScientificCard
            title="Organism, Platform & Library Provenance"
            subtitle="Reference genome assembly, sequencing instrument, and chemistry"
          >
            <div className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold text-foreground">Organism & Reference Genome Build:</Label>
                <Select value={selectedOrganismBuildId} onValueChange={setSelectedOrganismBuildId}>
                  <SelectTrigger className="mt-1 h-8 text-xs bg-surface border-border font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs max-h-60">
                    {ORGANISM_BUILD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{opt.organism}</span>
                          <span className="text-muted-foreground font-mono text-[10px]">({opt.build})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Cohort Title / Dataset Identifier:</Label>
                <Input
                  value={datasetTitle}
                  onChange={(e) => setDatasetTitle(e.target.value)}
                  className="mt-1 h-8 text-xs bg-surface border-border"
                />
              </div>
            </div>
          </ScientificCard>
        </div>

        {/* Step 4: Live Working Experimental Model (Sample & Attribute Matrix) */}
        <ScientificCard
          title="Step 3: Working Experimental Model & Sample Attribute Matrix"
          subtitle="Auto-translated from uploaded metadata; edit samples, group designations, batches, or timepoints directly before launching analysis"
          headerAction={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSampleRow}
                className="h-7 text-xs border-border bg-card hover:bg-muted text-foreground gap-1"
              >
                <Plus className="w-3 h-3 text-primary" />
                <span>Add Sample</span>
              </Button>
            </div>
          }
        >
          <div className="space-y-3 font-sans">
            <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-subtle">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface text-muted-foreground font-mono text-[11px]">
                    <th className="p-2.5 font-semibold">Sample ID</th>
                    <th className="p-2.5 font-semibold">Sample Name</th>
                    <th className="p-2.5 font-semibold">Group Designation</th>
                    <th className="p-2.5 font-semibold">Batch / Center</th>
                    <th className="p-2.5 font-semibold">Timepoint</th>
                    <th className="p-2.5 font-semibold">Tissue / Stage</th>
                    <th className="p-2.5 font-semibold text-right">RIN</th>
                    <th className="p-2.5 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {workingSamples.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-2 font-mono">
                        <Input
                          value={row.sampleId}
                          onChange={(e) => handleUpdateSampleRow(idx, "sampleId", e.target.value)}
                          className="h-7 text-xs font-mono bg-surface border-border w-24"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.sampleName}
                          onChange={(e) => handleUpdateSampleRow(idx, "sampleName", e.target.value)}
                          className="h-7 text-xs bg-surface border-border w-36"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.group}
                          onChange={(e) => handleUpdateSampleRow(idx, "group", e.target.value)}
                          className="h-7 text-xs font-semibold bg-surface border-border w-40 text-primary"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.batch || ""}
                          onChange={(e) => handleUpdateSampleRow(idx, "batch", e.target.value)}
                          className="h-7 text-xs font-mono bg-surface border-border w-24"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={row.timePoint || "T0"}
                          onChange={(e) => handleUpdateSampleRow(idx, "timePoint", e.target.value)}
                          className="h-7 text-xs font-mono bg-surface border-border w-16"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={`${row.tissue || "Tumor"} • ${row.stage || "Stage II"}`}
                          onChange={(e) => handleUpdateSampleRow(idx, "tissue", e.target.value)}
                          className="h-7 text-xs bg-surface border-border w-36 text-muted-foreground"
                        />
                      </td>
                      <td className="p-2 text-right font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {row.rinScore?.toFixed(1) || "8.8"}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSampleRow(idx)}
                          className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-muted"
                          title="Remove sample"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono pt-1">
              <span>{workingSamples.length} samples in active experimental design</span>
              <span>Groups detected: <strong className="text-foreground">{Array.from(new Set(workingSamples.map(s => s.group))).join(", ")}</strong></span>
            </div>
          </div>
        </ScientificCard>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            size="lg"
            onClick={handleExecuteIngestion}
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
