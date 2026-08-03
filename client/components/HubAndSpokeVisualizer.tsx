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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            Target Architecture: Central Integration Hub & Spokes
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Single governed point of truth connecting EHR, multiomics, digital imaging, LIMS, tumor registry, and research workspaces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-950/30 text-xs">
            <Activity className="w-3 h-3 mr-1 animate-pulse" /> Live Event Bus Active (1,845 TPS)
          </Badge>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 overflow-hidden">
        {/* Visual Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Spokes Column (EHR, Multiomics, Imaging) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Ingestion & Platform Spokes
            </div>
            {spokes.slice(0, 3).map((spoke) => {
              const Icon = getSpokeIcon(spoke.id);
              return (
                <button
                  key={spoke.id}
                  onClick={() => setSelectedSpoke(spoke)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 transition-all shadow-md group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500 rounded-r-xl" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-sky-400 group-hover:bg-uchicago-maroon group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-white truncate">{spoke.name}</p>
                        <span className="text-[10px] text-emerald-400 font-mono">{spoke.latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{spoke.integrationMode}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center Hub Core (Data Zones & Governance) */}
          <div className="lg:col-span-6 relative p-6 rounded-2xl bg-slate-900/90 border-2 border-red-900/60 shadow-2xl shadow-red-950/30 text-center space-y-5">
            {/* Hub Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-uchicago-maroon text-white text-xs font-bold shadow-lg shadow-red-900/40 border border-red-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>BEACON HUB — Single Governed Point of Truth</span>
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Every patient consented at UChicago flows into Beacon. Encrypted at rest (AES-256), governed by Open Policy Agent (OPA) consent enforcement.
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
                        ? "bg-slate-950 border-red-500 shadow-md shadow-red-950/50"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100 text-[11px]">{zone.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-300">
                        {zone.count.toLocaleString()} pts
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">{zone.description}</p>
                    <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {zone.securityLevel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hub Bottom Governance Pipeline */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" /> Kafka Event Bus
              </span>
              <span className="text-emerald-400">OPA Policy Engine Active</span>
              <span className="text-sky-400">0 PHI in Logs</span>
            </div>
          </div>

          {/* Right Spokes Column (LIMS, Registry, Workspaces, GA4GH) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" /> Research & External Spokes
            </div>
            {spokes.slice(3).map((spoke) => {
              const Icon = getSpokeIcon(spoke.id);
              return (
                <button
                  key={spoke.id}
                  onClick={() => setSelectedSpoke(spoke)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition-all shadow-md group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-sky-500 rounded-r-xl" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-white truncate">{spoke.name}</p>
                        <span className="text-[10px] text-sky-400 font-mono">{spoke.latencyMs}ms</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{spoke.integrationMode}</p>
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
          <DialogContent className="max-w-xl bg-slate-950 text-slate-100 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-sky-400" />
                Spoke Integration Specs: {selectedSpoke.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                {selectedSpoke.subtitle}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs mt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Integration Mode:</span>
                  <span className="font-semibold text-white">{selectedSpoke.integrationMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Protocol Specification:</span>
                  <span className="font-mono text-emerald-400">{selectedSpoke.protocol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Events Handled Today:</span>
                  <span className="font-mono text-sky-300">{selectedSpoke.eventsCountToday.toLocaleString()} events</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status & Latency:</span>
                  <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
                    Connected ({selectedSpoke.latencyMs}ms)
                  </Badge>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <p className="font-semibold text-slate-200 mb-1">Functional Responsibility:</p>
                <p className="text-slate-400 leading-relaxed">{selectedSpoke.description}</p>
              </div>

              <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 text-sky-200 text-[11px] flex items-center justify-between">
                <span>HIPAA BAA & Zero-PHI Contract Verified</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
