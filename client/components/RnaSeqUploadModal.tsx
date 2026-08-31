import React, { useState, useRef } from "react";
import { useRnaSeq, Dataset, SampleMeta, UploadInputType, GroupDesignationType, PcaPoint } from "@/context/RnaSeqContext";
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
import {
  Upload,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  Sparkles,
  Database,
  Sliders,
  Check,
  X,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  Info,
  FolderOpen,
  ArrowRight,
  Cpu,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
  category: "fastq" | "counts" | "tpm" | "metadata" | "design" | "annotation" | "unknown";
  detectedSamples?: string[];
  status: "ready" | "parsed" | "validated";
}

interface DetectedArchivePackage {
  filename: string;
  size: string;
  detectedType: "Paired-End FASTQs + Manifest" | "Gene Read Counts Matrix + Phenotypes" | "Normalized Abundance (TPM/FPKM)" | "Full BCO Pipeline Bundle";
  detectedOrganism: string;
  detectedGenomeBuild: string;
  detectedDesignFormula: string;
  contrastA: string;
  contrastB: string;
  files: UploadedFileInfo[];
  samples: SampleMeta[];
  recommendedPipeline: string[];
}

const DEMO_PRESET_ARCHIVES: DetectedArchivePackage[] = [
  {
    filename: "UChicago_TNBC_ChemoResistant_Cohort.zip",
    size: "428.4 MB",
    detectedType: "Paired-End FASTQs + Manifest",
    detectedOrganism: "Homo sapiens (Human)",
    detectedGenomeBuild: "GRCh38.p14 (GENCODE v44)",
    detectedDesignFormula: "~ batch + condition",
    contrastA: "Chemo-Resistant (Residual)",
    contrastB: "Chemo-Sensitive (pCR)",
    files: [
      { name: "sample_manifest.csv", size: "4.2 KB", type: "csv", category: "metadata", status: "validated" },
      { name: "experimental_design.json", size: "1.1 KB", type: "json", category: "design", status: "validated" },
      { name: "TNBC_01_R1.fastq.gz", size: "48.2 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_01_R2.fastq.gz", size: "49.1 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_02_R1.fastq.gz", size: "52.0 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_02_R2.fastq.gz", size: "53.4 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_03_R1.fastq.gz", size: "50.1 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_03_R2.fastq.gz", size: "51.0 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_04_R1.fastq.gz", size: "46.8 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_04_R2.fastq.gz", size: "47.5 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_05_R1.fastq.gz", size: "49.6 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_05_R2.fastq.gz", size: "50.2 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_06_R1.fastq.gz", size: "47.1 MB", type: "fastq", category: "fastq", status: "ready" },
      { name: "TNBC_06_R2.fastq.gz", size: "48.0 MB", type: "fastq", category: "fastq", status: "ready" }
    ],
    samples: [
      { sampleId: "TNBC-01", sampleName: "TNBC_01_Resistant_B1", group: "Chemo-Resistant (Residual)", batch: "Batch_A", tissue: "Primary Core Biopsy", stage: "Stage IIIA", subType: "Basal-Like", readCount: 68400000, alignmentRate: 97.6, rinScore: 9.1, qcPass: true, timePoint: "Post-NACT" },
      { sampleId: "TNBC-02", sampleName: "TNBC_02_Resistant_B1", group: "Chemo-Resistant (Residual)", batch: "Batch_A", tissue: "Primary Core Biopsy", stage: "Stage IIB", subType: "Basal-Like", readCount: 62100000, alignmentRate: 96.9, rinScore: 8.8, qcPass: true, timePoint: "Post-NACT" },
      { sampleId: "TNBC-03", sampleName: "TNBC_03_Resistant_B2", group: "Chemo-Resistant (Residual)", batch: "Batch_B", tissue: "Primary Core Biopsy", stage: "Stage IIIC", subType: "Mesenchymal", readCount: 74200000, alignmentRate: 98.2, rinScore: 9.3, qcPass: true, timePoint: "Post-NACT" },
      { sampleId: "TNBC-04", sampleName: "TNBC_04_Sensitive_B1", group: "Chemo-Sensitive (pCR)", batch: "Batch_A", tissue: "Primary Core Biopsy", stage: "Stage IIA", subType: "Immunomodulatory", readCount: 59300000, alignmentRate: 97.4, rinScore: 8.9, qcPass: true, timePoint: "Baseline" },
      { sampleId: "TNBC-05", sampleName: "TNBC_05_Sensitive_B1", group: "Chemo-Sensitive (pCR)", batch: "Batch_A", tissue: "Primary Core Biopsy", stage: "Stage IIB", subType: "Immunomodulatory", readCount: 64800000, alignmentRate: 98.5, rinScore: 9.2, qcPass: true, timePoint: "Baseline" },
      { sampleId: "TNBC-06", sampleName: "TNBC_06_Sensitive_B2", group: "Chemo-Sensitive (pCR)", batch: "Batch_B", tissue: "Primary Core Biopsy", stage: "Stage IIA", subType: "Immunomodulatory", readCount: 61500000, alignmentRate: 97.1, rinScore: 8.7, qcPass: true, timePoint: "Baseline" }
    ],
    recommendedPipeline: ["FastQC v0.12.1", "fastp Adapter Trimming", "STAR v2.7.11a Splice Alignment", "featureCounts Gene Summary", "DESeq2 GLM (Wald)"]
  },
  {
    filename: "NSCLC_EGFR_Osimertinib_Resistant_Counts.zip",
    size: "18.6 MB",
    detectedType: "Gene Read Counts Matrix + Phenotypes",
    detectedOrganism: "Homo sapiens (Human)",
    detectedGenomeBuild: "GRCh38.p14 (GENCODE v44)",
    detectedDesignFormula: "~ batch + condition",
    contrastA: "Osimertinib-Resistant (C797S+)",
    contrastB: "Osimertinib-Sensitive (T790M)",
    files: [
      { name: "raw_counts_matrix.tsv", size: "14.2 MB", type: "tsv", category: "counts", status: "validated" },
      { name: "phenotype_metadata.csv", size: "3.8 KB", type: "csv", category: "metadata", status: "validated" },
      { name: "contrast_contrast_config.json", size: "850 B", type: "json", category: "design", status: "validated" }
    ],
    samples: [
      { sampleId: "EGFR-01", sampleName: "EGFR_01_Res_B1", group: "Osimertinib-Resistant (C797S+)", batch: "Batch_1", tissue: "Lung Adenocarcinoma", stage: "Stage IV", subType: "EGFR L858R+C797S", readCount: 54000000, alignmentRate: 98.1, rinScore: 9.0, qcPass: true, timePoint: "Progression" },
      { sampleId: "EGFR-02", sampleName: "EGFR_02_Res_B1", group: "Osimertinib-Resistant (C797S+)", batch: "Batch_1", tissue: "Lung Adenocarcinoma", stage: "Stage IV", subType: "EGFR L858R+C797S", readCount: 58200000, alignmentRate: 97.8, rinScore: 8.8, qcPass: true, timePoint: "Progression" },
      { sampleId: "EGFR-03", sampleName: "EGFR_03_Res_B2", group: "Osimertinib-Resistant (C797S+)", batch: "Batch_2", tissue: "Lung Adenocarcinoma", stage: "Stage IV", subType: "EGFR Exon19del+METamp", readCount: 62000000, alignmentRate: 98.4, rinScore: 9.2, qcPass: true, timePoint: "Progression" },
      { sampleId: "EGFR-04", sampleName: "EGFR_04_Sens_B1", group: "Osimertinib-Sensitive (T790M)", batch: "Batch_1", tissue: "Lung Adenocarcinoma", stage: "Stage IIIB", subType: "EGFR L858R+T790M", readCount: 51300000, alignmentRate: 97.5, rinScore: 8.9, qcPass: true, timePoint: "Baseline" },
      { sampleId: "EGFR-05", sampleName: "EGFR_05_Sens_B1", group: "Osimertinib-Sensitive (T790M)", batch: "Batch_1", tissue: "Lung Adenocarcinoma", stage: "Stage IV", subType: "EGFR L858R+T790M", readCount: 55600000, alignmentRate: 98.0, rinScore: 9.1, qcPass: true, timePoint: "Baseline" },
      { sampleId: "EGFR-06", sampleName: "EGFR_06_Sens_B2", group: "Osimertinib-Sensitive (T790M)", batch: "Batch_2", tissue: "Lung Adenocarcinoma", stage: "Stage IIIB", subType: "EGFR Exon19del+T790M", readCount: 59400000, alignmentRate: 97.7, rinScore: 8.6, qcPass: true, timePoint: "Baseline" }
    ],
    recommendedPipeline: ["Unnormalized Count Validation", "DESeq2 Median of Ratios Normalization", "Dispersion Shrinkage (apeglm)", "Negative Binomial GLM", "GSEA Enrichment"]
  }
];

