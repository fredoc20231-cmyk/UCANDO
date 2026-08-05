import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { IRBCharterDoc } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApiContractsModal } from "@/components/ApiContractsModal";
import { IRBCharterModal } from "@/components/IRBCharterModal";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  CheckCircle2,
  Users,
  Key,
  FileText,
  Shield,
  Layers,
  ArrowRight,
  FileCode,
  Plus
} from "lucide-react";

export default function Governance() {
  const [charter, setCharter] = useState<IRBCharterDoc | null>(null);
  const [charterModalOpen, setCharterModalOpen] = useState(false);
  const [apiContractsOpen, setApiContractsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/beacon/governance/charter")
      .then((res) => res.json())
      .then((data: IRBCharterDoc) => setCharter(data))
      .catch((err) => console.error("Failed to load IRB charter:", err));
  }, []);

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary dark:bg-brand-maroon text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Data Governance, IRB & Policy Center</h1>
                  <Badge variant="outline" className="border-slate-300 dark:border-sky-500/40 text-slate-700 dark:text-sky-300 bg-slate-100 dark:bg-sky-950/40 text-[10px]">
                    RBAC / ABAC Policy Engine
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Governed access control, Data Use Committee (DUC) workflows, and IRB protocol compliance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => setCharterModalOpen(true)}
                className="bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white font-semibold text-xs"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Inspect IRB Charter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setApiContractsOpen(true)}
                className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-primary dark:text-sky-400" /> API Contracts
              </Button>
            </div>
          </div>
        </div>

        {/* Governance Tabs */}
        <Tabs defaultValue="charter" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <TabsTrigger value="charter" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> IRB Governance Charter
            </TabsTrigger>
            <TabsTrigger value="rbac" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Key className="w-3.5 h-3.5 mr-1.5" /> Role & Access Matrix (RBAC/ABAC)
            </TabsTrigger>
            <TabsTrigger value="duc" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Users className="w-3.5 h-3.5 mr-1.5" /> Data Use Committee (DUC) Requests
            </TabsTrigger>
          </TabsList>

          {/* IRB Charter */}
          <TabsContent value="charter" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{charter?.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Approval: <code className="text-brand-maroon dark:text-sky-300 font-mono font-semibold">{charter?.irbApprovalNumber}</code> • Version {charter?.version} • Effective: {charter?.effectiveDate}
              </p>
            </div>

            <div className="space-y-4">
              {charter?.sections.map((sec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-brand-maroon dark:text-sky-400 font-mono uppercase">{sec.heading}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* RBAC Table */}
          <TabsContent value="rbac" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Role-Based & Attribute-Based Access Control Matrix</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Role / Persona</th>
                    <th className="py-2.5 px-3">Raw Identified Zone</th>
                    <th className="py-2.5 px-3">Curated Controlled Zone</th>
                    <th className="py-2.5 px-3">De-Identified Zone</th>
                    <th className="py-2.5 px-3">Public GA4GH Beacon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Attending Oncologist (Direct Care)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">FULL READ (PHI)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400">PERMIT</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400">PERMIT</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400">PERMIT</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Beacon Faculty Researcher</td>
                    <td className="py-3 px-3 text-red-600 dark:text-red-400 font-bold">DENIED</td>
                    <td className="py-3 px-3 text-amber-700 dark:text-amber-300">IRB DUC REQUIRED</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">PERMIT (SAFE HARBOR)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400">PERMIT</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">External Federated Partner</td>
                    <td className="py-3 px-3 text-red-600 dark:text-red-400 font-bold">DENIED</td>
                    <td className="py-3 px-3 text-red-600 dark:text-red-400 font-bold">DENIED</td>
                    <td className="py-3 px-3 text-red-600 dark:text-red-400 font-bold">DENIED</td>
                    <td className="py-3 px-3 text-sky-600 dark:text-sky-300 font-bold">PERMIT (AGGREGATE FREQ)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* DUC Workflow */}
          <TabsContent value="duc" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Use Committee (DUC) Active Access Requests</h3>
              <Button
                size="sm"
                onClick={() => toast.info("DUC Request Submission", { description: "Data Use Committee request form is available in institutional portal." })}
                className="bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Submit DUC Request
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">DUC-2024-881: Multiomics PARP Resistance Study</span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]">Approved</Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">PI: Dr. Elena Vance • Dataset: Controlled Omics (5,240 samples)</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("DTA Agreement Loaded", { description: "Data Transfer Agreement #DTA-2024-881 verified under IRB-DEMO-0000." })}
                  className="border-slate-300 dark:border-slate-800 text-xs"
                >
                  View DTA Agreement
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <IRBCharterModal open={charterModalOpen} onOpenChange={setCharterModalOpen} />
        <ApiContractsModal open={apiContractsOpen} onOpenChange={setApiContractsOpen} />
      </div>
    </Layout>
  );
}
