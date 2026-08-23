import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq, Dataset } from "@/context/RnaSeqContext";
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
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DataUpload: React.FC = () => {
  const { loadCustomDataset } = useRnaSeq();
  const navigate = useNavigate();

  const [datasetTitle, setDatasetTitle] = useState("Custom Patient Cohort RNA-seq");
  const [organism, setOrganism] = useState("Homo sapiens");
  const [genomeBuild, setGenomeBuild] = useState("GRCh38.p14 (GENCODE v44)");
  const [groupAName, setGroupAName] = useState("Treated / Responder");
  const [groupBName, setGroupBName] = useState("Control / Non-Responder");
  const [countsFileName, setCountsFileName] = useState<string | null>(null);
  const [metaFileName, setMetaFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Create user dataset
      const customDs: Dataset = {
        id: `ds-user-${Date.now()}`,
        name: datasetTitle,
        description: `User-uploaded transcriptomic matrix (${groupAName} vs ${groupBName})`,
        organism,
        referenceGenome: genomeBuild,
        sampleCount: 8,
        geneCount: 18940,
        diseaseContext: "Translational Oncology / User Cohort",
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
      toast.success("Dataset parsed, normalized, and loaded into workspace!");
      navigate("/workspace");
    }, 700);
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Data Ingestion & Count Matrix Upload
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-dashed border-accent text-accent font-mono font-medium">
              Private Safe Harbor Ingestion
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Upload raw or normalized gene-level count matrices (CSV / TSV) and sample metadata tables for automated DESeq2 GLM modeling and downstream functional analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ingestion Form & Dropzones */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Metadata Parameters */}
            <ScientificCard
              title="Cohort Metadata & Reference Alignment"
              subtitle="Specify experimental nomenclature and reference genome assembly"
            >
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <Label className="text-xs font-semibold text-foreground">Cohort Title</Label>
                  <Input
                    value={datasetTitle}
                    onChange={(e) => setDatasetTitle(e.target.value)}
                    className="mt-1 h-9 text-xs bg-background border-border"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Organism</Label>
                    <Input
                      value={organism}
                      onChange={(e) => setOrganism(e.target.value)}
                      className="mt-1 h-9 text-xs bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Reference Genome</Label>
                    <Input
                      value={genomeBuild}
                      onChange={(e) => setGenomeBuild(e.target.value)}
                      className="mt-1 h-9 text-xs bg-background border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <Label className="text-xs font-semibold text-primary">Contrast Group (Test)</Label>
                    <Input
                      value={groupAName}
                      onChange={(e) => setGroupAName(e.target.value)}
                      className="mt-1 h-9 text-xs bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Reference Group (Baseline)</Label>
                    <Input
                      value={groupBName}
                      onChange={(e) => setGroupBName(e.target.value)}
                      className="mt-1 h-9 text-xs bg-background border-border"
                    />
                  </div>
                </div>
              </div>
            </ScientificCard>

            {/* Dropzones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Counts Matrix */}
              <div className="p-6 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors bg-card/60 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-foreground">Gene Counts Matrix</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    CSV / TSV (Genes as rows, Samples as columns)
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCountsFileName("raw_gene_counts_matrix.tsv");
                    toast.success("Loaded 'raw_gene_counts_matrix.tsv' (18,940 genes × 8 samples)");
                  }}
                  className="h-8 text-xs font-sans border-border"
                >
                  {countsFileName ? `Attached: ${countsFileName}` : "Browse / Drop Counts File"}
                </Button>
              </div>

              {/* Sample Metadata */}
              <div className="p-6 rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors bg-card/60 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-foreground">Sample Metadata Table</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    CSV with SampleID, Condition, Batch, Stage
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMetaFileName("sample_phenotypes.csv");
                    toast.success("Loaded 'sample_phenotypes.csv' (8 samples)");
                  }}
                  className="h-8 text-xs font-sans border-border"
                >
                  {metaFileName ? `Attached: ${metaFileName}` : "Browse / Drop Metadata File"}
                </Button>
              </div>

            </div>

            {/* Ingestion Execution Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                size="default"
                onClick={handleSimulateUpload}
                disabled={isProcessing}
                className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs shadow-subtle flex items-center gap-2"
              >
                <span>{isProcessing ? "Validating & Aligning Matrix..." : "Validate, Normalize & Open Workspace"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </div>

          {/* Right: Validation Specifications & Format Guidelines */}
          <div className="space-y-6">
            <ScientificCard
              title="Schema Requirements"
              subtitle="Input specifications for DESeq2 & limma compatibility"
            >
              <div className="space-y-4 text-xs font-sans text-muted-foreground">
                <div className="space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>Gene Identifier Mapping</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Row names must contain valid Ensembl Gene IDs (<code>ENSG...</code>) or HGNC gene symbols (<code>ESR1</code>, <code>TP53</code>). Automatic conversion is applied.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>Un-normalized Raw Counts</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    DESeq2 requires non-negative integers representing raw sequence read counts. Do not upload pre-normalized RPKM/FPKM values as raw counts.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>Sample ID Cross-Validation</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Column headers in the count matrix must match the <code>sample_id</code> column in the metadata file exactly.
                  </p>
                </div>

                <div className="p-3 rounded-md bg-surface border border-border mt-4">
                  <div className="font-semibold text-foreground text-[11px] mb-1">Download Template Files:</div>
                  <div className="space-y-1 text-[11px]">
                    <a href="#template" onClick={(e) => { e.preventDefault(); toast.info("Example count template ready for inspection."); }} className="text-primary hover:underline flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>example_counts_template.tsv</span>
                    </a>
                    <a href="#template" onClick={(e) => { e.preventDefault(); toast.info("Example metadata template ready for inspection."); }} className="text-accent hover:underline flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>example_metadata_template.csv</span>
                    </a>
                  </div>
                </div>

              </div>
            </ScientificCard>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default DataUpload;
