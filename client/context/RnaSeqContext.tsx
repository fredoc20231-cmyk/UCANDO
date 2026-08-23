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

// Built-in Reference Dataset 1: TCGA-BRCA (Basal-like vs Luminal A)
const TCGA_BRCA_SAMPLES: SampleMeta[] = [
  { sampleId: "TCGA-A2-0099", sampleName: "BRCA_001_Basal", group: "Basal-like (TNBC)", batch: "Batch_1 (UNC)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIA", subType: "Basal", readCount: 64200000, alignmentRate: 96.4, rinScore: 8.8, qcPass: true },
  { sampleId: "TCGA-A2-0294", sampleName: "BRCA_002_Basal", group: "Basal-like (TNBC)", batch: "Batch_1 (UNC)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIB", subType: "Basal", readCount: 58900000, alignmentRate: 95.8, rinScore: 8.4, qcPass: true },
  { sampleId: "TCGA-AO-A0J6", sampleName: "BRCA_003_Basal", group: "Basal-like (TNBC)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIC", subType: "Basal", readCount: 71200000, alignmentRate: 97.1, rinScore: 9.1, qcPass: true },
  { sampleId: "TCGA-AO-A0JJ", sampleName: "BRCA_004_Basal", group: "Basal-like (TNBC)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIB", subType: "Basal", readCount: 63100000, alignmentRate: 96.0, rinScore: 8.6, qcPass: true },
  { sampleId: "TCGA-BH-A0BQ", sampleName: "BRCA_005_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1 (UNC)", tissue: "Invasive Lobular Carcinoma", stage: "Stage IIA", subType: "LumA", readCount: 54300000, alignmentRate: 97.8, rinScore: 8.9, qcPass: true },
  { sampleId: "TCGA-BH-A0BV", sampleName: "BRCA_006_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1 (UNC)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IA", subType: "LumA", readCount: 61400000, alignmentRate: 98.2, rinScore: 9.3, qcPass: true },
  { sampleId: "TCGA-BH-A0BW", sampleName: "BRCA_007_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIA", subType: "LumA", readCount: 57800000, alignmentRate: 97.4, rinScore: 8.7, qcPass: true },
  { sampleId: "TCGA-BH-A0BZ", sampleName: "BRCA_008_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2 (BCM)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IB", subType: "LumA", readCount: 66500000, alignmentRate: 98.0, rinScore: 9.0, qcPass: true },
  { sampleId: "TCGA-E2-A15A", sampleName: "BRCA_009_Basal", group: "Basal-like (TNBC)", batch: "Batch_3 (WashU)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIB", subType: "Basal", readCount: 69400000, alignmentRate: 96.7, rinScore: 8.9, qcPass: true },
  { sampleId: "TCGA-E2-A15C", sampleName: "BRCA_010_Basal", group: "Basal-like (TNBC)", batch: "Batch_3 (WashU)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIIA", subType: "Basal", readCount: 62800000, alignmentRate: 95.9, rinScore: 8.5, qcPass: true },
  { sampleId: "TCGA-E2-A15E", sampleName: "BRCA_011_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3 (WashU)", tissue: "Invasive Ductal Carcinoma", stage: "Stage IIA", subType: "LumA", readCount: 59200000, alignmentRate: 97.5, rinScore: 9.2, qcPass: true },
  { sampleId: "TCGA-E2-A15I", sampleName: "BRCA_012_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3 (WashU)", tissue: "Invasive Lobular Carcinoma", stage: "Stage IA", subType: "LumA", readCount: 63800000, alignmentRate: 98.1, rinScore: 9.4, qcPass: true },
];

