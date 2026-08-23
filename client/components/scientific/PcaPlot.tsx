import React, { useState } from "react";
import { useRnaSeq, PcaPoint } from "@/context/RnaSeqContext";
import { ScientificCard } from "./ScientificCard";
import { CHART_PALETTES } from "@/lib/theme";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const PcaPlot: React.FC = () => {
  const { activeDataset } = useRnaSeq();
  const [plotMode, setPlotMode] = useState<"pca" | "umap">("pca");
  const [hoveredPoint, setHoveredPoint] = useState<PcaPoint | null>(null);

  const points = activeDataset.pcaPoints;
  const groups = Array.from(new Set(points.map((p) => p.group)));
  const palette = CHART_PALETTES.categorical;

  const width = 580;
  const height = 340;
  const margin = { top: 25, right: 30, bottom: 45, left: 55 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Coordinate scales
  const xs = points.map((p) => (plotMode === "pca" ? p.pc1 : p.umap1));
  const ys = points.map((p) => (plotMode === "pca" ? p.pc2 : p.umap2));

  const minX = Math.min(...xs) - 8;
  const maxX = Math.max(...xs) + 8;
  const minY = Math.min(...ys) - 6;
  const maxY = Math.max(...ys) + 6;

  const scaleX = (val: number) => {
    return margin.left + ((val - minX) / (maxX - minX)) * innerWidth;
  };

  const scaleY = (val: number) => {
    return margin.top + innerHeight - ((val - minY) / (maxY - minY)) * innerHeight;
  };

  const handleExportCsv = () => {
    const headers = "SampleID,SampleName,Group,Batch,PC1,PC2,PC3,UMAP1,UMAP2\n";
    const rows = points
      .map(
        (p) =>
          `"${p.sampleId}","${p.sampleName}","${p.group}","${p.batch}",${p.pc1},${p.pc2},${p.pc3},${p.umap1},${p.umap2}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_${plotMode}_embeddings.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${plotMode.toUpperCase()} embedding matrix exported as CSV.`);
  };

  return (
    <ScientificCard
      title={plotMode === "pca" ? "Principal Component Analysis (PCA)" : "UMAP Manifold Projection"}
      subtitle={`Sample clustering by regularized log (rlog) transcriptomic profiles (N=${points.length})`}
      methodCaption={
        plotMode === "pca"
          ? "SVD decomposition on top 500 highest variance genes after variance-stabilizing transformation."
          : "Uniform Manifold Approximation and Projection (n_neighbors=15, min_dist=0.1, cosine metric)."
      }
      citation="McInnes L et al. JOSS (2018) / DESeq2 rlog"
      onExportCsv={handleExportCsv}
      headerAction={
        <div className="flex items-center gap-1 bg-surface p-0.5 rounded border border-border">
          <button
            onClick={() => setPlotMode("pca")}
            className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors ${
              plotMode === "pca"
                ? "bg-card text-foreground font-semibold shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            PCA (PC1 vs PC2)
          </button>
          <button
            onClick={() => setPlotMode("umap")}
            className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors ${
              plotMode === "umap"
                ? "bg-card text-foreground font-semibold shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            UMAP
          </button>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pb-2 border-b border-border text-xs font-sans">
          <div className="flex flex-wrap items-center gap-3">
            {groups.map((grp, idx) => {
              const color = palette[idx % palette.length];
              const count = points.filter((p) => p.group === grp).length;
              return (
                <div key={grp} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-foreground">
                    {grp} <span className="text-muted-foreground tabular-nums font-normal">({count})</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-muted-foreground font-mono">
            {plotMode === "pca" ? "PC1: 48.6% | PC2: 19.4% var" : "n_neighbors=15 • dist=0.1"}
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[320px] select-none">
            {/* Axes */}
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

            {/* Axis titles */}
            <text
              x={margin.left + innerWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-sans"
            >
              {plotMode === "pca" ? "Principal Component 1 (48.6% variance)" : "UMAP Dimension 1"}
            </text>
            <text
              transform="rotate(-90)"
              x={-(margin.top + innerHeight / 2)}
              y={16}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-sans"
            >
              {plotMode === "pca" ? "Principal Component 2 (19.4% variance)" : "UMAP Dimension 2"}
            </text>

            {/* Zero center grid */}
            {plotMode === "pca" && (
              <>
                <line
                  x1={scaleX(0)}
                  y1={margin.top}
                  x2={scaleX(0)}
                  y2={margin.top + innerHeight}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <line
                  x1={margin.left}
                  y1={scaleY(0)}
                  x2={margin.left + innerWidth}
                  y2={scaleY(0)}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              </>
            )}

            {/* Points */}
            {points.map((pt) => {
              const xVal = plotMode === "pca" ? pt.pc1 : pt.umap1;
              const yVal = plotMode === "pca" ? pt.pc2 : pt.umap2;
              const cx = scaleX(xVal);
              const cy = scaleY(yVal);
              const groupIndex = groups.indexOf(pt.group);
              const color = palette[groupIndex % palette.length];
              const isHovered = hoveredPoint?.sampleId === pt.sampleId;

              return (
                <g key={pt.sampleId} className="cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 5.5}
                    fill={color}
                    stroke={isHovered ? "var(--foreground)" : "oklch(1 0 0 / 0.8)"}
                    strokeWidth={isHovered ? 2 : 1.2}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => toast.info(`Sample ${pt.sampleName} selected (${pt.group})`)}
                  />
                  <text
                    x={cx + 7}
                    y={cy - 4}
                    className="text-[9px] font-mono fill-muted-foreground select-none"
                  >
                    {pt.sampleName.split("_")[0]}_{pt.sampleName.split("_")[1]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 right-2 p-2.5 rounded-md bg-card border border-border shadow-elevated text-xs font-sans pointer-events-none z-10">
              <div className="font-serif font-bold text-foreground text-sm">
                {hoveredPoint.sampleName}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">{hoveredPoint.sampleId}</div>
              <div className="mt-1 space-y-0.5 text-[11px]">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Group:</span>
                  <span className="font-semibold text-foreground">{hoveredPoint.group}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Batch:</span>
                  <span className="font-mono text-foreground">{hoveredPoint.batch}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Coordinates:</span>
                  <span className="font-mono text-foreground">
                    {plotMode === "pca"
                      ? `(${hoveredPoint.pc1.toFixed(1)}, ${hoveredPoint.pc2.toFixed(1)})`
                      : `(${hoveredPoint.umap1.toFixed(1)}, ${hoveredPoint.umap2.toFixed(1)})`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScientificCard>
  );
};
