import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

export interface SampleMeta {
  sampleId: string;
  sampleName: string;
  group: string;
  batch: string;
  tissue: string;
  stage: string;
  subType: string;
  readCount: number;
  alignmentRate: number;
  rinScore: number;
  qcPass: boolean;
  timePoint?: string;
}

export interface GeneResult {
  geneId: string;
  geneSymbol: string;
  chromosome: string;
  biotype: "protein_coding" | "lncRNA" | "miRNA";
  baseMean: number;
  log2FoldChange: number;
  lfcSE: number;
  stat: number;
  pvalue: number;
  padj: number;
  status: "up" | "down" | "ns";
  meanGroupA: number;
  meanGroupB: number;
}

export interface PcaPoint {
  sampleId: string;
  sampleName: string;
  group: string;
  batch: string;
  pc1: number;
  pc2: number;
  pc3: number;
  umap1: number;
  umap2: number;
}

export interface HeatmapRow {
  geneSymbol: string;
  geneId: string;
  category: string;
  values: { [sampleId: string]: number }; // z-scores
}

export interface PathwayResult {
  pathwayId: string;
  pathwayName: string;
  database: "Hallmark" | "Reactome" | "KEGG" | "GO-BP";
  size: number;
  nes: number; // Normalized Enrichment Score
  pvalue: number;
  padj: number;
  leadingEdge: string[];
}

export interface IsoformResult {
  transcriptId: string;
  geneSymbol: string;
  isoformName: string;
  refLength: number;
  usageBaseline: number; // %
  usageContrast: number; // %
  deltaPsi: number; // dPSI
  pvalue: number;
  padj: number;
  event: "Exon Skipping" | "Alternative 5' SS" | "Intron Retention" | "Alternative 3' SS";
}

export interface DeconvolutionResult {
  sampleId: string;
  group: string;
  cd8TCells: number;
  cd4TCells: number;
  bCells: number;
  nkCells: number;
  macrophagesM1: number;
  macrophagesM2: number;
  cafFibroblasts: number;
  endothelial: number;
  tumorCells: number;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  organism: string;
  referenceGenome: string;
  sampleCount: number;
  geneCount: number;
  diseaseContext: string;
  primaryContrast: {
    groupA: string;
    groupB: string;
    label: string;
  };
  samples: SampleMeta[];
  genes: GeneResult[];
  pcaPoints: PcaPoint[];
  heatmapData: HeatmapRow[];
  pathways: PathwayResult[];
  isoforms: IsoformResult[];
  deconvolution: DeconvolutionResult[];
  isCustomUpload?: boolean;
}

export type GroupDesignationType = 
  | "control_treated" 
  | "diseased_normal" 
  | "time_0_t2" 
  | "time_series" 
  | "subtype" 
  | "custom";

export type UploadInputType = 
  | "raw_fastq" 
  | "read_counts" 
  | "processed_final";

export interface DesignFormulaOption {
  formula: string;
  label: string;
  description: string;
  category: "Standard" | "Time Series" | "Complex / Multi-factor" | "Paired";
}

