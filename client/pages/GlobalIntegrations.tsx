import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { SmartLaunchModal } from "@/components/SmartLaunchModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Database,
  ExternalLink,
  Zap,
  ShieldAlert,
  Info,
  Layers,
  Cpu,
  CheckCircle2,
  Lock,
  Search,
  BookOpen,
  Loader2
} from "lucide-react";

interface IntegrationCard {
  id: string;
  name: string;
  category: "EHR / Clinical" | "Genomics & Molecular" | "Public Registry";
  description: string;
  targetUrl: string;
  status: "Live SMART Sandbox" | "Connected" | "Available" | "Roadmap — pending Epic approval" | "Membership Required";
  isCosmos?: boolean;
  isSmartSandbox?: boolean;
}

const INTEGRATIONS: IntegrationCard[] = [
  {
    id: "epic-ehr",
    name: "Epic EHR",
    category: "EHR / Clinical",
    description: "Live connection to SMART Health IT's public test sandbox — not a production Epic instance. This demonstrates the same protocol used for real EHR integration.",
    targetUrl: "https://launch.smarthealthit.org/v/r4/auth/authorize",
    status: "Live SMART Sandbox",
    isSmartSandbox: true
  },
  {
    id: "epic-cosmos",
    name: "Epic Cosmos",
    category: "EHR / Clinical",
    description: "De-identified multi-health-system research dataset covering 220M+ patient records.",
    targetUrl: "https://cosmos.epic.com/request-access/",
    status: "Roadmap — pending Epic approval",
    isCosmos: true
  },
  {
    id: "epic-genomics",
    name: "Epic Genomics",
    category: "EHR / Clinical",
    description: "Genomic result integration, variant interpretation, and discrete FHIR diagnostic report mapping within the EHR.",
    targetUrl: "https://genomics.epic.com/",
    status: "Roadmap — pending Epic approval"
  },
  {
    id: "epic-mychart",
    name: "Epic MyChart",
    category: "EHR / Clinical",
    description: "Patient-facing portal integration for enrollment, secure messaging, and patient-reported outcomes.",
    targetUrl: "https://mychart.epic.com/",
    status: "Roadmap — pending Epic approval"
  },
  {
    id: "clinvar",
    name: "ClinVar (NCBI)",
    category: "Genomics & Molecular",
    description: "Public archive of genotype-phenotype relationships with expert pathogenicity curation.",
    targetUrl: "https://www.ncbi.nlm.nih.gov/clinvar/",
    status: "Connected"
  },
  {
    id: "cbioportal",
    name: "cBioPortal",
    category: "Genomics & Molecular",
    description: "Public cancer genomics visualization portal for multi-study cohort mutation heatmaps and survival analysis.",
    targetUrl: "https://www.cbioportal.org/",
    status: "Connected"
  },
  {
    id: "gdc-portal",
    name: "GDC Data Portal",
    category: "Genomics & Molecular",
    description: "NCI Genomic Data Commons for harmonized TCGA, TARGET, and CPTAC open-access datasets.",
    targetUrl: "https://portal.gdc.cancer.gov/",
    status: "Connected"
  },
  {
    id: "clinical-trials",
    name: "ClinicalTrials.gov",
    category: "Public Registry",
    description: "Public clinical trial registry and results database managed by the U.S. National Library of Medicine.",
    targetUrl: "https://clinicaltrials.gov/",
    status: "Connected"
  }
];

