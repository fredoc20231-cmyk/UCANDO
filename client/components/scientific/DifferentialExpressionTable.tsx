import React, { useState, useMemo } from "react";
import { useRnaSeq, GeneResult } from "@/context/RnaSeqContext";
import { ScientificCard } from "./ScientificCard";
import { 
  Search, 
  ArrowUpDown, 
  Copy, 
  Check, 
  ExternalLink, 
  Filter, 
  SlidersHorizontal,
  Dna
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const DifferentialExpressionTable: React.FC = () => {
  const {
    activeDataset,
    filteredGenes,
    geneSearchQuery,
    setGeneSearchQuery,
    selectedGene,
    setSelectedGene,
    padjThreshold,
    lfcThreshold
  } = useRnaSeq();

  const [sortField, setSortField] = useState<keyof GeneResult>("padj");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "up" | "down" | "sig">("all");
  const [copiedGene, setCopiedGene] = useState<string | null>(null);

  const handleSort = (field: keyof GeneResult) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === "geneSymbol" || field === "padj" || field === "pvalue");
    }
  };

  const processedGenes = useMemo(() => {
    let result = [...filteredGenes];

    if (statusFilter === "up") {
      result = result.filter((g) => g.status === "up");
    } else if (statusFilter === "down") {
      result = result.filter((g) => g.status === "down");
    } else if (statusFilter === "sig") {
      result = result.filter((g) => g.status !== "ns");
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

    return result;
  }, [filteredGenes, statusFilter, sortField, sortAsc]);

  const copySymbol = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(symbol);
    setCopiedGene(symbol);
    setTimeout(() => setCopiedGene(null), 1500);
    toast.success(`Copied "${symbol}" to clipboard`);
  };

  const handleExportCsv = () => {
    const headers = "GeneSymbol,GeneID,Chromosome,Biotype,BaseMean,log2FoldChange,lfcSE,stat,pvalue,padj,status\n";
    const rows = processedGenes
      .map(
        (g) =>
          `"${g.geneSymbol}","${g.geneId}","${g.chromosome}","${g.biotype}",${g.baseMean},${g.log2FoldChange},${g.lfcSE},${g.stat},${g.pvalue},${g.padj},"${g.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_differential_expression_table.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Filtered differential expression table exported as CSV.");
  };

  return (
    <ScientificCard
      title="Differential Expression Results Table (DESeq2)"
      subtitle={`Model: ~ batch + condition (${activeDataset.primaryContrast.label}) • N=${processedGenes.length} genes`}
      methodCaption="Wald significance test with independent filtering and Benjamini-Hochberg FDR p-adjustment."
      citation="Love MI et al. Genome Biology (2014) 15:550"
      onExportCsv={handleExportCsv}
    >
      <div className="flex flex-col h-full space-y-3">
        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search symbol (e.g. ESR1, TP53, BRCA1)..."
                value={geneSearchQuery}
                onChange={(e) => setGeneSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-background border-border"
              />
            </div>
            {geneSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGeneSearchQuery("")}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Quick status filter pills */}
          <div className="flex items-center gap-1 bg-surface p-0.5 rounded border border-border">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-card text-foreground font-semibold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({filteredGenes.length})
            </button>
            <button
              onClick={() => setStatusFilter("sig")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === "sig"
                  ? "bg-card text-foreground font-semibold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Significant ({filteredGenes.filter((g) => g.status !== "ns").length})
            </button>
            <button
              onClick={() => setStatusFilter("up")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === "up"
                  ? "bg-card text-primary font-semibold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              +Up ({filteredGenes.filter((g) => g.status === "up").length})
            </button>
            <button
              onClick={() => setStatusFilter("down")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === "down"
                  ? "bg-card text-accent font-semibold shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              -Down ({filteredGenes.filter((g) => g.status === "down").length})
            </button>
          </div>
        </div>

        {/* Dense Scientific Table */}
        <div className="overflow-x-auto border border-border rounded-md max-h-[380px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead className="sticky top-0 bg-surface border-b border-border z-10 select-none">
              <tr className="text-muted-foreground text-[11px]">
                <th
                  onClick={() => handleSort("geneSymbol")}
                  className="py-2 px-3 font-semibold cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center gap-1">
                    <span>Gene Symbol</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2 px-2 font-semibold">Ensembl ID</th>
                <th
                  onClick={() => handleSort("baseMean")}
                  className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Base Mean</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("log2FoldChange")}
                  className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>log₂FC</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2 px-2 text-right font-semibold">lfcSE</th>
                <th
                  onClick={() => handleSort("stat")}
                  className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Wald Stat</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("pvalue")}
                  className="py-2 px-2 text-right font-semibold cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>p-value</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("padj")}
                  className="py-2 px-3 text-right font-semibold cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>FDR (padj)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2 px-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {processedGenes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    No genes match the current search or significance filter.
                  </td>
                </tr>
              ) : (
                processedGenes.map((gene) => {
                  const isSelected = selectedGene?.geneId === gene.geneId;
                  return (
                    <tr
                      key={gene.geneId}
                      onClick={() => {
                        setSelectedGene(gene);
                        toast.info(`Selected ${gene.geneSymbol} for downstream analysis`);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 font-medium"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      {/* Gene Symbol with copy button */}
                      <td className="py-1.5 px-3 font-serif font-bold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span>{gene.geneSymbol}</span>
                          <button
                            onClick={(e) => copySymbol(gene.geneSymbol, e)}
                            className="text-muted-foreground hover:text-foreground p-0.5 rounded opacity-60 hover:opacity-100"
                            title={`Copy ${gene.geneSymbol}`}
                          >
                            {copiedGene === gene.geneSymbol ? (
                              <Check className="w-3 h-3 text-accent" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Ensembl ID */}
                      <td className="py-1.5 px-2 font-mono text-[11px] text-muted-foreground">
                        {gene.geneId}
                      </td>

                      {/* Base Mean */}
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums text-foreground">
                        {gene.baseMean.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>

                      {/* log2FoldChange */}
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums font-semibold">
                        <span
                          className={
                            gene.status === "up"
                              ? "text-primary"
                              : gene.status === "down"
                              ? "text-accent"
                              : "text-muted-foreground"
                          }
                        >
                          {gene.log2FoldChange > 0 ? `+${gene.log2FoldChange.toFixed(2)}` : gene.log2FoldChange.toFixed(2)}
                        </span>
                      </td>

                      {/* lfcSE */}
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums text-muted-foreground text-[11px]">
                        ±{gene.lfcSE.toFixed(2)}
                      </td>

                      {/* Wald Stat */}
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums text-muted-foreground text-[11px]">
                        {gene.stat.toFixed(2)}
                      </td>

                      {/* pvalue */}
                      <td className="py-1.5 px-2 text-right font-mono tabular-nums text-muted-foreground text-[11px]">
                        {gene.pvalue < 0.0001 ? gene.pvalue.toExponential(2) : gene.pvalue.toFixed(4)}
                      </td>

                      {/* padj */}
                      <td className="py-1.5 px-3 text-right font-mono tabular-nums font-semibold text-foreground">
                        {gene.padj < 0.0001 ? gene.padj.toExponential(2) : gene.padj.toFixed(4)}
                      </td>

                      {/* Status badge */}
                      <td className="py-1.5 px-3 text-center">
                        {gene.status === "up" ? (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            +Up
                          </span>
                        ) : gene.status === "down" ? (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
                            -Down
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.2 rounded text-[10px] text-muted-foreground bg-muted border border-border">
                            NS
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ScientificCard>
  );
};