const TCGA_BRCA_GENES: GeneResult[] = [
  { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 1845.2, log2FoldChange: 2.84, lfcSE: 0.21, stat: 13.52, pvalue: 1.2e-41, padj: 8.4e-39, status: "up", meanGroupA: 2840.1, meanGroupB: 850.3 },
  { geneId: "ENSG00000091831", geneSymbol: "ESR1", chromosome: "chr6", biotype: "protein_coding", baseMean: 6420.8, log2FoldChange: -4.92, lfcSE: 0.28, stat: -17.57, pvalue: 4.1e-69, padj: 8.2e-66, status: "down", meanGroupA: 310.4, meanGroupB: 12531.2 },
  { geneId: "ENSG00000141736", geneSymbol: "ERBB2", chromosome: "chr17", biotype: "protein_coding", baseMean: 3950.4, log2FoldChange: -1.82, lfcSE: 0.19, stat: -9.58, pvalue: 9.8e-22, padj: 3.4e-20, status: "down", meanGroupA: 1820.5, meanGroupB: 6080.3 },
  { geneId: "ENSG00000148773", geneSymbol: "MKI67", chromosome: "chr10", biotype: "protein_coding", baseMean: 2410.6, log2FoldChange: 3.65, lfcSE: 0.24, stat: 15.21, pvalue: 3.1e-52, padj: 1.5e-49, status: "up", meanGroupA: 4210.8, meanGroupB: 610.4 },
  { geneId: "ENSG00000101057", geneSymbol: "MYC", chromosome: "chr8", biotype: "protein_coding", baseMean: 3120.5, log2FoldChange: 2.45, lfcSE: 0.22, stat: 11.14, pvalue: 7.9e-29, padj: 4.2e-27, status: "up", meanGroupA: 4520.1, meanGroupB: 1720.9 },
  { geneId: "ENSG00000139618", geneSymbol: "BRCA2", chromosome: "chr13", biotype: "protein_coding", baseMean: 1120.4, log2FoldChange: 1.94, lfcSE: 0.18, stat: 10.78, pvalue: 4.3e-27, padj: 1.8e-25, status: "up", meanGroupA: 1680.2, meanGroupB: 560.6 },
  { geneId: "ENSG00000012048", geneSymbol: "BRCA1", chromosome: "chr17", biotype: "protein_coding", baseMean: 980.6, log2FoldChange: 1.78, lfcSE: 0.17, stat: 10.47, pvalue: 1.2e-25, padj: 4.6e-24, status: "up", meanGroupA: 1420.3, meanGroupB: 540.9 },
  { geneId: "ENSG00000171791", geneSymbol: "BCL2", chromosome: "chr18", biotype: "protein_coding", baseMean: 4530.1, log2FoldChange: -3.42, lfcSE: 0.26, stat: -13.15, pvalue: 1.8e-39, padj: 9.8e-38, status: "down", meanGroupA: 780.4, meanGroupB: 8280.0 },
  { geneId: "ENSG00000164362", geneSymbol: "FOXM1", chromosome: "chr12", biotype: "protein_coding", baseMean: 1640.2, log2FoldChange: 3.88, lfcSE: 0.25, stat: 15.52, pvalue: 2.5e-54, padj: 1.7e-51, status: "up", meanGroupA: 3180.6, meanGroupB: 290.8 },
  { geneId: "ENSG00000128422", geneSymbol: "GATA3", chromosome: "chr10", biotype: "protein_coding", baseMean: 5120.0, log2FoldChange: -4.15, lfcSE: 0.29, stat: -14.31, pvalue: 1.9e-46, padj: 1.1e-43, status: "down", meanGroupA: 450.2, meanGroupB: 9790.0 },
  { geneId: "ENSG00000136997", geneSymbol: "MYB", chromosome: "chr6", biotype: "protein_coding", baseMean: 2740.8, log2FoldChange: -2.86, lfcSE: 0.23, stat: -12.43, pvalue: 1.8e-35, padj: 8.1e-34, status: "down", meanGroupA: 620.1, meanGroupB: 4860.5 },
  { geneId: "ENSG00000105173", geneSymbol: "CCNE1", chromosome: "chr19", biotype: "protein_coding", baseMean: 1390.4, log2FoldChange: 2.76, lfcSE: 0.21, stat: 13.14, pvalue: 2.0e-39, padj: 1.0e-37, status: "up", meanGroupA: 2450.0, meanGroupB: 330.8 },
  { geneId: "ENSG00000110092", geneSymbol: "CCND1", chromosome: "chr11", biotype: "protein_coding", baseMean: 4890.3, log2FoldChange: -2.10, lfcSE: 0.22, stat: -9.55, pvalue: 1.3e-21, padj: 4.2e-20, status: "down", meanGroupA: 2100.4, meanGroupB: 7680.2 },
  { geneId: "ENSG00000111640", geneSymbol: "GAPDH", chromosome: "chr12", biotype: "protein_coding", baseMean: 38400.0, log2FoldChange: 0.08, lfcSE: 0.12, stat: 0.67, pvalue: 0.503, padj: 0.684, status: "ns", meanGroupA: 39100.0, meanGroupB: 37700.0 },
  { geneId: "ENSG00000075624", geneSymbol: "ACTB", chromosome: "chr7", biotype: "protein_coding", baseMean: 42100.0, log2FoldChange: -0.05, lfcSE: 0.11, stat: -0.45, pvalue: 0.652, padj: 0.791, status: "ns", meanGroupA: 41600.0, meanGroupB: 42600.0 },
  { geneId: "ENSG00000135679", geneSymbol: "MDM2", chromosome: "chr12", biotype: "protein_coding", baseMean: 2190.5, log2FoldChange: 0.21, lfcSE: 0.15, stat: 1.40, pvalue: 0.161, padj: 0.284, status: "ns", meanGroupA: 2280.0, meanGroupB: 2100.0 },
  { geneId: "ENSG00000146648", geneSymbol: "EGFR", chromosome: "chr7", biotype: "protein_coding", baseMean: 3410.2, log2FoldChange: 3.12, lfcSE: 0.24, stat: 13.00, pvalue: 1.2e-38, padj: 5.6e-37, status: "up", meanGroupA: 5920.0, meanGroupB: 900.4 },
  { geneId: "ENSG00000171862", geneSymbol: "PTEN", chromosome: "chr10", biotype: "protein_coding", baseMean: 2840.0, log2FoldChange: -1.34, lfcSE: 0.16, stat: -8.38, pvalue: 5.2e-17, padj: 1.2e-15, status: "down", meanGroupA: 1710.0, meanGroupB: 3970.0 },
  { geneId: "ENSG00000120217", geneSymbol: "CD274", chromosome: "chr9", biotype: "protein_coding", baseMean: 1050.8, log2FoldChange: 2.64, lfcSE: 0.22, stat: 12.00, pvalue: 3.5e-33, padj: 1.4e-31, status: "up", meanGroupA: 1890.0, meanGroupB: 211.6 },
  { geneId: "ENSG00000188389", geneSymbol: "PDCD1LG2", chromosome: "chr9", biotype: "protein_coding", baseMean: 740.2, log2FoldChange: 2.15, lfcSE: 0.20, stat: 10.75, pvalue: 5.8e-27, padj: 2.1e-25, status: "up", meanGroupA: 1210.0, meanGroupB: 270.4 },
  { geneId: "ENSG00000137752", geneSymbol: "CASP3", chromosome: "chr4", biotype: "protein_coding", baseMean: 2140.0, log2FoldChange: 1.15, lfcSE: 0.18, stat: 6.39, pvalue: 1.6e-10, padj: 2.4e-9, status: "up", meanGroupA: 2680.0, meanGroupB: 1600.0 },
  { geneId: "ENSG00000115414", geneSymbol: "FN1", chromosome: "chr2", biotype: "protein_coding", baseMean: 8940.0, log2FoldChange: 2.95, lfcSE: 0.25, stat: 11.80, pvalue: 3.9e-32, padj: 1.4e-30, status: "up", meanGroupA: 15400.0, meanGroupB: 2480.0 },
  { geneId: "ENSG00000026025", geneSymbol: "VIM", chromosome: "chr10", biotype: "protein_coding", baseMean: 12400.0, log2FoldChange: 3.48, lfcSE: 0.27, stat: 12.89, pvalue: 5.1e-38, padj: 2.2e-36, status: "up", meanGroupA: 22800.0, meanGroupB: 2000.0 },
  { geneId: "ENSG00000039068", geneSymbol: "CDH1", chromosome: "chr16", biotype: "protein_coding", baseMean: 9240.0, log2FoldChange: -3.85, lfcSE: 0.28, stat: -13.75, pvalue: 5.2e-43, padj: 4.1e-40, status: "down", meanGroupA: 1120.0, meanGroupB: 17360.0 }
];

