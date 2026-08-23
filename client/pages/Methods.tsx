import React from "react";
import { Layout } from "@/components/Layout";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { BookOpen, ExternalLink, Code2, ShieldCheck } from "lucide-react";

export const Methods: React.FC = () => {
  return (
    <Layout>
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              Statistical Methodology & Computational Provenance
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-primary font-mono font-medium">
              Bioconductor 3.19 Reference
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Rigorous mathematical formulation, negative binomial generalized linear modeling, shrinkage algorithms, and peer-reviewed literature citations.
          </p>
        </div>

        {/* Section 1: Negative Binomial GLM Formulation */}
        <ScientificCard
          title="1. Negative Binomial Generalized Linear Model (DESeq2)"
          subtitle="Count distribution with mean-dispersion relationship"
          citation="Love MI, Huber W, Anders S. Moderated estimation of fold change and dispersion for RNA-seq data with DESeq2. Genome Biology (2014) 15:550."
        >
          <div className="space-y-4 text-xs font-sans text-muted-foreground leading-relaxed">
            <p>
              RNA-seq read counts <span className="font-mono text-foreground font-semibold">K<sub>ij</sub></span> for gene <span className="font-mono text-foreground font-semibold">i</span> in sample <span className="font-mono text-foreground font-semibold">j</span> are modeled using a negative binomial distribution with mean <span className="font-mono text-foreground font-semibold">&mu;<sub>ij</sub></span> and gene-specific dispersion parameter <span className="font-mono text-foreground font-semibold">&alpha;<sub>i</sub></span>:
            </p>

            <div className="p-4 rounded-md bg-surface border border-border font-mono text-xs text-foreground text-center">
              K<sub>ij</sub> ~ NB(mean = &mu;<sub>ij</sub>, dispersion = &alpha;<sub>i</sub>)
              <br />
              Var(K<sub>ij</sub>) = &mu;<sub>ij</sub> + &alpha;<sub>i</sub> &mu;<sub>ij</sub><sup>2</sup>
            </div>

            <p>
              The mean <span className="font-mono text-foreground font-semibold">&mu;<sub>ij</sub></span> is decomposed via logarithmic link function as the product of the sample-specific size factor <span className="font-mono text-foreground font-semibold">s<sub>j</sub></span> and normalized expression level <span className="font-mono text-foreground font-semibold">q<sub>ij</sub></span>:
            </p>

            <div className="p-3 rounded-md bg-surface border border-border font-mono text-xs text-foreground text-center">
              log₂(&mu;<sub>ij</sub>) = log₂(s<sub>j</sub>) + x<sub>j.</sub> &beta;<sub>i</sub>
            </div>

            <p>
              Where <span className="font-mono text-foreground font-semibold">x<sub>j.</sub></span> represents the experimental design vector (incorporating condition and batch covariates) and <span className="font-mono text-foreground font-semibold">&beta;<sub>i</sub></span> represents the log₂ fold-change coefficients.
            </p>
          </div>
        </ScientificCard>

        {/* Section 2: Dispersion Shrinkage & Hypothesis Testing */}
        <ScientificCard
          title="2. Empirical Bayes Dispersion Shrinkage & Wald Significance Testing"
          subtitle="Information sharing across genes to stabilize variance estimates"
          citation="Love MI et al. (2014) / Zhu A, Ibrahim JG, Love MI. Bioinformatics (2019) 35:2084–2092."
        >
          <div className="space-y-4 text-xs font-sans text-muted-foreground leading-relaxed">
            <p>
              Because sample sizes in clinical RNA-seq cohorts are typically constrained (<span className="font-mono">N &lt; 50</span> per group), gene-wise dispersion estimates <span className="font-mono text-foreground font-semibold">&alpha;<sub>i</sub></span> exhibit high sampling variability. DESeq2 stabilizes these estimates through empirical Bayes shrinkage toward a trend line fitted across all mean expression levels:
            </p>

            <div className="p-3 rounded-md bg-surface border border-border font-mono text-xs text-foreground text-center">
              log(&alpha;<sub>i</sub><sup>MAP</sup>) = argmax<sub>log(&alpha;)</sub> [ log L(K<sub>i</sub> | &alpha;) + log P(&alpha; | &alpha;<sub>trend</sub>(&mu;<sub>i</sub>), &sigma;<sup>2</sup>) ]
            </div>

            <p>
              Significance is evaluated using the Wald test statistic: <span className="font-mono text-foreground font-semibold">W<sub>i</sub> = &beta;<sub>i</sub> / SE(&beta;<sub>i</sub>)</span>, following a standard normal distribution under the null hypothesis <span className="font-mono">H₀: &beta;<sub>i</sub> = 0</span>. Multiple testing p-value adjustment is performed using the Benjamini-Hochberg procedure to constrain False Discovery Rate (FDR).
            </p>
          </div>
        </ScientificCard>

        {/* Section 3: Software Versions & Dependencies */}
        <ScientificCard
          title="3. Software Environment & Containerized Dependencies"
          subtitle="Deterministic biostatistical toolchain"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3 rounded-md bg-surface border border-border">
              <div className="font-semibold text-foreground">DESeq2</div>
              <div className="text-[11px] font-mono text-primary mt-0.5">v1.44.0 (Bioconductor 3.19)</div>
              <div className="text-[11px] text-muted-foreground mt-1">GLM count modeling & Wald testing</div>
            </div>

            <div className="p-3 rounded-md bg-surface border border-border">
              <div className="font-semibold text-foreground">fgsea / clusterProfiler</div>
              <div className="text-[11px] font-mono text-accent mt-0.5">v1.30.0 / v4.12.0</div>
              <div className="text-[11px] text-muted-foreground mt-1">GSEA and Hypergeometric ORA</div>
            </div>

            <div className="p-3 rounded-md bg-surface border border-border">
              <div className="font-semibold text-foreground">ComBat-seq (sva)</div>
              <div className="text-[11px] font-mono text-foreground mt-0.5">v3.52.0</div>
              <div className="text-[11px] text-muted-foreground mt-1">Integer-count batch adjustment</div>
            </div>

            <div className="p-3 rounded-md bg-surface border border-border">
              <div className="font-semibold text-foreground">CIBERSORTx / MuSiC</div>
              <div className="text-[11px] font-mono text-primary mt-0.5">v1.2.0</div>
              <div className="text-[11px] text-muted-foreground mt-1">Single-cell digital cytometry</div>
            </div>

            <div className="p-3 rounded-md bg-surface border border-border">
              <div className="font-semibold text-foreground">glmnet</div>
              <div className="text-[11px] font-mono text-accent mt-0.5">v4.1-8</div>
              <div className="text-[11px] text-muted-foreground mt-1">LASSO Cox proportional hazards</div>
            </div>

            <div className="p-3 rounded-md bg-surface border border-border">
              <div className="font-semibold text-foreground">Reference Genome</div>
              <div className="text-[11px] font-mono text-foreground mt-0.5">GRCh38.p14 (GENCODE v44)</div>
              <div className="text-[11px] text-muted-foreground mt-1">Ensembl transcript annotation</div>
            </div>
          </div>
        </ScientificCard>

      </div>
    </Layout>
  );
};

export default Methods;
