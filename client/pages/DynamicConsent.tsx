import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Lock,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  History,
  FileText,
  UserCheck,
  Code,
  Copy,
  Check,
  Info
} from "lucide-react";

interface ConsentState {
  researchUse: boolean;
  recontactGranted: boolean;
  biospecimensUse: boolean;
  aiModelTraining: boolean;
  commercialSharing: boolean;
}

interface WormReceipt {
  receiptId: string;
  timestamp: string;
  sha256Signature: string;
  storeLocation: string;
  downstreamPropagatedSpokes: string[];
}

const OPA_CONSENT_REGO_POLICY = `package ucando.consent

default allow = false

# Allow internal academic research if patient consent is active
allow {
    input.action == "DATA_READ"
    input.purpose == "academic_research"
    input.patient_consent.researchUse == true
}

# Allow AI model training only if explicit permission is granted
allow {
    input.action == "TRAIN_AI_MODEL"
    input.patient_consent.aiModelTraining == true
    input.request.is_deidentified == true
}

# Restrict commercial partner export unless commercialSharing is permitted
allow {
    input.action == "PARTNER_EXPORT"
    input.patient_consent.commercialSharing == true
    input.request.duc_approval == true
}

# Immediate deny rule for withdrawn consent
deny {
    input.patient_consent.researchUse == false
}`;

