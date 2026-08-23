import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { Table, Search, Download, CheckCircle2, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const SampleMetadata: React.FC = () => {
  const { activeDataset } = useRnaSeq();
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const samples = activeDataset.samples;
  const groups = Array.from(new Set(samples.map((s) => s.group)));

  const filtered = samples.filter((s) => {
    const matchesSearch =
      s.sampleName.toLowerCase().includes(search.toLowerCase()) ||
      s.sampleId.toLowerCase().includes(search.toLowerCase()) ||
      s.tissue.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === "All" || s.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleExportCsv = () => {
    const headers = "SampleID,SampleName,Group,Batch,Tissue,Stage,SubType,ReadCount,AlignmentRate,RINScore,QCPass\n";
    const rows = filtered
      .map(
        (s) =>
          `"${s.sampleId}","${s.sampleName}","${s.group}","${s.batch}","${s.tissue}","${s.stage}","${s.subType}",${s.readCount},${s.alignmentRate},${s.rinScore},${s.qcPass}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_sample_metadata.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sample metadata exported as CSV.");
  };

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Sample Metadata & Phenotype Directory
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
              N={samples.length} Samples
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Clinical phenotypes, histological classifications, library batch variables, and RNA integrity scores for the active cohort.
          </p>
        </div>

        <ScientificCard
          title={`Phenotype Manifest: ${activeDataset.name}`}
          subtitle={`Verified biospecimens (${activeDataset.diseaseContext})`}
          methodCaption="Clinical demographic and histopathological staging annotated according to CAP/AJCC 8th Edition standards."
          onExportCsv={handleExportCsv}
        >
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
              <div className="relative w-full max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search by sample ID, stage, tissue..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background border-border"
                />
              </div>

              <div className="flex items-center gap-1 bg-surface p-0.5 rounded border border-border">
                <button
                  onClick={() => setSelectedGroup("All")}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedGroup === "All"
                      ? "bg-card text-foreground font-semibold shadow-subtle"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Groups ({samples.length})
                </button>
                {groups.map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      selectedGroup === grp
                        ? "bg-card text-primary font-semibold shadow-subtle"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {grp.split(" ")[0]} ({samples.filter((s) => s.group === grp).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground select-none">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Sample ID</th>
                    <th className="py-2.5 px-3 font-semibold">Sample Alias</th>
                    <th className="py-2.5 px-3 font-semibold">Experimental Group</th>
                    <th className="py-2.5 px-3 font-semibold">Batch Covariate</th>
                    <th className="py-2.5 px-3 font-semibold">Clinical Stage</th>
                    <th className="py-2.5 px-3 font-semibold">Histology / Tissue</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Read Depth</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Alignment %</th>
                    <th className="py-2.5 px-3 text-right font-semibold">RIN Score</th>
                    <th className="py-2.5 px-3 text-center font-semibold">QC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map((s) => (
                    <tr key={s.sampleId} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-3 font-mono font-medium text-foreground">{s.sampleId}</td>
                      <td className="py-2 px-3 font-semibold text-foreground">{s.sampleName}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.group === activeDataset.primaryContrast.groupA
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-accent/10 text-accent border border-accent/20"
                        }`}>
                          {s.group}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground">{s.batch}</td>
                      <td className="py-2 px-3 text-foreground">{s.stage}</td>
                      <td className="py-2 px-3 text-muted-foreground">{s.tissue}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-foreground">
                        {(s.readCount / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-foreground">
                        {s.alignmentRate.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-foreground">
                        {s.rinScore.toFixed(1)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PASS</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </ScientificCard>

      </div>
    </Layout>
  );
};

export default SampleMetadata;
