import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { GeneExpressionBoxplot } from "@/components/scientific/GeneExpressionBoxplot";
import { DifferentialExpressionTable } from "@/components/scientific/DifferentialExpressionTable";

export const DistributionsStudio: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Expression Distributions & Dispersion Studio
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
              Observed vs Modeled
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Per-group expression distributions, interquartile ranges, and biological dispersion estimates for candidate genes.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GeneExpressionBoxplot />
          <DifferentialExpressionTable />
        </div>

      </div>
    </Layout>
  );
};

export default DistributionsStudio;