const TCGA_BRCA_PCA: PcaPoint[] = [
  { sampleId: "TCGA-A2-0099", sampleName: "BRCA_001_Basal", group: "Basal-like (TNBC)", batch: "Batch_1 (UNC)", pc1: -34.2, pc2: 12.4, pc3: -4.1, umap1: -6.8, umap2: 3.2 },
  { sampleId: "TCGA-A2-0294", sampleName: "BRCA_002_Basal", group: "Basal-like (TNBC)", batch: "Batch_1 (UNC)", pc1: -31.8, pc2: 8.9, pc3: -2.8, umap1: -6.2, umap2: 2.9 },
  { sampleId: "TCGA-AO-A0J6", sampleName: "BRCA_003_Basal", group: "Basal-like (TNBC)", batch: "Batch_2 (BCM)", pc1: -38.5, pc2: 15.1, pc3: 1.4, umap1: -7.4, umap2: 4.1 },
  { sampleId: "TCGA-AO-A0JJ", sampleName: "BRCA_004_Basal", group: "Basal-like (TNBC)", batch: "Batch_2 (BCM)", pc1: -29.4, pc2: 11.2, pc3: 0.8, umap1: -5.9, umap2: 2.7 },
  { sampleId: "TCGA-BH-A0BQ", sampleName: "BRCA_005_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1 (UNC)", pc1: 32.1, pc2: -14.6, pc3: 3.5, umap1: 6.4, umap2: -3.8 },
  { sampleId: "TCGA-BH-A0BV", sampleName: "BRCA_006_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_1 (UNC)", pc1: 36.4, pc2: -18.2, pc3: -1.2, umap1: 7.1, umap2: -4.5 },
  { sampleId: "TCGA-BH-A0BW", sampleName: "BRCA_007_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2 (BCM)", pc1: 28.7, pc2: -11.9, pc3: -4.8, umap1: 5.8, umap2: -3.1 },
  { sampleId: "TCGA-BH-A0BZ", sampleName: "BRCA_008_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_2 (BCM)", pc1: 34.0, pc2: -16.0, pc3: 2.1, umap1: 6.8, umap2: -4.0 },
  { sampleId: "TCGA-E2-A15A", sampleName: "BRCA_009_Basal", group: "Basal-like (TNBC)", batch: "Batch_3 (WashU)", pc1: -36.1, pc2: 13.8, pc3: -3.2, umap1: -7.0, umap2: 3.6 },
  { sampleId: "TCGA-E2-A15C", sampleName: "BRCA_010_Basal", group: "Basal-like (TNBC)", batch: "Batch_3 (WashU)", pc1: -33.4, pc2: 9.7, pc3: 1.9, umap1: -6.5, umap2: 3.0 },
  { sampleId: "TCGA-E2-A15E", sampleName: "BRCA_011_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3 (WashU)", pc1: 30.5, pc2: -13.1, pc3: 0.4, umap1: 6.1, umap2: -3.4 },
  { sampleId: "TCGA-E2-A15I", sampleName: "BRCA_012_LumA", group: "Luminal A (ER+/HER2-)", batch: "Batch_3 (WashU)", pc1: 37.9, pc2: -19.4, pc3: -2.6, umap1: 7.5, umap2: -4.8 },
];

