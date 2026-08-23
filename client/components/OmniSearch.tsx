import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const SEARCH_DATABASE: SearchItem[] = [
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

  // Genes & Transcripts
  {
    id: "gene-brca1",
    title: "BRCA1 (BRCA1 DNA Repair Associated)",
    subtitle: "Chr 17q21.31 • ENSG00000012048 • Key homologous recombination repair regulator • log2FC: -2.84, FDR: 1.2e-18",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -2.84",
    path: "/workspace?gene=BRCA1",
    tags: ["gene", "brca1", "dna repair", "parp", "breast", "ovarian", "ensg00000012048"]
  },
  {
    id: "gene-tp53",
    title: "TP53 (Tumor Protein P53)",
    subtitle: "Chr 17p13.1 • ENSG00000141510 • Master tumor suppressor and guardian of the genome • log2FC: -1.95, FDR: 4.8e-15",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: -1.95",
    path: "/workspace?gene=TP53",
    tags: ["gene", "tp53", "p53", "tumor suppressor", "apoptosis", "cell cycle", "ensg00000141510"]
  },
  {
    id: "gene-erbb2",
    title: "ERBB2 / HER2 (erb-b2 Receptor Tyrosine Kinase 2)",
    subtitle: "Chr 17q12 • ENSG00000141736 • Amplified oncogene in HER2+ malignancies • log2FC: +3.62, FDR: 8.9e-24",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +3.62",
    path: "/workspace?gene=ERBB2",
    tags: ["gene", "erbb2", "her2", "neu", "tyrosine kinase", "trastuzumab", "ensg00000141736"]
  },
  {
    id: "gene-esr1",
    title: "ESR1 (Estrogen Receptor 1)",
    subtitle: "Chr 6q25.1-q25.2 • ENSG00000091831 • Key nuclear receptor defining Luminal breast cancer • log2FC: +4.15, FDR: 2.1e-31",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +4.15",
    path: "/workspace?gene=ESR1",
    tags: ["gene", "esr1", "er", "estrogen receptor", "luminal", "tamoxifen", "ensg00000091831"]
  },
  {
    id: "gene-mki67",
    title: "MKI67 / Ki-67 (Marker of Proliferation Ki-67)",
    subtitle: "Chr 10q26.2 • ENSG00000148773 • Cellular proliferation marker • log2FC: +3.12, FDR: 6.4e-22",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +3.12",
    path: "/workspace?gene=MKI67",
    tags: ["gene", "mki67", "ki67", "proliferation", "cell division", "ensg00000148773"]
  },
  {
    id: "gene-egfr",
    title: "EGFR (Epidermal Growth Factor Receptor)",
    subtitle: "Chr 7p11.2 • ENSG00000146648 • Receptor tyrosine kinase driver in NSCLC and glioblastoma • log2FC: +2.48, FDR: 3.2e-14",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.48",
    path: "/workspace?gene=EGFR",
    tags: ["gene", "egfr", "her1", "erbb1", "osimertinib", "gefitinib", "nsclc", "ensg00000146648"]
  },
  {
    id: "gene-pdcd1",
    title: "PDCD1 / PD-1 (Programmed Cell Death 1)",
    subtitle: "Chr 2q37.3 • ENSG00000188389 • Immune checkpoint receptor targeting exhausted T cells • log2FC: +2.77, FDR: 9.1e-12",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.77",
    path: "/workspace?gene=PDCD1",
    tags: ["gene", "pdcd1", "pd1", "checkpoint", "immunotherapy", "pembrolizumab", "ensg00000188389"]
  },
  {
    id: "gene-cd274",
    title: "CD274 / PD-L1 (Programmed Death-Ligand 1)",
    subtitle: "Chr 9p24.1 • ENSG00000120217 • Immune checkpoint ligand driving T-cell evasion • log2FC: +2.18, FDR: 1.4e-11",
    category: "genes",
    categoryLabel: "Genes",
    badge: "log2FC: +2.18",
    path: "/workspace?gene=CD274",
    tags: ["gene", "cd274", "pdl1", "pd-l1", "checkpoint", "atezolizumab", "ensg00000120217"]
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
  { id: "patients", label: "Patients", icon: User, badgeColor: "bg-primary/10 text-primary border-primary/30" },
  { id: "analyses", label: "Analyses", icon: Activity, badgeColor: "bg-accent/15 text-accent border-accent/30" },
  { id: "functions", label: "Functions & Tools", icon: Compass, badgeColor: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30" },
  { id: "genes", label: "Genes & Transcripts", icon: Dna, badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  { id: "pathways", label: "Pathways", icon: Sparkles, badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  { id: "cohorts", label: "Cohorts & Datasets", icon: Database, badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30" },
];

export const OmniSearch: React.FC = () => {
  const navigate = useNavigate();
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

  // Filter items
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCH_DATABASE.filter((item) => {
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
  }, [query, activeCategory]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults, activeCategory]);

  const handleSelectItem = (item: SearchItem) => {
    setIsOpen(false);
    setQuery("");
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
              className="h-8 px-2.5 flex items-center gap-1.5 border-r border-border bg-card/60 hover:bg-muted text-xs font-medium text-foreground rounded-l-md transition-colors shrink-0"
              title="Filter search category"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-primary" />
              <span className="hidden xl:inline text-[11px] font-sans truncate max-w-[85px]">
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
                ? "Search patients, analyses, functions, genes, pathways..."
                : `Search in ${currentCategoryConfig.label}...`
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full h-8 pl-3 pr-16 text-xs bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
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
        <div className="absolute top-9 left-0 right-0 bg-card border border-border rounded-lg shadow-elevated z-50 overflow-hidden font-sans animate-in fade-in-50 duration-100 max-h-[460px] flex flex-col">
          {/* Category Filter Pills in Dropdown Header */}
          <div className="p-2 border-b border-border bg-surface flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase px-1 shrink-0">Filter:</span>
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
          <div className="overflow-y-auto max-h-[340px] p-1 divide-y divide-border/40">
            {filteredResults.length === 0 ? (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs font-medium text-foreground">No matching results found</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Try searching for a patient ID (e.g. 89421), gene (BRCA1, TP53), pathway (EMT, Cell Cycle), or analysis (DESeq2, Volcano).
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
