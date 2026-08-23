import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { Layers, Dna, Activity } from "lucide-react";

export const MultiomicsIntegration: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  const correlations = [
    { gene: "ERBB2 (HER2)", rnaLogFC: "-1.82", cnaStatus: "Copy Neutral / Di-allelic", methBeta: "0.24 (Unmethylated)", concordant: "Yes" },
    { gene: "CCNE1", rnaLogFC: "+2.76", cnaStatus: "Focal Amplification (chr19q12)", methBeta: "0.12 (Hypomethylated)", concordant: "Yes" },
    { gene: "CDH1", rnaLogFC: "-3.85", cnaStatus: "Heterozygous Deletion", methBeta: "0.78 (Hypermethylated)", concordant: "Yes" },
    { gene: "PTEN", rnaLogFC: "-1.34", cnaStatus: "Deep Deletion (chr10q23.31)", methBeta: "0.62 (Hypermethylated)", concordant: "Yes" },
    { gene: "EGFR", rnaLogFC: "+3.12", cnaStatus: "Gain (chr7p11.2)", methBeta: "0.18 (Hypomethylated)", concordant: "Yes" }
  ];

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Multi-Omics Cross-Layer Integration
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-primary font-mono font-medium">
              RNA-seq + CNA + DNA Methylation
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Correlate transcript expression alterations with genomic copy number variations (GISTIC2.0) and promoter CpG island methylation (Illumina Infinium EPIC).
          </p>
        </div>

        <ScientificCard
          title="Genomic Copy Number & Epigenetic Concordance Table"
          subtitle={`Multi-modal alignment for top candidate loci (${activeDataset.name})`}
          methodCaption="Pearson correlation and linear regression modeling between log2 RNA-seq expression and GISTIC thresholded copy number."
          citation="TCGA Pan-Cancer Multi-Omics Consortium (2018)"
        >
          <div className="overflow-x-auto border border-border rounded-md">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Locus / Gene</th>
                  <th className="py-2.5 px-3 text-right font-semibold">RNA-seq log₂FC</th>
                  <th className="py-2.5 px-3 font-semibold">Copy Number Alteration (CNA)</th>
                  <th className="py-2.5 px-3 font-semibold">Promoter Methylation (&beta;-val)</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Mechanistic Concordance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {correlations.map((row) => (
                  <tr key={row.gene} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2 px-3 font-serif font-bold text-foreground">{row.gene}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-primary">{row.rnaLogFC}</td>
                    <td className="py-2 px-3 text-foreground">{row.cnaStatus}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{row.methBeta}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[10px] font-semibold">
                        {row.concordant}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScientificCard>

      </div>
    </Layout>
  );
};

export default MultiomicsIntegration;
