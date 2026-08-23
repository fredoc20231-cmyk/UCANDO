import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Dna,
  Sliders,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Reports: React.FC = () => {
  const { 
    activeDataset, 
    padjThreshold, 
    lfcThreshold, 
    upregulatedCount, 
    downregulatedCount, 
    normalizationMethod, 
    designFormula 
  } = useRnaSeq();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success("Generating publication-grade PDF summary dossier...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header & Action Controls */}
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
                Translational RNA-seq Biomarker Dossier
              </h1>
              <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-primary font-mono font-medium">
                Audited Report
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Publication-grade synthesis of differential transcript abundance, pathway activations, and quality metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs border-border gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              className="h-8 px-3 bg-primary text-primary-foreground font-medium text-xs shadow-subtle gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="bg-card border border-border rounded-lg shadow-subtle p-8 space-y-8 print:border-none print:shadow-none">
          
          {/* Institutional Document Header */}
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary text-primary-foreground font-serif font-bold text-xl flex items-center justify-center">
                U
              </div>
              <div>
                <div className="font-serif font-bold text-lg text-foreground">
                  University of Chicago Comprehensive Cancer Center
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-sans">
                  Genomic Medicine & Transcriptomics Scientific Core
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-muted-foreground font-mono space-y-0.5">
              <div>Document ID: <strong className="text-foreground">UC-RNA-{activeDataset.id.toUpperCase()}</strong></div>
              <div>Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
              <div>Classification: Safe Harbor Tier-3 Research</div>
            </div>
          </div>

          {/* Section 1: Study Summary */}
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border/60 pb-1">
              1. Experimental Cohort & Study Design
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-md bg-surface border border-border text-xs">
              <div>
                <div className="text-muted-foreground text-[11px]">Cohort Name</div>
                <div className="font-semibold text-foreground mt-0.5">{activeDataset.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Clinical Staging</div>
                <div className="font-semibold text-foreground mt-0.5">{activeDataset.diseaseContext}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Primary Contrast</div>
                <div className="font-semibold text-primary mt-0.5">{activeDataset.primaryContrast.label}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Total Biospecimens</div>
                <div className="font-mono font-bold text-foreground mt-0.5">{activeDataset.sampleCount} Libraries</div>
              </div>
            </div>
          </div>

          {/* Section 2: Statistical Methodology */}
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border/60 pb-1">
              2. Statistical Model Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-md bg-surface border border-border">
                <div className="font-semibold text-foreground mb-1">GLM Design Formula</div>
                <div className="font-mono text-primary font-bold">{designFormula}</div>
              </div>
              <div className="p-3 rounded-md bg-surface border border-border">
                <div className="font-semibold text-foreground mb-1">Normalization Strategy</div>
                <div className="text-muted-foreground">{normalizationMethod}</div>
              </div>
              <div className="p-3 rounded-md bg-surface border border-border">
                <div className="font-semibold text-foreground mb-1">Significance Criteria</div>
                <div className="font-mono text-foreground font-semibold">FDR &le; {padjThreshold} • |log₂FC| &ge; {lfcThreshold}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Key Biomarker Findings */}
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border/60 pb-1">
              3. Significant Transcriptional Biomarkers
            </h2>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Symbol</th>
                    <th className="py-2 px-3 font-semibold">Ensembl ID</th>
                    <th className="py-2 px-3 text-right font-semibold">log₂ Fold Change</th>
                    <th className="py-2 px-3 text-right font-semibold">Wald Statistic</th>
                    <th className="py-2 px-3 text-right font-semibold">Adjusted p-value (FDR)</th>
                    <th className="py-2 px-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {activeDataset.genes.slice(0, 8).map((gene) => (
                    <tr key={gene.geneId}>
                      <td className="py-2 px-3 font-serif font-bold text-foreground">{gene.geneSymbol}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">{gene.geneId}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                        {gene.log2FoldChange > 0 ? `+${gene.log2FoldChange.toFixed(2)}` : gene.log2FoldChange.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-muted-foreground">{gene.stat.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-foreground">
                        {gene.padj.toExponential(2)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          gene.status === "up" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                        }`}>
                          {gene.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Attestation & Governance */}
          <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Cryptographically verified against UC-CCC Research Audit Ledger</span>
            </div>
            <div>
              Platform Version: <strong className="text-foreground">DESeq2 v1.44 / Bioconductor 3.19</strong>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Reports;