export const DESIGN_FORMULA_OPTIONS: DesignFormulaOption[] = [
  {
    formula: "~ batch + condition",
    label: "~ batch + condition (Standard with Batch Correction)",
    description: "Two-factor additive generalized linear model controlling for technical batch effects across sequencing centers or flowcells.",
    category: "Standard"
  },
  {
    formula: "~ condition",
    label: "~ condition (Simple Contrast: Control vs. Treated / Diseased vs. Normal)",
    description: "Single-factor generalized linear model for clean datasets without confounding technical covariates.",
    category: "Standard"
  },
  {
    formula: "~ time",
    label: "~ time (Discrete Timepoint Comparison / T0 vs. T2)",
    description: "Evaluates expression trajectories across discrete time intervals or binary temporal endpoints.",
    category: "Time Series"
  },
  {
    formula: "~ batch + time",
    label: "~ batch + time (Time Series with Batch Blocking)",
    description: "Models temporal expression dynamics across longitudinal timepoints while blocking for sample preparation batches.",
    category: "Time Series"
  },
  {
    formula: "~ splines::ns(time, df=3) + batch",
    label: "~ splines::ns(time, df=3) + batch (Continuous Spline LRT: T0-T10)",
    description: "Likelihood Ratio Test (LRT) with natural cubic splines to detect non-linear temporal kinetic curves across 3 to 10 time points.",
    category: "Time Series"
  },
  {
    formula: "~ genotype + treatment + genotype:treatment",
    label: "~ genotype + treatment + genotype:treatment (Interaction Model)",
    description: "Tests whether the treatment response effect size differs across genotypes (e.g. Drug effect in Wildtype vs Mutant).",
    category: "Complex / Multi-factor"
  },
  {
    formula: "~ patient + treatment",
    label: "~ patient + treatment (Paired / Repeated Measures)",
    description: "Controls for inter-patient biological variability by treating individual patient IDs as blocking factors (pre- vs post-treatment).",
    category: "Paired"
  },
  {
    formula: "~ batch + condition + cell_purity",
    label: "~ batch + condition + cell_purity (Tumor Purity Adjusted)",
    description: "Integrates computational deconvolution or pathology tumor purity percentages as continuous numeric covariates.",
    category: "Complex / Multi-factor"
  }
];

// Built-in Reference Dataset 1: TCGA-BRCA (Basal-like vs Luminal A)
const TCGA_BRCA_SAMPLES: SampleMeta[] = [
  { sampleId: "TCGA-A2-0099", sampleName: "BRCA_001_Basal", group: "Basal-like (TNBC)", batch: "Batch_1 (UNC)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIA", subType: "Basal", readCount: 64200000, alignmentRate: 96.4, rinScore: 8.8, qcPass: true, timePoint: "T0" },
  { sampleId: "TCGA-A2-0294", sampleName: "BRCA_002_Basal", group: "Basal-like (TNBC)", batch: "Batch_1 (UNC)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIB", subType: "Basal", readCount: 58900000, alignmentRate: 95.8, rinScore: 8.4, qcPass: true, timePoint: "T0" },
  { sampleId: "TCGA-AO-A0J6", sampleName: "BRCA_003_Basal", group: "Basal-like (TNBC)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIC", subType: "Basal", readCount: 71200000, alignmentRate: 97.1, rinScore: 9.1, qcPass: true, timePoint: "T2" },
  { sampleId: "TCGA-AO-A0JJ", sampleName: "BRCA_004_Basal", group: "Basal-like (TNBC)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIB", subType: "Basal", readCount: 63100000, alignmentRate: 96.0, rinScore: 8.6, qcPass: true, timePoint: "T2" },
  { sampleId: "TCGA-BH-A0BQ", sampleName: "BRCA_005_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1 (UNC)", tissue: "Invasive Lobular Carcinoma", stage: "Stage IIA", subType: "LumA", readCount: 54300000, alignmentRate: 97.8, rinScore: 8.9, qcPass: true, timePoint: "T0" },
  { sampleId: "TCGA-BH-A0BV", sampleName: "BRCA_006_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1 (UNC)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IA", subType: "LumA", readCount: 61400000, alignmentRate: 98.2, rinScore: 9.3, qcPass: true, timePoint: "T0" },
  { sampleId: "TCGA-BH-A0BW", sampleName: "BRCA_007_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIA", subType: "LumA", readCount: 68100000, alignmentRate: 97.5, rinScore: 8.7, qcPass: true, timePoint: "T2" },
  { sampleId: "TCGA-BH-A0C0", sampleName: "BRCA_008_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIB", subType: "LumA", readCount: 59700000, alignmentRate: 96.9, rinScore: 9.0, qcPass: true, timePoint: "T2" },
  { sampleId: "TCGA-C8-A1HJ", sampleName: "BRCA_009_Basal", group: "Basal-like (TNBC)", batch: "Batch_3 (WashU)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIA", subType: "Basal", readCount: 74500000, alignmentRate: 98.6, rinScore: 9.4, qcPass: true, timePoint: "T3" },
  { sampleId: "TCGA-C8-A1HK", sampleName: "BRCA_010_Basal", group: "Basal-like (TNBC)", batch: "Batch_3 (WashU)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIC", subType: "Basal", readCount: 66200000, alignmentRate: 97.0, rinScore: 8.9, qcPass: true, timePoint: "T3" },
  { sampleId: "TCGA-D8-A13Y", sampleName: "BRCA_011_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3 (WashU)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IB", subType: "LumA", readCount: 52900000, alignmentRate: 96.1, rinScore: 8.5, qcPass: true, timePoint: "T3" },
  { sampleId: "TCGA-D8-A142", sampleName: "BRCA_012_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3 (WashU)", tissue: "Invasive Lobular Carcinoma", stage: "Stage IIA", subType: "LumA", readCount: 69800000, alignmentRate: 97.9, rinScore: 9.2, qcPass: true, timePoint: "T3" }
];

