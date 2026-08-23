import React from "react";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { 
  Database, 
  Layers, 
  Binary, 
  Activity, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  FileCode,
  X,
  Sparkles,
  GitFork
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const AnalysisStatusPanel: React.FC = () => {
  const {
    activeDataset,
    padjThreshold,
    lfcThreshold,
    normalizationMethod,
    designFormula,
    batchCovariate,
    multiTestingCorrection,
    isStatusPanelOpen,
    setIsStatusPanelOpen,
    upregulatedCount,
    downregulatedCount,
    nonsignificantCount,
  } = useRnaSeq();

  if (!isStatusPanelOpen) return null;

  return (
    <div className="border-b border-border bg-surface px-4 py-2 text-xs font-sans">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Dataset & Contrast Summary */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">{activeDataset.name}</span>
            <span className="text-muted-foreground">({activeDataset.organism} • {activeDataset.referenceGenome})</span>
          </div>

          <div className="h-3.5 w-px bg-border hidden sm:block" />

          {/* Sample count & Genes */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="tabular-nums font-semibold text-foreground">{activeDataset.sampleCount}</span> samples
            <span>•</span>
            <span className="tabular-nums font-semibold text-foreground">{activeDataset.geneCount.toLocaleString()}</span> features
          </div>

          <div className="h-3.5 w-px bg-border hidden sm:block" />

          {/* Experimental Groups / Contrast */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Contrast:</span>
            <span className="font-medium text-foreground bg-card px-2 py-0.5 rounded border border-border">
              {activeDataset.primaryContrast.label}
            </span>
          </div>
        </div>

        {/* Center: Statistical & Model Parameters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model status badges with solid (observed) and dashed (model-derived) borders */}
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-card border border-border text-foreground"
            title="Observed Experimental Design"
          >
            <GitFork className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground font-mono">{designFormula}</span>
          </span>

          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-card border border-dashed border-accent text-foreground"
            title="Model-Derived / Normalized"
          >
            <Sliders className="w-3 h-3 text-accent" />
            <span>{normalizationMethod}</span>
          </span>

          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-card border border-border text-foreground"
          >
            <span>FDR &le; {padjThreshold}</span>
            <span className="text-muted-foreground">|</span>
            <span>|log₂FC| &ge; {lfcThreshold}</span>
          </span>

          {/* Quick counts */}
          <div className="flex items-center gap-1 ml-1">
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold tabular-nums border border-primary/20">
              +{upregulatedCount} Up
            </span>
            <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-semibold tabular-nums border border-accent/20">
              -{downregulatedCount} Down
            </span>
            <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground tabular-nums border border-border">
              {nonsignificantCount} NS
            </span>
          </div>
        </div>

        {/* Right: Provenance & Close */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Safe Harbor Tier-3</span>
            <span className="text-border">|</span>
            <Clock className="w-3 h-3" />
            <span className="tabular-nums">DESeq2 v1.44</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsStatusPanelOpen(false)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            title="Hide Status Banner"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
