import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq, REFERENCE_DATASETS } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { Database, Check, ArrowRight, Dna, Layers, ShieldCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DatasetCatalog: React.FC = () => {
  const { activeDataset, selectDataset } = useRnaSeq();
  const navigate = useNavigate();

  const curatedCohorts = [
    ...REFERENCE_DATASETS,
    {
      id: "ds-nsclc-egfr",
      name: "NSCLC Adenocarcinoma EGFR-Mutant (N=16)",
      description: "Non-Small Cell Lung Cancer primary resections comparing EGFR Exon 19 del / L858R vs EGFR Wild-Type with Tyrosine Kinase Inhibitor response profiles.",
      organism: "Homo sapiens",
      referenceGenome: "GRCh38.p14 (GENCODE v44)",
      sampleCount: 16,
      geneCount: 21100,
      diseaseContext: "Lung Adenocarcinoma (ICD-O-3 8140/3)",
      primaryContrast: {
        groupA: "EGFR Mutant (TKI Res)",
        groupB: "EGFR Wild-Type",
        label: "EGFR-Mutant vs. EGFR Wild-Type"
      },
      samples: [],
      genes: [],
      pcaPoints: [],
      heatmapData: [],
      pathways: [],
      isoforms: [],
      deconvolution: []
    },
    {
      id: "ds-prad-castrate",
      name: "PRAD Castration-Resistant Cohort (N=14)",
      description: "Prostate Adenocarcinoma biopsies comparing Metastatic Castration-Resistant (mCRPC) vs Hormone-Sensitive primary adenocarcinoma.",
      organism: "Homo sapiens",
      referenceGenome: "GRCh38.p14 (GENCODE v44)",
      sampleCount: 14,
      geneCount: 20240,
      diseaseContext: "Prostate Adenocarcinoma (ICD-O-3 8140/3)",
      primaryContrast: {
        groupA: "mCRPC (Enzalutamide Res)",
        groupB: "Hormone Sensitive",
        label: "mCRPC vs. Hormone Sensitive"
      },
      samples: [],
      genes: [],
      pcaPoints: [],
      heatmapData: [],
      pathways: [],
      isoforms: [],
      deconvolution: []
    }
  ];

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Curated Scientific Dataset Catalog
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
              TCGA / CPTAC / Academic Commons
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Standardized, publication-grade bulk and single-cell RNA-seq reference cohorts aligned to GENCODE v44 and harmonized under Safe Harbor Tier-3 governance.
          </p>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curatedCohorts.map((ds) => {
            const isSelected = activeDataset.id === ds.id;
            return (
              <ScientificCard
                key={ds.id}
                title={ds.name}
                subtitle={ds.diseaseContext}
                methodCaption={`Organism: ${ds.organism} • Build: ${ds.referenceGenome}`}
                citation="NIH GDC / UC-CCC Data Commons"
                headerAction={
                  isSelected ? (
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active in Workspace</span>
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        selectDataset(ds.id);
                        toast.success(`Loaded cohort: ${ds.name}`);
                        navigate("/workspace");
                      }}
                      className="h-7 text-xs border-border"
                    >
                      <span>Load into Workspace</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )
                }
              >
                <div className="space-y-4 text-xs font-sans">
                  <p className="text-muted-foreground leading-relaxed">
                    {ds.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-md bg-surface border border-border text-center">
                    <div>
                      <div className="text-muted-foreground text-[10px] uppercase">Samples</div>
                      <div className="font-mono font-bold text-foreground text-sm mt-0.5">{ds.sampleCount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] uppercase">Genes Aligned</div>
                      <div className="font-mono font-bold text-foreground text-sm mt-0.5">{ds.geneCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] uppercase">Primary Contrast</div>
                      <div className="font-sans font-semibold text-primary text-xs mt-0.5 truncate">{ds.primaryContrast.groupA.split(" ")[0]}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-muted-foreground">Default Design: <code>~ batch + condition</code></span>
                    <button
                      onClick={() => {
                        selectDataset(ds.id);
                        navigate("/workspace");
                      }}
                      className="text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Open in Analysis Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </ScientificCard>
            );
          })}
        </div>

      </div>
    </Layout>
  );
};

export default DatasetCatalog;
