import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRnaSeq } from "@/context/RnaSeqContext";
import {
  Search,
  User,
  Activity,
  Sliders,
  Dna,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  FileCode,
  Shield,
  Eye,
  Database,
  Building,
  ArrowRight,
  Check,
  Tag,
  Clock,
  Compass
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export type SearchCategory =
  | "all"
  | "patients"
  | "analyses"
  | "functions"
  | "genes"
  | "pathways"
  | "cohorts";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "patients" | "analyses" | "functions" | "genes" | "pathways" | "cohorts";
  categoryLabel: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary";
  path: string;
  external?: boolean;
  tags: string[];
}

const STATIC_SEARCH_DATABASE: SearchItem[] = [
  // Patients
  {
    id: "pat-89421",
    title: "Patient UC-CCC-89421",
    subtitle: "58 y/o Female • Stage IIIB Invasive Ductal Carcinoma (Triple-Negative / Basal-like) • BRCA1 185delAG, TP53 R248W",
    category: "patients",
    categoryLabel: "Patients",
    badge: "Active Patient 360",
    path: "/patient-360?id=UC-CCC-89421",
    tags: ["patient", "mrn", "tnbc", "brca1", "tp53", "stage iiib", "breast", "89421"]
  },
  {
    id: "pat-44102",
    title: "Patient UC-CCC-44102",
    subtitle: "64 y/o Male • Stage IVA Non-Small Cell Lung Adenocarcinoma • EGFR L858R, TP53 C135Y",
    category: "patients",
    categoryLabel: "Patients",
    badge: "Consented Cohort",
    path: "/patient-360?id=UC-CCC-44102",
    tags: ["patient", "nsclc", "lung", "egfr", "osimertinib", "stage iva", "44102"]
  },
  {
    id: "pat-77319",
    title: "Patient UC-CCC-77319",
    subtitle: "51 y/o Female • Stage IIIC High-Grade Serous Ovarian Carcinoma • BRCA2 6174delT, homologous recombination deficient",
    category: "patients",
    categoryLabel: "Patients",
    badge: "PARP Candidate",
    path: "/patient-360?id=UC-CCC-77319",
    tags: ["patient", "ovarian", "brca2", "olaparib", "hrd", "stage iiic", "77319"]
  },
  {
    id: "pat-19024",
    title: "Patient UC-CCC-19024",
    subtitle: "68 y/o Male • Stage III Colorectal Adenocarcinoma (MSI-High / dMMR) • BRAF V600E, MLH1 hypermethylation",
    category: "patients",
    categoryLabel: "Patients",
    badge: "Immuno-Responder",
    path: "/patient-360?id=UC-CCC-19024",
    tags: ["patient", "colorectal", "crc", "msi-h", "braf", "pembrolizumab", "19024"]
  },
  {
    id: "pat-62810",
    title: "Patient UC-CCC-62810",
    subtitle: "45 y/o Female • Stage IIA ER+/HER2+ Breast Cancer • ERBB2 amplification (IHC 3+), PIK3CA E545K",
    category: "patients",
    categoryLabel: "Patients",
    badge: "Trastuzumab Regimen",
    path: "/patient-360?id=UC-CCC-62810",
    tags: ["patient", "her2", "erbb2", "breast", "trastuzumab", "pik3ca", "62810"]
  },

  // Analyses
  {
    id: "ana-deseq2",
    title: "DESeq2 Negative Binomial GLM Modeling",
    subtitle: "Wald testing & Likelihood Ratio Testing (LRT) with parametric dispersion fitting across user-selected contrasts",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Wald / LRT",
    path: "/workspace",
    tags: ["analysis", "deseq2", "glm", "differential expression", "wald", "lrt", "dispersion", "negative binomial"]
  },
  {
    id: "ana-volcano",
    title: "Interactive Volcano Plot Visualizer",
    subtitle: "Log2 fold-change vs. -Log10 Benjamini-Hochberg FDR significance with customizable significance thresholds",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Visualization",
    path: "/visualization/volcano",
    tags: ["analysis", "volcano", "plot", "log2fc", "p-value", "fdr", "significance", "scatter"]
  },
  {
    id: "ana-heatmap",
    title: "Hierarchical Clustered Heatmap Matrix",
    subtitle: "Euclidean / Pearson distance clustering of top differentially expressed genes with sample annotation tracks",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Clustering",
    path: "/visualization/heatmap",
    tags: ["analysis", "heatmap", "clustering", "hierarchical", "expression matrix", "z-score"]
  },
  {
    id: "ana-pca",
    title: "Dimensionality Reduction: PCA & UMAP",
    subtitle: "Principal component analysis (PC1 vs PC2) and 2D UMAP non-linear manifold projection of variance-stabilized counts",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Decomposition",
    path: "/visualization/pca",
    tags: ["analysis", "pca", "umap", "variance", "dimensionality reduction", "clusters", "qc"]
  },
  {
    id: "ana-gsea",
    title: "Gene Set Enrichment Analysis (GSEA)",
    subtitle: "Pre-ranked Kolmogorov-Smirnov test against MSigDB Hallmark, KEGG, and Reactome biological pathways",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "GSEA / MSigDB",
    path: "/pathways/gsea",
    tags: ["analysis", "gsea", "enrichment", "hallmark", "msigdb", "nes", "kolmogorov-smirnov"]
  },
  {
    id: "ana-norm",
    title: "Normalization & Variance Stabilization (VST)",
    subtitle: "DESeq2 Median of Ratios, TMM, TPM, and VST transformation for count depth and composition normalization",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Normalization",
    path: "/expression/normalization",
    tags: ["analysis", "normalization", "vst", "median of ratios", "tmm", "tpm", "size factors"]
  },
  {
    id: "ana-splicing",
    title: "Alternative Splicing & Transcript Isoforms",
    subtitle: "Exon-junction read modeling, percent spliced-in (PSI) delta calculation, and isoform switching analysis",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Isoforms",
    path: "/advanced/splicing",
    tags: ["analysis", "splicing", "isoform", "psi", "exon skipping", "junction", "dexseq"]
  },
  {
    id: "ana-deconv",
    title: "Tumor Microenvironment Cell Deconvolution",
    subtitle: "CIBERSORTx and signature-matrix based digital estimation of infiltrating immune subsets and tumor purity",
    category: "analyses",
    categoryLabel: "Analyses",
    badge: "Deconvolution",
    path: "/advanced/deconvolution",
    tags: ["analysis", "deconvolution", "cibersort", "immune", "cd8 t cell", "macrophages", "tumor purity"]
  },

  // Functions & Modules
  {
    id: "func-patient360",
    title: "Patient 360 Orbit View",
    subtitle: "Unified longitudinal clinical EHR timeline, OMOP CDM measurements, multiomics variants, and imaging studies",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Clinical Hub",
    path: "/patient-360",
    tags: ["function", "patient 360", "orbit", "clinical", "ehr", "timeline", "omop", "smart on fhir"]
  },
  {
    id: "func-cohort-builder",
    title: "Visual Cohort Builder",
    subtitle: "Multi-parameter cohort builder with live differential privacy budget, Kaplan-Meier curves, and mCODE export",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Cohort Studio",
    path: "/cohort-builder",
    tags: ["function", "cohort builder", "feasibility", "privacy", "mcode", "ga4gh", "kaplan meier"]
  },
  {
    id: "func-trial-matching",
    title: "Clinical Trial Matching Engine",
    subtitle: "Automated biomarker-driven protocol matching with ClinicalTrials.gov and IRB pre-screen dispatch",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Precision Trials",
    path: "/trial-matching",
    tags: ["function", "trial matching", "clinicaltrials.gov", "biomarkers", "irb", "precision oncology"]
  },
  {
    id: "func-consent",
    title: "Dynamic Consent Console & OPA Ledger",
    subtitle: "Patient-mediated data sharing granular controls with Open Policy Agent real-time policy enforcement and WORM audit receipts",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Governance",
    path: "/consent-console",
    tags: ["function", "consent", "dynamic consent", "opa", "open policy agent", "worm", "hipaa", "privacy"]
  },
  {
    id: "func-imaging",
    title: "OHIF DICOM Radiology & Pathology WSI Hub",
    subtitle: "Zero-footprint web viewer with PET/CT multi-planar reconstruction, radiomics feature extraction, and digital pathology WSI",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Imaging & WSI",
    path: "/imaging-hub",
    tags: ["function", "imaging", "dicom", "ohif", "radiomics", "wsi", "pathology", "pet/ct"]
  },
  {
    id: "func-omics-view",
    title: "UC-MOP / PhoenixMO Multiomics Workspace",
    subtitle: "Integrated somatic variants, OncoPrint matrix, pathway enrichment, BioCompute IEEE 2791 provenance, and risk scoring",
    category: "functions",
    categoryLabel: "Functions",
    badge: "UC-MOP",
    path: "/omics-view",
    tags: ["function", "omics", "uc-mop", "phoenixmo", "oncoprint", "biocompute", "somatic variants"]
  },
  {
    id: "func-integrations",
    title: "Global Enterprise Integrations Hub",
    subtitle: "Federated links to Epic Cosmos, Epic Genomics, Epic MyChart, ClinVar, cBioPortal, and live NCI GDC External Cohorts",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Integrations",
    path: "/global-integrations",
    tags: ["function", "epic", "cosmos", "mychart", "gdc", "cbioportal", "clinvar", "beacon"]
  },
  {
    id: "func-upload",
    title: "Data Upload & Ingestion Pipeline Studio",
    subtitle: "Configurable entry point: Raw FASTQ (start from scratch), Read Counts (DESeq2 GLM), or Processed Final Files",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Ingestion",
    path: "/data/upload",
    tags: ["function", "upload", "fastq", "counts", "ingestion", "pipeline", "experimental design"]
  },
  {
    id: "func-census",
    title: "Admin Census & Governance Audit",
    subtitle: "Institutional data repository breakdown across Raw Identified, OMOP Curated, and Safe Harbor De-identified zones",
    category: "functions",
    categoryLabel: "Functions",
    badge: "Admin",
    path: "/admin-census",
    tags: ["function", "admin", "census", "audit", "governance", "security", "data zones"]
  },

  // Curated Cancer Gene Catalog
  {
    id: "gene-brca1",
    title: "BRCA1 (BRCA1 DNA Repair Associated)",
    subtitle: "Chr 17q21.31 • ENSG00000012048 • Key homologous recombination repair regulator • log2FC: -2.31, FDR: 1.8e-31",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -2.31",
    path: "/workspace?gene=BRCA1",
    tags: ["gene", "brca1", "dna repair", "parp", "breast", "ovarian", "ensg00000012048", "hrd"]
  },
  {
    id: "gene-brca2",
    title: "BRCA2 (BRCA2 DNA Repair Associated)",
    subtitle: "Chr 13q13.1 • ENSG00000139618 • Homologous recombination repair factor • log2FC: -1.75, FDR: 3.9e-16",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -1.75",
    path: "/workspace?gene=BRCA2",
    tags: ["gene", "brca2", "dna repair", "parp", "breast", "ovarian", "ensg00000139618", "fanconi"]
  },
  {
    id: "gene-tp53",
    title: "TP53 / p53 (Tumor Protein P53)",
    subtitle: "Chr 17p13.1 • ENSG00000141510 • Guardian of the genome & tumor suppressor • log2FC: +2.84, FDR: 8.9e-54",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.84",
    path: "/workspace?gene=TP53",
    tags: ["gene", "tp53", "p53", "tumor suppressor", "apoptosis", "cell cycle", "ensg00000141510"]
  },
  {
    id: "gene-erbb2",
    title: "ERBB2 / HER2 (erb-b2 Receptor Tyrosine Kinase 2)",
    subtitle: "Chr 17q12 • ENSG00000141736 • Amplified oncogene in HER2+ breast/gastric cancer • log2FC: +0.42, FDR: 0.245",
    category: "genes",
    categoryLabel: "Genes",
    badge: "HER2 / Neu",
    path: "/workspace?gene=ERBB2",
    tags: ["gene", "erbb2", "her2", "neu", "tyrosine kinase", "trastuzumab", "ensg00000141736", "her2+"]
  },
  {
    id: "gene-esr1",
    title: "ESR1 / ER (Estrogen Receptor 1)",
    subtitle: "Chr 6q25.1 • ENSG00000091831 • Hallmark nuclear receptor defining Luminal A/B breast cancer • log2FC: -4.95, FDR: 3.1e-83",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -4.95",
    path: "/workspace?gene=ESR1",
    tags: ["gene", "esr1", "er", "estrogen receptor", "luminal", "tamoxifen", "fulvestrant", "ensg00000091831"]
  },
  {
    id: "gene-pik3ca",
    title: "PIK3CA (Phosphatidylinositol-4,5-Bisphosphate 3-Kinase Catalytic Subunit Alpha)",
    subtitle: "Chr 3q26.32 • ENSG00000121879 • PI3K/AKT oncogenic signaling driver • log2FC: +1.95, FDR: 3.2e-18",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +1.95",
    path: "/workspace?gene=PIK3CA",
    tags: ["gene", "pik3ca", "pi3k", "alpelisib", "akt", "oncogene", "ensg00000121879"]
  },
  {
    id: "gene-mki67",
    title: "MKI67 / Ki-67 (Marker of Proliferation Ki-67)",
    subtitle: "Chr 10q26.2 • ENSG00000148773 • Cellular proliferation index marker • log2FC: +3.82, FDR: 4.8e-64",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +3.82",
    path: "/workspace?gene=MKI67",
    tags: ["gene", "mki67", "ki67", "ki-67", "proliferation", "mitosis", "ensg00000148773"]
  },
  {
    id: "gene-egfr",
    title: "EGFR / HER1 (Epidermal Growth Factor Receptor)",
    subtitle: "Chr 7p11.2 • ENSG00000146648 • Receptor tyrosine kinase driver in NSCLC & glioblastoma • log2FC: +2.65, FDR: 6.4e-31",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.65",
    path: "/workspace?gene=EGFR",
    tags: ["gene", "egfr", "her1", "erbb1", "osimertinib", "gefitinib", "nsclc", "ensg00000146648"]
  },
  {
    id: "gene-kras",
    title: "KRAS (KRAS Proto-Oncogene, GTPase)",
    subtitle: "Chr 12p12.1 • ENSG00000133703 • GTPase driver in colorectal, pancreatic & lung cancers • log2FC: +1.45, FDR: 4.5e-12",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +1.45",
    path: "/workspace?gene=KRAS",
    tags: ["gene", "kras", "ras", "sotorasib", "g12c", "g12d", "pancreatic", "colorectal", "ensg00000133703"]
  },
  {
    id: "gene-braf",
    title: "BRAF (B-Raf Proto-Oncogene, Serine/Threonine Kinase)",
    subtitle: "Chr 7q34 • ENSG00000157764 • MAPK/ERK driver in melanoma, CRC & thyroid carcinoma • log2FC: +1.15, FDR: 2.8e-8",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +1.15",
    path: "/workspace?gene=BRAF",
    tags: ["gene", "braf", "v600e", "dabrafenib", "vemurafenib", "mapk", "ensg00000157764"]
  },
  {
    id: "gene-myc",
    title: "MYC / c-Myc (MYC Proto-Oncogene, BHLH Transcription Factor)",
    subtitle: "Chr 8q24.21 • ENSG00000136997 • Master oncogenic transcription factor • log2FC: +3.12, FDR: 2.9e-39",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +3.12",
    path: "/workspace?gene=MYC",
    tags: ["gene", "myc", "c-myc", "transcription factor", "amplification", "ensg00000136997"]
  },
  {
    id: "gene-pten",
    title: "PTEN (Phosphatase and Tensin Homolog)",
    subtitle: "Chr 10q23.31 • ENSG00000171862 • Tumor suppressor negatively regulating PI3K/AKT • log2FC: -2.18, FDR: 8.2e-23",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -2.18",
    path: "/workspace?gene=PTEN",
    tags: ["gene", "pten", "tumor suppressor", "pi3k", "loss", "ensg00000171862"]
  },
  {
    id: "gene-cdk4",
    title: "CDK4 (Cyclin Dependent Kinase 4)",
    subtitle: "Chr 12q14.1 • ENSG00000135446 • G1/S cell cycle transition kinase • log2FC: +2.42, FDR: 3.2e-31",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.42",
    path: "/workspace?gene=CDK4",
    tags: ["gene", "cdk4", "cell cycle", "palbociclib", "ribociclib", "abemaciclib", "ensg00000135446"]
  },
  {
    id: "gene-cdk6",
    title: "CDK6 (Cyclin Dependent Kinase 6)",
    subtitle: "Chr 7q21.2 • ENSG00000105810 • G1/S cell cycle kinase • log2FC: +2.15, FDR: 3.6e-20",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.15",
    path: "/workspace?gene=CDK6",
    tags: ["gene", "cdk6", "cell cycle", "cdk4/6", "ensg00000105810"]
  },
  {
    id: "gene-ccnd1",
    title: "CCND1 / Cyclin D1 (Cyclin D1)",
    subtitle: "Chr 11q13.3 • ENSG00000110092 • Regulator of CDK4/6 kinases • log2FC: -2.85, FDR: 1.6e-25",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -2.85",
    path: "/workspace?gene=CCND1",
    tags: ["gene", "ccnd1", "cyclin d1", "cell cycle", "ensg00000110092"]
  },
  {
    id: "gene-parp1",
    title: "PARP1 (Poly(ADP-Ribose) Polymerase 1)",
    subtitle: "Chr 1q42.12 • ENSG00000143799 • Base excision repair enzyme, synthetic lethality with BRCA1/2 • log2FC: +2.78, FDR: 2.4e-37",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.78",
    path: "/workspace?gene=PARP1",
    tags: ["gene", "parp1", "parp", "olaparib", "talazoparib", "synthetic lethality", "ensg00000143799"]
  },
  {
    id: "gene-pdcd1",
    title: "PDCD1 / PD-1 (Programmed Cell Death 1)",
    subtitle: "Chr 2q37.3 • ENSG00000188389 • Key immune checkpoint on exhausted T cells • log2FC: +2.77, FDR: 6.4e-31",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.77",
    path: "/workspace?gene=PDCD1",
    tags: ["gene", "pdcd1", "pd1", "pd-1", "checkpoint", "immunotherapy", "pembrolizumab", "nivolumab", "ensg00000188389"]
  },
  {
    id: "gene-cd274",
    title: "CD274 / PD-L1 (Programmed Death-Ligand 1)",
    subtitle: "Chr 9p24.1 • ENSG00000120217 • Immune evasion checkpoint ligand • log2FC: +3.15, FDR: 1.1e-36",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +3.15",
    path: "/workspace?gene=CD274",
    tags: ["gene", "cd274", "pdl1", "pd-l1", "checkpoint", "atezolizumab", "durvalumab", "ensg00000120217"]
  },
  {
    id: "gene-ctla4",
    title: "CTLA4 / CD152 (Cytotoxic T-Lymphocyte Associated Protein 4)",
    subtitle: "Chr 2q33.2 • ENSG00000163599 • Immune checkpoint downregulating T cell activation • log2FC: +2.48, FDR: 4.9e-27",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.48",
    path: "/workspace?gene=CTLA4",
    tags: ["gene", "ctla4", "ipilimumab", "checkpoint", "immunotherapy", "t cell", "ensg00000163599"]
  },
  {
    id: "gene-gata3",
    title: "GATA3 (GATA Binding Protein 3)",
    subtitle: "Chr 10p14 • ENSG00000107485 • Luminal breast lineage master transcription factor • log2FC: -4.62, FDR: 2.4e-62",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -4.62",
    path: "/workspace?gene=GATA3",
    tags: ["gene", "gata3", "luminal", "breast", "transcription factor", "ensg00000107485"]
  },
  {
    id: "gene-foxa1",
    title: "FOXA1 (Forkhead Box A1)",
    subtitle: "Chr 14q21.1 • ENSG00000129514 • Pioneer factor for nuclear hormone receptors • log2FC: -4.18, FDR: 7.2e-55",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -4.18",
    path: "/workspace?gene=FOXA1",
    tags: ["gene", "foxa1", "pioneer factor", "estrogen receptor", "luminal", "ensg00000129514"]
  },
  {
    id: "gene-vim",
    title: "VIM / Vimentin (Vimentin)",
    subtitle: "Chr 10p13 • ENSG00000026025 • Mesenchymal marker & EMT driver • log2FC: +3.95, FDR: 1.5e-57",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +3.95",
    path: "/workspace?gene=VIM",
    tags: ["gene", "vim", "vimentin", "emt", "mesenchymal", "metastasis", "ensg00000026025"]
  },
  {
    id: "gene-cdh1",
    title: "CDH1 / E-Cadherin (Cadherin 1)",
    subtitle: "Chr 16q22.1 • ENSG00000039068 • Epithelial cell-cell adhesion molecule • log2FC: -3.72, FDR: 1.8e-47",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -3.72",
    path: "/workspace?gene=CDH1",
    tags: ["gene", "cdh1", "e-cadherin", "epithelial", "lobular", "adhesion", "ensg00000039068"]
  },
  {
    id: "gene-vegfa",
    title: "VEGFA (Vascular Endothelial Growth Factor A)",
    subtitle: "Chr 6p21.1 • ENSG00000112715 • Angiogenesis and vascular permeability mediator • log2FC: +2.92, FDR: 2.8e-34",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.92",
    path: "/workspace?gene=VEGFA",
    tags: ["gene", "vegfa", "vegf", "bevacizumab", "angiogenesis", "hypoxia", "ensg00000112715"]
  },
  {
    id: "gene-hif1a",
    title: "HIF1A (Hypoxia Inducible Factor 1 Subunit Alpha)",
    subtitle: "Chr 14q23.2 • ENSG00000100644 • Master cellular oxygen sensing transcription factor • log2FC: +2.25, FDR: 2.4e-24",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.25",
    path: "/workspace?gene=HIF1A",
    tags: ["gene", "hif1a", "hif-1a", "hypoxia", "metabolic rewiring", "ensg00000100644"]
  },
  {
    id: "gene-cd8a",
    title: "CD8A (CD8a Molecule)",
    subtitle: "Chr 2p11.2 • ENSG00000153563 • Cytotoxic T-lymphocyte coreceptor • log2FC: +2.85, FDR: 1.1e-32",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.85",
    path: "/workspace?gene=CD8A",
    tags: ["gene", "cd8a", "cd8", "cytotoxic t cell", "tumor infiltrating lymphocytes", "til", "ensg00000153563"]
  },

  // Pathways
  {
    id: "path-emt",
    title: "Hallmark: Epithelial-Mesenchymal Transition (EMT)",
    subtitle: "MSigDB Hallmark • 200 genes • Normalized Enrichment Score (NES): +2.42, FDR: 0.0001 • Mediates metastasis",
    category: "pathways",
    categoryLabel: "Pathways",
    badge: "NES: +2.42",
    path: "/pathways/gsea",
    tags: ["pathway", "emt", "epithelial", "mesenchymal", "metastasis", "vimentin", "snai1", "msigdb"]
  },
  {
    id: "path-e2f",
    title: "Hallmark: E2F Targets & Cell Cycle Progression",
    subtitle: "MSigDB Hallmark • 200 genes • Normalized Enrichment Score (NES): +2.18, FDR: 0.0004 • G1/S transition",
    category: "pathways",
    categoryLabel: "Pathways",
    badge: "NES: +2.18",
    path: "/pathways/gsea",
    tags: ["pathway", "e2f", "cell cycle", "g1/s", "cdk4", "cdk6", "retinoblastoma", "msigdb"]
  },
  {
    id: "path-g2m",
    title: "Hallmark: G2M DNA Damage Checkpoint",
    subtitle: "MSigDB Hallmark • 200 genes • Normalized Enrichment Score (NES): +1.98, FDR: 0.0012 • Mitotic entry control",
    category: "pathways",
    categoryLabel: "Pathways",
    badge: "NES: +1.98",
    path: "/pathways/gsea",
    tags: ["pathway", "g2m", "mitosis", "checkpoint", "aurkb", "ccnb1", "cdk1", "msigdb"]
  },
  {
    id: "path-estrogen",
    title: "Hallmark: Estrogen Response Early",
    subtitle: "MSigDB Hallmark • 200 genes • Normalized Enrichment Score (NES): -2.85, FDR: 0.0001 • Downregulated in TNBC",
    category: "pathways",
    categoryLabel: "Pathways",
    badge: "NES: -2.85",
    path: "/pathways/gsea",
    tags: ["pathway", "estrogen", "esr1", "gata3", "foxa1", "hormone receptor", "msigdb"]
  },
  {
    id: "path-pi3k",
    title: "Hallmark: PI3K / AKT / mTOR Signaling",
    subtitle: "MSigDB Hallmark • 105 genes • Normalized Enrichment Score (NES): +1.76, FDR: 0.0045 • Survival and metabolic rewiring",
    category: "pathways",
    categoryLabel: "Pathways",
    badge: "NES: +1.76",
    path: "/pathways/gsea",
    tags: ["pathway", "pi3k", "akt", "mtor", "pten", "pik3ca", "survival", "msigdb"]
  },
  {
    id: "path-dna-repair",
    title: "Reactome: Homologous Recombination Repair",
    subtitle: "Reactome Pathway • 112 genes • Normalized Enrichment Score (NES): -2.14, FDR: 0.0008 • Synthetic lethality target",
    category: "pathways",
    categoryLabel: "Pathways",
    badge: "Reactome",
    path: "/pathways/gsea",
    tags: ["pathway", "homologous recombination", "dna repair", "rad51", "brca1", "brca2", "reactome"]
  },

  // Cohorts & Datasets
  {
    id: "coh-tcga-brca",
    title: "TCGA-BRCA Breast Invasive Carcinoma",
    subtitle: "Reference cohort • N=1,098 primary tumor specimens with paired RNA-seq, WES, and PAM50 subtype classifications",
    category: "cohorts",
    categoryLabel: "Cohorts",
    badge: "N = 1,098",
    path: "/workspace",
    tags: ["cohort", "tcga", "brca", "breast", "pam50", "basal", "luminal", "her2"]
  },
  {
    id: "coh-ccle",
    title: "CCLE Pan-Cancer Cell Line Encyclopedia",
    subtitle: "Reference cohort • N=1,019 pharmacogenomically profiled tumor cell lines with high-depth transcriptomics",
    category: "cohorts",
    categoryLabel: "Cohorts",
    badge: "N = 1,019",
    path: "/workspace",
    tags: ["cohort", "ccle", "cell lines", "pharmacogenomics", "drug response"]
  },
  {
    id: "coh-io",
    title: "Immuno-Oncology Anti-PD1 Clinical Trial Cohort",
    subtitle: "Reference cohort • N=184 pre- and on-treatment metastatic biopsies with RECIST response outcomes",
    category: "cohorts",
    categoryLabel: "Cohorts",
    badge: "N = 184",
    path: "/workspace",
    tags: ["cohort", "immunotherapy", "anti-pd1", "pembrolizumab", "nivolumab", "responders"]
  },
  {
    id: "coh-gdc-breast",
    title: "NCI GDC External Cohort: Breast Primary Site",
    subtitle: "External NCI GDC node • 3,412 cases harmonized under GRCh38 with STAR-Counts workflows",
    category: "cohorts",
    categoryLabel: "Cohorts",
    badge: "NCI GDC Live",
    path: "/global-integrations",
    tags: ["cohort", "gdc", "nci", "external", "beacon", "breast", "cases"]
  }
];

