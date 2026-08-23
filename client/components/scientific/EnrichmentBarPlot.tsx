import React, { useState } from "react";
import { useRnaSeq, PathwayResult } from "@/context/RnaSeqContext";
import { ScientificCard } from "./ScientificCard";
import { Network, ExternalLink, BarChart2 } from "lucide-react";
import { toast } from "sonner";

export const EnrichmentBarPlot: React.FC = () => {
  const { activeDataset, setSelectedGene } = useRnaSeq();
  const [selectedDb, setSelectedDb] = useState<string>("All");

  const pathways = activeDataset.pathways;
  const filtered = selectedDb === "All" ? pathways : pathways.filter((p) => p.database === selectedDb);

  const handleExportCsv = () => {
    const header = "PathwayID,PathwayName,Database,Size,NES,PValue,Padj,LeadingEdgeGenes\n";
    const rows = filtered
      .map(
        (p) =>
          `"${p.pathwayId}","${p.pathwayName}","${p.database}",${p.size},${p.nes},${p.pvalue},${p.padj},"${p.leadingEdge.join(";")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_gsea_enrichment_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("GSEA pathway enrichment table exported as CSV.");
  };

  return (
    <ScientificCard
      title="Gene Set Enrichment Analysis (GSEA Hallmarks & Signatures)"
      subtitle={`Ranked by Normalized Enrichment Score (NES) • ${activeDataset.primaryContrast.label}`}
      methodCaption="Fast Gene Set Enrichment Analysis (fgsea) using Wald statistic rank metric with 10,000 permutations."
      citation="Subramanian A et al. PNAS (2005) / fgsea Korotkevich et al. (2021)"
      onExportCsv={handleExportCsv}
      headerAction={
        <div className="flex items-center gap-1 bg-surface p-0.5 rounded border border-border">
          {["All", "Hallmark", "Reactome", "KEGG"].map((db) => (
            <button
              key={db}
              onClick={() => setSelectedDb(db)}
              className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors ${
                selectedDb === db
                  ? "bg-card text-foreground font-semibold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {db}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-col h-full space-y-3 text-xs font-sans">
        <div className="flex items-center justify-between text-muted-foreground text-[11px] pb-1 border-b border-border">
          <span>Pathway Name & Leading-Edge Biomarkers</span>
          <div className="flex items-center gap-4 font-mono">
            <span>Size</span>
            <span>NES Score</span>
            <span>FDR (q-val)</span>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
          {filtered.map((pathway) => {
            const isPos = pathway.nes > 0;
            const maxNes = 3.0;
            const widthPct = Math.min(100, (Math.abs(pathway.nes) / maxNes) * 100);

            return (
              <div
                key={pathway.pathwayId}
                className="p-2.5 rounded-md border border-border bg-card/60 hover:bg-muted/40 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-serif font-bold text-foreground text-xs leading-snug">
                      {pathway.pathwayName.replace(/_/g, " ")}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                      <span className="px-1 py-0.2 rounded bg-surface border border-border">
                        {pathway.database}
                      </span>
                      <span>ID: {pathway.pathwayId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs shrink-0">
                    <span className="text-muted-foreground tabular-nums w-8 text-right">
                      {pathway.size}
                    </span>
                    <span
                      className={`font-bold tabular-nums w-12 text-right ${
                        isPos ? "text-primary" : "text-accent"
                      }`}
                    >
                      {isPos ? `+${pathway.nes.toFixed(2)}` : pathway.nes.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground tabular-nums w-14 text-right">
                      {pathway.padj < 0.0001 ? pathway.padj.toExponential(2) : pathway.padj.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Horizontal Ranked Bar */}
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border flex">
                  {isPos ? (
                    <div
                      className="bg-primary h-full rounded-full transition-all ml-auto"
                      style={{ width: `${widthPct}%` }}
                    />
                  ) : (
                    <div
                      className="bg-accent h-full rounded-full transition-all mr-auto"
                      style={{ width: `${widthPct}%` }}
                    />
                  )}
                </div>

                {/* Leading Edge Genes tags */}
                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="text-muted-foreground font-medium">Leading Edge:</span>
                  {pathway.leadingEdge.map((gene) => (
                    <button
                      key={gene}
                      onClick={() => {
                        const match = activeDataset.genes.find((g) => g.geneSymbol === gene);
                        if (match) setSelectedGene(match);
                        toast.info(`Selected leading-edge gene ${gene}`);
                      }}
                      className="px-1.5 py-0.2 rounded bg-surface hover:bg-muted border border-border font-mono text-foreground font-semibold hover:text-primary transition-colors cursor-pointer"
                    >
                      {gene}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScientificCard>
  );
};