export default function DynamicConsent() {
  const [patientId] = useState("UC-CCC-89421");
  const [permissions, setPermissions] = useState<ConsentState>({
    researchUse: true,
    recontactGranted: true,
    biospecimensUse: true,
    aiModelTraining: true,
    commercialSharing: false
  });

  const [saving, setSaving] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<WormReceipt | null>({
    receiptId: "worm_receipt_99210",
    timestamp: new Date().toISOString(),
    sha256Signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    storeLocation: "AWS S3 Object Lock (WORM) Compliance Bucket",
    downstreamPropagatedSpokes: ["EHR Spoke", "Multiomics Lakehouse", "DICOM Store", "GA4GH Beacon Node"]
  });

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"patient" | "admin" | "ledger">("patient");

  useEffect(() => {
    fetch(`/api/beacon/patient/360?id=${patientId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.consent?.permissions) {
          setPermissions(data.consent.permissions);
        }
      })
      .catch((err) => console.error("Failed to load initial consent:", err));
  }, [patientId]);

  const handleToggle = (key: keyof ConsentState) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveConsent = () => {
    setSaving(true);
    fetch("/api/beacon/consent/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, permissions })
    })
      .then((r) => r.json())
      .then((data) => {
        setSaving(false);
        if (data.wormAuditReceipt) {
          setLastReceipt(data.wormAuditReceipt);
        }
      })
      .catch((err) => {
        console.error("Failed to update consent:", err);
        setSaving(false);
      });
  };

  const handleWithdrawAll = () => {
    const withdrawn: ConsentState = {
      researchUse: false,
      recontactGranted: false,
      biospecimensUse: false,
      aiModelTraining: false,
      commercialSharing: false
    };
    setPermissions(withdrawn);
    setWithdrawModalOpen(false);
    handleSaveConsent();
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 shadow-md">
                <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dynamic Consent Console</h1>
                  <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-[10px]">
                    OPA Policy Engine
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Patient-centric consent control for The University of Chicago Comprehensive Cancer Center Data Commons Operations (UCANDO). Patient ID:{" "}
                  <code className="bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded text-brand-maroon dark:text-sky-300 font-mono font-semibold">{patientId}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setWithdrawModalOpen(true)}
                className="border-red-300 dark:border-red-800/80 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-800 dark:text-red-200 text-xs font-semibold"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-red-600 dark:text-red-400" /> Withdraw All Consent
              </Button>
              <Button
                onClick={handleSaveConsent}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 dark:bg-brand-maroon dark:hover:bg-brand-maroon/90 text-white font-semibold text-xs shadow-md"
              >
                {saving ? (
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                {saving ? "Propagating OPA Policies..." : "Save & Propagate Policies"}
              </Button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Withdraw-Anytime Guarantee: </strong>
                Consent withdrawal propagates across all 6 downstream spokes within &lt; 24 hours.
              </span>
            </div>
            <Badge className="bg-slate-100 dark:bg-sky-950 text-slate-800 dark:text-sky-300 border-slate-300 dark:border-sky-800 text-[10px]">
              IRB Protocol IRB-DEMO-0000
            </Badge>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <Tabs defaultValue="patient" onValueChange={(val) => setActiveTab(val as any)} className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <TabsTrigger value="patient" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <UserCheck className="w-3.5 h-3.5 mr-1.5" /> Patient Plain-Language Wizard
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Code className="w-3.5 h-3.5 mr-1.5" /> OPA Rego Rule Inspector
            </TabsTrigger>
            <TabsTrigger value="ledger" className="text-xs data-[state=active]:bg-primary dark:data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <History className="w-3.5 h-3.5 mr-1.5" /> WORM Cryptographic Ledger
            </TabsTrigger>
          </TabsList>

          {/* Patient Plain-Language Wizard */}
          <TabsContent value="patient" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Permission Switches Main Box */}
              <div className="lg:col-span-2 space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Granular Research Permissions
                </h3>

                {/* Switch 1: General Research */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">1. Academic Research & Discovery</span>
                      <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]">Active</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Allows UC-CCC Comprehensive Cancer Center oncologists to analyze your de-identified clinical records to advance cancer treatments.
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      IRB Clause §3.1: Academic non-profit observational studies.
                    </span>
                  </div>
                  <Switch
                    checked={permissions.researchUse}
                    onCheckedChange={() => handleToggle("researchUse")}
                    className="data-[state=checked]:bg-emerald-600 mt-1"
                  />
                </div>

                {/* Switch 2: Recontact */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">2. Trial Matching & Recontact Permission</span>
                      {permissions.recontactGranted ? (
                        <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]">Granted</Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px]">Opted Out</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Allows your care team to contact you if a new clinical trial or targeted therapy matches your specific tumor mutation.
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      IRB Clause §4.2: Incidental findings notification protocol.
                    </span>
                  </div>
                  <Switch
                    checked={permissions.recontactGranted}
                    onCheckedChange={() => handleToggle("recontactGranted")}
                    className="data-[state=checked]:bg-emerald-600 mt-1"
                  />
                </div>

                {/* Switch 3: Biospecimens */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">3. Biospecimen Biorepository Analysis</span>
                      <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px]">LIMS Linked</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Allows leftover surgical tissue blocks or blood samples to be used for next-generation genomic sequencing.
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      LIMS Barcode: FFPE-UCH-2024-8841 (Stored at -80°C)
                    </span>
                  </div>
                  <Switch
                    checked={permissions.biospecimensUse}
                    onCheckedChange={() => handleToggle("biospecimensUse")}
                    className="data-[state=checked]:bg-emerald-600 mt-1"
                  />
                </div>

                {/* Switch 4: AI Model Training */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">4. AI & Machine Learning Model Training</span>
                      {permissions.aiModelTraining ? (
                        <Badge className="bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800 text-[10px]">AI Permitted</Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px]">Disabled</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Allows de-identified radiology scans (CT/MRI) and pathology digital slides to train diagnostic AI models.
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      PHI-Free Guaranteed: Zero images leave HIPAA enclave un-scrubbed.
                    </span>
                  </div>
                  <Switch
                    checked={permissions.aiModelTraining}
                    onCheckedChange={() => handleToggle("aiModelTraining")}
                    className="data-[state=checked]:bg-emerald-600 mt-1"
                  />
                </div>

                {/* Switch 5: Commercial Sharing */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">5. Commercial & Industry Partner Sharing</span>
                      {permissions.commercialSharing ? (
                        <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[10px]">Partner Shared</Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px]">Restricted</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Allows anonymized statistical findings to be shared with pharmaceutical partners developing targeted oncology drugs.
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Requires Data Transfer Agreement (DTA) & DUC Approval.
                    </span>
                  </div>
                  <Switch
                    checked={permissions.commercialSharing}
                    onCheckedChange={() => handleToggle("commercialSharing")}
                    className="data-[state=checked]:bg-emerald-600 mt-1"
                  />
                </div>
              </div>

              {/* Status Summary & Receipt Panel */}
              <div className="space-y-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <FileCheck className="w-4 h-4 text-brand-maroon dark:text-sky-400" />
                  Active Enforcement Summary
                </h3>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">OPA Policy State:</span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-mono">
                      PERMIT_ACTIVE
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Downstream Spokes:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">6 Connected</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Last Policy Audit:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200 font-semibold">Just now</span>
                  </div>
                </div>

                {/* Latest WORM Audit Receipt */}
                {lastReceipt && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> WORM Cryptographic Receipt
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <p><span className="text-slate-500">ID:</span> {lastReceipt.receiptId}</p>
                      <p className="truncate"><span className="text-slate-500">Hash:</span> {lastReceipt.sha256Signature}</p>
                      <p><span className="text-slate-500">Vault:</span> {lastReceipt.storeLocation}</p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Propagated Spokes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lastReceipt.downstreamPropagatedSpokes.map((spk) => (
                          <Badge key={spk} variant="outline" className="border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[9px]">
                            {spk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* OPA Rego Rule Inspector */}
          <TabsContent value="admin" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-brand-maroon dark:text-sky-400" /> Dynamic Open Policy Agent (OPA) Rego Rule
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time evaluation logic compiled and distributed to sidecar proxies on every API request.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyText(OPA_CONSENT_REGO_POLICY)}
                className="border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "Copied" : "Copy Rego Rule"}
              </Button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-sky-300 overflow-auto h-80">
{OPA_CONSENT_REGO_POLICY}
            </pre>
          </TabsContent>

          {/* WORM Cryptographic Ledger */}
          <TabsContent value="ledger" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Immutable Consent Transaction History (WORM Audit Store)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2 px-3">Receipt ID</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">SHA-256 Signature</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  <tr className="hover:bg-slate-950/60">
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{lastReceipt?.receiptId || "worm_receipt_99210"}</td>
                    <td className="py-2.5 px-3">{lastReceipt?.timestamp || new Date().toISOString()}</td>
                    <td className="py-2.5 px-3 truncate max-w-xs">{lastReceipt?.sha256Signature}</td>
                    <td className="py-2.5 px-3">
                      <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">
                        WORM Validated
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Withdrawal Modal */}
        <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
          <DialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" /> Confirm Full Consent Withdrawal
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                This action will immediately disable all research permissions for Patient {patientId}.
              </DialogDescription>
            </DialogHeader>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              Withdrawing consent will trigger an immediate OPA policy update across all 6 connected spokes. Downstream research workspaces will be purged within 24 hours per IRB-DEMO-0000.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setWithdrawModalOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawAll}
                className="bg-red-700 hover:bg-red-600 text-white font-semibold text-xs"
              >
                Withdraw All Permissions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
