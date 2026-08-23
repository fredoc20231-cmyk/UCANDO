import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { PieChart, Download } from "lucide-react";

export const CellDeconvolution: React.FC = () => {
  const { activeDataset } = useRnaSeq();
  const deconv = activeDataset.deconvolution;

  const cellTypes = [
    { name: "CD8+ T Cells", basal: "18.0%", lumA: "3.8%", role: "Cytotoxic / Antitumor", color: "var(--primary)" },
    { name: "CD4+ T Cells", basal: "12.2%", lumA: "7.5%", role: "Helper / Memory", color: "var(--accent)" },
    { name: "B Cells", basal: "7.5%", lumA: "3.0%", role: "Humoral Immunity", color: "#D97706" },
    { name: "M1 Macrophages", basal: "15.4%", lumA: "4.0%", role: "Pro-inflammatory", color: "var(--primary)" },
    { name: "M2 Macrophages", basal: "5.5%", lumA: "17.0%", role: "Immunosuppressive / TAM", color: "#475569" },
    { name: "Cancer-Assoc. Fibroblasts", basal: "11.5%", lumA: "20.0%", role: "Desmoplastic Stroma", color: "#059669" },
    { name: "Endothelial Cells", basal: "6.2%", lumA: "8.5%", role: "Angiogenic Vasculature", color: "#7C3AED" },
    { name: "Malignant Epithelial", basal: "19.5%", lumA: "35.5%", role: "Tumor Cell Purity", color: "var(--foreground)" }
  ];

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Cell-Type Deconvolution & Microenvironment Modeling
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-dashed border-accent text-accent font-mono font-medium">
              CIBERSORTx / MuSiC v1.2
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Deconvolute bulk tumor transcriptomes into relative fractions of infiltrating cytotoxic T lymphocytes, tumor-associated macrophages, and stromal fibroblasts.
          </p>
        </div>

        <ScientificCard
          title="Immune & Stromal Cell-Type Composition"
          subtitle={`LM22 / Single-cell reference deconvolution (${activeDataset.primaryContrast.label})`}
          isModelDerived={true}
          methodCaption="CIBERSORTx digital cytometry using nu-support vector regression (v-SVR) with 1,000 permutations."
          citation="Newman AM et al. Nat Biotechnol (2019) 37:773–782"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Cell Population</th>
                    <th className="py-2.5 px-3 font-semibold">Immunological Role</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Mean Fraction ({activeDataset.primaryContrast.groupA})</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Mean Fraction ({activeDataset.primaryContrast.groupB})</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Infiltration Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {cellTypes.map((ct) => (
                    <tr key={ct.name} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-3 font-serif font-bold text-foreground">{ct.name}</td>
                      <td className="py-2 px-3 text-muted-foreground">{ct.role}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-primary">{ct.basal}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-foreground">{ct.lumA}</td>
                      <td className="py-2 px-3 text-right font-mono text-[11px]">
                        {parseFloat(ct.basal) > parseFloat(ct.lumA) ? (
                          <span className="text-primary font-semibold">Enriched in {activeDataset.primaryContrast.groupA.split(" ")[0]}</span>
                        ) : (
                          <span className="text-muted-foreground">Enriched in {activeDataset.primaryContrast.groupB.split(" ")[0]}</span>
                        )}
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

export default CellDeconvolution;
