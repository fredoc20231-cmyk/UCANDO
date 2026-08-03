import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiContractSpec } from "@shared/api";
import { ShieldCheck, FileCode, Cpu, Image, CheckCircle2, Copy, Check } from "lucide-react";

interface ApiContractsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiContractsModal({ open, onOpenChange }: ApiContractsModalProps) {
  const [contracts, setContracts] = useState<Record<string, ApiContractSpec> | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (open && !contracts) {
      fetch("/api/beacon/contracts")
        .then((res) => res.json())
        .then((data) => {
          setContracts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load API contracts:", err);
          setLoading(false);
        });
    }
  }, [open, contracts]);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-950 text-slate-100 border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                Platform Integration API Contracts (G1 & G2)
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs mt-0.5">
                Exact OpenAPI 3.0 specs and Kafka event schemas for Multiomics and Digital Imaging platform teams.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading API Contract documentation...</div>
        ) : contracts ? (
          <Tabs defaultValue="multiomics" className="mt-2">
            <TabsList className="bg-slate-900 border border-slate-800 p-1">
              <TabsTrigger
                value="multiomics"
                className="flex items-center gap-2 text-xs data-[state=active]:bg-uchicago-maroon data-[state=active]:text-white"
              >
                <Cpu className="w-3.5 h-3.5" />
                G1. Multiomics Platform
              </TabsTrigger>
              <TabsTrigger
                value="imaging"
                className="flex items-center gap-2 text-xs data-[state=active]:bg-beacon-cyan data-[state=active]:text-slate-950 font-medium"
              >
                <Image className="w-3.5 h-3.5" />
                G2. Digital Imaging Platform
              </TabsTrigger>
            </TabsList>

            {Object.entries(contracts).map(([key, spec]) => (
              <TabsContent key={key} value={key} className="space-y-4 mt-4">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Platform: </span>
                    <span className="font-semibold text-white">{spec.platformName}</span>
                    <span className="mx-2 text-slate-600">|</span>
                    <span className="text-slate-400">Version: </span>
                    <span className="text-emerald-400 font-mono">{spec.version}</span>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-950/40">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Zero PHI Invariant Active
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                  <p className="font-medium text-amber-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authorization & Scope Constraint
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{spec.complianceNote}</p>
                </div>

                {/* Endpoints */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">REST OpenAPI Endpoints</h4>
                  {spec.endpoints.map((ep, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              ep.method === "POST"
                                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                                : "bg-sky-600 hover:bg-sky-600 text-white"
                            }
                          >
                            {ep.method}
                          </Badge>
                          <span className="font-mono text-emerald-300 font-medium">{ep.path}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[10px] text-slate-400 hover:text-white"
                          onClick={() => copyCode(ep.requestBodySample || ep.responseBodySample || ep.path, `ep-${key}-${idx}`)}
                        >
                          {copiedKey === `ep-${key}-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          Copy Schema
                        </Button>
                      </div>
                      <p className="text-slate-300 text-[11px]">{ep.summary}</p>
                      <p className="text-slate-400 text-[11px]">{ep.description}</p>
                      {ep.requestBodySample && (
                        <div className="mt-2">
                          <span className="text-[10px] text-slate-500 uppercase font-mono">Sample Request Payload:</span>
                          <pre className="mt-1 p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-sky-300 font-mono overflow-x-auto">
                            {ep.requestBodySample}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Event Schema */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Kafka Event Bus Schemas</h4>
                  {spec.eventSchema.map((ev, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-amber-300 font-semibold">{ev.eventName}</span>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                          Kafka Topic
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ev.description}</p>
                      <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto">
                        {ev.payloadSample}
                      </pre>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
