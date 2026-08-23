import React, { useState } from "react";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "./ScientificCard";
import { CHART_PALETTES } from "@/lib/theme";
import { toast } from "sonner";

export const HeatmapMatrix: React.FC = () => {
  const { activeDataset, setSelectedGene } = useRnaSeq();
  const [hoveredCell, setHoveredCell] = useState<{
    geneSymbol: string;
    sampleId: string;
    zScore: number;
    sampleName: string;
    group: string;
  } | null>(null);

  const samples = activeDataset.samples;
  const heatmapRows = activeDataset.heatmapData;

  // Diverging color interpolation (Teal -> Neutral -> Maroon)
  const getZColor = (z: number) => {
    // Clamp between -2.5 and +2.5
    const clamped = Math.max(-2.5, Math.min(2.5, z));
    if (clamped < 0) {
      // Teal spectrum
      const ratio = Math.abs(clamped) / 2.5; // 0 to 1
      if (ratio > 0.7) return "#0E5E6B";
      if (ratio > 0.4) return "#157F8F";
      if (ratio > 0.2) return "#6BB5C2";
      return "#C8E6EB";
    } else if (clamped > 0) {
      // Maroon spectrum
      const ratio = clamped / 2.5;
      if (ratio > 0.7) return "#7D1B2D";
      if (ratio > 0.4) return "#A83246";
      if (ratio > 0.2) return "#D97388";
      return "#F6D5DC";
    }
    return "#FAF9F6";
  };

  const handleExportCsv = () => {
    const header = "GeneSymbol,GeneID,Category," + samples.map((s) => s.sampleId).join(",") + "\n";
    const rows = heatmapRows
      .map((r) => {
        const vals = samples.map((s) => r.values[s.sampleId] ?? 0).join(",");
        return `"${r.geneSymbol}","${r.geneId}","${r.category}",${vals}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_clustered_heatmap_zscores.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Heatmap Z-score matrix exported as CSV.");
  };

  return (
    <ScientificCard
      title="Clustered Expression Heatmap (Top Discriminant Features)"
      subtitle={`Hierarchically clustered gene expression (row-scaled Z-scores across N=${samples.length} samples)`}
      methodCaption="Complete linkage hierarchical clustering with Euclidean distance metric on regularized log transformed counts."
      citation="Eisen MB et al. PNAS (1998) / pheatmap"
      onExportCsv={handleExportCsv}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Colorbar Scale / Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-border text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Row Z-Score:</span>
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="text-accent font-semibold">-2.5 (Repressed)</span>
              <div className="w-28 h-3 rounded border border-border flex overflow-hidden">
                <div className="flex-1 bg-[#0E5E6B]" />
                <div className="flex-1 bg-[#157F8F]" />
                <div className="flex-1 bg-[#6BB5C2]" />
                <div className="flex-1 bg-[#C8E6EB]" />
                <div className="flex-1 bg-[#FAF9F6]" />
                <div className="flex-1 bg-[#F6D5DC]" />
                <div className="flex-1 bg-[#D97388]" />
                <div className="flex-1 bg-[#A83246]" />
                <div className="flex-1 bg-[#7D1B2D]" />
              </div>
              <span className="text-primary font-semibold">+2.5 (Overexpressed)</span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground">
            {heatmapRows.length} discriminant genes × {samples.length} samples
          </div>
        </div>

        {/* Matrix Container */}
        <div className="relative overflow-x-auto flex-1 pb-2">
          <table className="w-full border-collapse text-xs select-none">
            <thead>
              {/* Sample group color annotation strip */}
              <tr>
                <th className="p-1 text-left font-serif font-bold text-foreground w-28 bg-surface border-b border-r border-border">
                  Feature / Gene
                </th>
                {samples.map((s) => {
                  const isGroupA = s.group === activeDataset.primaryContrast.groupA;
                  return (
                    <th
                      key={s.sampleId}
                      className="p-1 text-center font-mono text-[10px] min-w-[32px] border-b border-border"
                      title={`${s.sampleName} (${s.group})`}
                    >
                      <div
                        className={`h-2 rounded-t-sm mb-1 ${
                          isGroupA ? "bg-primary" : "bg-accent"
                        }`}
                      />
                      <span className="block truncate max-w-[36px] text-muted-foreground">
                        {s.sampleName.split("_")[1] || s.sampleName.slice(0, 4)}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {heatmapRows.map((row) => (
                <tr key={row.geneId} className="border-b border-border/40 hover:bg-muted/30">
                  <td
                    onClick={() => {
                      const match = activeDataset.genes.find((g) => g.geneSymbol === row.geneSymbol);
                      if (match) setSelectedGene(match);
                      toast.info(`Selected gene ${row.geneSymbol}`);
                    }}
                    className="p-1.5 font-serif font-bold text-foreground text-xs cursor-pointer hover:text-primary transition-colors bg-surface/50 border-r border-border truncate"
                  >
                    <span>{row.geneSymbol}</span>
                    <span className="block text-[9px] font-sans text-muted-foreground font-normal">
                      {row.category}
                    </span>
                  </td>

                  {samples.map((sample) => {
                    const z = row.values[sample.sampleId] ?? 0;
                    const bg = getZColor(z);
                    const isCellHovered =
                      hoveredCell?.geneSymbol === row.geneSymbol &&
                      hoveredCell?.sampleId === sample.sampleId;

                    return (
                      <td
                        key={sample.sampleId}
                        style={{ backgroundColor: bg }}
                        onMouseEnter={() =>
                          setHoveredCell({
                            geneSymbol: row.geneSymbol,
                            sampleId: sample.sampleId,
                            sampleName: sample.sampleName,
                            group: sample.group,
                            zScore: z
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-1 text-center cursor-pointer transition-all border border-card/40 ${
                          isCellHovered ? "ring-2 ring-foreground z-10" : ""
                        }`}
                      >
                        <span className="opacity-0 hover:opacity-100 font-mono text-[9px] font-bold text-foreground">
                          {z > 0 ? `+${z.toFixed(1)}` : z.toFixed(1)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cell Tooltip */}
          {hoveredCell && (
            <div className="absolute bottom-2 right-2 p-2 rounded-md bg-card border border-border shadow-elevated text-xs font-sans pointer-events-none z-20">
              <div className="font-serif font-bold text-foreground">
                {hoveredCell.geneSymbol} × {hoveredCell.sampleName}
              </div>
              <div className="text-[11px] mt-0.5 space-y-0.5">
                <div>
                  <span className="text-muted-foreground">Group: </span>
                  <span className="font-semibold text-foreground">{hoveredCell.group}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Standardized Z-Score: </span>
                  <span className="font-mono font-bold text-foreground">
                    {hoveredCell.zScore > 0 ? `+${hoveredCell.zScore.toFixed(2)}` : hoveredCell.zScore.toFixed(2)}
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
