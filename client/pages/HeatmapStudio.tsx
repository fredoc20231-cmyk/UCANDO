import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { HeatmapMatrix } from "@/components/scientific/HeatmapMatrix";
import { GeneExpressionBoxplot } from "@/components/scientific/GeneExpressionBoxplot";

export const HeatmapStudio: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Hierarchically Clustered Heatmap Studio
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-primary font-mono font-medium">
              Diverging Z-Scores
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Unsupervised agglomerative clustering with complete linkage and Euclidean distance metric across top discriminating transcript features.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <HeatmapMatrix />
          </div>
          <div>
            <GeneExpressionBoxplot />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default HeatmapStudio;