const CATEGORY_CONFIG: {
  id: SearchCategory;
  label: string;
  icon: React.ElementType;
  badgeColor: string;
}[] = [
  { id: "all", label: "All Categories", icon: Search, badgeColor: "bg-muted text-foreground" },
  { id: "genes", label: "Gene Symbol", icon: Dna, badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  { id: "patients", label: "Patients", icon: User, badgeColor: "bg-primary/10 text-primary border-primary/30" },
  { id: "analyses", label: "Analyses", icon: Activity, badgeColor: "bg-accent/15 text-accent border-accent/30" },
  { id: "functions", label: "Functions & Tools", icon: Compass, badgeColor: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30" },
  { id: "pathways", label: "Pathways", icon: Sparkles, badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  { id: "cohorts", label: "Cohorts & Datasets", icon: Database, badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30" },
];

export const OmniSearch: React.FC = () => {
  const navigate = useNavigate();
  const { activeDataset, setSelectedGene, setGeneSearchQuery } = useRnaSeq();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl+K, Cmd+K, or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "/" && document.activeElement !== inputRef.current && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items with dynamic gene dataset integration
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // Build active dataset gene items
    const datasetGeneItems: SearchItem[] = (activeDataset?.genes || []).map((gene) => ({
      id: gene.geneId,
      title: `${gene.geneSymbol} (${gene.geneId})`,
      subtitle: `${gene.chromosome} • ${gene.biotype} • BaseMean: ${gene.baseMean.toFixed(1)} • log2FC: ${gene.log2FoldChange > 0 ? "+" : ""}${gene.log2FoldChange.toFixed(2)} • FDR: ${gene.padj < 0.001 ? gene.padj.toExponential(2) : gene.padj.toFixed(4)}`,
      category: "genes",
      categoryLabel: "Gene Symbol",
      badge: `log2FC: ${gene.log2FoldChange > 0 ? "+" : ""}${gene.log2FoldChange.toFixed(2)}`,
      path: `/workspace?gene=${encodeURIComponent(gene.geneSymbol)}`,
      tags: ["gene", gene.geneSymbol.toLowerCase(), gene.geneId.toLowerCase(), gene.chromosome.toLowerCase(), gene.status]
    }));

    // Merge static database with dataset genes (deduping by geneId / title)
    const existingIds = new Set(datasetGeneItems.map(g => g.id));
    const mergedDb = [
      ...datasetGeneItems,
      ...STATIC_SEARCH_DATABASE.filter(item => !existingIds.has(item.id))
    ];

    const results = mergedDb.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (!q) return true; // Show top results when no query

      // Text match against title, subtitle, tags, category
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    });

    // If querying genes and no exact item matched, provide dynamic deep query item
    if (q && (activeCategory === "genes" || activeCategory === "all") && !results.some(r => r.title.toLowerCase().startsWith(q))) {
      results.unshift({
        id: `query-gene-${q}`,
        title: `Search Gene Symbol "${query.toUpperCase()}"`,
        subtitle: `Query DESeq2 GLM results, Volcano plot coordinates, and boxplots for ${query.toUpperCase()}`,
        category: "genes",
        categoryLabel: "Gene Symbol",
        badge: "Deep Query",
        path: `/workspace?gene=${encodeURIComponent(query.trim().toUpperCase())}`,
        tags: ["gene", q]
      });
    }

    return results;
  }, [query, activeCategory, activeDataset]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults, activeCategory]);

  const handleSelectItem = (item: SearchItem) => {
    setIsOpen(false);
    setQuery("");

    // If selecting a gene, automatically link to active dataset gene model
    if (item.category === "genes" && activeDataset?.genes) {
      const cleanSymbol = item.title.split(" ")[0].replace(/[^a-zA-Z0-9_-]/g, "").toUpperCase();
      const geneObj = activeDataset.genes.find(
        (g) => g.geneSymbol.toUpperCase() === cleanSymbol || g.geneId.toUpperCase() === item.id.toUpperCase()
      );
      if (geneObj) {
        setSelectedGene(geneObj);
        setGeneSearchQuery(geneObj.geneSymbol);
        toast.success(`Selected gene: ${geneObj.geneSymbol} (${geneObj.geneId})`);
      } else {
        setGeneSearchQuery(cleanSymbol);
        toast.info(`Querying gene expression for ${cleanSymbol}`);
      }
    }

    if (item.external) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const currentCategoryConfig = CATEGORY_CONFIG.find((c) => c.id === activeCategory) || CATEGORY_CONFIG[0];
  const CurrentIcon = currentCategoryConfig.icon;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl hidden md:block">
      {/* Search Input Container */}
      <div className="relative flex items-center bg-surface border border-border rounded-md shadow-subtle hover:border-border/80 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        {/* Category Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-8 -mt-px px-2.5 flex items-center gap-1.5 border-r border-border bg-card/60 hover:bg-muted text-xs font-medium text-foreground rounded-l-md transition-colors shrink-0"
              title="Filter search category"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-primary" />
              <span className="hidden xl:inline text-[11px] font-sans truncate max-w-[90px]">
                {activeCategory === "all" ? "All" : currentCategoryConfig.label}
              </span>
              <span className="text-[10px] text-muted-foreground">▾</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 p-1 bg-card border-border shadow-elevated">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1 tracking-wider">
              Search Scope
            </div>
            {CATEGORY_CONFIG.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setIsOpen(true);
                    inputRef.current?.focus();
                  }}
                  className={`flex items-center justify-between text-xs px-2 py-1.5 cursor-pointer rounded ${
                    isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Input */}
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder={
              activeCategory === "all"
                ? "Search gene symbols (BRCA1, TP53, HER2), patients, analyses, pathways..."
                : `Search in ${currentCategoryConfig.label}...`
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full h-8 -mt-px pl-3 pr-16 text-xs bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-sans"
          />

          {/* Shortcut / Clear Badge */}
          <div className="absolute right-2 flex items-center gap-1">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-0.5 text-muted-foreground hover:text-foreground rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground bg-muted border border-border rounded">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Results Box */}
      {isOpen && (
        <div className="absolute top-9 left-0 right-0 bg-card border border-border rounded-lg shadow-elevated z-50 overflow-hidden font-sans animate-in fade-in-50 duration-100 max-h-[480px] flex flex-col">
          {/* Category Filter Pills in Dropdown Header */}
          <div className="p-2 border-b border-border bg-surface flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase px-1 shrink-0">Scope:</span>
            {CATEGORY_CONFIG.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    inputRef.current?.focus();
                  }}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div className="overflow-y-auto max-h-[360px] p-1 divide-y divide-border/40">
            {filteredResults.length === 0 ? (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs font-medium text-foreground">No matching results found</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Try searching for gene symbols like <strong>BRCA1, TP53, ERBB2, ESR1, EGFR, KRAS, CD274</strong> or patient IDs.
                </p>
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const catConf = CATEGORY_CONFIG.find((c) => c.id === item.category);
                const ItemIcon = catConf?.icon || Search;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2 rounded-md transition-colors flex items-start gap-3 group ${
                      isSelected ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        catConf?.badgeColor || "bg-surface border-border text-foreground"
                      }`}
                    >
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            [{item.categoryLabel}]
                          </span>
                        </div>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className="text-[9px] font-mono py-0 px-1.5 bg-card shrink-0 border-border"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary self-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="p-1.5 px-3 border-t border-border bg-surface flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <span>Navigate <kbd className="px-1 bg-card border rounded">↑</kbd><kbd className="px-1 bg-card border rounded">↓</kbd></span>
              <span>Select <kbd className="px-1 bg-card border rounded">↵</kbd></span>
              <span>Close <kbd className="px-1 bg-card border rounded">esc</kbd></span>
            </div>
            <span>{filteredResults.length} item{filteredResults.length === 1 ? "" : "s"} indexed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OmniSearch;