const TCGA_BRCA_GENES: GeneResult[] = [
  { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 2840.5, log2FoldChange: 2.84, lfcSE: 0.18, stat: 15.78, pvalue: 1.2e-56, padj: 8.9e-54, status: "up", meanGroupA: 4250.0, meanGroupB: 1431.0 },
  { geneId: "ENSG00000012048", geneSymbol: "BRCA1", chromosome: "chr17", biotype: "protein_coding", baseMean: 1950.2, log2FoldChange: -2.31, lfcSE: 0.19, stat: -12.16, pvalue: 5.1e-34, padj: 1.8e-31, status: "down", meanGroupA: 620.0, meanGroupB: 3280.4 },
  { geneId: "ENSG00000121879", geneSymbol: "PIK3CA", chromosome: "chr3", biotype: "protein_coding", baseMean: 3120.8, log2FoldChange: 1.95, lfcSE: 0.21, stat: 9.29, pvalue: 1.5e-20, padj: 3.2e-18, status: "up", meanGroupA: 4480.2, meanGroupB: 1761.4 },
  { geneId: "ENSG00000148773", geneSymbol: "MKI67", chromosome: "chr10", biotype: "protein_coding", baseMean: 4500.1, log2FoldChange: 3.82, lfcSE: 0.22, stat: 17.36, pvalue: 2.2e-67, padj: 4.8e-64, status: "up", meanGroupA: 7850.0, meanGroupB: 1150.2 },
  { geneId: "ENSG00000091831", geneSymbol: "ESR1", chromosome: "chr6", biotype: "protein_coding", baseMean: 8900.4, log2FoldChange: -4.95, lfcSE: 0.25, stat: -19.80, pvalue: 8.9e-87, padj: 3.1e-83, status: "down", meanGroupA: 420.1, meanGroupB: 17380.7 },
  { geneId: "ENSG00000171791", geneSymbol: "BCL2", chromosome: "chr18", biotype: "protein_coding", baseMean: 5400.0, log2FoldChange: -3.42, lfcSE: 0.23, stat: -14.87, pvalue: 5.4e-50, padj: 2.1e-47, status: "down", meanGroupA: 890.3, meanGroupB: 9910.0 },
  { geneId: "ENSG00000139618", geneSymbol: "BRCA2", chromosome: "chr13", biotype: "protein_coding", baseMean: 1420.0, log2FoldChange: -1.75, lfcSE: 0.20, stat: -8.75, pvalue: 2.1e-18, padj: 3.9e-16, status: "down", meanGroupA: 550.0, meanGroupB: 2290.0 },
  { geneId: "ENSG00000141736", geneSymbol: "ERBB2", chromosome: "chr17", biotype: "protein_coding", baseMean: 6200.0, log2FoldChange: 0.42, lfcSE: 0.28, stat: 1.50, pvalue: 0.133, padj: 0.245, status: "ns", meanGroupA: 6800.0, meanGroupB: 5600.0 },
  { geneId: "ENSG00000120217", geneSymbol: "CD274", chromosome: "chr9", biotype: "protein_coding", baseMean: 2100.3, log2FoldChange: 3.15, lfcSE: 0.24, stat: 13.12, pvalue: 2.4e-39, padj: 1.1e-36, status: "up", meanGroupA: 3890.0, meanGroupB: 310.6 },
  { geneId: "ENSG00000111640", geneSymbol: "GAPDH", chromosome: "chr12", biotype: "protein_coding", baseMean: 48500.0, log2FoldChange: 0.08, lfcSE: 0.11, stat: 0.73, pvalue: 0.467, padj: 0.612, status: "ns", meanGroupA: 49100.0, meanGroupB: 47900.0 },
  { geneId: "ENSG00000075624", geneSymbol: "ACTB", chromosome: "chr7", biotype: "protein_coding", baseMean: 52000.0, log2FoldChange: -0.05, lfcSE: 0.10, stat: -0.50, pvalue: 0.617, padj: 0.744, status: "ns", meanGroupA: 51700.0, meanGroupB: 52300.0 }
];

