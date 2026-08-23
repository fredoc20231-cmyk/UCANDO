import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { EnrichmentBarPlot } from "@/components/scientific/EnrichmentBarPlot";
import { Network, Activity, BarChart2 } from "lucide-react";

export const PathwaysGsea: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Gene Set Enrichment Analysis (GSEA) Studio
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-primary font-mono font-medium">
              MSigDB v2023.2.Hs
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Unbiased enrichment of canonical MSigDB Hallmarks, Reactome pathways, and KEGG metabolic routes ranked by Wald test statistic.
          </p>
        </div>

        <EnrichmentBarPlot />

      </div>
    </Layout>
  );
};

export default PathwaysGsea;
