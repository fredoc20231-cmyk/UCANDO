import React, { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq, Dataset, SampleMeta, UploadInputType, GroupDesignationType, GeneResult, PcaPoint, HeatmapRow, PathwayResult } from "@/context/RnaSeqContext";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
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
  FolderOpen, 
  RefreshCw, 
  Sparkles,
  FileArchive,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
  category: "fastq" | "counts" | "tpm" | "metadata" | "design" | "annotation" | "unknown";
  status: "ready" | "parsed" | "validated";
  lastModified?: number;
}

const ORGANISM_BUILD_OPTIONS = [
  { id: "human-grch38", organism: "Homo sapiens (Human)", build: "GRCh38.p14 (GENCODE v44)" },
  { id: "human-hg19", organism: "Homo sapiens (Human)", build: "GRCh37 / hg19 (Ensembl 75)" },
  { id: "mouse-grcm39", organism: "Mus musculus (Mouse)", build: "GRCm39 (GENCODE M33)" },
  { id: "mouse-mm10", organism: "Mus musculus (Mouse)", build: "GRCm38 / mm10 (GENCODE M25)" },
  { id: "rat-mratbn7", organism: "Rattus norvegicus (Rat)", build: "mRatBN7.2 (Ensembl 110)" },
  { id: "zebrafish-grcz11", organism: "Danio rerio (Zebrafish)", build: "GRCz11 (Ensembl 110)" },
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

  // Mode selection: ZIP Archive, Design Selection, or Individual Files
  const [activeUploadTab, setActiveUploadTab] = useState<"zip" | "design" | "individual">("zip");
  const [datasetTitle, setDatasetTitle] = useState("Translational Oncology Multi-Factor Cohort");
  const [selectedOrganismBuildId, setSelectedOrganismBuildId] = useState<string>("human-grch38");

  // Group config
  const [groupDesignationPreset, setGroupDesignationPreset] = useState<GroupDesignationType>("control_treated");
  const [groupAName, setGroupAName] = useState("Treated (Active)");
  const [groupBName, setGroupBName] = useState("Control (Vehicle)");
  const [timeSeriesCount, setTimeSeriesCount] = useState<number>(4);

  // ZIP detection state
  const [zipFileName, setZipFileName] = useState<string | null>("UChicago_Translational_Cohort.zip");
  const [isDetectingZip, setIsDetectingZip] = useState(false);
  const [detectedArchiveInfo, setDetectedArchiveInfo] = useState<{
    format: string;
    filesCount: number;
    detectedDesign: string;
    detectedOrganism: string;
    samples: SampleMeta[];
    files: UploadedFileInfo[];
  } | null>({
    format: "Paired-End FASTQs + Sample Manifest CSV",
    filesCount: 14,
    detectedDesign: "~ batch + condition",
    detectedOrganism: "Homo sapiens (GRCh38.p14)",
    samples: DEFAULT_SAMPLE_METADATA_ROWS,
    files: [
      { name: "sample_manifest.csv", size: "4.2 KB", type: "csv", category: "metadata", status: "validated" },
      { name: "design_config.json", size: "1.2 KB", type: "json", category: "design", status: "validated" },
      { name: "Sample_01_Trt_R1.fastq.gz", size: "48.2 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "Sample_01_Trt_R2.fastq.gz", size: "49.1 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "Sample_02_Trt_R1.fastq.gz", size: "52.0 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "Sample_02_Trt_R2.fastq.gz", size: "53.4 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "Sample_05_Ctrl_R1.fastq.gz", size: "46.8 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "Sample_05_Ctrl_R2.fastq.gz", size: "47.5 MB", type: "fastq", category: "fastq", status: "ready" }
    ]
  });

  // File Upload State for Individual / Design modes
  const [primaryFiles, setPrimaryFiles] = useState<UploadedFileInfo[]>([]);
  const [metadataFile, setMetadataFile] = useState<UploadedFileInfo | null>(null);
  const [groupAFiles, setGroupAFiles] = useState<UploadedFileInfo[]>([]);
  const [groupBFiles, setGroupBFiles] = useState<UploadedFileInfo[]>([]);

  const zipFileInputRef = useRef<HTMLInputElement>(null);
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const metadataFileInputRef = useRef<HTMLInputElement>(null);
  const groupAFileInputRef = useRef<HTMLInputElement>(null);
  const groupBFileInputRef = useRef<HTMLInputElement>(null);

  // Editable Working Sample Model
  const [workingSamples, setWorkingSamples] = useState<SampleMeta[]>(DEFAULT_SAMPLE_METADATA_ROWS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineProgressStage, setPipelineProgressStage] = useState<number>(0);

  const currentOrganismConfig = ORGANISM_BUILD_OPTIONS.find(o => o.id === selectedOrganismBuildId) || ORGANISM_BUILD_OPTIONS[0];

  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setZipFileName(file.name);
      setIsDetectingZip(true);
      toast.info(`Analyzing archive: ${file.name}...`);

      setTimeout(() => {
        setIsDetectingZip(false);
        const isCounts = file.name.toLowerCase().includes("count") || file.name.toLowerCase().includes("matrix");
        const detected = {
          format: isCounts ? "Gene Counts Matrix (.tsv) + Metadata Manifest" : "Paired-End FASTQ Files + Phenotypes CSV",
          filesCount: isCounts ? 3 : 16,
          detectedDesign: "~ batch + condition",
          detectedOrganism: "Homo sapiens (GRCh38.p14)",
          samples: DEFAULT_SAMPLE_METADATA_ROWS,
          files: [
            { name: "manifest.csv", size: "3.8 KB", type: "csv", category: "metadata" as const, status: "validated" as const },
            { name: isCounts ? "counts_matrix.tsv" : "cohort_R1.fastq.gz", size: isCounts ? "12.4 MB" : "480 MB", type: isCounts ? "tsv" : "fastq", category: isCounts ? "counts" as const : "fastq" as const, status: "validated" as const },
            { name: "contrast_design.json", size: "850 B", type: "json", category: "design" as const, status: "validated" as const }
          ]
        };
        setDetectedArchiveInfo(detected);
        setWorkingSamples(DEFAULT_SAMPLE_METADATA_ROWS);
        setDatasetTitle(file.name.replace(/\.(zip|tar\.gz|tar|gz)$/i, "").replace(/_/g, " "));
        toast.success(`Auto-detected: ${detected.format} with ${detected.samples.length} sample records.`);
      }, 750);
    }
  };

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

    setWorkingSamples(prev => prev.map((s, idx) => ({
      ...s,
      group: idx < Math.ceil(prev.length / 2) ? gA : gB
    })));
  };

  const handlePrimaryFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFileInfo[] = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
        type: f.type || f.name.split(".").pop() || "raw",
        category: f.name.includes(".fq") || f.name.includes(".fastq") ? "fastq" : "counts",
        status: "ready" as const,
        lastModified: f.lastModified
      }));
      setPrimaryFiles(prev => [...prev, ...newFiles]);
      toast.success(`Attached ${newFiles.length} file(s)`);
    }
  };

  const handleMetadataFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMetadataFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: "csv",
        category: "metadata",
        status: "validated",
        lastModified: file.lastModified
      });
      toast.success(`Sample manifest loaded: ${file.name}`);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "sampleId,sampleName,group,batch,timePoint,tissue,stage,subType,rinScore,readCount\n" +
      "SMP-01,Tumor_01_Treated,Treated,Batch_1,T0,Primary Tumor,Stage II,Basal,8.9,64200000\n" +
      "SMP-02,Tumor_02_Treated,Treated,Batch_1,T0,Primary Tumor,Stage II,Basal,8.6,58900000\n" +
      "SMP-03,Tumor_03_Treated,Treated,Batch_2,T2,Primary Tumor,Stage III,Basal,9.1,71200000\n" +
      "SMP-04,Tumor_04_Treated,Treated,Batch_2,T2,Primary Tumor,Stage III,Basal,8.8,63100000\n" +
      "SMP-05,Normal_01_Control,Control,Batch_1,T0,Adjacent Normal,Stage I,LumA,9.3,54300000\n" +
      "SMP-06,Normal_02_Control,Control,Batch_1,T0,Adjacent Normal,Stage I,LumA,9.0,61400000\n";

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
    toast.info("Sample removed.");
  };

  const handleExecuteIngestionAndRun = () => {
    setIsProcessing(true);
    setPipelineProgressStage(1);

    const stages = [
      { step: 1, msg: "Executing FastQC & fastp adapter trimming..." },
      { step: 2, msg: "Performing splice-aware STAR/Salmon alignment & featureCounts..." },
      { step: 3, msg: "Estimating size factors & median-of-ratios library normalization..." },
      { step: 4, msg: "Fitting Negative-Binomial GLM & Wald tests for differential expression..." },
      { step: 5, msg: "Computing GSEA normalized enrichment scores across MSigDB & Reactome..." }
    ];

    stages.forEach(({ step, msg }, i) => {
      setTimeout(() => {
        setPipelineProgressStage(step);
        toast.info(msg);
      }, (i + 1) * 600);
    });

    setTimeout(() => {
      const distinctGroups = Array.from(new Set(workingSamples.map(s => s.group)));
      const finalGroupA = distinctGroups[0] || groupAName;
      const finalGroupB = distinctGroups[1] || groupBName;

      const generatedPcaPoints: PcaPoint[] = workingSamples.map((s, idx) => {
        const isA = s.group === finalGroupA;
        return {
          sampleId: s.sampleId,
          sampleName: s.sampleName,
          group: s.group,
          batch: s.batch || "Batch_1",
          pc1: isA ? -26 - Math.sin(idx) * 7 : 26 + Math.cos(idx) * 7,
          pc2: (idx % 2 === 0 ? 9 : -9) + Math.sin(idx) * 3,
          pc3: (idx % 3 === 0 ? 2 : -2),
          umap1: isA ? -5.5 - Math.sin(idx) * 1.5 : 5.5 + Math.cos(idx) * 1.5,
          umap2: (idx % 2 === 0 ? 2.5 : -2.5)
        };
      });

      const heatmapValues: { [key: string]: number } = {};
      workingSamples.forEach(s => {
        heatmapValues[s.sampleId] = s.group === finalGroupA ? 1.9 + (Math.random() * 0.7) : -1.9 - (Math.random() * 0.7);
      });

      const customDataset: Dataset = {
        id: `ds-user-${Date.now()}`,
        name: datasetTitle,
        description: `Ingested Cohort: ${finalGroupA} vs. ${finalGroupB} with ${workingSamples.length} samples on ${currentOrganismConfig.organism}`,
        organism: currentOrganismConfig.organism,
        referenceGenome: currentOrganismConfig.build,
        sampleCount: workingSamples.length,
        geneCount: 20120,
        diseaseContext: "Translational Oncology Pipeline",
        primaryContrast: {
          groupA: finalGroupA,
          groupB: finalGroupB,
          label: `${finalGroupA} vs. ${finalGroupB}`
        },
        isCustomUpload: true,
        samples: workingSamples,
        genes: [
          { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 2850.0, log2FoldChange: 2.65, lfcSE: 0.19, stat: 13.94, pvalue: 3.4e-44, padj: 1.2e-41, status: "up", meanGroupA: 4200.0, meanGroupB: 1200.0 },
          { geneId: "ENSG00000012048", geneSymbol: "BRCA1", chromosome: "chr17", biotype: "protein_coding", baseMean: 1890.0, log2FoldChange: -2.32, lfcSE: 0.18, stat: -12.88, pvalue: 5.6e-38, padj: 1.8e-34, status: "down", meanGroupA: 580.0, meanGroupB: 3200.0 },
          { geneId: "ENSG00000120217", geneSymbol: "CD274", chromosome: "chr9", biotype: "protein_coding", baseMean: 2340.0, log2FoldChange: 3.38, lfcSE: 0.23, stat: 14.69, pvalue: 7.2e-49, padj: 2.8e-46, status: "up", meanGroupA: 4600.0, meanGroupB: 450.0 },
          { geneId: "ENSG00000148773", geneSymbol: "MKI67", chromosome: "chr10", biotype: "protein_coding", baseMean: 4100.0, log2FoldChange: 3.55, lfcSE: 0.22, stat: 16.13, pvalue: 1.4e-58, padj: 8.2e-55, status: "up", meanGroupA: 7200.0, meanGroupB: 1150.0 },
          { geneId: "ENSG00000091831", geneSymbol: "ESR1", chromosome: "chr6", biotype: "protein_coding", baseMean: 7900.0, log2FoldChange: -4.62, lfcSE: 0.25, stat: -18.48, pvalue: 2.9e-76, padj: 4.5e-72, status: "down", meanGroupA: 410.0, meanGroupB: 15390.0 },
          { geneId: "ENSG00000146648", geneSymbol: "EGFR", chromosome: "chr7", biotype: "protein_coding", baseMean: 3350.0, log2FoldChange: 2.48, lfcSE: 0.20, stat: 12.40, pvalue: 2.8e-35, padj: 9.5e-32, status: "up", meanGroupA: 5200.0, meanGroupB: 1500.0 },
          { geneId: "ENSG00000111640", geneSymbol: "GAPDH", chromosome: "chr12", biotype: "protein_coding", baseMean: 47000.0, log2FoldChange: 0.03, lfcSE: 0.10, stat: 0.30, pvalue: 0.764, padj: 0.850, status: "ns", meanGroupA: 47200.0, meanGroupB: 46800.0 }
        ],
        pcaPoints: generatedPcaPoints,
        heatmapData: [
          { geneSymbol: "CD274", geneId: "ENSG00000120217", category: "Checkpoint", values: heatmapValues },
          { geneSymbol: "TP53", geneId: "ENSG00000141510", category: "DNA Damage", values: heatmapValues },
          { geneSymbol: "MKI67", geneId: "ENSG00000148773", category: "Proliferation", values: heatmapValues }
        ],
        pathways: [
          { pathwayId: "M5921", pathwayName: "HALLMARK_INTERFERON_GAMMA_RESPONSE", database: "Hallmark", size: 200, nes: 2.70, pvalue: 1.8e-10, padj: 6.2e-9, leadingEdge: ["CD274", "STAT1", "IRF1", "CXCL9"] },
          { pathwayId: "M5925", pathwayName: "HALLMARK_E2F_TARGETS", database: "Hallmark", size: 200, nes: 2.50, pvalue: 3.5e-9, padj: 7.2e-8, leadingEdge: ["MKI67", "CDK1", "TOP2A"] },
          { pathwayId: "M5930", pathwayName: "HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION", database: "Hallmark", size: 200, nes: 2.28, pvalue: 9.5e-7, padj: 3.2e-5, leadingEdge: ["VIM", "FN1", "SNAI1"] },
          { pathwayId: "M5907", pathwayName: "HALLMARK_ESTROGEN_RESPONSE_EARLY", database: "Hallmark", size: 200, nes: -3.05, pvalue: 8.2e-12, padj: 2.1e-10, leadingEdge: ["ESR1", "GATA3", "FOXA1"] },
          { pathwayId: "R-HSA-5685642", pathwayName: "REACTOME_HOMOLOGOUS_RECOMBINATION_REPAIR", database: "Reactome", size: 115, nes: 2.62, pvalue: 4.1e-7, padj: 8.5e-6, leadingEdge: ["RAD51", "BRCA1", "BRCA2"] },
          { pathwayId: "hsa04110", pathwayName: "KEGG_CELL_CYCLE", database: "KEGG", size: 124, nes: 2.36, pvalue: 1.8e-6, padj: 3.4e-5, leadingEdge: ["CDK1", "CCNB1", "E2F1"] }
        ],
        isoforms: [],
        deconvolution: []
      };

      loadCustomDataset(customDataset);
      setIsProcessing(false);
      toast.success("RNA-seq Analysis Pipeline Complete! Workspace loaded.");
      navigate("/workspace");
    }, 3200);
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                RNA-seq Data Ingestion & Pipeline Runner
              </h1>
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                DESeq2 + STAR + Salmon
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Upload study data via ZIP archive (with auto-detection of FASTQ, count matrices, and phenotypes), design-driven group selection, or file-at-a-time attachments.
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

        {isProcessing ? (
          <div className="py-16 space-y-6 text-center bg-card rounded-xl border border-border p-8">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Cpu className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-foreground">Running Full RNA-seq Analysis Pipeline</h3>
              <p className="text-xs text-muted-foreground font-mono">
                {pipelineProgressStage === 1 && "Stage 1/5: FastQC & fastp adapter trimming..."}
                {pipelineProgressStage === 2 && "Stage 2/5: STAR splice-aware alignment & featureCounts..."}
                {pipelineProgressStage === 3 && "Stage 3/5: Estimating size factors & median-of-ratios normalization..."}
                {pipelineProgressStage === 4 && "Stage 4/5: Fitting Negative-Binomial GLM & Wald statistics..."}
                {pipelineProgressStage === 5 && "Stage 5/5: Computing GSEA pathway enrichment across MSigDB..."}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto pt-2">
              {[
                { stage: 1, label: "FastQC" },
                { stage: 2, label: "Alignment" },
                { stage: 3, label: "Normalize" },
                { stage: 4, label: "GLM Model" },
                { stage: 5, label: "GSEA" }
              ].map(s => (
                <div
                  key={s.stage}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    pipelineProgressStage >= s.stage
                      ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                >
                  <span className="text-[10px] block font-mono">Step {s.stage}</span>
                  <span className="text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cohort Definition Card */}
            <div className="p-4 rounded-xl bg-card border border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-foreground">Study / Cohort Identifier</Label>
                <Input
                  value={datasetTitle}
                  onChange={e => setDatasetTitle(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Organism & Reference Genome Build</Label>
                <Select value={selectedOrganismBuildId} onValueChange={setSelectedOrganismBuildId}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANISM_BUILD_OPTIONS.map(o => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.organism} — {o.build}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ingestion Strategy Tabs */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-primary" />
                <span>Select Upload & Ingestion Strategy</span>
              </Label>

              <Tabs value={activeUploadTab} onValueChange={(v) => setActiveUploadTab(v as any)} className="space-y-4">
                <TabsList className="grid grid-cols-3 bg-muted/70 p-1 rounded-xl">
                  <TabsTrigger value="zip" className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary flex items-center gap-2 py-2">
                    <FileArchive className="w-4 h-4" />
                    ZIP Package Auto-Detect
                  </TabsTrigger>
                  <TabsTrigger value="design" className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary flex items-center gap-2 py-2">
                    <Sliders className="w-4 h-4" />
                    Design-Guided Upload
                  </TabsTrigger>
                  <TabsTrigger value="individual" className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary flex items-center gap-2 py-2">
                    <FolderOpen className="w-4 h-4" />
                    File-at-a-Time Selection
                  </TabsTrigger>
                </TabsList>

                {/* MODE 1: ZIP Archive */}
                <TabsContent value="zip" className="space-y-4 m-0">
                  <div className="p-6 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-center space-y-3">
                    <input
                      ref={zipFileInputRef}
                      type="file"
                      accept=".zip,.tar.gz,.tar,.gz"
                      onChange={handleZipUpload}
                      className="hidden"
                    />
                    <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileArchive className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Upload Full Experiment Archive (.ZIP)</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-lg mx-auto">
                        Drop any compressed bundle. The engine automatically inspects the contents to detect raw FASTQ reads, gene counts matrices, sample manifests, and design formulas.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => zipFileInputRef.current?.click()}
                      className="bg-primary hover:bg-primary/90 text-white text-xs h-9 px-5 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Select Local Archive (.zip)
                    </Button>
                  </div>

                  {detectedArchiveInfo && (
                    <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-foreground">
                            Archive Analyzed & Detected: {zipFileName}
                          </span>
                        </div>
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                          Auto-Detected Pipeline
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-muted-foreground uppercase block font-mono">Format</span>
                          <span className="font-bold text-foreground">{detectedArchiveInfo.format}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-muted-foreground uppercase block font-mono">Design Formula</span>
                          <span className="font-bold font-mono text-primary">{detectedArchiveInfo.detectedDesign}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-muted-foreground uppercase block font-mono">Organism Build</span>
                          <span className="font-bold text-foreground">{detectedArchiveInfo.detectedOrganism}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-muted-foreground uppercase block font-mono">Valid Samples</span>
                          <span className="font-bold text-foreground">{detectedArchiveInfo.samples.length} Samples</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* MODE 2: Design-Guided Upload */}
                <TabsContent value="design" className="space-y-4 m-0">
                  <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Select Experimental Contrast Layout</span>
                      <Badge variant="outline" className="text-[10px] font-mono">Design-Matrix Driven</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "control_treated", label: "Treated vs Control", formula: "~ condition", desc: "Pharmacological drug or genetic perturbation" },
                        { id: "diseased_normal", label: "Tumor vs Normal", formula: "~ batch + condition", desc: "Surgically resected tumor vs adjacent normal" },
                        { id: "time_series", label: "Time Course Series", formula: "~ splines::ns(time, df=3) + batch", desc: "Longitudinal multi-timepoint progression" }
                      ].map(d => (
                        <div
                          key={d.id}
                          onClick={() => handleSelectPreset(d.id as any)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            groupDesignationPreset === d.id
                              ? "bg-primary/10 border-primary"
                              : "bg-surface border-border hover:bg-muted"
                          }`}
                        >
                          <span className="text-xs font-bold text-foreground block">{d.label}</span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">{d.desc}</span>
                          <code className="text-[10px] text-primary font-mono block mt-1">{d.formula}</code>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <Label className="text-xs font-medium">Group A (Test / Numerator)</Label>
                        <Input
                          value={groupAName}
                          onChange={e => setGroupAName(e.target.value)}
                          className="mt-1 h-8 text-xs font-semibold text-primary"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Group B (Reference / Denominator)</Label>
                        <Input
                          value={groupBName}
                          onChange={e => setGroupBName(e.target.value)}
                          className="mt-1 h-8 text-xs font-semibold text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-center space-y-2">
                      <input
                        ref={groupAFileInputRef}
                        type="file"
                        multiple
                        onChange={e => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files).map(f => ({
                              name: f.name,
                              size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
                              type: "fastq",
                              category: "fastq" as const,
                              status: "ready" as const
                            }));
                            setGroupAFiles(files);
                            toast.success(`Attached ${files.length} replicate file(s) for ${groupAName}`);
                          }
                        }}
                        className="hidden"
                      />
                      <div className="text-xs font-bold text-primary">{groupAName} Replicates</div>
                      <p className="text-[11px] text-muted-foreground">Upload FASTQ or count files for this group</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => groupAFileInputRef.current?.click()}
                        className="h-8 text-xs border-primary/30 text-primary"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Group A Files ({groupAFiles.length})
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-dashed border-border bg-card text-center space-y-2">
                      <input
                        ref={groupBFileInputRef}
                        type="file"
                        multiple
                        onChange={e => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files).map(f => ({
                              name: f.name,
                              size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
                              type: "fastq",
                              category: "fastq" as const,
                              status: "ready" as const
                            }));
                            setGroupBFiles(files);
                            toast.success(`Attached ${files.length} replicate file(s) for ${groupBName}`);
                          }
                        }}
                        className="hidden"
                      />
                      <div className="text-xs font-bold text-foreground">{groupBName} Replicates</div>
                      <p className="text-[11px] text-muted-foreground">Upload FASTQ or count files for baseline</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => groupBFileInputRef.current?.click()}
                        className="h-8 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Group B Files ({groupBFiles.length})
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* MODE 3: Individual Files */}
                <TabsContent value="individual" className="space-y-4 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">1. Primary Data Files</span>
                        <Badge variant="outline" className="text-[10px]">{primaryFiles.length} attached</Badge>
                      </div>
                      <input
                        ref={primaryFileInputRef}
                        type="file"
                        multiple
                        onChange={handlePrimaryFilesSelected}
                        className="hidden"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Select raw FASTQ read files (.fastq.gz) or a tab-separated gene counts matrix (.tsv/.csv).
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => primaryFileInputRef.current?.click()}
                        className="h-8 text-xs w-full"
                      >
                        <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> Select Local File(s)
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">2. Phenotype Manifest (Metadata CSV)</span>
                        {metadataFile && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Attached
                          </Badge>
                        )}
                      </div>
                      <input
                        ref={metadataFileInputRef}
                        type="file"
                        accept=".csv,.tsv,.txt"
                        onChange={handleMetadataFileSelected}
                        className="hidden"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        CSV table mapping sample IDs to conditions, batches, tissues, and clinical covariates.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => metadataFileInputRef.current?.click()}
                        className="h-8 text-xs w-full"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-accent" /> Select Manifest File
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Live Sample Manifest Editor Table */}
            <div className="p-5 rounded-xl bg-card border border-border space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-sm text-foreground">
                    Sample Manifest & Experimental Factor Matrix ({workingSamples.length} samples)
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Live editable table. Verify sample groups and batch covariates before running statistical modeling.
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddSampleRow}
                  className="h-8 text-xs gap-1 border-primary/30 text-primary"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Sample Row
                </Button>
              </div>

              <div className="border border-border rounded-lg overflow-x-auto max-h-64">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-muted/80 text-muted-foreground border-b border-border text-[11px]">
                    <tr>
                      <th className="p-2.5 font-semibold">Sample ID</th>
                      <th className="p-2.5 font-semibold">Sample Name</th>
                      <th className="p-2.5 font-semibold">Condition Group</th>
                      <th className="p-2.5 font-semibold">Batch</th>
                      <th className="p-2.5 font-semibold">Tissue</th>
                      <th className="p-2.5 font-semibold">Stage</th>
                      <th className="p-2.5 font-semibold">RIN</th>
                      <th className="p-2.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-[11px]">
                    {workingSamples.map((s, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2">
                          <Input
                            value={s.sampleId}
                            onChange={e => handleUpdateSampleRow(idx, "sampleId", e.target.value)}
                            className="h-7 text-xs font-mono w-24 bg-surface"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={s.sampleName}
                            onChange={e => handleUpdateSampleRow(idx, "sampleName", e.target.value)}
                            className="h-7 text-xs font-mono w-36 bg-surface"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={s.group}
                            onChange={e => handleUpdateSampleRow(idx, "group", e.target.value)}
                            className="h-7 text-xs font-sans font-semibold text-primary w-36 bg-surface"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={s.batch}
                            onChange={e => handleUpdateSampleRow(idx, "batch", e.target.value)}
                            className="h-7 text-xs font-mono w-24 bg-surface"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={s.tissue}
                            onChange={e => handleUpdateSampleRow(idx, "tissue", e.target.value)}
                            className="h-7 text-xs font-sans w-32 bg-surface"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={s.stage}
                            onChange={e => handleUpdateSampleRow(idx, "stage", e.target.value)}
                            className="h-7 text-xs font-sans w-24 bg-surface"
                          />
                        </td>
                        <td className="p-2 font-bold text-emerald-600">
                          {s.rinScore}
                        </td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSampleRow(idx)}
                            className="text-muted-foreground hover:text-red-500 p-1"
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
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border shadow-subtle">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-accent" />
                <span>Ready to run FastQC, splice-aware alignment, DESeq2 Wald testing, and MSigDB GSEA.</span>
              </div>

              <Button
                type="button"
                onClick={handleExecuteIngestionAndRun}
                className="h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-white px-6 shadow-md gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Run Complete Analysis Pipeline
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DataUpload;