const TCGA_BRCA_HEATMAP: HeatmapRow[] = [
  { geneSymbol: "MKI67", geneId: "ENSG00000148773", category: "Proliferation", values: { "TCGA-A2-0099": 2.1, "TCGA-A2-0294": 1.8, "TCGA-AO-A0J6": 2.4, "TCGA-AO-A0JJ": 1.9, "TCGA-E2-A15A": 2.2, "TCGA-E2-A15C": 1.7, "TCGA-BH-A0BQ": -1.9, "TCGA-BH-A0BV": -2.3, "TCGA-BH-A0BW": -1.6, "TCGA-BH-A0BZ": -2.1, "TCGA-E2-A15E": -1.8, "TCGA-E2-A15I": -2.4 } },
  { geneSymbol: "FOXM1", geneId: "ENSG00000164362", category: "Cell Cycle", values: { "TCGA-A2-0099": 2.3, "TCGA-A2-0294": 2.0, "TCGA-AO-A0J6": 2.5, "TCGA-AO-A0JJ": 1.8, "TCGA-E2-A15A": 2.1, "TCGA-E2-A15C": 1.9, "TCGA-BH-A0BQ": -2.0, "TCGA-BH-A0BV": -2.4, "TCGA-BH-A0BW": -1.7, "TCGA-BH-A0BZ": -2.2, "TCGA-E2-A15E": -1.9, "TCGA-E2-A15I": -2.5 } },
  { geneSymbol: "TP53", geneId: "ENSG00000141510", category: "DNA Damage", values: { "TCGA-A2-0099": 1.8, "TCGA-A2-0294": 1.5, "TCGA-AO-A0J6": 2.1, "TCGA-AO-A0JJ": 1.6, "TCGA-E2-A15A": 1.9, "TCGA-E2-A15C": 1.4, "TCGA-BH-A0BQ": -1.5, "TCGA-BH-A0BV": -1.8, "TCGA-BH-A0BW": -1.3, "TCGA-BH-A0BZ": -1.7, "TCGA-E2-A15E": -1.4, "TCGA-E2-A15I": -1.9 } },
  { geneSymbol: "EGFR", geneId: "ENSG00000146648", category: "Receptor Tyrosine Kinase", values: { "TCGA-A2-0099": 2.0, "TCGA-A2-0294": 1.7, "TCGA-AO-A0J6": 2.3, "TCGA-AO-A0JJ": 1.9, "TCGA-E2-A15A": 2.1, "TCGA-E2-A15C": 1.8, "TCGA-BH-A0BQ": -1.7, "TCGA-BH-A0BV": -2.1, "TCGA-BH-A0BW": -1.5, "TCGA-BH-A0BZ": -1.9, "TCGA-E2-A15E": -1.6, "TCGA-E2-A15I": -2.2 } },
  { geneSymbol: "VIM", geneId: "ENSG00000026025", category: "EMT / Mesenchymal", values: { "TCGA-A2-0099": 2.2, "TCGA-A2-0294": 1.9, "TCGA-AO-A0J6": 2.4, "TCGA-AO-A0JJ": 1.7, "TCGA-E2-A15A": 2.0, "TCGA-E2-A15C": 1.8, "TCGA-BH-A0BQ": -1.8, "TCGA-BH-A0BV": -2.2, "TCGA-BH-A0BW": -1.6, "TCGA-BH-A0BZ": -2.0, "TCGA-E2-A15E": -1.7, "TCGA-E2-A15I": -2.3 } },
  { geneSymbol: "CD274", geneId: "ENSG00000120217", category: "Immune Checkpoint", values: { "TCGA-A2-0099": 1.7, "TCGA-A2-0294": 1.4, "TCGA-AO-A0J6": 2.0, "TCGA-AO-A0JJ": 1.5, "TCGA-E2-A15A": 1.8, "TCGA-E2-A15C": 1.3, "TCGA-BH-A0BQ": -1.4, "TCGA-BH-A0BV": -1.7, "TCGA-BH-A0BW": -1.2, "TCGA-BH-A0BZ": -1.6, "TCGA-E2-A15E": -1.3, "TCGA-E2-A15I": -1.8 } },
  { geneSymbol: "ESR1", geneId: "ENSG00000091831", category: "Luminal / Hormone Receptor", values: { "TCGA-A2-0099": -2.4, "TCGA-A2-0294": -2.1, "TCGA-AO-A0J6": -2.6, "TCGA-AO-A0JJ": -2.0, "TCGA-E2-A15A": -2.3, "TCGA-E2-A15C": -1.9, "TCGA-BH-A0BQ": 2.1, "TCGA-BH-A0BV": 2.5, "TCGA-BH-A0BW": 1.8, "TCGA-BH-A0BZ": 2.3, "TCGA-E2-A15E": 2.0, "TCGA-E2-A15I": 2.6 } },
  { geneSymbol: "GATA3", geneId: "ENSG00000128422", category: "Luminal Transcription Factor", values: { "TCGA-A2-0099": -2.2, "TCGA-A2-0294": -1.9, "TCGA-AO-A0J6": -2.5, "TCGA-AO-A0JJ": -1.8, "TCGA-E2-A15A": -2.1, "TCGA-E2-A15C": -1.7, "TCGA-BH-A0BQ": 1.9, "TCGA-BH-A0BV": 2.3, "TCGA-BH-A0BW": 1.7, "TCGA-BH-A0BZ": 2.1, "TCGA-E2-A15E": 1.8, "TCGA-E2-A15I": 2.4 } },
  { geneSymbol: "BCL2", geneId: "ENSG00000171791", category: "Anti-Apoptotic Luminal", values: { "TCGA-A2-0099": -2.0, "TCGA-A2-0294": -1.7, "TCGA-AO-A0J6": -2.3, "TCGA-AO-A0JJ": -1.6, "TCGA-E2-A15A": -1.9, "TCGA-E2-A15C": -1.5, "TCGA-BH-A0BQ": 1.8, "TCGA-BH-A0BV": 2.2, "TCGA-BH-A0BW": 1.5, "TCGA-BH-A0BZ": 2.0, "TCGA-E2-A15E": 1.6, "TCGA-E2-A15I": 2.3 } },
  { geneSymbol: "CDH1", geneId: "ENSG00000039068", category: "Epithelial Adhesion", values: { "TCGA-A2-0099": -2.1, "TCGA-A2-0294": -1.8, "TCGA-AO-A0J6": -2.4, "TCGA-AO-A0JJ": -1.7, "TCGA-E2-A15A": -2.0, "TCGA-E2-A15C": -1.6, "TCGA-BH-A0BQ": 1.9, "TCGA-BH-A0BV": 2.3, "TCGA-BH-A0BW": 1.6, "TCGA-BH-A0BZ": 2.1, "TCGA-E2-A15E": 1.7, "TCGA-E2-A15I": 2.4 } }
];

