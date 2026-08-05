import { useState } from "react";
import { SpokeConnection, HubDataZone } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Activity,
  ShieldCheck,
  Zap,
  Server,
  Database,
  Lock,
  Globe,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Image as ImageIcon,
  FlaskConical,
  FileCheck,
  Terminal,
  Share2
} from "lucide-react";

interface HubAndSpokeVisualizerProps {
  spokes: SpokeConnection[];
  dataZones: HubDataZone[];
}

export function HubAndSpokeVisualizer({ spokes, dataZones }: HubAndSpokeVisualizerProps) {
  const [selectedSpoke, setSelectedSpoke] = useState<SpokeConnection | null>(null);
  const [activeZone, setActiveZone] = useState<string>("curated");

  const getSpokeIcon = (id: string) => {
    switch (id) {
      case "ehr": return Server;
      case "omics": return Cpu;
      case "imaging": return ImageIcon;
      case "lims": return FlaskConical;
      case "registry": return FileCheck;
      case "workspaces": return Terminal;
      case "beacon": return Share2;
      default: return Database;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Diagram Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-maroon" />
            Target Architecture: Central Integration Hub & Spokes
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Single governed point of truth connecting EHR, multiomics, digital imaging, LIMS, tumor registry, and research workspaces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-xs">
            <Activity className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400 animate-pulse" /> Live Event Bus Active (1,845 TPS)
          </Badge>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-6 overflow-hidden shadow-md">
        {/* Visual Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.12)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Spokes Column (EHR, Multiomics, Imaging) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Ingestion & Platform Spokes
            </div>
            {spokes.slice(0, 3).map((spoke) => {
              const Icon = getSpokeIcon(spoke.id);
              return (
                <button
                  key={spoke.id}
                  onClick={() => setSelectedSpoke(spoke)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-brand-maroon/50 transition-all shadow-sm group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 rounded-r-xl" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-sky-400 group-hover:bg-primary dark:group-hover:bg-brand-maroon group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">{spoke.name}</p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">{spoke.latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{spoke.integrationMode}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center Hub Core (Data Zones & Governance) */}
          <div className="lg:col-span-6 relative p-6 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-brand-maroon/60 shadow-xl text-center space-y-5">
            {/* Hub Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary dark:bg-brand-maroon text-white text-xs font-bold shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>UCANDO / UC-CCC HUB — Single Governed Point of Truth</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              Every patient consented at Beacon flows into Beacon. Encrypted at rest (AES-256), governed by Open Policy Agent (OPA) consent enforcement.
            </p>

            {/* Data Zones Grid Inside Central Hub */}
            <div className="grid grid-cols-2 gap-3 text-left">
              {dataZones.map((zone) => {
                const isSelected = activeZone === zone.code;
                return (
                  <button
                    key={zone.code}
                    onClick={() => setActiveZone(zone.code)}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? "bg-red-50/80 dark:bg-slate-950 border-brand-maroon shadow-md"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">{zone.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
                        {zone.count.toLocaleString()} pts
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">{zone.description}</p>
                    <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {zone.securityLevel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hub Bottom Governance Pipeline */}
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-300 font-semibold">
                <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" /> Kafka Event Bus
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">OPA Policy Engine Active</span>
              <span className="text-slate-700 dark:text-sky-400 font-bold">0 PHI in Logs</span>
            </div>
          </div>

          {/* Right Spokes Column (LIMS, Registry, Workspaces, GA4GH) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-maroon" /> Research & External Spokes
            </div>
            {spokes.slice(3).map((spoke) => {
              const Icon = getSpokeIcon(spoke.id);
              return (
                <button
                  key={spoke.id}
                  onClick={() => setSelectedSpoke(spoke)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-brand-maroon/50 transition-all shadow-sm group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-brand-maroon rounded-r-xl" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-emerald-400 group-hover:bg-primary dark:group-hover:bg-brand-maroon group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">{spoke.name}</p>
                        <span className="text-[10px] text-brand-maroon dark:text-rose-300 font-mono font-bold">{spoke.latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{spoke.integrationMode}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spoke Inspection Modal */}
      {selectedSpoke && (
        <Dialog open={!!selectedSpoke} onOpenChange={(open) => !open && setSelectedSpoke(null)}>
          <DialogContent className="max-w-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-brand-maroon" />
                Spoke Integration Specs: {selectedSpoke.name}
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
                {selectedSpoke.subtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs mt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Integration Mode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedSpoke.integrationMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Protocol Specification:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{selectedSpoke.protocol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Events Handled Today:</span>
                  <span className="font-mono text-slate-800 dark:text-sky-300 font-semibold">{selectedSpoke.eventsCountToday.toLocaleString()} events</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Status & Latency:</span>
                  <Badge className="bg-emerald-100 dark:bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30">
                    Connected ({selectedSpoke.latencyMs}ms)
                  </Badge>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-200 mb-1">Functional Responsibility:</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedSpoke.description}</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center justify-between font-medium">
                <span>HIPAA BAA & Zero-PHI Contract Verified</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
