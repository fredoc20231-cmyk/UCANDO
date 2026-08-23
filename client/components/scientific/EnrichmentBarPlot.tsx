import React, { useState, useMemo } from "react";
import { useRnaSeq, PathwayResult } from "@/context/RnaSeqContext";
import { ScientificCard } from "./ScientificCard";
import {
  Network,
  ExternalLink,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Info,
  CircleDot,
  Dna,
  Filter,
  CheckCircle2,
  Sliders,
  Table as TableIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { toast } from "sonner";

export type GseaViewMode = "two_sided_bar" | "bubble_plot" | "top10_table" | "all_table";

export const EnrichmentBarPlot: React.FC = () => {
  const { activeDataset, setSelectedGene, setGeneSearchQuery } = useRnaSeq();
  const [selectedDb, setSelectedDb] = useState<string>("All");
  const [viewMode, setViewMode] = useState<GseaViewMode>("two_sided_bar");
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  const allPathways = activeDataset.pathways || [];

  // Filter by database (All, Hallmark, Reactome, KEGG)
  const filteredByDb = useMemo(() => {
    if (selectedDb === "All") return allPathways;
    return allPathways.filter((p) => p.database.toLowerCase() === selectedDb.toLowerCase());
  }, [allPathways, selectedDb]);

  // Sort by significance and absolute NES to get top 10
  const top10Pathways = useMemo(() => {
    return [...filteredByDb]
      .sort((a, b) => Math.abs(b.nes) - Math.abs(a.nes))
      .slice(0, 10);
  }, [filteredByDb]);

  // Data formatted for Two-Sided Diverging Bar Chart
  const twoSidedChartData = useMemo(() => {
    return top10Pathways.map((p) => {
      const cleanName = p.pathwayName
        .replace(/^(HALLMARK_|REACTOME_|KEGG_)/, "")
        .replace(/_/g, " ");
      const shortName = cleanName.length > 28 ? cleanName.slice(0, 26) + "…" : cleanName;
      const negLogFdr = -Math.log10(Math.max(p.padj, 1e-12));

      return {
        id: p.pathwayId,
        rawName: p.pathwayName,
        displayName: shortName,
        fullName: cleanName,
        database: p.database,
        nes: Number(p.nes.toFixed(2)),
        isPositive: p.nes > 0,
        padj: p.padj,
        pvalue: p.pvalue,
        negLogFdr: Number(negLogFdr.toFixed(2)),
        size: p.size,
        leadingEdgeCount: p.leadingEdge.length,
        leadingEdge: p.leadingEdge
      };
    });
  }, [top10Pathways]);

  // Data formatted for Bubble Plot (X: NES, Y: -log10 FDR, Size: Gene count)
  const bubbleChartData = useMemo(() => {
    return filteredByDb.map((p) => {
      const cleanName = p.pathwayName
        .replace(/^(HALLMARK_|REACTOME_|KEGG_)/, "")
        .replace(/_/g, " ");
      const negLogFdr = -Math.log10(Math.max(p.padj, 1e-12));

      return {
        id: p.pathwayId,
        name: cleanName,
        fullName: p.pathwayName,
        database: p.database,
        x: Number(p.nes.toFixed(2)), // NES on X axis
        y: Number(negLogFdr.toFixed(2)), // -log10(FDR) on Y axis
        z: p.size, // Size
        padj: p.padj,
        pvalue: p.pvalue,
        leadingEdge: p.leadingEdge
      };
    });
  }, [filteredByDb]);

  const handleSelectGene = (geneSymbol: string) => {
    const match = activeDataset.genes.find((g) => g.geneSymbol === geneSymbol);
    if (match) {
      setSelectedGene(match);
      setGeneSearchQuery(match.geneSymbol);
      toast.success(`Selected leading-edge biomarker: ${match.geneSymbol} (${match.geneId})`);
    } else {
      setGeneSearchQuery(geneSymbol);
      toast.info(`Querying gene expression for ${geneSymbol}`);
    }
  };

  const handleExportCsv = () => {
    const header = "Rank,PathwayID,PathwayName,Database,Size,NES,PValue,Padj,NegLog10FDR,LeadingEdgeGenes\n";
    const rows = top10Pathways
      .map((p, idx) => {
        const negLogFdr = -Math.log10(Math.max(p.padj, 1e-12)).toFixed(2);
        return `${idx + 1},"${p.pathwayId}","${p.pathwayName}","${p.database}",${p.size},${p.nes},${p.pvalue},${p.padj},${negLogFdr},"${p.leadingEdge.join(";")}"`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_top10_gsea_enrichment_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Top 10 GSEA pathway results exported as CSV.");
  };

  const selectedPathwayDetails = useMemo(() => {
    if (!selectedPathwayId) return top10Pathways[0] || null;
    return allPathways.find((p) => p.pathwayId === selectedPathwayId) || top10Pathways[0] || null;
  }, [selectedPathwayId, allPathways, top10Pathways]);

  return (
    <ScientificCard
      title="Gene Set Enrichment Analysis (GSEA Hallmarks, Reactome & KEGG)"
      subtitle={`Top 10 Pathways Ranked by Normalized Enrichment Score (NES) • ${activeDataset.primaryContrast.label}`}
      methodCaption="Preranked Fast GSEA (fgsea) computed using DESeq2 Wald statistic rank metric with 10,000 permutations and Benjamini-Hochberg FDR correction."
      citation="Subramanian A et al. PNAS (2005) / fgsea Korotkevich et al. (2021)"
      onExportCsv={handleExportCsv}
      headerAction={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Database Selector Pills */}
          <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border">
            {["All", "Hallmark", "Reactome", "KEGG"].map((db) => (
              <button
                key={db}
                onClick={() => {
                  setSelectedDb(db);
                  toast.info(`Filtered GSEA pathways by: ${db}`);
                }}
                className={`px-2.5 py-1 rounded text-xs font-sans font-medium transition-colors ${
                  selectedDb === db
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {db}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("two_sided_bar")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "two_sided_bar"
                  ? "bg-card text-foreground font-bold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Two-Sided Diverging NES & Significance Bar Chart"
            >
              <BarChart2 className="w-3.5 h-3.5 text-primary" />
              <span>Two-Sided Chart</span>
            </button>

            <button
              onClick={() => setViewMode("bubble_plot")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "bubble_plot"
                  ? "bg-card text-foreground font-bold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="GSEA Pathway Bubble Plot"
            >
              <CircleDot className="w-3.5 h-3.5 text-accent" />
              <span>Bubble Plot</span>
            </button>

            <button
              onClick={() => setViewMode("top10_table")}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "top10_table"
                  ? "bg-card text-foreground font-bold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Top 10 Ranked Pathways Table"
            >
              <TableIcon className="w-3.5 h-3.5 text-foreground" />
              <span>Top 10 List</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-xs font-sans">
        
        {/* Top Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-surface border border-border flex flex-col justify-between">
            <span className="text-[11px] text-muted-foreground">Active Database:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-bold text-sm text-foreground">{selectedDb}</span>
              <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                {filteredByDb.length} Gene Sets
              </Badge>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border flex flex-col justify-between">
            <span className="text-[11px] text-muted-foreground">Top Upregulated:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold font-mono text-primary text-sm">
                NES +{Math.max(...filteredByDb.map((p) => p.nes), 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border flex flex-col justify-between">
            <span className="text-[11px] text-muted-foreground">Top Downregulated:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingDown className="w-4 h-4 text-accent shrink-0" />
              <span className="font-bold font-mono text-accent text-sm">
                NES {Math.min(...filteredByDb.map((p) => p.nes), 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border flex flex-col justify-between">
            <span className="text-[11px] text-muted-foreground">FDR Significance Threshold:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span className="font-bold font-mono text-foreground text-sm">q &lt; 0.05</span>
            </div>
          </div>
        </div>

        {/* 1. Two-Sided Diverging Bar Chart (Ups & Downs with Significance Level) */}
        {viewMode === "two_sided_bar" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-card border border-border shadow-subtle space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                <div>
                  <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-primary" />
                    Two-Sided Diverging GSEA Bar Chart (Top 10 Pathways by Normalized Enrichment Score)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Positive NES (Right / Maroon) = Enriched in {activeDataset.primaryContrast.groupA} • Negative NES (Left / Teal) = Enriched in {activeDataset.primaryContrast.groupB}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#7D1B2D]" />
                    <span className="text-foreground">Upregulated</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#157F8F]" />
                    <span className="text-foreground">Downregulated</span>
                  </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="h-96 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={twoSidedChartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 160, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={true} opacity={0.6} />
                    <XAxis
                      type="number"
                      domain={[-3.5, 3.5]}
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      label={{ value: "Normalized Enrichment Score (NES)", position: "insideBottom", offset: -10, fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="displayName"
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      width={150}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 rounded-lg bg-card border border-border shadow-elevated text-xs font-sans space-y-1.5 max-w-xs">
                              <div className="font-serif font-bold text-foreground text-sm">
                                {data.fullName}
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <Badge className="bg-surface border border-border text-foreground py-0 text-[10px]">
                                  {data.database}
                                </Badge>
                                <span className="text-muted-foreground">ID: {data.id}</span>
                              </div>
                              <div className="border-t border-border pt-1.5 space-y-1 font-mono text-[11px]">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">NES Score:</span>
                                  <span className={`font-bold ${data.isPositive ? "text-primary" : "text-accent"}`}>
                                    {data.nes > 0 ? `+${data.nes}` : data.nes}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">FDR q-value:</span>
                                  <span className="font-bold text-foreground">
                                    {data.padj < 0.0001 ? data.padj.toExponential(2) : data.padj.toFixed(4)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Nominal p-value:</span>
                                  <span className="text-foreground">{data.pvalue < 0.0001 ? data.pvalue.toExponential(2) : data.pvalue.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">-log10(FDR):</span>
                                  <span className="font-bold text-accent">{data.negLogFdr}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Gene Set Size:</span>
                                  <span className="text-foreground">{data.size} genes</span>
                                </div>
                              </div>
                              <div className="pt-1 text-[10px] text-muted-foreground">
                                Leading Edge: {data.leadingEdge.slice(0, 4).join(", ")}…
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine x={0} stroke="var(--foreground)" strokeWidth={1.5} />
                    <ReferenceLine x={1.5} stroke="#7D1B2D" strokeDasharray="3 3" label={{ value: "Enriched (+)", fill: "#7D1B2D", fontSize: 9, position: "insideTopRight" }} />
                    <ReferenceLine x={-1.5} stroke="#157F8F" strokeDasharray="3 3" label={{ value: "Suppressed (-)", fill: "#157F8F", fontSize: 9, position: "insideTopLeft" }} />
                    <Bar dataKey="nes" radius={[3, 3, 3, 3]}>
                      {twoSidedChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isPositive ? "#7D1B2D" : "#157F8F"}
                          opacity={Math.min(1.0, 0.45 + (entry.negLogFdr / 12) * 0.55)}
                          onClick={() => setSelectedPathwayId(entry.id)}
                          className="cursor-pointer hover:opacity-100 transition-opacity"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. GSEA Pathway Bubble Plot */}
        {viewMode === "bubble_plot" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-card border border-border shadow-subtle space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                <div>
                  <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-accent" />
                    GSEA Pathway Bubble Plot (NES vs. -log10 Significance Level)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    X-Axis = Normalized Enrichment Score (NES) • Y-Axis = -log10(FDR q-value) • Bubble Size = Gene Set Size
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <Badge variant="outline" className="border-border">Bubble Area = Gene Set Size</Badge>
                </div>
              </div>

              {/* Bubble Chart Canvas */}
              <div className="h-96 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="NES"
                      domain={[-3.5, 3.5]}
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      label={{ value: "Normalized Enrichment Score (NES)", position: "insideBottom", offset: -10, fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="-log10(FDR)"
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      label={{ value: "-log10(FDR Adjusted P-Value)", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <ZAxis type="number" dataKey="z" range={[80, 500]} name="Gene Size" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 rounded-lg bg-card border border-border shadow-elevated text-xs font-sans space-y-1.5 max-w-xs">
                              <div className="font-serif font-bold text-foreground text-sm">
                                {data.name}
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <Badge className="bg-surface border border-border text-foreground py-0 text-[10px]">
                                  {data.database}
                                </Badge>
                                <span className="text-muted-foreground">ID: {data.id}</span>
                              </div>
                              <div className="border-t border-border pt-1.5 space-y-1 font-mono text-[11px]">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">NES Score:</span>
                                  <span className={`font-bold ${data.x > 0 ? "text-primary" : "text-accent"}`}>
                                    {data.x > 0 ? `+${data.x}` : data.x}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">-log10(FDR):</span>
                                  <span className="font-bold text-accent">{data.y}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">FDR (q-val):</span>
                                  <span className="text-foreground">{data.padj < 0.0001 ? data.padj.toExponential(2) : data.padj.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Gene Set Size:</span>
                                  <span className="text-foreground">{data.z} genes</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine x={0} stroke="var(--foreground)" strokeWidth={1} />
                    <ReferenceLine y={-Math.log10(0.05)} stroke="#157F8F" strokeDasharray="3 3" label={{ value: "FDR = 0.05", fill: "#157F8F", fontSize: 10, position: "insideTopRight" }} />
                    <Scatter
                      data={bubbleChartData}
                      onClick={(point) => setSelectedPathwayId(point.id)}
                      className="cursor-pointer"
                    >
                      {bubbleChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.x > 0 ? "#7D1B2D" : "#157F8F"}
                          fillOpacity={0.75}
                          stroke={entry.x > 0 ? "#5C1220" : "#0E5E6B"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 3. Top 10 Ranked Pathways Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
                <TableIcon className="w-4 h-4 text-primary" />
                Top 10 Ranked Pathways ({selectedDb} Catalog)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Sorted by statistical significance and absolute normalized enrichment score (NES)
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
              Top 10 of {filteredByDb.length}
            </Badge>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface text-muted-foreground font-mono uppercase text-[10px] border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 text-center">Rank</th>
                  <th className="py-2.5 px-3">Pathway Name & Database</th>
                  <th className="py-2.5 px-3 text-right">Size</th>
                  <th className="py-2.5 px-3 text-right">NES Score</th>
                  <th className="py-2.5 px-3 text-right">Nominal p-val</th>
                  <th className="py-2.5 px-3 text-right">FDR (q-val)</th>
                  <th className="py-2.5 px-3">Leading Edge Core Biomarkers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {top10Pathways.map((pathway, idx) => {
                  const isPos = pathway.nes > 0;
                  const cleanName = pathway.pathwayName
                    .replace(/^(HALLMARK_|REACTOME_|KEGG_)/, "")
                    .replace(/_/g, " ");

                  return (
                    <tr
                      key={pathway.pathwayId}
                      onClick={() => setSelectedPathwayId(pathway.pathwayId)}
                      className={`cursor-pointer transition-colors ${
                        selectedPathwayDetails?.pathwayId === pathway.pathwayId
                          ? "bg-primary/5"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-muted-foreground">
                        #{idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-serif font-bold text-foreground">{cleanName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="px-1 py-0.2 rounded bg-surface border border-border">
                            {pathway.database}
                          </span>
                          <span>{pathway.pathwayId}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                        {pathway.size}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        <span className={isPos ? "text-primary" : "text-accent"}>
                          {isPos ? `+${pathway.nes.toFixed(2)}` : pathway.nes.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                        {pathway.pvalue < 0.0001 ? pathway.pvalue.toExponential(2) : pathway.pvalue.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                        {pathway.padj < 0.0001 ? pathway.padj.toExponential(2) : pathway.padj.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap items-center gap-1">
                          {pathway.leadingEdge.map((gene) => (
                            <button
                              key={gene}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectGene(gene);
                              }}
                              className="px-1.5 py-0.5 rounded bg-surface hover:bg-muted border border-border text-[10px] font-mono text-primary font-semibold transition-colors"
                              title={`Inspect ${gene} in RNA-seq Workspace`}
                            >
                              {gene}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Selected Pathway Detail Card */}
        {selectedPathwayDetails && (
          <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-2">
              <div>
                <span className="text-[10px] font-mono text-primary font-bold uppercase block">
                  Focused Pathway Inspection • {selectedPathwayDetails.database}
                </span>
                <h4 className="font-serif font-bold text-base text-foreground">
                  {selectedPathwayDetails.pathwayName.replace(/_/g, " ")}
                </h4>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Badge className={selectedPathwayDetails.nes > 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                  NES {selectedPathwayDetails.nes > 0 ? `+${selectedPathwayDetails.nes.toFixed(2)}` : selectedPathwayDetails.nes.toFixed(2)}
                </Badge>
                <Badge variant="outline" className="border-border">
                  FDR: {selectedPathwayDetails.padj < 0.0001 ? selectedPathwayDetails.padj.toExponential(2) : selectedPathwayDetails.padj.toFixed(4)}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-muted-foreground font-semibold text-[11px] block">
                Leading-Edge Core Enrichment Biomarkers (Click any gene to inspect expression in Workspace):
              </span>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {selectedPathwayDetails.leadingEdge.map((gene) => (
                  <button
                    key={gene}
                    onClick={() => handleSelectGene(gene)}
                    className="px-2 py-1 rounded-lg bg-card hover:bg-muted border border-border text-xs font-mono text-primary font-bold shadow-subtle flex items-center gap-1 transition-all"
                  >
                    <Dna className="w-3 h-3 text-accent" />
                    <span>{gene}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </ScientificCard>
  );
};

export default EnrichmentBarPlot;
