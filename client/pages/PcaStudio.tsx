import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { PcaPlot } from "@/components/scientific/PcaPlot";
import { ScientificCard } from "@/components/scientific/ScientificCard";

export const PcaStudio: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Dimensionality Reduction Studio (PCA / UMAP)
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-accent font-mono font-medium">
              Manifold Projections
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Multidimensional transcriptomic trajectory and unsupervised cohort clustering across principal components and non-linear UMAP embeddings.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PcaPlot />
          </div>

          <ScientificCard
            title="Eigenvalue Scree & Variance Explained"
            subtitle="Top 10 Principal Components"
            methodCaption="Singular Value Decomposition (SVD) of variance-stabilized covariance matrix."
          >
            <div className="space-y-3 text-xs font-sans">
              {[
                { pc: "PC1", var: "48.6%", cum: "48.6%" },
                { pc: "PC2", var: "19.4%", cum: "68.0%" },
                { pc: "PC3", var: "8.2%", cum: "76.2%" },
                { pc: "PC4", var: "5.1%", cum: "81.3%" },
                { pc: "PC5", var: "3.8%", cum: "85.1%" },
              ].map((row) => (
                <div key={row.pc} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="font-bold text-foreground">{row.pc}</span>
                    <span className="text-muted-foreground">{row.var} var (cum: {row.cum})</span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-accent h-full rounded-full" style={{ width: row.var }} />
                  </div>
                </div>
              ))}
            </div>
          </ScientificCard>
        </div>

      </div>
    </Layout>
  );
};

export default PcaStudio;
