import React from "react";
import { Layout } from "@/components/Layout";
import { ScientificCard } from "@/components/scientific/ScientificCard";
import { ShieldCheck, Database, Lock, Dna, Server, CheckCircle2 } from "lucide-react";

export const About: React.FC = () => {
  return (
    <Layout>
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif font-semibold text-foreground tracking-tight">
              About the Platform & Data Governance
            </h1>
            <span className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-accent font-mono font-medium">
              UC-CCC Scientific Commons
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Architectural principles, HIPAA Safe Harbor de-identification standards, IRB compliance, and institutional security controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScientificCard
            title="Institutional Mission & Core Infrastructure"
            subtitle="University of Chicago Comprehensive Cancer Center (UC-CCC)"
          >
            <div className="space-y-3 text-xs font-sans text-muted-foreground leading-relaxed">
              <p>
                The <strong>UC-CCC Transcriptomics Scientific Platform</strong> serves clinicians, translational researchers, and bioinformaticians with publication-grade RNA-seq analytics, high-dimensional visualization, and rigorous statistical pipelines.
              </p>
              <p>
                Engineered with academic rigor, the platform avoids generic SaaS design conventions in favor of dense tabular numerals, colorblind-safe palettes, reproducible mathematical parameters, and cryptographic provenance ledgers.
              </p>
            </div>
          </ScientificCard>

          <ScientificCard
            title="HIPAA Safe Harbor & Data Privacy"
            subtitle="Tier-3 Protected Genomic Computing Environment"
          >
            <div className="space-y-3 text-xs font-sans text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p>
                  <strong>De-identification:</strong> All patient identifiers are scrubbed and replaced with deterministic cryptographic pseudonyms (<code>UC-CCC-*</code>).
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p>
                  <strong>Role-Based Access:</strong> Data access is constrained by IRB charter protocols, data use agreements, and Open Policy Agent (OPA) validation.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Database className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p>
                  <strong>Private Ingestion:</strong> User-uploaded count matrices remain isolated to the local browser session and encrypted runtime container.
                </p>
              </div>
            </div>
          </ScientificCard>
        </div>

      </div>
    </Layout>
  );
};

export default About;