const TCGA_BRCA_PATHWAYS: PathwayResult[] = [
  { pathwayId: "M5930", pathwayName: "HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION", database: "Hallmark", size: 198, nes: 2.64, pvalue: 1.0e-10, padj: 3.2e-9, leadingEdge: ["VIM", "FN1", "SNAI2", "TWIST1", "ZEB1", "MMP2", "CDH2"] },
  { pathwayId: "M5901", pathwayName: "HALLMARK_E2F_TARGETS", database: "Hallmark", size: 200, nes: 2.52, pvalue: 2.1e-9, padj: 4.8e-8, leadingEdge: ["MKI67", "FOXM1", "CCNE1", "CDK1", "E2F1", "CDC25A", "BRCA1"] },
  { pathwayId: "M5903", pathwayName: "HALLMARK_G2M_CHECKPOINT", database: "Hallmark", size: 194, nes: 2.41, pvalue: 5.4e-8, padj: 8.9e-7, leadingEdge: ["TOP2A", "CCNB1", "AURKA", "PLK1", "BIRC5", "CENPE", "TP53"] },
  { pathwayId: "M5921", pathwayName: "HALLMARK_MYC_TARGETS_V1", database: "Hallmark", size: 196, nes: 2.18, pvalue: 3.8e-6, padj: 4.5e-5, leadingEdge: ["MYC", "NPM1", "HSPD1", "MCM4", "SRSF1", "NOP56"] },
  { pathwayId: "M5906", pathwayName: "HALLMARK_ESTROGEN_RESPONSE_EARLY", database: "Hallmark", size: 197, nes: -2.85, pvalue: 1.0e-12, padj: 1.0e-10, leadingEdge: ["ESR1", "GATA3", "TFF1", "PGR", "GREB1", "XBP1", "BCL2"] },
  { pathwayId: "M5907", pathwayName: "HALLMARK_ESTROGEN_RESPONSE_LATE", database: "Hallmark", size: 195, nes: -2.61, pvalue: 1.8e-10, padj: 4.1e-9, leadingEdge: ["MYB", "FOXA1", "CA12", "STC2", "KRT19", "SLC39A6"] },
  { pathwayId: "R-HSA-69278", pathwayName: "REACTOME_CELL_CYCLE_CHECKPOINTS", database: "Reactome", size: 284, nes: 2.34, pvalue: 1.2e-7, padj: 1.8e-6, leadingEdge: ["ATM", "CHEK1", "CHEK2", "RAD51", "BRCA2", "RPA1"] },
  { pathwayId: "hsa04115", pathwayName: "KEGG_P53_SIGNALING_PATHWAY", database: "KEGG", size: 72, nes: 2.05, pvalue: 4.2e-5, padj: 3.1e-4, leadingEdge: ["TP53", "MDM2", "CDKN1A", "BAX", "PMAIP1", "BBC3"] }
];

const TCGA_BRCA_ISOFORMS: IsoformResult[] = [
  { transcriptId: "ENST00000269305", geneSymbol: "TP53", isoformName: "p53-alpha (Canonical)", refLength: 2580, usageBaseline: 42.1, usageContrast: 78.4, deltaPsi: 36.3, pvalue: 2.4e-18, padj: 8.9e-16, event: "Alternative 3' SS" },
  { transcriptId: "ENST00000445888", geneSymbol: "TP53", isoformName: "p53-beta (Truncated)", refLength: 1920, usageBaseline: 34.2, usageContrast: 12.8, deltaPsi: -21.4, pvalue: 6.1e-11, padj: 1.4e-9, event: "Alternative 3' SS" },
  { transcriptId: "ENST00000206249", geneSymbol: "ESR1", isoformName: "ER-alpha66 (Full)", refLength: 6450, usageBaseline: 84.5, usageContrast: 14.2, deltaPsi: -70.3, pvalue: 1.1e-32, padj: 4.5e-30, event: "Exon Skipping" },
  { transcriptId: "ENST00000440919", geneSymbol: "ESR1", isoformName: "ER-alpha36 (Dominant Neg)", refLength: 3280, usageBaseline: 15.5, usageContrast: 85.8, deltaPsi: 70.3, pvalue: 1.1e-32, padj: 4.5e-30, event: "Exon Skipping" },
  { transcriptId: "ENST00000371583", geneSymbol: "CD44", isoformName: "CD44v6 (Metastatic)", refLength: 4890, usageBaseline: 18.2, usageContrast: 68.9, deltaPsi: 50.7, pvalue: 3.2e-21, padj: 2.8e-19, event: "Exon Skipping" },
  { transcriptId: "ENST00000279259", geneSymbol: "CD44", isoformName: "CD44s (Standard)", refLength: 2210, usageBaseline: 81.8, usageContrast: 31.1, deltaPsi: -50.7, pvalue: 3.2e-21, padj: 2.8e-19, event: "Exon Skipping" }
];