export default function GlobalIntegrations() {
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    name: string;
    url: string;
  }>({
    isOpen: false,
    name: "",
    url: ""
  });

  const [gdcPrimarySite, setGdcPrimarySite] = useState("Breast");
  const [gdcResult, setGdcResult] = useState<any>(null);
  const [gdcLoading, setGdcLoading] = useState(false);
  const [gdcError, setGdcError] = useState<string | null>(null);

  const handleGdcQuery = () => {
    setGdcLoading(true);
    setGdcError(null);
    setGdcResult(null);
    fetch(`/api/beacon/external-cohort/gdc?primarySite=${encodeURIComponent(gdcPrimarySite)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "GDC query failed");
        setGdcResult(data);
      })
      .catch((err) => setGdcError(err.message || "Could not reach the GDC API"))
      .finally(() => setGdcLoading(false));
  };

  const handleLaunch = (item: IntegrationCard) => {
    if (item.id === "epic-ehr") {
      const redirectUri = encodeURIComponent(`${window.location.origin}/fhir-callback`);
      const sandboxAuthUrl = `https://launch.smarthealthit.org/v/r4/auth/authorize?response_type=code&client_id=my_web_app&redirect_uri=${redirectUri}&scope=patient%2F%2A.read+launch%2Fpatient+openid+profile&state=smart_launch_ucando&aud=https%3A%2F%2Flaunch.smarthealthit.org%2Fv%2Fr4%2Ffhir`;
      window.location.href = sandboxAuthUrl;
      return;
    }
    if (item.isCosmos) {
      window.open(item.targetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setActiveModal({
      isOpen: true,
      name: item.name,
      url: item.targetUrl
    });
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md">
                <Globe className="w-6 h-6 text-brand-maroon" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Global EHR & Public Genomics Integrations Hub</h1>
                  <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 text-[10px]">
                    SMART-on-FHIR & REST Interop
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct federated integration launchpad for health system EHRs, national clinical trial registries, and public multiomics knowledgebases.
                </p>
              </div>
            </div>

            <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs py-1 px-3">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 7 Federation Endpoints Configured
            </Badge>
          </div>

          {/* X-Frame-Options Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-brand-maroon shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Third-Party Frame Policy Notice: </span>
              Frames may not load for platforms that enforce strict security headers (<code className="font-mono bg-slate-200 dark:bg-slate-900 px-1 rounded">X-Frame-Options</code> / <code className="font-mono bg-slate-200 dark:bg-slate-900 px-1 rounded">CSP</code>); use the "New Tab" option inside the SMART launch window in that case.
            </div>
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between hover:border-brand-maroon/50 transition-all shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px]">
                    {item.category}
                  </Badge>
                  <Badge
                    className={
                      item.status === "Live SMART Sandbox" || item.status === "Connected"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]"
                        : item.status === "Available"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 text-[10px]"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[10px]"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-maroon transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {item.isCosmos ? (
                  <Button
                    onClick={() => handleLaunch(item)}
                    variant="outline"
                    className="w-full border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 text-xs h-9 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Learn About Cosmos Access
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleLaunch(item)}
                    className="w-full bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white font-semibold text-xs h-9 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" /> Launch {item.name}
                  </Button>
                )}

                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                  {item.isSmartSandbox
                    ? "Live connection to SMART Health IT's public test sandbox — not a production Epic instance. This demonstrates the same protocol used for real EHR integration."
                    : "Roadmap integration — pending Epic vendor approval and institutional credentialing."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* External Data Commons Cohort Discovery -- live GDC integration */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-primary dark:text-sky-400" />
                External Cohort Discovery: NCI Genomic Data Commons
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Query pattern inspired by MINDS (Rasool Lab, Moffitt Cancer Center) --
                queries the real, public GDC API on demand rather than storing case data locally.
              </p>
            </div>
            <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]">
              Live External API
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Input
              value={gdcPrimarySite}
              onChange={(e) => setGdcPrimarySite(e.target.value)}
              placeholder="Primary site, e.g. Breast, Lung, Ovary"
              className="max-w-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200"
            />
            <Button
              onClick={handleGdcQuery}
              disabled={gdcLoading}
              className="bg-primary dark:bg-brand-maroon text-white text-xs h-9"
            >
              {gdcLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Search className="w-3.5 h-3.5 mr-1.5" />}
              Query Live GDC Cohort
            </Button>
          </div>

          {gdcError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              {gdcError}
            </div>
          )}

          {gdcResult && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{gdcResult.totalCases?.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">matching cases in GDC</div>
                </div>
                {gdcResult.cached && (
                  <Badge variant="outline" className="text-[10px] border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    Cached result
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Sample matching cases (metadata only)</p>
                {(gdcResult.sampleCases || []).slice(0, 5).map((c: any) => (
                  <div key={c.caseId} className="text-xs font-mono text-slate-700 dark:text-slate-300 flex justify-between border-b border-slate-100 dark:border-slate-800 py-1">
                    <span>{c.submitterId}</span>
                    <span className="text-slate-500 dark:text-slate-400">{c.project} • {c.diseaseType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SMART Launch Modal */}
      <SmartLaunchModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ isOpen: false, name: "", url: "" })}
        platformName={activeModal.name}
        targetUrl={activeModal.url}
      />
    </Layout>
  );
}
