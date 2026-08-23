import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { useBackgroundTheme } from "@/context/BackgroundContext";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { AnalysisStatusPanel } from "./AnalysisStatusPanel";
import {
  Dna,
  Database,
  SlidersHorizontal,
  Layers,
  Network,
  PieChart,
  Cpu,
  FileSpreadsheet,
  BookOpen,
  Info,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Download,
  HelpCircle,
  ShieldCheck,
  Activity,
  Sliders,
  Sparkles,
  Search,
  Check,
  CheckCircle2,
  ExternalLink,
  Table,
  LineChart,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bgTheme, setBgTheme } = useBackgroundTheme();
  const { isAuthenticated, user, switchUser, logout } = useAuth();
  const { 
    activeDataset, 
    allDatasets, 
    selectDataset, 
    isStatusPanelOpen, 
    toggleStatusPanel,
    upregulatedCount,
    downregulatedCount
  } = useRnaSeq();

  const [helpOpen, setHelpOpen] = useState(false);

  // Active path checking helper
  const isActive = (prefix: string) => {
    if (prefix === "/workspace" || prefix === "/") {
      return location.pathname === "/" || location.pathname === "/workspace";
    }
    return location.pathname.startsWith(prefix);
  };

  const handleExportSession = () => {
    const sessionData = {
      dataset: activeDataset.name,
      sampleCount: activeDataset.sampleCount,
      geneCount: activeDataset.geneCount,
      exportedAt: new Date().toISOString(),
      contrast: activeDataset.primaryContrast,
      genes: activeDataset.genes
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDataset.id}_analysis_snapshot.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Analysis session snapshot exported successfully as JSON.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-accent/20">
      {/* Top Synthetic / Non-Clinical Example Data Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-1 text-center text-xs font-sans text-primary flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>
          <strong>Research Analytics Platform:</strong> De-identified transcriptomic data for hypothesis generation and translational oncology. Not for direct diagnostic use.
        </span>
      </div>

      {/* Authenticated Persistent Application Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-subtle">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Brand / Platform Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/workspace" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-base shadow-subtle group-hover:opacity-95 transition-opacity">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-semibold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                    UC-CCC Transcriptomics
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border border-border bg-surface text-muted-foreground">
                    RNA-seq v3.2
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground hidden sm:block">Academic Analytics Commons</p>
              </div>
            </Link>
          </div>

          {/* Primary Scientific Module Tabs & Dropdowns */}
          <nav className="hidden md:flex items-center gap-1 font-sans text-xs">
            
            {/* Workspace (Top-level) */}
            <Link
              to="/workspace"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                isActive("/workspace")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              Workspace
            </Link>

            {/* Data Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    isActive("/data")
                      ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Data</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Data Management
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/data/upload")} className="cursor-pointer">
                  <Download className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Upload Counts & Matrix</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/data/samples")} className="cursor-pointer">
                  <Table className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Sample Metadata ({activeDataset.sampleCount})</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/data/qc")} className="cursor-pointer">
                  <Activity className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Quality Control & Library Sizes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/data/catalog")} className="cursor-pointer">
                  <Database className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <span>Dataset Catalog</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Expression Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    isActive("/expression")
                      ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Expression</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Transcript Quantification
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/expression/differential")} className="cursor-pointer">
                  <LineChart className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Differential Expression (DESeq2)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/expression/normalization")} className="cursor-pointer">
                  <Sliders className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Normalization & Transformation</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/expression/genes")} className="cursor-pointer">
                  <Dna className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Gene-Level Results ({activeDataset.geneCount.toLocaleString()})</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/expression/isoforms")} className="cursor-pointer">
                  <Layers className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Isoform & Splicing Analysis</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pathways Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    isActive("/pathways")
                      ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Pathways</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Functional Enrichment
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/pathways/gsea")} className="cursor-pointer">
                  <BarChart2 className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Gene Set Enrichment (GSEA)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pathways/activity")} className="cursor-pointer">
                  <Activity className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Pathway Activity Scores</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pathways/annotation")} className="cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <span>Functional Annotation (GO / KEGG)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pathways/network")} className="cursor-pointer">
                  <Network className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Protein-Protein Networks</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Visualization Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    isActive("/visualization")
                      ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Visualization</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Scientific Plot Suite
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/visualization/volcano")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <span>Volcano Plot (Interactive)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/visualization/pca")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-accent mr-2" />
                  <span>PCA / UMAP Projection</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/visualization/heatmap")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <span>Expression Heatmap (Clustered)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/visualization/distributions")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground mr-2" />
                  <span>Violin / Box Distributions</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Advanced Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    isActive("/advanced")
                      ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Advanced</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Translational Algorithms
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/advanced/batch")} className="cursor-pointer">
                  <Sliders className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Batch Correction (ComBat-seq)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/advanced/deconvolution")} className="cursor-pointer">
                  <PieChart className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Cell-Type Deconvolution</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/advanced/predictive")} className="cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Predictive Survival / Response</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/advanced/multiomics")} className="cursor-pointer">
                  <Layers className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <span>Multi-omics Integration</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reports */}
            <Link
              to="/reports"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                isActive("/reports")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              Reports
            </Link>

            {/* Methods */}
            <Link
              to="/methods"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                isActive("/methods")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              Methods
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                isActive("/about")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Utility Actions (Right Aligned) */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Status Panel Trigger / Dataset switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs bg-background border-border text-foreground hover:bg-muted gap-1.5 hidden sm:flex"
                >
                  <Database className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold max-w-[130px] truncate">{activeDataset.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Switch Active Cohort
                </DropdownMenuLabel>
                {allDatasets.map((ds) => (
                  <DropdownMenuItem
                    key={ds.id}
                    onClick={() => selectDataset(ds.id)}
                    className="flex items-center justify-between cursor-pointer py-2"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{ds.name}</div>
                      <div className="text-[11px] text-muted-foreground">{ds.diseaseContext}</div>
                    </div>
                    {ds.id === activeDataset.id && <Check className="w-4 h-4 text-primary ml-2 shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Summary Banner Toggle */}
            <Button
              variant={isStatusPanelOpen ? "secondary" : "outline"}
              size="sm"
              onClick={toggleStatusPanel}
              className="h-8 px-2.5 text-xs gap-1 hidden lg:flex border-border"
              title="Toggle Analysis Status Summary"
            >
              <Activity className="w-3.5 h-3.5 text-accent" />
              <span>Status</span>
            </Button>

            {/* Export Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSession}
              className="h-8 px-2.5 text-xs gap-1 border-border text-foreground hover:bg-muted hidden sm:flex"
              title="Export Full Session JSON"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export</span>
            </Button>

            {/* Light / Dark Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-md bg-surface border border-border">
              <button
                onClick={() => setBgTheme("day")}
                title="Academic Light Mode (Warm White)"
                className={`p-1.5 rounded transition-all ${
                  bgTheme === "day"
                    ? "bg-card text-primary font-semibold shadow-subtle"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBgTheme("night")}
                title="Dark Mode"
                className={`p-1.5 rounded transition-all ${
                  bgTheme === "night"
                    ? "bg-card text-accent font-semibold shadow-subtle"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Account / Persona Switcher */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 pl-2 pr-2.5 text-xs bg-background border-border text-foreground hover:bg-muted gap-2"
                  >
                    <div className="w-5 h-5 rounded bg-primary text-primary-foreground font-serif font-bold text-[11px] flex items-center justify-center">
                      {user?.avatarInitial || "U"}
                    </div>
                    <span className="max-w-[90px] truncate hidden sm:inline font-medium">{user?.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 font-sans text-xs">
                  <div className="p-2 border-b border-border">
                    <div className="font-semibold text-foreground">{user?.name}</div>
                    <div className="text-[11px] text-muted-foreground">{user?.title}</div>
                    <div className="text-[10px] text-primary font-mono mt-0.5">{user?.role}</div>
                  </div>
                  <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
                    Switch Authenticated Persona
                  </DropdownMenuLabel>
                  {DEMO_USERS.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => switchUser(u)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-[10px] text-muted-foreground">{u.role}</div>
                      </div>
                      {user?.id === u.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-2" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="h-8 px-3 text-xs bg-primary text-primary-foreground font-medium shadow-subtle"
              >
                Sign In
              </Button>
            )}

          </div>

        </div>
      </header>

      {/* Analysis Status Banner (always visible or toggleable) */}
      <AnalysisStatusPanel />

      {/* Main Scientific Content Viewport */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Academic Institutional Footer */}
      <footer className="border-t border-border bg-card/60 px-6 py-4 text-xs text-muted-foreground font-sans">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-foreground">University of Chicago Comprehensive Cancer Center</span>
            <span>•</span>
            <span>RNA-seq Scientific Analytics Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/methods" className="hover:text-foreground transition-colors">Statistical Methods</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Platform Architecture</Link>
            <a href="https://bioconductor.org/packages/DESeq2" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
              <span>DESeq2 v1.44</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-border">|</span>
            <span>© 2026 UC-CCC</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
