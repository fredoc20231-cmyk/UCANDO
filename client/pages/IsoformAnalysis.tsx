import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { Layers, Download, CheckCircle2, Split } from "lucide-react";
import { toast } from "sonner";

export const IsoformAnalysis: React.FC = () => {
  const { activeDataset } = useRnaSeq();
  const isoforms = activeDataset.isoforms;

  const handleExportCsv = () => {
    const headers = "TranscriptID,GeneSymbol,IsoformName,LengthBP,UsageBaseline,UsageContrast,DeltaPSI,Event,PValue,Padj\n";
    const rows = isoforms
      .map(
        (i) =>
          `"${i.transcriptId}","${i.geneSymbol}","${i.isoformName}",${i.refLength},${i.usageBaseline},${i.usageContrast},${i.deltaPsi},"${i.event}",${i.pvalue},${i.padj}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_differential_isoform_usage.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Isoform analysis table exported as CSV.");
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Isoform Quantification & Alternative Splicing
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-dashed border-accent text-accent font-mono font-medium">
              Differential Transcript Usage (DTU)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Quantify transcript-level abundance, detect alternative exon skipping, differential 5'/3' splice sites, and calculate delta Percent Spliced In (&Delta;PSI).
          </p>
        </div>

        {/* DTU Results Table */}
        <ScientificCard
          title="Differential Transcript Usage (DTU & Splicing Switches)"
          subtitle={`Salmon / DEXSeq transcript model switches • ${activeDataset.primaryContrast.label}`}
          methodCaption="Dirichlet-multinomial regression model (DRIMSeq / DEXSeq) testing for changes in relative isoform proportion."
          citation="Nowicka M & Robinson MD. F1000Research (2016)"
          onExportCsv={handleExportCsv}
        >
          {isoforms.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              Transcript-level alignment quantification is loading or unavailable for this custom dataset.
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Transcript ID</th>
                    <th className="py-2.5 px-3 font-semibold">Gene Symbol</th>
                    <th className="py-2.5 px-3 font-semibold">Isoform Variant</th>
                    <th className="py-2.5 px-3 font-semibold">Splicing Event</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Length (bp)</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Baseline %</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Contrast %</th>
                    <th className="py-2.5 px-3 text-right font-semibold">&Delta;PSI Shift</th>
                    <th className="py-2.5 px-3 text-right font-semibold">FDR (padj)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isoforms.map((iso) => (
                    <tr key={iso.transcriptId} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-3 font-mono font-medium text-foreground">{iso.transcriptId}</td>
                      <td className="py-2 px-3 font-serif font-bold text-foreground">{iso.geneSymbol}</td>
                      <td className="py-2 px-3 text-muted-foreground">{iso.isoformName}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.2 rounded bg-surface border border-border text-[10px] font-mono">
                          {iso.event}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-muted-foreground">{iso.refLength}</td>
                      <td className="py-2 px-3 text-right font-mono text-muted-foreground">{iso.usageBaseline.toFixed(1)}%</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-foreground">{iso.usageContrast.toFixed(1)}%</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">
                        <span className={iso.deltaPsi > 0 ? "text-primary" : "text-accent"}>
                          {iso.deltaPsi > 0 ? `+${iso.deltaPsi.toFixed(1)}%` : `${iso.deltaPsi.toFixed(1)}%`}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-foreground font-semibold">
                        {iso.padj < 0.0001 ? iso.padj.toExponential(2) : iso.padj.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ScientificCard>

      </div>
    </Layout>
  );
};

export default IsoformAnalysis;