const TCGA_BRCA_PCA: PcaPoint[] = [
  { sampleId: "TCGA-A2-0099", sampleName: "BRCA_001_Basal", group: "Basal-like (TNBC)", batch: "Batch_1", pc1: -38.4, pc2: 12.2, pc3: 2.1, umap1: -6.4, umap2: 3.1 },
  { sampleId: "TCGA-A2-0294", sampleName: "BRCA_002_Basal", group: "Basal-like (TNBC)", batch: "Batch_1", pc1: -34.1, pc2: 9.8, pc3: -1.8, umap1: -5.8, umap2: 2.8 },
  { sampleId: "TCGA-AO-A0J6", sampleName: "BRCA_003_Basal", group: "Basal-like (TNBC)", batch: "Batch_2", pc1: -41.2, pc2: 15.4, pc3: 3.4, umap1: -7.1, umap2: 3.9 },
  { sampleId: "TCGA-AO-A0JJ", sampleName: "BRCA_004_Basal", group: "Basal-like (TNBC)", batch: "Batch_2", pc1: -36.7, pc2: 11.0, pc3: -0.5, umap1: -6.2, umap2: 2.9 },
  { sampleId: "TCGA-BH-A0BQ", sampleName: "BRCA_005_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1", pc1: 32.5, pc2: -10.4, pc3: 1.4, umap1: 5.9, umap2: -3.2 },
  { sampleId: "TCGA-BH-A0BV", sampleName: "BRCA_006_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1", pc1: 36.8, pc2: -14.1, pc3: -2.1, umap1: 6.8, umap2: -4.1 },
  { sampleId: "TCGA-BH-A0BW", sampleName: "BRCA_007_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2", pc1: 29.4, pc2: -8.9, pc3: 3.1, umap1: 5.4, umap2: -2.8 },
  { sampleId: "TCGA-BH-A0C0", sampleName: "BRCA_008_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2", pc1: 34.0, pc2: -12.5, pc3: -1.2, umap1: 6.3, umap2: -3.7 },
  { sampleId: "TCGA-C8-A1HJ", sampleName: "BRCA_009_Basal", group: "Basal-like (TNBC)", batch: "Batch_3", pc1: -39.0, pc2: 13.8, pc3: 1.9, umap1: -6.7, umap2: 3.5 },
  { sampleId: "TCGA-C8-A1HK", sampleName: "BRCA_010_Basal", group: "Basal-like (TNBC)", batch: "Batch_3", pc1: -35.6, pc2: 10.2, pc3: -1.1, umap1: -6.0, umap2: 2.7 },
  { sampleId: "TCGA-D8-A13Y", sampleName: "BRCA_011_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3", pc1: 31.2, pc2: -9.5, pc3: 2.0, umap1: 5.7, umap2: -3.0 },
  { sampleId: "TCGA-D8-A142", sampleName: "BRCA_012_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3", pc1: 35.5, pc2: -13.0, pc3: -0.8, umap1: 6.5, umap2: -3.9 }
];

