import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { VolcanoPlot } from "@/components/scientific/VolcanoPlot";
import { DifferentialExpressionTable } from "@/components/scientific/DifferentialExpressionTable";
import { GeneExpressionBoxplot } from "@/components/scientific/GeneExpressionBoxplot";
import { LineChart, Sliders, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DifferentialExpression: React.FC = () => {
  const { activeDataset, padjThreshold, lfcThreshold } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Differential Transcript Expression Studio
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-primary font-mono font-medium">
              DESeq2 Negative Binomial GLM
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Wald hypothesis testing, shrinkage of logarithmic fold changes (apeglm / ashr), and false discovery rate (FDR) control for {activeDataset.primaryContrast.label}.
          </p>
        </div>

        {/* Plots & Table */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <VolcanoPlot />
          <GeneExpressionBoxplot />
        </div>

        <DifferentialExpressionTable />

      </div>
    </Layout>
  );
};

export default DifferentialExpression;
