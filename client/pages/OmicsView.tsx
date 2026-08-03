import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SmartLaunchModal } from "@/components/SmartLaunchModal";
import { MultiomicsDataset, GenomicVariant } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dna,
  Zap,
  Search,
  Filter,
  BarChart3,
  Layers,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Info,
  Activity,
  FileCode,
  ArrowUpRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function OmicsView() {
  const [dataset, setDataset] = useState<MultiomicsDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchGene, setSearchGene] = useState("");
  const [filterPathogenicOnly, setFilterPathogenicOnly] = useState(false);
  const [smartModalOpen, setSmartModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/beacon/omics")
      .then((res) => res.json())
      .then((data: MultiomicsDataset) => {
        setDataset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load multiomics dataset:", err);
        setLoading(false);
      });
  }, []);

  const filteredVariants = (dataset?.variants || []).filter((v) => {
    const matchesGene = v.gene.toLowerCase().includes(searchGene.toLowerCase()) || v.hgvs.toLowerCase().includes(searchGene.toLowerCase());
    const matchesPathogenic = filterPathogenicOnly ? v.pathogenicity === "Pathogenic" : true;
    return matchesGene && matchesPathogenic;
  });

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-300 border border-purple-700/50 shadow-md">
                <Dna className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Multiomics & Genomics Explorer</h1>
                  <Badge variant="outline" className="border-purple-500/40 text-purple-300 bg-purple-950/40 text-[10px]">
                    BioCompute Provenance IEEE 2791
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-throughput somatic & germline VCFs, gene expression matrices, and pathway enrichment scores.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setSmartModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 shadow-md"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                SMART Launch: Cronus Multiomics
              </Button>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800/60 text-xs py-1 px-3">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Pipeline: Dragen v4.2 GRCh38
              </Badge>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Search variant by gene (e.g. BRCA1, TP53) or HGVS notation..."
                value={searchGene}
                onChange={(e) => setSearchGene(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-800 text-xs text-slate-200"
              />
            </div>

            <Button
              variant={filterPathogenicOnly ? "default" : "outline"}
              onClick={() => setFilterPathogenicOnly(!filterPathogenicOnly)}
              className={`text-xs ${
                filterPathogenicOnly
                  ? "bg-red-900 text-white hover:bg-red-800 border-red-700"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900"
              }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              {filterPathogenicOnly ? "Showing Pathogenic Only" : "Filter Pathogenic Only"}
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="variants" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <TabsTrigger value="variants" className="text-xs data-[state=active]:bg-purple-800 text-slate-300">
              <Dna className="w-3.5 h-3.5 mr-1.5" /> Genomic Variants Table
            </TabsTrigger>
            <TabsTrigger value="oncoprint" className="text-xs data-[state=active]:bg-purple-800 text-slate-300">
              <Layers className="w-3.5 h-3.5 mr-1.5" /> OncoPrint Matrix
            </TabsTrigger>
            <TabsTrigger value="pathways" className="text-xs data-[state=active]:bg-purple-800 text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> Pathway Enrichment
            </TabsTrigger>
            <TabsTrigger value="igv" className="text-xs data-[state=active]:bg-purple-800 text-slate-300">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> IGV Browser Preview
            </TabsTrigger>
          </TabsList>

          {/* Genomic Variants Table */}
          <TabsContent value="variants" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Detected Somatic & Germline Variants ({filteredVariants.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Annotation Engine: Ensembl VEP v110
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Gene</th>
                    <th className="py-2.5 px-3">HGVS Nomenclature</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">VAF %</th>
                    <th className="py-2.5 px-3">Read Depth</th>
                    <th className="py-2.5 px-3">Pathogenicity</th>
                    <th className="py-2.5 px-3 text-right">BioCompute (BCO)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  {filteredVariants.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-950/60">
                      <td className="py-3 px-3 font-bold text-sky-300">{v.gene}</td>
                      <td className="py-3 px-3 text-slate-200">{v.hgvs}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                          {v.variantType}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{v.vafPercent > 0 ? `${v.vafPercent}%` : "CN Amp"}</td>
                      <td className="py-3 px-3 text-slate-400">{v.readDepth}x</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            v.pathogenicity === "Pathogenic"
                              ? "bg-red-950 text-red-300 border-red-800 text-[10px]"
                              : "bg-amber-950 text-amber-300 border-amber-800 text-[10px]"
                          }
                        >
                          {v.pathogenicity}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={v.bioComputeObject}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-[10px] text-purple-400 hover:text-purple-300"
                        >
                          BCO Specification <ArrowUpRight className="w-3 h-3 ml-0.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* OncoPrint Matrix */}
          <TabsContent value="oncoprint" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">OncoPrint Cohort Mutation Heatmap</h3>
              <p className="text-xs text-slate-400">
                Visualizing co-occurrence and mutual exclusivity of somatic variants across patient tumor samples.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto space-y-4">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">Legend:</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <span className="w-3 h-3 rounded bg-red-600 inline-block" /> Somatic SNV
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <span className="w-3 h-3 rounded bg-sky-500 inline-block" /> Germline SNV
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> CNV Amplification
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" /> Wildtype
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {["BRCA1", "TP53", "PIK3CA", "ERBB2"].map((gene) => (
                  <div key={gene} className="flex items-center gap-3">
                    <span className="w-16 font-bold text-slate-200">{gene}</span>
                    <div className="flex items-center gap-1.5 flex-1">
                      {dataset?.oncoPrintSamples.map((sample) => {
                        const status = sample.variants[gene] || "none";
                        return (
                          <div
                            key={sample.sampleId}
                            className={`h-8 flex-1 rounded border flex items-center justify-center text-[9px] font-bold text-white ${
                              status === "somatic_snv"
                                ? "bg-red-950 border-red-600 text-red-200"
                                : status === "germline_snv"
                                ? "bg-sky-950 border-sky-500 text-sky-200"
                                : status === "cnv_amp"
                                ? "bg-amber-950 border-amber-500 text-amber-200"
                                : "bg-slate-900 border-slate-800 text-slate-600"
                            }`}
                          >
                            {status !== "none" ? status.split("_")[0].toUpperCase() : "-"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Pathway Enrichment */}
          <TabsContent value="pathways" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white">Signaling Pathway Enrichment & Impact</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-slate-400">Enrichment Score by Biological Pathway</span>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataset?.pathways || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" stroke="#64748b" fontSize={11} />
                      <YAxis type="category" dataKey="pathway" stroke="#94a3b8" fontSize={10} width={180} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                      />
                      <Bar dataKey="enrichmentScore" fill="#a855f7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pathway List Details */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-slate-400">Statistical Significance Details</span>
                <div className="space-y-2">
                  {dataset?.pathways.map((p) => (
                    <div key={p.pathway} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                      <div className="flex justify-between items-center font-bold text-slate-200">
                        <span>{p.pathway}</span>
                        <Badge className="bg-purple-950 text-purple-300 border-purple-800 text-[10px]">
                          FDR = {p.fdr}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Gene Count: {p.geneCount} genes • p-value: {p.pValue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* IGV Genome Browser Preview */}
          <TabsContent value="igv" className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">IGV Genome Browser Coverage Track</h3>
                <p className="text-xs text-slate-400">
                  Locus: <code className="bg-slate-950 px-2 py-0.5 rounded text-purple-300 font-mono">chr17:43,044,295-43,125,483 (BRCA1)</code>
                </p>
              </div>
              <Badge className="bg-purple-950 text-purple-300 border-purple-800 font-mono text-xs">
                GRCh38 Reference
              </Badge>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="h-20 bg-slate-900 rounded border border-slate-800 p-3 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500">Read Depth Alignment (Coverage 420x)</span>
                <div className="flex items-end gap-1 h-10 pt-2">
                  {[40, 50, 65, 80, 95, 100, 92, 85, 70, 60, 45, 55, 75, 88, 98, 80, 60, 40].map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-purple-500/80 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>RefSeq Gene Track: BRCA1 (Exon 11 duplication locus)</span>
                <span className="text-emerald-400 font-bold">c.5266dupC (Pathogenic)</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
