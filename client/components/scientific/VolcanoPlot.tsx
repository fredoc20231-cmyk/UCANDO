import React, { useState } from "react";
import { useRnaSeq, GeneResult } from "@/context/RnaSeqContext";
import { ScientificCard } from "./ScientificCard";
import { THEME_COLORS, CHART_PALETTES } from "@/lib/theme";
import { toast } from "sonner";
import { Target, Info, Search } from "lucide-react";

export const VolcanoPlot: React.FC = () => {
  const {
    activeDataset,
    padjThreshold,
    lfcThreshold,
    selectedGene,
    setSelectedGene,
    filteredGenes,
    upregulatedCount,
    downregulatedCount,
    nonsignificantCount
  } = useRnaSeq();

  const [hoveredGene, setHoveredGene] = useState<GeneResult | null>(null);

  // Plot bounds & coordinate transformations
  const genes = activeDataset.genes;
  const maxAbsLfc = Math.max(5.5, ...genes.map((g) => Math.abs(g.log2FoldChange)));
  const maxNegLogP = Math.max(
    50,
    ...genes.map((g) => -Math.log10(Math.max(g.padj, 1e-70)))
  );

  const width = 640;
  const height = 360;
  const margin = { top: 25, right: 30, bottom: 45, left: 55 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const scaleX = (lfc: number) => {
    return margin.left + ((lfc + maxAbsLfc) / (2 * maxAbsLfc)) * innerWidth;
  };

  const scaleY = (negLogP: number) => {
    return margin.top + innerHeight - (negLogP / maxNegLogP) * innerHeight;
  };

  const thresholdY = scaleY(-Math.log10(padjThreshold));
  const thresholdXPos = scaleX(lfcThreshold);
  const thresholdXNeg = scaleX(-lfcThreshold);

  const handleExportCsv = () => {
    const headers = "GeneSymbol,GeneID,log2FoldChange,lfcSE,stat,pvalue,padj,status\n";
    const rows = genes
      .map(
        (g) =>
          `"${g.geneSymbol}","${g.geneId}",${g.log2FoldChange},${g.lfcSE},${g.stat},${g.pvalue},${g.padj},"${g.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_volcano_differential_expression.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Volcano differential expression table exported as CSV.");
  };

  return (
    <ScientificCard
      title="Volcano Plot: Differential Expression"
      subtitle={`${activeDataset.primaryContrast.label} (FDR &le; ${padjThreshold}, |log₂FC| &ge; ${lfcThreshold})`}
      methodCaption="Empirical Bayes negative binomial generalized linear model (DESeq2 Wald test with Benjamini-Hochberg FDR correction)."
      citation="Love MI et al. Genome Biology (2014) 15:550"
      onExportCsv={handleExportCsv}
    >
      <div className="flex flex-col h-full">
        {/* Top interactive legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-border text-xs font-sans">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-semibold text-foreground">Upregulated ({upregulatedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="font-semibold text-foreground">Downregulated ({downregulatedCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8A29E]" />
              <span>Nonsignificant ({nonsignificantCount})</span>
            </div>
          </div>

          {selectedGene && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono">
              <Target className="w-3 h-3" />
              <span>Selected: {selectedGene.geneSymbol} (log₂FC: {selectedGene.log2FoldChange.toFixed(2)}, padj: {selectedGene.padj.toExponential(2)})</span>
            </div>
          )}
        </div>

        {/* SVG Volcano Canvas */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[360px] select-none"
          >
            {/* Grid Lines */}
            <line
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={margin.top + innerHeight}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <line
              x1={margin.left}
              y1={margin.top + innerHeight}
              x2={margin.left + innerWidth}
              y2={margin.top + innerHeight}
              stroke="var(--border)"
              strokeWidth="1"
            />

            {/* Zero Fold-Change vertical center line */}
            <line
              x1={scaleX(0)}
              y1={margin.top}
              x2={scaleX(0)}
              y2={margin.top + innerHeight}
              stroke="var(--border)"
              strokeDasharray="3 3"
              strokeWidth="1"
            />

            {/* Threshold Lines */}
            {/* Horizontal FDR threshold */}
            <line
              x1={margin.left}
              y1={thresholdY}
              x2={margin.left + innerWidth}
              y2={thresholdY}
              stroke="#B45309"
              strokeDasharray="4 4"
              strokeWidth="1.2"
            />
            {/* Vertical +log2FC threshold */}
            <line
              x1={thresholdXPos}
              y1={margin.top}
              x2={thresholdXPos}
              y2={margin.top + innerHeight}
              stroke="var(--border)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            {/* Vertical -log2FC threshold */}
            <line
              x1={thresholdXNeg}
              y1={margin.top}
              x2={thresholdXNeg}
              y2={margin.top + innerHeight}
              stroke="var(--border)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />

            {/* Axis Labels */}
            <text
              x={margin.left + innerWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-sans"
            >
              log₂ Fold Change (Effect Size)
            </text>
            <text
              transform={`rotate(-90)`}
              x={-(margin.top + innerHeight / 2)}
              y={16}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-sans"
            >
              -log₁₀(Adjusted P-Value)
            </text>

            {/* X-axis ticks */}
            {[-4, -2, 0, 2, 4].map((tick) => (
              <g key={tick} transform={`translate(${scaleX(tick)}, ${margin.top + innerHeight})`}>
                <line y2="4" stroke="var(--border)" strokeWidth="1" />
                <text y="16" textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
                  {tick > 0 ? `+${tick}` : tick}
                </text>
              </g>
            ))}

            {/* Gene Points */}
            {genes.map((gene) => {
              const negLogP = -Math.log10(Math.max(gene.padj, 1e-70));
              const cx = scaleX(gene.log2FoldChange);
              const cy = scaleY(negLogP);
              const isSelected = selectedGene?.geneId === gene.geneId;
              const isHovered = hoveredGene?.geneId === gene.geneId;

              let fillColor = "#A8A29E"; // NS
              if (gene.status === "up") fillColor = "var(--primary)"; // Maroon
              if (gene.status === "down") fillColor = "var(--accent)"; // Teal

              return (
                <g key={gene.geneId} className="cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : isHovered ? 5 : gene.status !== "ns" ? 4 : 2.5}
                    fill={fillColor}
                    fillOpacity={gene.status !== "ns" ? 0.88 : 0.45}
                    stroke={isSelected ? "#000" : isHovered ? "var(--foreground)" : "none"}
                    strokeWidth={isSelected ? 2 : 1}
                    onMouseEnter={() => setHoveredGene(gene)}
                    onMouseLeave={() => setHoveredGene(null)}
                    onClick={() => {
                      setSelectedGene(gene);
                      toast.info(`Inspecting gene: ${gene.geneSymbol} (${gene.geneId})`);
                    }}
                  />
                  {/* Gene label for high-impact or selected genes */}
                  {(isSelected || (gene.status !== "ns" && negLogP > 35)) && (
                    <text
                      x={cx + 6}
                      y={cy - 4}
                      className="text-[10px] font-serif font-bold fill-foreground select-none"
                    >
                      {gene.geneSymbol}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredGene && (
            <div className="absolute top-2 right-2 p-2.5 rounded-md bg-card border border-border shadow-elevated text-xs font-sans pointer-events-none z-10">
              <div className="font-serif font-bold text-foreground text-sm flex items-center gap-1.5">
                <span>{hoveredGene.geneSymbol}</span>
                <span className="text-[10px] font-mono text-muted-foreground font-normal">({hoveredGene.geneId})</span>
              </div>
              <div className="mt-1 space-y-0.5 text-[11px]">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">log₂FC:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {hoveredGene.log2FoldChange > 0 ? `+${hoveredGene.log2FoldChange.toFixed(2)}` : hoveredGene.log2FoldChange.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">FDR (padj):</span>
                  <span className="font-mono font-semibold text-foreground">{hoveredGene.padj.toExponential(2)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Base Mean:</span>
                  <span className="font-mono text-foreground">{hoveredGene.baseMean.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Chromosome:</span>
                  <span className="font-mono text-foreground">{hoveredGene.chromosome}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScientificCard>
  );
};