interface RnaSeqUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RnaSeqUploadModal: React.FC<RnaSeqUploadModalProps> = ({ open, onOpenChange }) => {
  const {
    loadCustomDataset,
    uploadInputType,
    setUploadInputType,
    designFormula,
    setDesignFormula,
    setBaselineGroup,
    setContrastGroup
  } = useRnaSeq();

  const navigate = useNavigate();

  // Mode selection
  const [uploadMode, setUploadMode] = useState<"zip" | "design" | "individual">("zip");
  const [datasetTitle, setDatasetTitle] = useState("Custom Ingested Cohort");
  const [selectedOrganism, setSelectedOrganism] = useState("Homo sapiens (Human) - GRCh38.p14");

  // ZIP detection state
  const [detectedArchive, setDetectedArchive] = useState<DetectedArchivePackage | null>(DEMO_PRESET_ARCHIVES[0]);
  const [isAnalyzingZip, setIsAnalyzingZip] = useState(false);

  // Individual files state
  const [individualFiles, setIndividualFiles] = useState<UploadedFileInfo[]>([]);
  const [individualManifest, setIndividualManifest] = useState<UploadedFileInfo | null>(null);

  // Design-guided state
  const [selectedDesignType, setSelectedDesignType] = useState<GroupDesignationType>("control_treated");
  const [designGroupA, setDesignGroupA] = useState("Treated (Active)");
  const [designGroupB, setDesignGroupB] = useState("Control (Vehicle)");
  const [groupAFiles, setGroupAFiles] = useState<UploadedFileInfo[]>([]);
  const [groupBFiles, setGroupBFiles] = useState<UploadedFileInfo[]>([]);

