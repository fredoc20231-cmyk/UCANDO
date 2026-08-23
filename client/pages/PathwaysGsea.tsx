import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { EnrichmentBarPlot } from "@/components/scientific/EnrichmentBarPlot";
import { Network, Activity, BarChart2, Layers, Dna, Sliders, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const PathwaysGsea: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-tight flex items-center gap-2">
                <Network className="w-6 h-6 text-primary" />
                <span>Gene Set Enrichment Analysis (GSEA) Studio</span>
              </h1>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary font-mono font-medium">
                MSigDB v2023.2.Hs
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Unbiased enrichment across MSigDB Hallmarks (50), Reactome canonical pathways, and KEGG metabolic routes ranked by DESeq2 Wald statistic.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/workspace">
              <Button size="sm" variant="outline" className="h-8 text-xs border-border gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>RNA-seq Workspace</span>
              </Button>
            </Link>
            <Link to="/omics-view">
              <Button size="sm" variant="outline" className="h-8 text-xs border-border gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span>Omics View</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Database Modality Summary Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary font-serif">MSigDB Hallmark (H)</span>
              <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] font-mono">50 Gene Sets</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Coherently expressed cancer hallmarks: EMT, E2F, G2M checkpoint, DNA repair, and estrogen response.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-accent font-serif">Reactome Pathways (C2:CP)</span>
              <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-mono">Canonical Biology</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Peer-reviewed human biological pathways: homologous recombination, cell cycle checkpoints, and PD-1 signaling.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground font-serif">KEGG Pathways (C2:KEGG)</span>
              <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">Metabolic & Disease</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Kyoto Encyclopedia of Genes and Genomes: cellular processes, immune regulation, and steroid metabolism.
            </p>
          </div>
        </div>

        {/* Main GSEA Visual Analytics Component */}
        <EnrichmentBarPlot />

      </div>
    </Layout>
  );
};

export default PathwaysGsea;
