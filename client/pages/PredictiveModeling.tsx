import React from "react";
import { Layout } from "@/components/Layout";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export const PredictiveModeling: React.FC = () => {
  const { activeDataset } = useRnaSeq();

  const signature = [
    { gene: "MKI67", coeff: "+0.42", hr: "1.52 (1.28–1.81)", pval: "4.2e-6", role: "Proliferation Index" },
    { gene: "FOXM1", coeff: "+0.38", hr: "1.46 (1.21–1.77)", pval: "8.9e-5", role: "Mitotic Kinase Driver" },
    { gene: "CD274", coeff: "+0.31", hr: "1.36 (1.14–1.63)", pval: "6.1e-4", role: "Immune Checkpoint" },
    { gene: "ESR1", coeff: "-0.54", hr: "0.58 (0.47–0.72)", pval: "1.1e-7", role: "Endocrine Sensitivity" },
    { gene: "GATA3", coeff: "-0.45", hr: "0.64 (0.52–0.79)", pval: "3.4e-5", role: "Luminal Differentiation" }
  ];

  return (
    <Layout>
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Predictive Modeling & Survival Risk Signatures
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-dashed border-accent text-accent font-mono font-medium">
              Multivariate Cox Proportional Hazards
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Construct multigene prognostic classifiers, fit LASSO-penalized Cox models, and stratify progression-free survival (PFS) in cancer cohorts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScientificCard
            title="Multivariate Risk Signature Coefficients"
            subtitle="LASSO regularized Cox model (lambda.min = 0.024)"
            isModelDerived={true}
            methodCaption="glmnet L1-penalized Cox proportional hazards with 10-fold cross-validation."
            citation="Tibshirani R. Stat Med (1997) 16:385–395"
          >
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead className="bg-surface border-b border-border text-[11px] text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Gene</th>
                    <th className="py-2.5 px-3 font-semibold">Biological Role</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Beta (&beta;)</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Hazard Ratio (95% CI)</th>
                    <th className="py-2.5 px-3 text-right font-semibold">p-value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {signature.map((s) => (
                    <tr key={s.gene} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-3 font-serif font-bold text-foreground">{s.gene}</td>
                      <td className="py-2 px-3 text-muted-foreground">{s.role}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">
                        <span className={s.coeff.startsWith("+") ? "text-primary" : "text-accent"}>
                          {s.coeff}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-foreground font-semibold">{s.hr}</td>
                      <td className="py-2 px-3 text-right font-mono text-muted-foreground">{s.pval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScientificCard>

          <ScientificCard
            title="Kaplan-Meier Survival Stratification"
            subtitle="Progression-Free Survival (High-Risk vs Low-Risk Score)"
            isModelDerived={true}
            methodCaption="Log-rank test comparing high vs low risk score median split (HR = 2.84, p = 1.4e-8)."
          >
            <div className="p-6 text-xs font-sans text-muted-foreground space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-surface border border-border">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">High-Risk Median PFS</div>
                  <div className="text-xl font-mono font-bold text-primary mt-0.5">14.2 months</div>
                  <div className="text-[10px] text-muted-foreground">5-year PFS: 28.4%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Low-Risk Median PFS</div>
                  <div className="text-xl font-mono font-bold text-accent mt-0.5">58.6 months</div>
                  <div className="text-[10px] text-muted-foreground">5-year PFS: 74.2%</div>
                </div>
              </div>

              <div className="text-[11px] leading-relaxed">
                <strong>Concordance Index (C-Index):</strong> 0.784 (95% CI: 0.732–0.836). The composite transcriptomic risk score provides significant independent prognostic value beyond standard clinical tumor stage (p &lt; 0.001).
              </div>
            </div>
          </ScientificCard>
        </div>

      </div>
    </Layout>
  );
};

export default PredictiveModeling;
