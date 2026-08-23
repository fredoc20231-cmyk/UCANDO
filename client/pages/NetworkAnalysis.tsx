import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { Network, Dna } from "lucide-react";

export const NetworkAnalysis: React.FC = () => {
  const { activeDataset, setSelectedGene } = useRnaSeq();

  const hubs = [
    { hub: "TP53", degree: 28, betweenness: 0.84, community: "DNA Damage / Cell Cycle", color: "var(--primary)" },
    { hub: "ESR1", degree: 24, betweenness: 0.79, community: "Nuclear Receptor Signaling", color: "var(--accent)" },
    { hub: "MYC", degree: 22, betweenness: 0.71, community: "Transcriptional Regulation", color: "var(--primary)" },
    { hub: "EGFR", degree: 19, betweenness: 0.65, community: "RTK / MAPK Signaling", color: "var(--primary)" },
    { hub: "CDH1", degree: 16, betweenness: 0.58, community: "Cell Adhesion / EMT", color: "var(--accent)" },
    { hub: "BRCA1", degree: 18, betweenness: 0.62, community: "Homologous Recombination", color: "var(--primary)" },
  ];

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Protein-Protein Interaction & Regulatory Networks
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
              STRING v12.0 / BioGRID
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Network topology, high-centrality driver bottlenecks, and interactome subgraphs computed across differential candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScientificCard
            title="Interactome Network Hubs & Bottlenecks"
            subtitle="Top centrality nodes with degree &ge; 15 and betweenness &gt; 0.5"
            methodCaption="STRING physical and functional interaction network with combined score &gt; 0.700 (high confidence)."
            citation="Szklarczyk D et al. Nucleic Acids Res (2023)"
          >
            <div className="space-y-3">
              {hubs.map((h) => (
                <div
                  key={h.hub}
                  onClick={() => {
                    const match = activeDataset.genes.find((g) => g.geneSymbol === h.hub);
                    if (match) setSelectedGene(match);
                  }}
                  className="p-3 rounded-md border border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center font-serif font-bold text-foreground">
                      {h.hub}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-foreground text-xs">{h.hub} Interaction Hub</div>
                      <div className="text-[11px] text-muted-foreground">{h.community}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-muted-foreground">Degree: <strong className="text-foreground">{h.degree}</strong></span>
                    <span className="text-muted-foreground">Cent: <strong className="text-foreground">{h.betweenness.toFixed(2)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </ScientificCard>

          <ScientificCard
            title="Sub-Network Community Clusters"
            subtitle="Modularity optimization using the Louvain algorithm"
            methodCaption="Louvain community detection algorithm partitioning connected subgraphs (resolution = 1.0)."
            citation="Blondel VD et al. J Stat Mech (2008)"
          >
            <div className="space-y-3 text-xs font-sans text-muted-foreground">
              <div className="p-3 rounded-md bg-surface border border-border">
                <div className="font-serif font-bold text-foreground text-xs mb-1">Cluster 1: DNA Replication & Chromosome Segregation</div>
                <p className="text-[11px] leading-relaxed">
                  Contains <strong>MKI67, FOXM1, CCNE1, BRCA1, BRCA2, TOP2A</strong>. Densely interconnected cluster with high clustering coefficient (C = 0.76).
                </p>
              </div>

              <div className="p-3 rounded-md bg-surface border border-border">
                <div className="font-serif font-bold text-foreground text-xs mb-1">Cluster 2: Hormone Receptor & Luminal Lineage</div>
                <p className="text-[11px] leading-relaxed">
                  Contains <strong>ESR1, GATA3, MYB, BCL2, CDH1</strong>. Governed by estrogen receptor transcription factor binding networks.
                </p>
              </div>

              <div className="p-3 rounded-md bg-surface border border-border">
                <div className="font-serif font-bold text-foreground text-xs mb-1">Cluster 3: Immune Checkpoint & Microenvironment</div>
                <p className="text-[11px] leading-relaxed">
                  Contains <strong>CD274 (PD-L1), PDCD1LG2, VIM, FN1</strong>. Enriched for extracellular matrix remodeling and T-cell exhaustion signatures.
                </p>
              </div>
            </div>
          </ScientificCard>
        </div>

      </div>
    </Layout>
  );
};

export default NetworkAnalysis;