const TCGA_BRCA_HEATMAP: HeatmapRow[] = [
  { geneSymbol: "ESR1", geneId: "ENSG00000091831", category: "Luminal Marker", values: { "TCGA-A2-0099": -2.4, "TCGA-A2-0294": -2.1, "TCGA-AO-A0J6": -2.6, "TCGA-AO-A0JJ": -2.3, "TCGA-BH-A0BQ": 2.1, "TCGA-BH-A0BV": 2.5, "TCGA-BH-A0BW": 1.9, "TCGA-BH-A0C0": 2.3, "TCGA-C8-A1HJ": -2.5, "TCGA-C8-A1HK": -2.2, "TCGA-D8-A13Y": 2.0, "TCGA-D8-A142": 2.4 } },
  { geneSymbol: "MKI67", geneId: "ENSG00000148773", category: "Proliferation", values: { "TCGA-A2-0099": 2.2, "TCGA-A2-0294": 1.9, "TCGA-AO-A0J6": 2.5, "TCGA-AO-A0JJ": 2.1, "TCGA-BH-A0BQ": -1.8, "TCGA-BH-A0BV": -2.2, "TCGA-BH-A0BW": -1.6, "TCGA-BH-A0C0": -2.0, "TCGA-C8-A1HJ": 2.3, "TCGA-C8-A1HK": 2.0, "TCGA-D8-A13Y": -1.7, "TCGA-D8-A142": -2.1 } },
  { geneSymbol: "CD274", geneId: "ENSG00000120217", category: "Immune Checkpoint", values: { "TCGA-A2-0099": 2.1, "TCGA-A2-0294": 1.8, "TCGA-AO-A0J6": 2.4, "TCGA-AO-A0JJ": 1.9, "TCGA-BH-A0BQ": -1.9, "TCGA-BH-A0BV": -2.1, "TCGA-BH-A0BW": -1.7, "TCGA-BH-A0C0": -2.0, "TCGA-C8-A1HJ": 2.2, "TCGA-C8-A1HK": 1.8, "TCGA-D8-A13Y": -1.8, "TCGA-D8-A142": -2.0 } },
  { geneSymbol: "TP53", geneId: "ENSG00000141510", category: "DNA Damage", values: { "TCGA-A2-0099": 1.9, "TCGA-A2-0294": 1.7, "TCGA-AO-A0J6": 2.1, "TCGA-AO-A0JJ": 1.8, "TCGA-BH-A0BQ": -1.5, "TCGA-BH-A0BV": -1.8, "TCGA-BH-A0BW": -1.4, "TCGA-BH-A0C0": -1.7, "TCGA-C8-A1HJ": 2.0, "TCGA-C8-A1HK": 1.7, "TCGA-D8-A13Y": -1.5, "TCGA-D8-A142": -1.8 } }
];

const TCGA_BRCA_PATHWAYS: PathwayResult[] = [
  { pathwayId: "M5921", pathwayName: "HALLMARK_INTERFERON_GAMMA_RESPONSE", database: "Hallmark", size: 200, nes: 2.84, pvalue: 1.2e-9, padj: 4.8e-8, leadingEdge: ["CD274", "STAT1", "IRF1", "CXCL9", "CXCL10", "HLA-A"] },
  { pathwayId: "M5925", pathwayName: "HALLMARK_E2F_TARGETS", database: "Hallmark", size: 200, nes: 2.61, pvalue: 3.4e-8, padj: 8.9e-7, leadingEdge: ["MKI67", "CDK1", "TOP2A", "CCNB1", "E2F1"] },
  { pathwayId: "M5907", pathwayName: "HALLMARK_ESTROGEN_RESPONSE_EARLY", database: "Hallmark", size: 200, nes: -3.12, pvalue: 4.1e-12, padj: 2.1e-10, leadingEdge: ["ESR1", "BCL2", "PGR", "GATA3", "XBP1"] }
];