const TCGA_BRCA_DECONV: DeconvolutionResult[] = [
  { sampleId: "TCGA-A2-0099", group: "Basal-like (TNBC)", cd8TCells: 0.18, cd4TCells: 0.12, bCells: 0.08, nkCells: 0.05, macrophagesM1: 0.14, macrophagesM2: 0.06, cafFibroblasts: 0.11, endothelial: 0.06, tumorCells: 0.20 },
  { sampleId: "TCGA-A2-0294", group: "Basal-like (TNBC)", cd8TCells: 0.16, cd4TCells: 0.11, bCells: 0.07, nkCells: 0.04, macrophagesM1: 0.15, macrophagesM2: 0.05, cafFibroblasts: 0.12, endothelial: 0.07, tumorCells: 0.23 },
  { sampleId: "TCGA-AO-A0J6", group: "Basal-like (TNBC)", cd8TCells: 0.22, cd4TCells: 0.14, bCells: 0.09, nkCells: 0.06, macrophagesM1: 0.18, macrophagesM2: 0.04, cafFibroblasts: 0.09, endothelial: 0.05, tumorCells: 0.13 },
  { sampleId: "TCGA-AO-A0JJ", group: "Basal-like (TNBC)", cd8TCells: 0.17, cd4TCells: 0.10, bCells: 0.06, nkCells: 0.04, macrophagesM1: 0.13, macrophagesM2: 0.07, cafFibroblasts: 0.14, endothelial: 0.06, tumorCells: 0.23 },
  { sampleId: "TCGA-BH-A0BQ", group: "Luminal A (ER+/HER2-)", cd8TCells: 0.04, cd4TCells: 0.08, bCells: 0.03, nkCells: 0.02, macrophagesM1: 0.04, macrophagesM2: 0.16, cafFibroblasts: 0.19, endothelial: 0.09, tumorCells: 0.35 },
  { sampleId: "TCGA-BH-A0BV", group: "Luminal A (ER+/HER2-)", cd8TCells: 0.03, cd4TCells: 0.07, bCells: 0.02, nkCells: 0.02, macrophagesM1: 0.03, macrophagesM2: 0.18, cafFibroblasts: 0.21, endothelial: 0.08, tumorCells: 0.36 },
  { sampleId: "TCGA-BH-A0BW", group: "Luminal A (ER+/HER2-)", cd8TCells: 0.05, cd4TCells: 0.09, bCells: 0.04, nkCells: 0.03, macrophagesM1: 0.05, macrophagesM2: 0.15, cafFibroblasts: 0.18, endothelial: 0.09, tumorCells: 0.32 },
  { sampleId: "TCGA-BH-A0BZ", group: "Luminal A (ER+/HER2-)", cd8TCells: 0.04, cd4TCells: 0.07, bCells: 0.03, nkCells: 0.02, macrophagesM1: 0.04, macrophagesM2: 0.17, cafFibroblasts: 0.20, endothelial: 0.08, tumorCells: 0.35 },
  { sampleId: "TCGA-E2-A15A", group: "Basal-like (TNBC)", cd8TCells: 0.19, cd4TCells: 0.13, bCells: 0.08, nkCells: 0.05, macrophagesM1: 0.16, macrophagesM2: 0.05, cafFibroblasts: 0.10, endothelial: 0.06, tumorCells: 0.18 },
  { sampleId: "TCGA-E2-A15C", group: "Basal-like (TNBC)", cd8TCells: 0.15, cd4TCells: 0.11, bCells: 0.06, nkCells: 0.04, macrophagesM1: 0.14, macrophagesM2: 0.06, cafFibroblasts: 0.13, endothelial: 0.07, tumorCells: 0.24 },
  { sampleId: "TCGA-E2-A15E", group: "Luminal A (ER+/HER2-)", cd8TCells: 0.04, cd4TCells: 0.08, bCells: 0.03, nkCells: 0.02, macrophagesM1: 0.04, macrophagesM2: 0.15, cafFibroblasts: 0.19, endothelial: 0.09, tumorCells: 0.36 },
  { sampleId: "TCGA-E2-A15I", group: "Luminal A (ER+/HER2-)", cd8TCells: 0.03, cd4TCells: 0.06, bCells: 0.02, nkCells: 0.01, macrophagesM1: 0.03, macrophagesM2: 0.19, cafFibroblasts: 0.22, endothelial: 0.08, tumorCells: 0.36 },
];

