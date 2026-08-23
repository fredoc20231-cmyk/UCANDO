import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Share2,
  Dna,
  SlidersHorizontal,
  Compass
} from "lucide-react";

interface HubAndSpokeVisualizerProps {
  spokes: SpokeConnection[];
  dataZones: HubDataZone[];
}

export function HubAndSpokeVisualizer({ spokes, dataZones }: HubAndSpokeVisualizerProps) {
  const navigate = useNavigate();
  const [selectedSpoke, setSelectedSpoke] = useState<SpokeConnection | null>(null);
  const [activeZone, setActiveZone] = useState<string>("curated");

  const getSpokeIcon = (id: string) => {
    switch (id) {
      case "ehr": return Server;
      case "omics": return Dna;
      case "imaging": return ImageIcon;
      case "lims": return FlaskConical;
      case "registry": return FileCheck;
      case "workspaces": return Terminal;
      case "beacon": return Share2;
      default: return Database;
    }
  };

  const getSpokeRoutes = (id: string) => {
    switch (id) {
      case "ehr":
        return {
          primaryPath: "/global-integrations",
          primaryLabel: "Open Epic EHR & Integrations Hub",
          secondaryPath: "/patient-360?id=UC-CCC-89421",
          secondaryLabel: "Launch Patient 360 Orbit View",
          description: "Live connection to Epic EHR HL7 feeds, FHIR R4 endpoints, and SMART on FHIR OAuth2 sandboxes."
        };
      case "omics":
        return {
          primaryPath: "/omics-view",
          primaryLabel: "Launch Omics View (9 Modalities)",
          secondaryPath: "/workspace",
          secondaryLabel: "Open RNA-seq Analytics Workspace",
          description: "Deep multi-omics platform unifying RNA-seq, WES/WGS variants, OncoPrint matrix, and PhoenixMO workspaces."
        };
      case "imaging":
        return {
          primaryPath: "/imaging-hub",
          primaryLabel: "Launch OHIF DICOM Radiology & Pathology WSI",
          secondaryPath: "/patient-360?id=UC-CCC-89421",
          secondaryLabel: "View Patient Imaging Studies",
          description: "Zero-footprint web viewer with PET/CT multi-planar reconstruction, radiomics, and digital pathology."
        };
      case "workspaces":
        return {
          primaryPath: "/workspace",
          primaryLabel: "Open RNA-seq Analysis Workspace",
          secondaryPath: "/expression/differential",
          secondaryLabel: "Differential Expression Studio",
          description: "Isolated analytical environment for publication-grade DESeq2 GLM modeling and exploratory analysis."
        };
      case "beacon":
        return {
          primaryPath: "/global-integrations",
          primaryLabel: "Open GA4GH Beacon & NCI GDC Discovery",
          secondaryPath: "/cohort-builder",
          secondaryLabel: "Visual Cohort Builder",
          description: "Federated genomic and phenotypic query node conforming to GA4GH Beacon v2 standards."
        };
      case "lims":
        return {
          primaryPath: "/cohort-builder",
          primaryLabel: "Query Biospecimen Availability",
          secondaryPath: "/admin-census",
          secondaryLabel: "Inspect Data Commons Census",
          description: "Tracking FFPE tissue blocks, flash-frozen cores, buffy coats, and longitudinal biobank aliquots."
        };
      case "registry":
        return {
          primaryPath: "/cohort-builder",
          primaryLabel: "Launch Visual Cohort Query Builder",
          secondaryPath: "/admin-census",
          secondaryLabel: "Admin Census & Governance",
          description: "NAACCR-compliant tumor registry data feeds with automated stage and histological classification."
        };
      default:
        return {
          primaryPath: "/workspace",
          primaryLabel: "Launch Workspace",
          description: "Governed analytical interface for authorized translational researchers."
        };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Diagram Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border shadow-subtle">
        <div>
          <h3 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Target Architecture: Central Integration Hub & Federated Spokes
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Single governed point of truth connecting Epic EHR, multi-omics, digital imaging, LIMS biobanks, tumor registry, and research workspaces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/10 text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5 mr-1 text-accent animate-pulse" /> Live Event Bus Active (1,845 TPS)
          </Badge>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="relative rounded-2xl bg-card border border-border p-6 overflow-hidden shadow-subtle">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.06)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Spokes Column (Ingestion & Platform Spokes: EHR, Multiomics, Imaging) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-accent" /> Ingestion & Platform Spokes
            </div>
            
            {spokes.slice(0, 3).map((spoke) => {
              const Icon = getSpokeIcon(spoke.id);
              const routes = getSpokeRoutes(spoke.id);
              return (
                <div
                  key={spoke.id}
                  className="rounded-xl bg-surface border border-border hover:border-primary/50 transition-all shadow-subtle group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-accent" />
                  
                  <div 
                    onClick={() => setSelectedSpoke(spoke)}
                    className="p-3.5 cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-card border border-border text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate font-serif">
                            {spoke.name}
                          </p>
                          <span className="text-[10px] text-accent font-mono font-bold shrink-0">
                            {spoke.latencyMs}ms
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-mono">
                          {spoke.integrationMode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Link Action Toolbar */}
                  <div className="px-3 py-1.5 bg-card/70 border-t border-border flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedSpoke(spoke)}
                      className="text-muted-foreground hover:text-foreground text-[10px] font-medium"
                    >
                      Inspect Specs
                    </button>
                    <Link
                      to={routes.primaryPath}
                      className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      Open Page <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Hub Core (UCANDO Data Commons Engine & Data Zones) */}
          <div className="lg:col-span-6 relative p-6 rounded-2xl bg-surface border-2 border-primary/40 shadow-elevated text-center space-y-4">
            {/* Hub Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-subtle">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>UCANDO Hub — Single Governed Point of Truth</span>
            </div>

            <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Every patient consented at UC-CCC flows into UCANDO. Ingested under OMOP CDM v5.4, tokenized with zero-PHI leakage, and dynamically governed by Open Policy Agent (OPA) policy rules.
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
                        ? "bg-card border-primary shadow-subtle"
                        : "bg-card/60 border-border hover:border-border/80 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground text-[11px] font-serif">{zone.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground bg-surface">
                        {zone.count.toLocaleString()} pts
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">{zone.description}</p>
                    <div className="mt-2 text-[10px] text-accent font-mono font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {zone.securityLevel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hub Bottom Governance Pipeline */}
            <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span className="flex items-center gap-1 text-foreground font-semibold">
                <RefreshCw className="w-3 h-3 text-accent animate-spin" /> Kafka Event Bus
              </span>
              <span className="text-accent font-bold">OPA Consent Engine Active</span>
              <span className="text-primary font-bold">0 PHI in Telemetry</span>
            </div>
          </div>

          {/* Right Spokes Column (Research & External Spokes: LIMS, Registry, Workspaces, Beacon) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5 text-primary" /> Research & External Spokes
            </div>
            
            {spokes.slice(3).map((spoke) => {
              const Icon = getSpokeIcon(spoke.id);
              const routes = getSpokeRoutes(spoke.id);
              return (
                <div
                  key={spoke.id}
                  className="rounded-xl bg-surface border border-border hover:border-primary/50 transition-all shadow-subtle group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
                  
                  <div 
                    onClick={() => setSelectedSpoke(spoke)}
                    className="p-3.5 cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-card border border-border text-accent group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate font-serif">
                            {spoke.name}
                          </p>
                          <span className="text-[10px] text-primary font-mono font-bold shrink-0">
                            {spoke.latencyMs}ms
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-mono">
                          {spoke.integrationMode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Link Action Toolbar */}
                  <div className="px-3 py-1.5 bg-card/70 border-t border-border flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedSpoke(spoke)}
                      className="text-muted-foreground hover:text-foreground text-[10px] font-medium"
                    >
                      Inspect Specs
                    </button>
                    <Link
                      to={routes.primaryPath}
                      className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      Open Page <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Spoke Deep-Inspection & Launch Modal */}
      {selectedSpoke && (
        <Dialog open={!!selectedSpoke} onOpenChange={(open) => !open && setSelectedSpoke(null)}>
          <DialogContent className="max-w-xl bg-card text-foreground border-border shadow-elevated">
            <DialogHeader>
              <DialogTitle className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Spoke Integration Specs: {selectedSpoke.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs font-sans">
                {selectedSpoke.subtitle}
              </DialogDescription>
            </DialogHeader>

            {(() => {
              const routes = getSpokeRoutes(selectedSpoke.id);
              return (
                <div className="space-y-4 text-xs mt-2 font-sans">
                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Integration Mode:</span>
                      <span className="font-semibold text-foreground font-mono">{selectedSpoke.integrationMode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Protocol Specification:</span>
                      <span className="font-mono text-accent font-bold">{selectedSpoke.protocol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Events Handled Today:</span>
                      <span className="font-mono text-foreground font-bold">{selectedSpoke.eventsCountToday.toLocaleString()} events</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status & Latency:</span>
                      <Badge className="bg-accent/15 text-accent border-accent/30 font-mono font-bold">
                        Connected ({selectedSpoke.latencyMs}ms)
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-border">
                    <p className="font-semibold text-foreground mb-1 font-serif">Functional Scope & Description:</p>
                    <p className="text-muted-foreground leading-relaxed">{selectedSpoke.description}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-foreground text-[11px] flex items-center justify-between font-medium">
                    <span>HIPAA BAA & Zero-PHI Scoped Contract Verified</span>
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>

                  {/* Action Direct Links */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <Button
                      onClick={() => {
                        setSelectedSpoke(null);
                        navigate(routes.primaryPath);
                      }}
                      className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 shadow-subtle gap-1.5"
                    >
                      <span>{routes.primaryLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>

                    {routes.secondaryPath && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedSpoke(null);
                          navigate(routes.secondaryPath!);
                        }}
                        className="w-full sm:w-auto border-border bg-surface hover:bg-muted text-foreground font-semibold text-xs h-9 px-3"
                      >
                        {routes.secondaryLabel}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default HubAndSpokeVisualizer;
