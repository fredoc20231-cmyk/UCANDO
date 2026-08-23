import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { DifferentialExpressionTable } from "@/components/scientific/DifferentialExpressionTable";
import { GeneExpressionBoxplot } from "@/components/scientific/GeneExpressionBoxplot";
import { Dna, Search } from "lucide-react";

export const GeneLevelResults: React.FC = () => {
  const { activeDataset, selectedGene } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Gene-Level Expression & Feature Inspector
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
              {activeDataset.geneCount.toLocaleString()} Quantified Features
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Search, filter, and inspect single-gene expression dynamics, log2 fold-changes, and Wald statistical metrics across experimental cohorts.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DifferentialExpressionTable />
          </div>
          <div>
            <GeneExpressionBoxplot />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default GeneLevelResults;
