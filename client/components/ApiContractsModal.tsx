import React, { useState, useEffect } from "react";
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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-card text-foreground border-border shadow-elevated">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10 text-accent border border-accent/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-serif text-foreground">
                Platform Integration API Contracts (G1 & G2)
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs mt-0.5">
                Exact OpenAPI 3.0 specs and Kafka event schemas for Multiomics and Digital Imaging platform teams.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading || !contracts ? (
          <div className="p-8 text-center text-muted-foreground text-sm font-sans">
            Loading API contracts specification...
          </div>
        ) : (
          <Tabs defaultValue="multiomics" className="space-y-4 pt-2">
            <TabsList className="bg-muted p-1 border border-border">
              <TabsTrigger
                value="multiomics"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs font-semibold"
              >
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-primary" />
                G1: Multiomics Spec
              </TabsTrigger>
              <TabsTrigger
                value="imaging"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs font-semibold"
              >
                <Image className="w-3.5 h-3.5 mr-1.5 text-accent" />
                G2: Digital Imaging Spec
              </TabsTrigger>
            </TabsList>

            {Object.entries(contracts).map(([key, spec]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-border text-xs">
                  <div>
                    <h3 className="font-bold text-foreground font-serif">{spec.platformName}</h3>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{spec.complianceNote}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                      {spec.version}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
                      {spec.protocol}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                      Endpoints & Operations
                    </span>
                  </div>

                  <div className="space-y-2">
                    {spec.endpoints.map((ep, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-surface border border-border flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 font-mono">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                ep.method === "POST"
                                  ? "bg-accent/15 text-accent border border-accent/30"
                                  : "bg-primary/15 text-primary border border-primary/30"
                              }`}
                            >
                              {ep.method}
                            </span>
                            <span className="font-semibold text-foreground">{ep.path}</span>
                          </div>
                          <p className="font-sans text-muted-foreground text-[11px]">{ep.summary}</p>
                        </div>
                        <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono">
                          {spec.authMethod}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                      Event Schema Payload
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCode(JSON.stringify(spec.eventSchema, null, 2), key)}
                      className="h-7 text-xs border-border hover:bg-muted text-foreground"
                    >
                      {copiedKey === key ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-primary" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1 text-muted-foreground" /> Copy Schema
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-3.5 rounded-lg bg-surface border border-border font-mono text-[11px] text-foreground overflow-x-auto max-h-56">
                    <pre>{JSON.stringify(spec.eventSchema, null, 2)}</pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ApiContractsModal;