export const REFERENCE_DATASETS: Dataset[] = [
  {
    id: "ds-brca-tcga",
    name: "TCGA-BRCA Transcriptomics Cohort",
    description: "Harmonized bulk RNA-seq count matrix comparing Basal-like (Triple Negative) vs. Luminal A breast carcinoma across 12 patient tumors.",
    organism: "Homo sapiens",
    referenceGenome: "GRCh38.p14 (GENCODE v44)",
    sampleCount: 12,
    geneCount: 20485,
    diseaseContext: "Invasive Breast Carcinoma (BRCA)",
    primaryContrast: {
      groupA: "Basal-like (TNBC)",
      groupB: "Luminal A (ER+/HER2-)",
      label: "Basal-like (TNBC) vs. Luminal A (ER+/HER2-)"
    },
    samples: TCGA_BRCA_SAMPLES,
    genes: TCGA_BRCA_GENES,
    pcaPoints: TCGA_BRCA_PCA,
    heatmapData: TCGA_BRCA_HEATMAP,
    pathways: TCGA_BRCA_PATHWAYS,
    isoforms: [],
    deconvolution: []
  }
];

export interface RnaSeqContextType {
  // Current active dataset
  activeDataset: Dataset;
  allDatasets: Dataset[];
  selectDataset: (datasetId: string) => void;
  loadCustomDataset: (dataset: Dataset) => void;

  // Analysis configuration & filter thresholds
  padjThreshold: number;
  setPadjThreshold: (val: number) => void;
  lfcThreshold: number;
  setLfcThreshold: (val: number) => void;
  normalizationMethod: string;
  setNormalizationMethod: (val: string) => void;
  designFormula: string;
  setDesignFormula: (val: string) => void;
  batchCovariate: string;
  setBatchCovariate: (val: string) => void;
  multiTestingCorrection: string;
  setMultiTestingCorrection: (val: string) => void;

  // Experimental Design & Groups (Control vs Treated, Diseased vs Normal, T0-T10 Time Series)
  groupDesignation: GroupDesignationType;
  setGroupDesignation: (val: GroupDesignationType) => void;
  groupCount: number;
  setGroupCount: (val: number) => void;
  groupsList: string[];
  setGroupsList: (groups: string[]) => void;
  baselineGroup: string;
  setBaselineGroup: (val: string) => void;
  contrastGroup: string;
  setContrastGroup: (val: string) => void;
  updateExperimentalGroups: (type: GroupDesignationType, count: number, customNames?: string[]) => void;

  // Sequencing Platform & Library Protocol Metadata
  sequencingPlatform: string;
  setSequencingPlatform: (val: string) => void;
  libraryProtocol: string;
  setLibraryProtocol: (val: string) => void;
  readType: string;
  setReadType: (val: string) => void;
  meanReadDepth: string;
  setMeanReadDepth: (val: string) => void;

  // Upload input type & analysis starting point
  uploadInputType: UploadInputType;
  setUploadInputType: (val: UploadInputType) => void;
  pipelineStartingPointDescription: string;

  // Search & gene selection
  selectedGene: GeneResult | null;
  setSelectedGene: (gene: GeneResult | null) => void;
  geneSearchQuery: string;
  setGeneSearchQuery: (query: string) => void;

  // Status panel drawer / collapse & modal trigger
  isStatusPanelOpen: boolean;
  setIsStatusPanelOpen: (open: boolean) => void;
  toggleStatusPanel: () => void;
  isDesignModalOpen: boolean;
  setIsDesignModalOpen: (open: boolean) => void;

  // Computed / filtered metrics
  filteredGenes: GeneResult[];
  upregulatedCount: number;
  downregulatedCount: number;
  nonsignificantCount: number;
  totalGenesCount: number;
}

const RnaSeqContext = createContext<RnaSeqContextType | undefined>(undefined);

