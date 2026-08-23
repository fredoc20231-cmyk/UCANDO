import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  ArrowUpRight,
  GripHorizontal,
  ArrowUpDown,
  Globe,
  Maximize2,
  FlaskConical,
  ShieldCheck
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
  const [riskScore, setRiskScore] = useState<{
    compositeScore: number;
    riskTier: "Low" | "Intermediate" | "High";
    contributingFactors: { factor: string; weight: number; detail: string }[];
    methodologyNote: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchGene, setSearchGene] = useState("");
  const [filterPathogenicOnly, setFilterPathogenicOnly] = useState(false);
  const [smartModalOpen, setSmartModalOpen] = useState(false);
  const [frameHeight, setFrameHeight] = useState<number>(560);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(560);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = frameHeight;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.min(1000, Math.max(300, startHeightRef.current + deltaY));
      setFrameHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

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

    fetch("/api/beacon/patient/risk-score")
      .then((res) => res.json())
      .then((data) => setRiskScore(data))
      .catch((err) => console.error("Failed to load multi-omics risk score:", err));
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
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Dna className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif text-foreground">UC-MOP: Multi-Omics Platform & Genomics</h1>
                  <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                    BioCompute IEEE 2791
                  </Badge>
                  <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 font-mono text-[10px]">
                    PhoenixMO Connected
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  High-throughput somatic & germline VCFs, OncoPrint variant matrices, and BioCompute Object cryptographic execution provenance.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/workspace">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-accent text-accent hover:bg-accent/10"
                >
                  <Dna className="w-3.5 h-3.5 mr-1.5" /> RNA-seq Platform
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={() => setSmartModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-subtle"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                SMART Launch: PhoenixMO Multiomics
              </Button>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <Input
                placeholder="Search variant by gene (e.g. BRCA1, TP53, PIK3CA) or HGVS notation..."
                value={searchGene}
                onChange={(e) => setSearchGene(e.target.value)}
                className="pl-9 bg-surface border-border text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              variant={filterPathogenicOnly ? "default" : "outline"}
              onClick={() => setFilterPathogenicOnly(!filterPathogenicOnly)}
              className={`text-xs font-semibold ${
                filterPathogenicOnly
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              {filterPathogenicOnly ? "Showing Pathogenic Only" : "Filter Pathogenic Only"}
            </Button>
          </div>
        </div>

        {/* Multi-Omics Composite Risk Score */}
        {riskScore && (
          <div className="p-5 rounded-xl bg-card border border-border space-y-3 shadow-subtle">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  Multi-Omics Composite Molecular Risk Score
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xl">
                  Analytical heuristic incorporating germline BRCA1, somatic TP53, RNA signature HRD index, and CA 15-3 kinetics.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-primary tabular-nums">{riskScore.compositeScore}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">/ 100 Score</div>
                </div>
                <Badge
                  className={
                    riskScore.riskTier === "High"
                      ? "bg-primary/15 text-primary border-primary/30 font-mono text-xs"
                      : "bg-accent/15 text-accent border-accent/30 font-mono text-xs"
                  }
                >
                  {riskScore.riskTier} Risk Tier
                </Badge>
              </div>
            </div>

            {riskScore.contributingFactors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {riskScore.contributingFactors.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border text-xs">
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>{f.factor}</span>
                      <span className="font-mono text-accent tabular-nums">+{f.weight}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{f.detail}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="variants" className="space-y-6">
          <TabsList className="bg-muted border border-border p-1 rounded-lg flex flex-wrap">
            <TabsTrigger
              value="variants"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <Dna className="w-3.5 h-3.5 mr-1.5 text-accent" /> Genomic Variants Table
            </TabsTrigger>
            <TabsTrigger
              value="oncoprint"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-primary" /> OncoPrint Matrix
            </TabsTrigger>
            <TabsTrigger
              value="pathways"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-accent" /> Pathway Enrichment
            </TabsTrigger>
            <TabsTrigger
              value="cronos"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <Globe className="w-3.5 h-3.5 mr-1.5 text-primary" /> PhoenixMO / UC-MOP Frame
            </TabsTrigger>
          </TabsList>

          {/* Genomic Variants Table */}
          <TabsContent value="variants" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Detected Somatic & Germline Variants ({filteredVariants.length})
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Annotation Engine: Ensembl VEP v110 • GRCh38
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Gene</th>
                    <th className="py-2.5 px-3">HGVS Nomenclature</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">VAF %</th>
                    <th className="py-2.5 px-3">Read Depth</th>
                    <th className="py-2.5 px-3">Pathogenicity</th>
                    <th className="py-2.5 px-3 text-right">BioCompute (BCO)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground font-mono">
                  {filteredVariants.map((v) => (
                    <tr key={v.id} className="hover:bg-muted/50">
                      <td className="py-3 px-3 font-bold text-primary">{v.gene}</td>
                      <td className="py-3 px-3 text-foreground">{v.hgvs}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                          {v.variantType}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-accent font-bold tabular-nums">{v.vafPercent > 0 ? `${v.vafPercent}%` : "CN Amp"}</td>
                      <td className="py-3 px-3 text-muted-foreground tabular-nums">{v.readDepth}x</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            v.pathogenicity === "Pathogenic"
                              ? "bg-primary/15 text-primary border-primary/30 text-[10px]"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
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
                          className="text-[11px] text-accent hover:underline inline-flex items-center gap-1"
                        >
                          <FileCode className="w-3 h-3" /> BCO Provenance
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* OncoPrint Matrix */}
          <TabsContent value="oncoprint" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-foreground">Cohort OncoPrint Mutation Landscape</h3>
                <p className="text-xs text-muted-foreground">Genomic alteration distribution across reference clinical cohort.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-primary rounded-sm" />
                  <span className="text-muted-foreground">Somatic Missense</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-accent rounded-sm" />
                  <span className="text-muted-foreground">Germline Indel</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {dataset?.oncoPrintSamples?.map((sample) => (
                <div key={sample.sampleId} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-24 font-bold text-foreground text-right">{sample.sampleId}</span>
                  <div className="flex-1 flex gap-1">
                    {Object.entries(sample.variants).map(([gene, status]) => {
                      const isMut = status !== "none";
                      return (
                        <div
                          key={gene}
                          title={`${sample.sampleId}: ${gene} (${status})`}
                          className={`flex-1 h-7 rounded-sm border transition-colors flex items-center justify-center text-[9px] font-bold ${
                            status === "somatic_snv"
                              ? "bg-primary text-primary-foreground border-primary"
                              : status === "germline_snv"
                              ? "bg-accent text-accent-foreground border-accent"
                              : status === "cnv_amp"
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-surface border-border text-muted-foreground/40"
                          }`}
                        >
                          {isMut ? gene : "-"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Pathway Enrichment */}
          <TabsContent value="pathways" className="p-6 rounded-xl bg-card border border-border space-y-6 shadow-subtle">
            <h3 className="text-base font-bold font-serif text-foreground">Signaling Pathway Enrichment & Impact</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-muted-foreground">Enrichment Score by Pathway</span>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataset?.pathways || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                      <YAxis type="category" dataKey="pathway" stroke="var(--muted-foreground)" fontSize={10} width={180} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", fontSize: "12px", color: "var(--foreground)" }}
                      />
                      <Bar dataKey="enrichmentScore" fill="#157F8F" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pathway List Details */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-muted-foreground">Statistical Significance Details</span>
                <div className="space-y-2">
                  {dataset?.pathways.map((p) => (
                    <div key={p.pathway} className="p-3 rounded-lg bg-surface border border-border space-y-1 text-xs font-mono">
                      <div className="flex justify-between items-center font-bold text-foreground">
                        <span>{p.pathway}</span>
                        <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px]">
                          FDR = {p.fdr}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Gene Count: {p.geneCount} genes • p-value: {p.pValue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Phoenix-Multiomics Resizable Embedded Frame Tab */}
          <TabsContent value="cronos" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    Phoenix-Multiomics & UC-MOP Embedded Workspace
                  </h3>
                  <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono">
                    SMART-on-FHIR v2.0
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Interactive multiomics workspace with live integration. Drag bottom bar to resize.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open("https://cronus.life/", "_blank")}
                  className="text-xs border-border text-foreground hover:bg-muted"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-accent" /> Open External Window
                </Button>
              </div>
            </div>

            {/* Embedded iframe container */}
            <div
              className="relative rounded-xl border border-border overflow-hidden bg-background shadow-subtle"
              style={{ height: `${frameHeight}px` }}
            >
              <iframe
                src="https://cronus.life/"
                title="Phoenix-Multiomics Workspace"
                className="w-full h-full border-0 bg-background"
              />
            </div>

            {/* Drag Handle */}
            <div
              onMouseDown={handleMouseDown}
              className="w-full py-2 bg-muted/60 hover:bg-muted border border-border rounded-lg cursor-row-resize flex items-center justify-center transition-colors"
              title="Drag up or down to resize frame"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase">Drag to resize embedded frame ({frameHeight}px)</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* SMART Launch Modal */}
        <SmartLaunchModal
          isOpen={smartModalOpen}
          onClose={() => setSmartModalOpen(false)}
          patientId="UC-CCC-89421"
          platformName="PhoenixMO Multiomics Platform"
          targetUrl="https://cronus.life/"
        />
      </div>
    </Layout>
  );
}