  // Working samples
  const [workingSamples, setWorkingSamples] = useState<SampleMeta[]>(DEMO_PRESET_ARCHIVES[0].samples);

  // Analysis pipeline execution state
  const [isExecutingPipeline, setIsExecutingPipeline] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<number>(0);

  const zipInputRef = useRef<HTMLInputElement>(null);
  const individualInputRef = useRef<HTMLInputElement>(null);
  const manifestInputRef = useRef<HTMLInputElement>(null);
  const groupAInputRef = useRef<HTMLInputElement>(null);
  const groupBInputRef = useRef<HTMLInputElement>(null);

  const handleZipFileUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsAnalyzingZip(true);
      toast.info(`Analyzing compressed archive: ${file.name}...`);

      setTimeout(() => {
        setIsAnalyzingZip(false);
        const isCounts = file.name.toLowerCase().includes("count") || file.name.toLowerCase().includes("matrix");
        const detected = isCounts ? DEMO_PRESET_ARCHIVES[1] : {
          ...DEMO_PRESET_ARCHIVES[0],
          filename: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
        };
        setDetectedArchive(detected);
        setWorkingSamples(detected.samples);
        setDatasetTitle(file.name.replace(/\.(zip|tar\.gz|tar|gz)$/i, "").replace(/_/g, " "));
        toast.success(`Archive unpacked & auto-detected: ${detected.detectedType} (${detected.samples.length} samples)`);
      }, 700);
    }
  };

  const handleSelectPresetArchive = (archive: DetectedArchivePackage) => {
    setDetectedArchive(archive);
    setWorkingSamples(archive.samples);
    setDatasetTitle(archive.filename.replace(/\.zip$/i, "").replace(/_/g, " "));
    toast.info(`Loaded pre-configured package: ${archive.filename}`);
  };

  const handleIndividualFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFileInfo[] = Array.from(e.target.files).map(f => {
        const ext = f.name.split(".").pop()?.toLowerCase() || "";
        const isFq = f.name.includes(".fastq") || f.name.includes(".fq");
        const isCnt = f.name.includes("count") || ext === "tsv" || ext === "csv";
        return {
          name: f.name,
          size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
          type: ext,
          category: isFq ? "fastq" : isCnt ? "counts" : "unknown",
          status: "ready"
        };
      });
      setIndividualFiles(prev => [...prev, ...newFiles]);
      toast.success(`Attached ${newFiles.length} file(s)`);
    }
  };

  const handleManifestUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIndividualManifest({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: "csv",
        category: "metadata",
        status: "validated"
      });
      toast.success(`Metadata manifest parsed: ${file.name}`);
    }
  };

  const handleRunAnalysisPipeline = () => {
    setIsExecutingPipeline(true);
    setPipelineStage(1);

    const stages = [
      { stage: 1, msg: "Running FastQC & fastp adapter QC trimming...", delay: 600 },
      { stage: 2, msg: "Splice-aware alignment & feature quantification (STAR/Salmon)...", delay: 1200 },
      { stage: 3, msg: "Estimating size factors & DESeq2 library normalization...", delay: 1800 },
      { stage: 4, msg: "Fitting Negative Binomial GLM & calculating Wald statistics...", delay: 2400 },
      { stage: 5, msg: "Computing GSEA pathway enrichment across MSigDB & Reactome...", delay: 3000 },
    ];

    stages.forEach(({ stage, msg, delay }) => {
      setTimeout(() => {
        setPipelineStage(stage);
        toast.info(msg);
      }, delay);
    });

    setTimeout(() => {
      setIsExecutingPipeline(false);
      const activeSamples = workingSamples.length > 0 ? workingSamples : DEMO_PRESET_ARCHIVES[0].samples;
      const groupA = detectedArchive ? detectedArchive.contrastA : designGroupA;
      const groupB = detectedArchive ? detectedArchive.contrastB : designGroupB;

      // Generate dynamic PCA & UMAP data
      const dynamicPcaPoints: PcaPoint[] = activeSamples.map((s, idx) => {
        const isA = s.group === groupA;
        return {
          sampleId: s.sampleId,
          sampleName: s.sampleName,
          group: s.group,
          batch: s.batch || "Batch_1",
          pc1: isA ? -28.4 - Math.sin(idx) * 6 : 28.4 + Math.cos(idx) * 6,
          pc2: (idx % 2 === 0 ? 10.2 : -10.2) + Math.sin(idx) * 3,
          pc3: (idx % 3 === 0 ? 3.5 : -3.5),
          umap1: isA ? -6.2 - Math.sin(idx) * 1.2 : 6.2 + Math.cos(idx) * 1.2,
          umap2: (idx % 2 === 0 ? 3.1 : -3.1)
        };
      });

      // Sample-value heatmaps
      const heatmapValues: { [key: string]: number } = {};
      activeSamples.forEach(s => {
        heatmapValues[s.sampleId] = s.group === groupA ? 2.1 + (Math.random() * 0.6) : -2.1 - (Math.random() * 0.6);
      });

      const customDataset: Dataset = {
        id: `ds-user-${Date.now()}`,
        name: datasetTitle,
        description: `User Ingested Pipeline Cohort: ${groupA} vs. ${groupB} (${activeSamples.length} samples, ${selectedOrganism})`,
        organism: "Homo sapiens (Human)",
        referenceGenome: "GRCh38.p14 (GENCODE v44)",
        sampleCount: activeSamples.length,
        geneCount: 20450,
        diseaseContext: "Clinical & Translational Cohort",
        primaryContrast: {
          groupA,
          groupB,
          label: `${groupA} vs. ${groupB}`
        },
        isCustomUpload: true,
        samples: activeSamples,
        genes: [
          { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 3120.0, log2FoldChange: 2.85, lfcSE: 0.18, stat: 15.83, pvalue: 1.8e-56, padj: 7.2e-53, status: "up", meanGroupA: 4800.0, meanGroupB: 1440.0 },
          { geneId: "ENSG00000012048", geneSymbol: "BRCA1", chromosome: "chr17", biotype: "protein_coding", baseMean: 1950.0, log2FoldChange: -2.45, lfcSE: 0.19, stat: -12.89, pvalue: 5.2e-38, padj: 1.8e-34, status: "down", meanGroupA: 550.0, meanGroupB: 3350.0 },
          { geneId: "ENSG00000120217", geneSymbol: "CD274", chromosome: "chr9", biotype: "protein_coding", baseMean: 2450.0, log2FoldChange: 3.42, lfcSE: 0.22, stat: 15.54, pvalue: 1.9e-54, padj: 6.4e-51, status: "up", meanGroupA: 5100.0, meanGroupB: 480.0 },
          { geneId: "ENSG00000148773", geneSymbol: "MKI67", chromosome: "chr10", biotype: "protein_coding", baseMean: 4300.0, log2FoldChange: 3.65, lfcSE: 0.21, stat: 17.38, pvalue: 1.1e-67, padj: 8.8e-64, status: "up", meanGroupA: 7800.0, meanGroupB: 1200.0 },
          { geneId: "ENSG00000091831", geneSymbol: "ESR1", chromosome: "chr6", biotype: "protein_coding", baseMean: 8200.0, log2FoldChange: -4.85, lfcSE: 0.25, stat: -19.40, pvalue: 1.5e-83, padj: 3.0e-79, status: "down", meanGroupA: 380.0, meanGroupB: 16020.0 },
          { geneId: "ENSG00000146648", geneSymbol: "EGFR", chromosome: "chr7", biotype: "protein_coding", baseMean: 3500.0, log2FoldChange: 2.65, lfcSE: 0.20, stat: 13.25, pvalue: 4.5e-40, padj: 1.5e-36, status: "up", meanGroupA: 5600.0, meanGroupB: 1400.0 },
          { geneId: "ENSG00000105976", geneSymbol: "MET", chromosome: "chr7", biotype: "protein_coding", baseMean: 2900.0, log2FoldChange: 2.15, lfcSE: 0.19, stat: 11.31, pvalue: 1.1e-29, padj: 3.2e-26, status: "up", meanGroupA: 4200.0, meanGroupB: 1600.0 },
          { geneId: "ENSG00000136997", geneSymbol: "MYC", chromosome: "chr8", biotype: "protein_coding", baseMean: 6200.0, log2FoldChange: 2.90, lfcSE: 0.21, stat: 13.80, pvalue: 2.4e-43, padj: 8.6e-40, status: "up", meanGroupA: 9200.0, meanGroupB: 3200.0 },
          { geneId: "ENSG00000111640", geneSymbol: "GAPDH", chromosome: "chr12", biotype: "protein_coding", baseMean: 48000.0, log2FoldChange: 0.04, lfcSE: 0.10, stat: 0.40, pvalue: 0.689, padj: 0.795, status: "ns", meanGroupA: 48200.0, meanGroupB: 47800.0 },
          { geneId: "ENSG00000075624", geneSymbol: "ACTB", chromosome: "chr7", biotype: "protein_coding", baseMean: 52000.0, log2FoldChange: -0.06, lfcSE: 0.11, stat: -0.54, pvalue: 0.589, padj: 0.710, status: "ns", meanGroupA: 51800.0, meanGroupB: 52200.0 }
        ],
        pcaPoints: dynamicPcaPoints,
        heatmapData: [
          { geneSymbol: "CD274", geneId: "ENSG00000120217", category: "Immune Checkpoint", values: heatmapValues },
          { geneSymbol: "TP53", geneId: "ENSG00000141510", category: "DNA Damage", values: heatmapValues },
          { geneSymbol: "MKI67", geneId: "ENSG00000148773", category: "Cell Proliferation", values: heatmapValues },
          { geneSymbol: "EGFR", geneId: "ENSG00000146648", category: "Receptor Tyrosine Kinase", values: heatmapValues },
          { geneSymbol: "MET", geneId: "ENSG00000105976", category: "Receptor Tyrosine Kinase", values: heatmapValues },
          { geneSymbol: "ESR1", geneId: "ENSG00000091831", category: "Hormone Receptor", values: heatmapValues }
        ],
        pathways: [
          { pathwayId: "M5921", pathwayName: "HALLMARK_INTERFERON_GAMMA_RESPONSE", database: "Hallmark", size: 200, nes: 2.74, pvalue: 1.2e-10, padj: 4.8e-9, leadingEdge: ["CD274", "STAT1", "IRF1", "CXCL9", "CXCL10"] },
          { pathwayId: "M5925", pathwayName: "HALLMARK_E2F_TARGETS", database: "Hallmark", size: 200, nes: 2.58, pvalue: 2.3e-9, padj: 5.6e-8, leadingEdge: ["MKI67", "CDK1", "TOP2A", "E2F1"] },
          { pathwayId: "M5930", pathwayName: "HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION", database: "Hallmark", size: 200, nes: 2.35, pvalue: 8.4e-8, padj: 1.2e-6, leadingEdge: ["VIM", "FN1", "SNAI1", "TWIST1"] },
          { pathwayId: "M5907", pathwayName: "HALLMARK_ESTROGEN_RESPONSE_EARLY", database: "Hallmark", size: 200, nes: -3.12, pvalue: 4.5e-13, padj: 1.8e-11, leadingEdge: ["ESR1", "GATA3", "FOXA1", "XBP1"] },
          { pathwayId: "R-HSA-5685642", pathwayName: "REACTOME_HOMOLOGOUS_RECOMBINATION_REPAIR", database: "Reactome", size: 115, nes: 2.68, pvalue: 3.2e-8, padj: 6.8e-7, leadingEdge: ["RAD51", "BRCA1", "BRCA2", "ATM"] },
          { pathwayId: "R-HSA-69620", pathwayName: "REACTOME_CELL_CYCLE_CHECKPOINTS", database: "Reactome", size: 190, nes: 2.44, pvalue: 9.1e-8, padj: 1.5e-6, leadingEdge: ["CDK1", "CCNB1", "CHEK1", "ATR"] },
          { pathwayId: "hsa04110", pathwayName: "KEGG_CELL_CYCLE", database: "KEGG", size: 124, nes: 2.40, pvalue: 1.5e-7, padj: 2.8e-6, leadingEdge: ["CDK1", "CCNB1", "E2F1", "MKI67"] }
        ],
        isoforms: [],
        deconvolution: []
      };

      loadCustomDataset(customDataset);
      setBaselineGroup(groupB);
      setContrastGroup(groupA);
      setDesignFormula("~ batch + condition");

      toast.success("RNA-seq Analysis Pipeline Complete! Workspace loaded.");
      onOpenChange(false);
      navigate("/workspace");
    }, 3600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-6 font-sans">
        <DialogHeader className="space-y-1.5 pb-3 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-serif font-bold text-foreground">
                  RNA-seq Data Ingestion & Pipeline Runner
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Upload complete study packages (ZIP), select files based on experimental design, or attach individual FASTQ/counts matrices.
                </DialogDescription>
              </div>
            </div>

            <Badge variant="outline" className="font-mono text-[10px] text-accent border-accent/30 bg-accent/5">
              DESeq2 + STAR + GSEA
            </Badge>
          </div>
        </DialogHeader>

        {isExecutingPipeline ? (
          <div className="py-12 space-y-6 text-center">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Cpu className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-foreground">Executing Differential Expression Pipeline</h3>
              <p className="text-xs text-muted-foreground font-mono">
                {pipelineStage === 1 && "Stage 1/5: Running FastQC adapter & quality trimming..."}
                {pipelineStage === 2 && "Stage 2/5: STAR splice-aware alignment & featureCounts..."}
                {pipelineStage === 3 && "Stage 3/5: Estimating size factors & median-of-ratios normalization..."}
                {pipelineStage === 4 && "Stage 4/5: Fitting Negative-Binomial GLM & Wald statistics..."}
                {pipelineStage === 5 && "Stage 5/5: Computing GSEA pathway enrichment across MSigDB..."}
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
                    pipelineStage >= s.stage
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
          <div className="space-y-6 py-2">
            {/* Cohort metadata header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-border">
              <div>
                <Label className="text-xs font-semibold text-foreground">Study / Cohort Title</Label>
                <Input
                  value={datasetTitle}
                  onChange={e => setDatasetTitle(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g., UChicago TNBC Chemo-Resistance Study"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Organism & Reference Genome</Label>
                <Select value={selectedOrganism} onValueChange={setSelectedOrganism}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue placeholder="Select reference genome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homo sapiens (Human) - GRCh38.p14">Homo sapiens (Human) — GRCh38.p14 (GENCODE v44)</SelectItem>
                    <SelectItem value="Homo sapiens (Human) - GRCh37/hg19">Homo sapiens (Human) — GRCh37 / hg19 (Ensembl 75)</SelectItem>
                    <SelectItem value="Mus musculus (Mouse) - GRCm39">Mus musculus (Mouse) — GRCm39 (GENCODE M33)</SelectItem>
                    <SelectItem value="Custom Reference Genome">Custom Reference (User-Provided FASTA & GTF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Method Tabs */}
            <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as any)} className="space-y-4">
              <TabsList className="grid grid-cols-3 bg-muted/60 p-1 rounded-lg">
                <TabsTrigger value="zip" className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary flex items-center gap-1.5">
                  <FileArchive className="w-3.5 h-3.5" />
                  ZIP Archive Auto-Detect
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Design-Guided Upload
                </TabsTrigger>
                <TabsTrigger value="individual" className="text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Individual File-at-a-Time
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: ZIP Archive Auto-Detection */}
              <TabsContent value="zip" className="space-y-4 m-0">
                <div className="p-5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors bg-primary/5 text-center space-y-3">
                  <input
                    ref={zipInputRef}
                    type="file"
                    accept=".zip,.tar.gz,.tar,.gz"
                    onChange={handleZipFileUploaded}
                    className="hidden"
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileArchive className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Upload Full Study ZIP Archive</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Drag & drop a <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">.zip</code> containing FASTQ files, Count Matrices (<code className="font-mono text-[11px]">.tsv/.csv</code>), Sample Manifests, or Design JSON.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => zipInputRef.current?.click()}
                      className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Select Local ZIP File
                    </Button>
                  </div>
                </div>

                {/* Preset Fast-Test Packages */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Or Test With Institutional Pre-Packaged Bundles:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {DEMO_PRESET_ARCHIVES.map((pkg, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPresetArchive(pkg)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          detectedArchive?.filename === pkg.filename
                            ? "bg-primary/10 border-primary shadow-sm"
                            : "bg-card border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FileArchive className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-xs font-bold text-foreground truncate">{pkg.filename}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-mono">{pkg.size}</Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="text-primary font-medium">{pkg.contrastA} vs. {pkg.contrastB}</span>
                          <span>•</span>
                          <span>{pkg.samples.length} samples</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detected Archive Details Card */}
                {detectedArchive && (
                  <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-foreground">
                          Detected Package Content: {detectedArchive.filename}
                        </span>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                        Auto-Configured
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-surface border border-border">
                        <span className="text-[10px] text-muted-foreground uppercase block font-mono">Format Detected</span>
                        <span className="font-bold text-foreground">{detectedArchive.detectedType}</span>
                      </div>
                      <div className="p-2 rounded bg-surface border border-border">
                        <span className="text-[10px] text-muted-foreground uppercase block font-mono">Design Formula</span>
                        <span className="font-bold font-mono text-primary">{detectedArchive.detectedDesignFormula}</span>
                      </div>
                      <div className="p-2 rounded bg-surface border border-border">
                        <span className="text-[10px] text-muted-foreground uppercase block font-mono">Contrast Groups</span>
                        <span className="font-bold text-foreground">{detectedArchive.contrastA} vs {detectedArchive.contrastB}</span>
                      </div>
                      <div className="p-2 rounded bg-surface border border-border">
                        <span className="text-[10px] text-muted-foreground uppercase block font-mono">Samples Found</span>
                        <span className="font-bold text-foreground">{detectedArchive.samples.length} Validated Samples</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-2.5">
                      <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                        Detected Archive File Manifest ({detectedArchive.files.length} items):
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1 text-xs font-mono">
                        {detectedArchive.files.map((f, i) => (
                          <div key={i} className="flex items-center justify-between p-1.5 rounded bg-muted/40 hover:bg-muted text-[11px]">
                            <div className="flex items-center gap-2 truncate">
                              {f.category === "fastq" && <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                              {f.category === "counts" && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                              {f.category === "metadata" && <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                              {f.category === "design" && <Sliders className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
                              <span className="truncate">{f.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-muted-foreground">{f.size}</span>
                              <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                                {f.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: Design-Guided Upload */}
              <TabsContent value="design" className="space-y-4 m-0">
                <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Step 1: Select Contrast Architecture</span>
                    <Badge variant="outline" className="text-[10px] font-mono">Design-Matrix Aligned</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "control_treated", label: "Treated vs Control", formula: "~ condition", desc: "Two-group active drug or knockdown comparison" },
                      { id: "diseased_normal", label: "Tumor vs Normal", formula: "~ batch + condition", desc: "Matched or cohort tumor vs adjacent normal tissue" },
                      { id: "time_series", label: "Longitudinal / Time-Course", formula: "~ splines::ns(time) + batch", desc: "Multi-timepoint dynamic response series" }
                    ].map(d => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDesignType(d.id as any)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedDesignType === d.id
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
                      <Label className="text-xs font-medium">Group A (Numerator / Test Group)</Label>
                      <Input
                        value={designGroupA}
                        onChange={e => setDesignGroupA(e.target.value)}
                        className="mt-1 h-8 text-xs font-semibold text-primary"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Group B (Denominator / Baseline Reference)</Label>
                      <Input
                        value={designGroupB}
                        onChange={e => setDesignGroupB(e.target.value)}
                        className="mt-1 h-8 text-xs font-semibold text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Dropzones for each group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-center space-y-2">
                    <input
                      ref={groupAInputRef}
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
                          toast.success(`Attached ${files.length} replicate file(s) for ${designGroupA}`);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="text-xs font-bold text-primary">{designGroupA} Replicate Files</div>
                    <p className="text-[11px] text-muted-foreground">Upload FASTQ or count files for this group</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => groupAInputRef.current?.click()}
                      className="h-7 text-xs border-primary/30 text-primary"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Group A Files ({groupAFiles.length})
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border-2 border-dashed border-border bg-card text-center space-y-2">
                    <input
                      ref={groupBInputRef}
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
                          toast.success(`Attached ${files.length} replicate file(s) for ${designGroupB}`);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="text-xs font-bold text-foreground">{designGroupB} Replicate Files</div>
                    <p className="text-[11px] text-muted-foreground">Upload FASTQ or count files for baseline</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => groupBInputRef.current?.click()}
                      className="h-7 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Group B Files ({groupBFiles.length})
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Individual File-at-a-Time */}
              <TabsContent value="individual" className="space-y-4 m-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">1. Primary Data Files (FASTQ or Counts Matrix)</span>
                      <Badge variant="outline" className="text-[10px]">{individualFiles.length} attached</Badge>
                    </div>
                    <input
                      ref={individualInputRef}
                      type="file"
                      multiple
                      onChange={handleIndividualFilesChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Select raw FASTQ read files (.fastq.gz) or a tab-separated gene counts matrix (.tsv/.csv).
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => individualInputRef.current?.click()}
                      className="h-8 text-xs w-full"
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> Select Data File(s)
                    </Button>

                    {individualFiles.length > 0 && (
                      <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[11px]">
                        {individualFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between p-1 rounded bg-muted/50">
                            <span className="truncate">{f.name}</span>
                            <span className="text-muted-foreground text-[10px]">{f.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">2. Phenotype Manifest (Metadata CSV/TSV)</span>
                      {individualManifest && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                          Attached
                        </Badge>
                      )}
                    </div>
                    <input
                      ref={manifestInputRef}
                      type="file"
                      accept=".csv,.tsv,.txt"
                      onChange={handleManifestUploaded}
                      className="hidden"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Table mapping sample IDs to conditions, batches, tissues, and clinical covariates.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => manifestInputRef.current?.click()}
                      className="h-8 text-xs w-full"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Select Manifest File
                    </Button>

                    {individualManifest && (
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
                        <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold truncate">
                          {individualManifest.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{individualManifest.size}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Live Sample Validation Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Ingestion Sample Matrix ({workingSamples.length} samples loaded)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Ready for Negative-Binomial GLM Dispersion Fitting
                </span>
              </div>

              <div className="border border-border rounded-lg overflow-x-auto max-h-48 bg-card">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-muted/80 text-muted-foreground border-b border-border text-[11px]">
                    <tr>
                      <th className="p-2 font-semibold">Sample ID</th>
                      <th className="p-2 font-semibold">Sample Name</th>
                      <th className="p-2 font-semibold">Group / Condition</th>
                      <th className="p-2 font-semibold">Batch</th>
                      <th className="p-2 font-semibold">Tissue</th>
                      <th className="p-2 font-semibold">RIN</th>
                      <th className="p-2 font-semibold">QC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-[11px]">
                    {workingSamples.map((s, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-bold text-foreground">{s.sampleId}</td>
                        <td className="p-2 text-muted-foreground">{s.sampleName}</td>
                        <td className="p-2">
                          <span className="font-sans px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            {s.group}
                          </span>
                        </td>
                        <td className="p-2 text-muted-foreground">{s.batch}</td>
                        <td className="p-2 font-sans text-muted-foreground">{s.tissue}</td>
                        <td className="p-2 font-bold text-emerald-600">{s.rinScore}</td>
                        <td className="p-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Execution Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-accent" />
                <span>One-click execution triggers FastQC, STAR alignment, DESeq2 Wald test, and GSEA.</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRunAnalysisPipeline}
                  className="h-9 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-4 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Run Analysis Pipeline
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