export const RnaSeqProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allDatasets, setAllDatasets] = useState<Dataset[]>(REFERENCE_DATASETS);
  const [activeDatasetId, setActiveDatasetId] = useState<string>(REFERENCE_DATASETS[0].id);

  const [padjThreshold, setPadjThreshold] = useState<number>(0.01);
  const [lfcThreshold, setLfcThreshold] = useState<number>(1.0);
  const [normalizationMethod, setNormalizationMethod] = useState<string>("DESeq2 Median of Ratios");
  const [designFormula, setDesignFormula] = useState<string>("~ batch + condition");
  const [batchCovariate, setBatchCovariate] = useState<string>("Batch (Sequencing Center)");
  const [multiTestingCorrection, setMultiTestingCorrection] = useState<string>("Benjamini-Hochberg (FDR)");

  // Experimental Groups & Contrasts State
  const [groupDesignation, setGroupDesignation] = useState<GroupDesignationType>("subtype");
  const [groupCount, setGroupCount] = useState<number>(2);
  const [groupsList, setGroupsList] = useState<string[]>([
    "Basal-like (TNBC)",
    "Luminal A (ER+/HER2-)"
  ]);
  const [baselineGroup, setBaselineGroup] = useState<string>("Luminal A (ER+/HER2-)");
  const [contrastGroup, setContrastGroup] = useState<string>("Basal-like (TNBC)");

  // Sequencing Platform & Library Protocol Metadata
  const [sequencingPlatform, setSequencingPlatform] = useState<string>("Illumina NovaSeq 6000");
  const [libraryProtocol, setLibraryProtocol] = useState<string>("Illumina Stranded mRNA (PolyA Capture)");
  const [readType, setReadType] = useState<string>("Paired-End 2x150bp");
  const [meanReadDepth, setMeanReadDepth] = useState<string>("62.5M reads/sample");

  // Upload Input Type
  const [uploadInputType, setUploadInputType] = useState<UploadInputType>("read_counts");

  const [selectedGene, setSelectedGene] = useState<GeneResult | null>(null);
  const [geneSearchQuery, setGeneSearchQuery] = useState<string>("");
  const [isStatusPanelOpen, setIsStatusPanelOpen] = useState<boolean>(true);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState<boolean>(false);

  const activeDataset = useMemo(() => {
    return allDatasets.find((d) => d.id === activeDatasetId) || allDatasets[0];
  }, [allDatasets, activeDatasetId]);

  const selectDataset = (datasetId: string) => {
    setActiveDatasetId(datasetId);
    setSelectedGene(null);
  };

  const loadCustomDataset = (dataset: Dataset) => {
    setAllDatasets((prev) => [dataset, ...prev]);
    setActiveDatasetId(dataset.id);
    setSelectedGene(null);
  };

  const toggleStatusPanel = () => {
    setIsStatusPanelOpen((prev) => !prev);
  };

  const updateExperimentalGroups = (type: GroupDesignationType, count: number, customNames?: string[]) => {
    setGroupDesignation(type);
    setGroupCount(count);

    if (customNames && customNames.length > 0) {
      setGroupsList(customNames);
      setBaselineGroup(customNames[0]);
      setContrastGroup(customNames[1] || customNames[0]);
      return;
    }

    if (type === "control_treated") {
      const g = ["Control (Vehicle)", "Treated (Active Compound)"];
      setGroupsList(g);
      setBaselineGroup(g[0]);
      setContrastGroup(g[1]);
      setDesignFormula("~ condition");
    } else if (type === "diseased_normal") {
      const g = ["Adjacent Normal Tissue", "Primary Malignant Tumor"];
      setGroupsList(g);
      setBaselineGroup(g[0]);
      setContrastGroup(g[1]);
      setDesignFormula("~ batch + condition");
    } else if (type === "time_0_t2") {
      const g = ["Time 0 (Baseline Pre-Treatment)", "T2 (Post-Treatment 2h)"];
      setGroupsList(g);
      setBaselineGroup(g[0]);
      setContrastGroup(g[1]);
      setDesignFormula("~ time");
    } else if (type === "time_series") {
      const g: string[] = [];
      for (let i = 0; i <= count; i++) {
        if (i === 0) g.push("T0 (Baseline)");
        else g.push(`T${i} (Timepoint ${i})`);
      }
      setGroupsList(g);
      setBaselineGroup(g[0]);
      setContrastGroup(g[g.length - 1]);
      setDesignFormula(count >= 4 ? "~ splines::ns(time, df=3) + batch" : "~ batch + time");
    } else if (type === "subtype") {
      const g = ["Basal-like (TNBC)", "Luminal A (ER+/HER2-)"];
      setGroupsList(g);
      setBaselineGroup(g[1]);
      setContrastGroup(g[0]);
      setDesignFormula("~ batch + condition");
    }
  };

  const pipelineStartingPointDescription = useMemo(() => {
    if (uploadInputType === "raw_fastq") {
      return "Starts analysis from scratch: Raw FASTQ trimming (fastp) → STAR/Salmon alignment → featureCounts quantification → DESeq2 GLM modeling.";
    }
    if (uploadInputType === "read_counts") {
      return "Starts analysis from raw read counts: Library size normalization (Median of Ratios) → VST variance stabilization → DESeq2 Wald/LRT differential testing.";
    }
    return "Final processed results: Pre-computed normalized expression & differential statistics loaded directly into Volcano, Heatmap, PCA, and GSEA.";
  }, [uploadInputType]);

  // Recompute gene status based on user-adjusted padj and log2FC thresholds
  const computedGenes = useMemo(() => {
    return activeDataset.genes.map((gene) => {
      const isSig = gene.padj <= padjThreshold;
      let status: "up" | "down" | "ns" = "ns";
      if (isSig) {
        if (gene.log2FoldChange >= lfcThreshold) {
          status = "up";
        } else if (gene.log2FoldChange <= -lfcThreshold) {
          status = "down";
        }
      }
      return {
        ...gene,
        status
      };
    });
  }, [activeDataset.genes, padjThreshold, lfcThreshold]);

  const filteredGenes = useMemo(() => {
    if (!geneSearchQuery.trim()) return computedGenes;
    const q = geneSearchQuery.toLowerCase();
    return computedGenes.filter(
      (g) =>
        g.geneSymbol.toLowerCase().includes(q) ||
        g.geneId.toLowerCase().includes(q) ||
        g.chromosome.toLowerCase().includes(q)
    );
  }, [computedGenes, geneSearchQuery]);

  const upregulatedCount = useMemo(
    () => computedGenes.filter((g) => g.status === "up").length,
    [computedGenes]
  );
  const downregulatedCount = useMemo(
    () => computedGenes.filter((g) => g.status === "down").length,
    [computedGenes]
  );
  const nonsignificantCount = useMemo(
    () => computedGenes.filter((g) => g.status === "ns").length,
    [computedGenes]
  );

  return (
    <RnaSeqContext.Provider
      value={{
        activeDataset,
        allDatasets,
        selectDataset,
        loadCustomDataset,
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
        groupDesignation,
        setGroupDesignation,
        groupCount,
        setGroupCount,
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
        selectedGene,
        setSelectedGene,
        geneSearchQuery,
        setGeneSearchQuery,
        isStatusPanelOpen,
        setIsStatusPanelOpen,
        toggleStatusPanel,
        isDesignModalOpen,
        setIsDesignModalOpen,
        filteredGenes,
        upregulatedCount,
        downregulatedCount,
        nonsignificantCount,
        totalGenesCount: activeDataset.genes.length
      }}
    >
      {children}
    </RnaSeqContext.Provider>
  );
};

export const useRnaSeq = (): RnaSeqContextType => {
  const context = useContext(RnaSeqContext);
  if (!context) {
    throw new Error("useRnaSeq must be used within a RnaSeqProvider");
  }
  return context;
};
