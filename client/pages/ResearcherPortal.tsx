import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Terminal,
  Cpu,
  Layers,
  ExternalLink,
  Play,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Server
} from "lucide-react";

export default function ResearcherPortal() {
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);

  const handleLaunch = (workspaceName: string) => {
    setActiveWorkspace(workspaceName);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-300 border border-purple-700/50 shadow-md">
                <Terminal className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Researcher Cloud Sandbox Portal</h1>
                  <Badge variant="outline" className="border-purple-500/40 text-purple-300 bg-purple-950/40 text-[10px]">
                    FedRAMP High Secure Enclave
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Launch JupyterLab, RStudio, or Nextflow pipelines pre-loaded with de-identified Commons datasets.
                </p>
              </div>
            </div>

            <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-xs py-1 px-3">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active Quota: 64 vCPU / 256 GB RAM
            </Badge>
          </div>
        </div>

        {/* Workspace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workspace 1: JupyterLab */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
                <Terminal className="w-5 h-5" />
              </div>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">Python 3.11 / PyTorch</Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">JupyterLab Deep Learning Sandbox</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pre-installed PyTorch, Scanpy single-cell RNA-seq, and MONAI imaging AI frameworks.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <p><span className="text-slate-500">Compute:</span> 8 vCPU • 32GB RAM • 1x NVIDIA A10G</p>
              <p><span className="text-slate-500">Mount:</span> /data/commons/brca_omics_v4</p>
            </div>

            <Button
              onClick={() => handleLaunch("JupyterLab")}
              className="w-full bg-brand-maroon hover:bg-red-800 text-white font-semibold text-xs"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {activeWorkspace === "JupyterLab" ? "Workspace Running (Click to Re-open)" : "Launch JupyterLab Environment"}
            </Button>
          </div>

          {/* Workspace 2: RStudio */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sky-400">
                <Code className="w-5 h-5" />
              </div>
              <Badge className="bg-sky-950 text-sky-300 border-sky-800 text-[10px]">R 4.3 / Bioconductor</Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">RStudio Biostatistics Environment</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pre-configured for survival analysis, DESeq2 differential expression, and ggplot2 visualizations.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <p><span className="text-slate-500">Compute:</span> 16 vCPU • 64GB RAM</p>
              <p><span className="text-slate-500">Mount:</span> /data/commons/survival_cohorts</p>
            </div>

            <Button
              onClick={() => handleLaunch("RStudio")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {activeWorkspace === "RStudio" ? "Workspace Running" : "Launch RStudio Server"}
            </Button>
          </div>

          {/* Workspace 3: Nextflow */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-400">
                <Server className="w-5 h-5" />
              </div>
              <Badge className="bg-purple-950 text-purple-300 border-purple-800 text-[10px]">Nextflow / nf-core</Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Nextflow Genomic Pipeline Runner</h3>
              <p className="text-xs text-slate-400 mt-1">
                Automated alignment, variant calling, and quality control workflow orchestrator.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <p><span className="text-slate-500">Compute:</span> Batch HPC Worker Cluster</p>
              <p><span className="text-slate-500">Mount:</span> /data/commons/raw_fastq_vault</p>
            </div>

            <Button
              onClick={() => handleLaunch("Nextflow")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {activeWorkspace === "Nextflow" ? "Pipeline Active" : "Launch Nextflow Cluster"}
            </Button>
          </div>
        </div>

        {/* Running Workspace Frame Info */}
        {activeWorkspace && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active Session: {activeWorkspace} Workspace Connected
              </span>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">
                HTTPS Secure WebSocket Active
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Interactive cloud container launched inside isolated Docker subnet. All notebook outputs are dynamically checked against differential privacy export policies before downloading.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