export const REFERENCE_DATASETS: Dataset[] = [
  {
    id: "ds-brca-tcga",
    name: "TCGA-BRCA Transcriptomics (N=12)",
    description: "Invasive Breast Carcinoma cohort comparing Triple-Negative / Basal-like vs Hormone Receptor-Positive Luminal A primary tumors.",
    organism: "Homo sapiens",
    referenceGenome: "GRCh38.p14 (GENCODE v44)",
    sampleCount: 12,
    geneCount: 20485,
    diseaseContext: "Invasive Breast Carcinoma (ICD-O-3 8500/3)",
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
    isoforms: TCGA_BRCA_ISOFORMS,
    deconvolution: TCGA_BRCA_DECONV
  },
  {
    id: "ds-ov-platinum",
    name: "HGSOC Carboplatin Response Cohort (N=10)",
    description: "High-Grade Serous Ovarian Carcinoma pre-treatment biopsies comparing Platinum-Resistant (PFI < 6 mo) vs Platinum-Sensitive (PFI > 12 mo).",
    organism: "Homo sapiens",
    referenceGenome: "GRCh38.p14 (GENCODE v44)",
    sampleCount: 10,
    geneCount: 19840,
    diseaseContext: "High-Grade Serous Ovarian Cancer (ICD-O-3 8441/3)",
    primaryContrast: {
      groupA: "Platinum-Resistant",
      groupB: "Platinum-Sensitive",
      label: "Platinum-Resistant vs. Platinum-Sensitive"
    },
    samples: [
      { sampleId: "OV-R-01", sampleName: "HGSOC_Res_01", group: "Platinum-Resistant", batch: "Run_A", tissue: "Ovary / Peritoneum", stage: "Stage IIIC", subType: "Mesenchymal", readCount: 68100000, alignmentRate: 97.2, rinScore: 8.7, qcPass: true },
      { sampleId: "OV-R-02", sampleName: "HGSOC_Res_02", group: "Platinum-Resistant", batch: "Run_A", tissue: "Ovary / Peritoneum", stage: "Stage IV", subType: "Mesenchymal", readCount: 61400000, alignmentRate: 96.5, rinScore: 8.3, qcPass: true },
      { sampleId: "OV-R-03", sampleName: "HGSOC_Res_03", group: "Platinum-Resistant", batch: "Run_B", tissue: "Ovary / Peritoneum", stage: "Stage IIIC", subType: "Proliferative", readCount: 74200000, alignmentRate: 98.1, rinScore: 9.0, qcPass: true },
      { sampleId: "OV-R-04", sampleName: "HGSOC_Res_04", group: "Platinum-Resistant", batch: "Run_B", tissue: "Ovary / Peritoneum", stage: "Stage IIIC", subType: "Mesenchymal", readCount: 59800000, alignmentRate: 95.9, rinScore: 8.5, qcPass: true },
      { sampleId: "OV-R-05", sampleName: "HGSOC_Res_05", group: "Platinum-Resistant", batch: "Run_B", tissue: "Ovary / Peritoneum", stage: "Stage IV", subType: "Mesenchymal", readCount: 65400000, alignmentRate: 96.8, rinScore: 8.8, qcPass: true },
      { sampleId: "OV-S-01", sampleName: "HGSOC_Sens_01", group: "Platinum-Sensitive", batch: "Run_A", tissue: "Ovary / Peritoneum", stage: "Stage IIIC", subType: "Differentiated", readCount: 62900000, alignmentRate: 97.9, rinScore: 9.2, qcPass: true },
      { sampleId: "OV-S-02", sampleName: "HGSOC_Sens_02", group: "Platinum-Sensitive", batch: "Run_A", tissue: "Ovary / Peritoneum", stage: "Stage IIIB", subType: "Immunoreactive", readCount: 58700000, alignmentRate: 98.3, rinScore: 9.4, qcPass: true },
      { sampleId: "OV-S-03", sampleName: "HGSOC_Sens_03", group: "Platinum-Sensitive", batch: "Run_A", tissue: "Ovary / Peritoneum", stage: "Stage IIIC", subType: "Immunoreactive", readCount: 71000000, alignmentRate: 97.5, rinScore: 8.9, qcPass: true },
      { sampleId: "OV-S-04", sampleName: "HGSOC_Sens_04", group: "Platinum-Sensitive", batch: "Run_B", tissue: "Ovary / Peritoneum", stage: "Stage IIIA", subType: "Differentiated", readCount: 67300000, alignmentRate: 98.0, rinScore: 9.1, qcPass: true },
      { sampleId: "OV-S-05", sampleName: "HGSOC_Sens_05", group: "Platinum-Sensitive", batch: "Run_B", tissue: "Ovary / Peritoneum", stage: "Stage IIIC", subType: "Immunoreactive", readCount: 64100000, alignmentRate: 97.7, rinScore: 9.0, qcPass: true }
    ],
    genes: [
      { geneId: "ENSG00000012048", geneSymbol: "BRCA1", chromosome: "chr17", biotype: "protein_coding", baseMean: 1420.0, log2FoldChange: 2.14, lfcSE: 0.22, stat: 9.72, pvalue: 2.4e-22, padj: 1.2e-20, status: "up", meanGroupA: 2400.0, meanGroupB: 440.0 },
      { geneId: "ENSG00000105173", geneSymbol: "CCNE1", chromosome: "chr19", biotype: "protein_coding", baseMean: 3840.0, log2FoldChange: 3.42, lfcSE: 0.28, stat: 12.21, pvalue: 2.8e-34, padj: 3.1e-32, status: "up", meanGroupA: 6800.0, meanGroupB: 880.0 },
      { geneId: "ENSG00000139618", geneSymbol: "BRCA2", chromosome: "chr13", biotype: "protein_coding", baseMean: 980.0, log2FoldChange: -2.31, lfcSE: 0.24, stat: -9.62, pvalue: 6.8e-22, padj: 3.2e-20, status: "down", meanGroupA: 280.0, meanGroupB: 1680.0 },
      { geneId: "ENSG00000115414", geneSymbol: "FN1", chromosome: "chr2", biotype: "protein_coding", baseMean: 11400.0, log2FoldChange: 2.90, lfcSE: 0.26, stat: 11.15, pvalue: 7.2e-29, padj: 4.8e-27, status: "up", meanGroupA: 19800.0, meanGroupB: 3000.0 },
      { geneId: "ENSG00000141510", geneSymbol: "TP53", chromosome: "chr17", biotype: "protein_coding", baseMean: 2480.0, log2FoldChange: 0.12, lfcSE: 0.16, stat: 0.75, pvalue: 0.453, padj: 0.620, status: "ns", meanGroupA: 2540.0, meanGroupB: 2420.0 }
    ],
    pcaPoints: [
      { sampleId: "OV-R-01", sampleName: "HGSOC_Res_01", group: "Platinum-Resistant", batch: "Run_A", pc1: -28.4, pc2: 9.1, pc3: 1.2, umap1: -5.4, umap2: 2.1 },
      { sampleId: "OV-R-02", sampleName: "HGSOC_Res_02", group: "Platinum-Resistant", batch: "Run_A", pc1: -31.2, pc2: 12.4, pc3: -0.8, umap1: -5.8, umap2: 2.7 },
      { sampleId: "OV-R-03", sampleName: "HGSOC_Res_03", group: "Platinum-Resistant", batch: "Run_B", pc1: -25.8, pc2: 8.0, pc3: -2.1, umap1: -4.9, umap2: 1.8 },
      { sampleId: "OV-R-04", sampleName: "HGSOC_Res_04", group: "Platinum-Resistant", batch: "Run_B", pc1: -33.1, pc2: 14.2, pc3: 2.4, umap1: -6.2, umap2: 3.1 },
      { sampleId: "OV-R-05", sampleName: "HGSOC_Res_05", group: "Platinum-Resistant", batch: "Run_B", pc1: -29.7, pc2: 10.8, pc3: -1.5, umap1: -5.6, umap2: 2.4 },
      { sampleId: "OV-S-01", sampleName: "HGSOC_Sens_01", group: "Platinum-Sensitive", batch: "Run_A", pc1: 29.5, pc2: -11.4, pc3: 1.8, umap1: 5.8, umap2: -2.8 },
      { sampleId: "OV-S-02", sampleName: "HGSOC_Sens_02", group: "Platinum-Sensitive", batch: "Run_A", pc1: 34.1, pc2: -15.8, pc3: -2.4, umap1: 6.4, umap2: -3.5 },
      { sampleId: "OV-S-03", sampleName: "HGSOC_Sens_03", group: "Platinum-Sensitive", batch: "Run_A", pc1: 27.2, pc2: -9.8, pc3: 3.1, umap1: 5.2, umap2: -2.2 },
      { sampleId: "OV-S-04", sampleName: "HGSOC_Sens_04", group: "Platinum-Sensitive", batch: "Run_B", pc1: 31.8, pc2: -13.6, pc3: -0.9, umap1: 6.0, umap2: -3.1 },
      { sampleId: "OV-S-05", sampleName: "HGSOC_Sens_05", group: "Platinum-Sensitive", batch: "Run_B", pc1: 26.9, pc2: -8.9, pc3: -1.8, umap1: 5.1, umap2: -2.0 }
    ],
    heatmapData: [
      { geneSymbol: "CCNE1", geneId: "ENSG00000105173", category: "Amplification", values: { "OV-R-01": 2.1, "OV-R-02": 2.4, "OV-R-03": 1.9, "OV-R-04": 2.5, "OV-R-05": 2.2, "OV-S-01": -1.8, "OV-S-02": -2.3, "OV-S-03": -1.7, "OV-S-04": -2.1, "OV-S-05": -1.9 } },
      { geneSymbol: "FN1", geneId: "ENSG00000115414", category: "Mesenchymal", values: { "OV-R-01": 2.0, "OV-R-02": 2.2, "OV-R-03": 1.8, "OV-R-04": 2.3, "OV-R-05": 2.1, "OV-S-01": -1.7, "OV-S-02": -2.1, "OV-S-03": -1.6, "OV-S-04": -2.0, "OV-S-05": -1.8 } },
      { geneSymbol: "BRCA2", geneId: "ENSG00000139618", category: "HRD / Repair", values: { "OV-R-01": -1.9, "OV-R-02": -2.2, "OV-R-03": -1.7, "OV-R-04": -2.3, "OV-R-05": -2.0, "OV-S-01": 1.8, "OV-S-02": 2.2, "OV-S-03": 1.6, "OV-S-04": 2.0, "OV-S-05": 1.9 } }
    ],
    pathways: [
      { pathwayId: "M5930", pathwayName: "HALLMARK_EPITHELIAL_MESENCHYMAL_TRANSITION", database: "Hallmark", size: 198, nes: 2.58, pvalue: 2.0e-9, padj: 1.1e-7, leadingEdge: ["FN1", "VIM", "MMP2", "CDH2"] },
      { pathwayId: "R-HSA-73886", pathwayName: "REACTOME_CHROMOSOME_MAINTENANCE", database: "Reactome", size: 142, nes: 2.29, pvalue: 4.8e-7, padj: 2.4e-5, leadingEdge: ["CCNE1", "CDK2", "MCM2"] }
    ],
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

  // Search & gene selection
  selectedGene: GeneResult | null;
  setSelectedGene: (gene: GeneResult | null) => void;
  geneSearchQuery: string;
  setGeneSearchQuery: (query: string) => void;

  // Status panel drawer / collapse
  isStatusPanelOpen: boolean;
  setIsStatusPanelOpen: (open: boolean) => void;
  toggleStatusPanel: () => void;

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

  const [padjThreshold, setPadjThreshold] = useState<number>(0.05);
  const [lfcThreshold, setLfcThreshold] = useState<number>(1.0);
  const [normalizationMethod, setNormalizationMethod] = useState<string>("DESeq2 Median of Ratios");
  const [designFormula, setDesignFormula] = useState<string>("~ batch + condition");
  const [batchCovariate, setBatchCovariate] = useState<string>("Batch (Sequencing Center)");
  const [multiTestingCorrection, setMultiTestingCorrection] = useState<string>("Benjamini-Hochberg (FDR)");

  const [selectedGene, setSelectedGene] = useState<GeneResult | null>(null);
  const [geneSearchQuery, setGeneSearchQuery] = useState<string>("");
  const [isStatusPanelOpen, setIsStatusPanelOpen] = useState<boolean>(true);

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

  const upregulatedCount = useMemo(() => computedGenes.filter((g) => g.status === "up").length, [computedGenes]);
  const downregulatedCount = useMemo(() => computedGenes.filter((g) => g.status === "down").length, [computedGenes]);
  const nonsignificantCount = useMemo(() => computedGenes.filter((g) => g.status === "ns").length, [computedGenes]);
  const totalGenesCount = activeDataset.geneCount;

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
        selectedGene,
        setSelectedGene,
        geneSearchQuery,
        setGeneSearchQuery,
        isStatusPanelOpen,
        setIsStatusPanelOpen,
        toggleStatusPanel,
        filteredGenes,
        upregulatedCount,
        downregulatedCount,
        nonsignificantCount,
        totalGenesCount
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
