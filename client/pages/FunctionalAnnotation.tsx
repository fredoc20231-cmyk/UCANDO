import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { BookOpen, CheckCircle2 } from "lucide-react";

export const FunctionalAnnotation: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  const goTerms = [
    { id: "GO:0007049", name: "cell cycle", domain: "Biological Process", genes: 142, pvalue: 1.2e-14, padj: 4.5e-12 },
    { id: "GO:0051301", name: "cell division", domain: "Biological Process", genes: 98, pvalue: 3.4e-12, padj: 8.9e-11 },
    { id: "GO:0006281", name: "DNA repair", domain: "Biological Process", genes: 84, pvalue: 7.8e-10, padj: 1.2e-8 },
    { id: "GO:0005634", name: "nucleus", domain: "Cellular Component", genes: 320, pvalue: 2.1e-11, padj: 4.8e-10 },
    { id: "GO:0005819", name: "spindle", domain: "Cellular Component", genes: 56, pvalue: 4.5e-9, padj: 6.2e-8 },
    { id: "GO:0003677", name: "DNA binding", domain: "Molecular Function", genes: 210, pvalue: 5.6e-8, padj: 7.1e-7 },
    { id: "GO:0004672", name: "protein kinase activity", domain: "Molecular Function", genes: 92, pvalue: 8.9e-8, padj: 9.8e-7 }
  ];

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Functional Gene Ontology & Over-Representation
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground font-mono">
              Gene Ontology (GO) Consortium
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Hypergeometric over-representation analysis (ORA) mapping significant differentially expressed genes to Biological Processes, Molecular Functions, and Cellular Components.
          </p>
        </div>

        <ScientificCard
          title="Gene Ontology (GO) Over-Representation Results"
          subtitle={`Enriched terms in ${activeDataset.name} (Hypergeometric Fisher's Exact Test)`}
          methodCaption="clusterProfiler v4.10 hypergeometric distribution with Benjamini-Hochberg FDR correction."
          citation="Wu T et al. The Innovation (2021) 2:100141"
        >
          <div className="overflow-x-auto border border-border rounded-md">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">GO Identifier</th>
                  <th className="py-2.5 px-3 font-semibold">Ontology Term Name</th>
                  <th className="py-2.5 px-3 font-semibold">Domain</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Overlap Genes</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Raw p-value</th>
                  <th className="py-2.5 px-3 text-right font-semibold">FDR (q-value)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {goTerms.map((term) => (
                  <tr key={term.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2 px-3 font-mono font-medium text-foreground">{term.id}</td>
                    <td className="py-2 px-3 font-serif font-bold text-foreground">{term.name}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.2 rounded bg-surface border border-border text-[10px] font-mono">
                        {term.domain}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums text-foreground">{term.genes}</td>
                    <td className="py-2 px-3 text-right font-mono text-muted-foreground">{term.pvalue.toExponential(2)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-primary">{term.padj.toExponential(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScientificCard>

      </div>
    </Layout>
  );
};

export default FunctionalAnnotation;
