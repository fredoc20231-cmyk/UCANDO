import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { useBackgroundTheme } from "@/context/BackgroundContext";
import { useRnaSeq } from "@/context/RnaSeqContext";
import { institutionConfig } from "@/config/institution";
import { SyntheticDataBanner } from "./SyntheticDataBanner";
import { AnalysisStatusPanel } from "./AnalysisStatusPanel";
import { ApiContractsModal } from "./ApiContractsModal";
import { IRBCharterModal } from "./IRBCharterModal";
import { LoginModal } from "./LoginModal";
import { IUCANDOChat } from "./iUCANDOChat";
import { OmniSearch } from "./OmniSearch";
import {
  LayoutDashboard,
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
  BarChart2,
  Users,
  Image as ImageIcon,
  Lock,
  GitPullRequest,
  Shield,
  BarChart3,
  Globe,
  FileCode,
  Landmark,
  Bot,
  Stethoscope
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
    toggleStatusPanel
  } = useRnaSeq();

  const [contractsOpen, setContractsOpen] = useState(false);
  const [charterOpen, setCharterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const isRnaSeqRoute = [
    "/workspace",
    "/data",
    "/expression",
    "/pathways",
    "/visualization",
    "/advanced",
    "/reports",
    "/methods"
  ].some((prefix) => location.pathname.startsWith(prefix));

  const isResearcherRoute = [
    "/researcher-portal",
    "/workspace",
    "/data",
    "/expression",
    "/pathways",
    "/visualization",
    "/advanced",
    "/reports",
    "/methods",
    "/omics-view"
  ].some((prefix) => location.pathname.startsWith(prefix));

  const isPatientRoute = [
    "/patient-360",
    "/patient-integration",
    "/iucado-orbit"
  ].some((prefix) => location.pathname.startsWith(prefix));

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-accent/20">
      {/* Synthetic Demo Data Banner */}
      <SyntheticDataBanner />

      {/* Main Cancer Data Commons Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-subtle">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">

          {/* Brand Logo & Identity */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Link to="/" className="flex items-center gap-2.5 group min-w-0">
              <div className="h-10 w-10 rounded-lg border border-border bg-slate-950 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                <img
                  src={institutionConfig.logoPath}
                  alt={`${institutionConfig.platformName} Logo`}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <span className="font-serif font-bold text-xs sm:text-sm md:text-base lg:text-[17px] tracking-tight text-primary group-hover:text-primary/90 transition-colors leading-snug truncate">
                  {institutionConfig.platformName}: {institutionConfig.fullName}
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-sans truncate leading-tight mt-0.5 hidden sm:block">
                  {institutionConfig.tagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Upper Panel Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* API Contracts */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContractsOpen(true)}
              className="h-8 px-2.5 text-xs bg-card border-border text-foreground hover:bg-muted gap-1.5 hidden lg:flex"
            >
              <FileCode className="w-3.5 h-3.5 text-accent" />
              <span>API Contracts</span>
            </Button>

            {/* Day / Night Theme Toggle */}
            <div className="flex items-center p-0.5 rounded-md bg-surface border border-border">
              <button
                onClick={() => setBgTheme("day")}
                title="Switch to Light / Day Mode"
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
                title="Switch to Dark / Night Mode"
                className={`p-1.5 rounded transition-all ${
                  bgTheme === "night"
                    ? "bg-card text-accent font-semibold shadow-subtle"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User Persona Switcher */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 pl-2 pr-2.5 text-xs bg-card border-border text-foreground hover:bg-muted gap-1.5"
                  >
                    <div className="w-5 h-5 rounded bg-primary text-primary-foreground font-serif font-bold text-[11px] flex items-center justify-center">
                      {user?.avatarInitial || "U"}
                    </div>
                    <span className="max-w-[80px] truncate hidden sm:inline font-medium">{user?.name.split(" ")[0]}</span>
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
                onClick={() => setLoginOpen(true)}
                className="h-8 px-3 text-xs bg-primary text-primary-foreground font-medium shadow-subtle"
              >
                Sign In
              </Button>
            )}

          </div>

        </div>

        {/* Global Horizontal 5-Category Taxonomy Navigation Bar */}
        <nav className="w-full bg-[#7D1B2D] dark:bg-slate-950 border-t border-[#661221] dark:border-border px-4 sm:px-6 shadow-md text-white">
          <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 py-1.5 text-xs font-sans">

            {/* 5 Dropdown Tabs on Left (Uniform Hover & One-Click Trigger) */}
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap w-full lg:w-auto overflow-x-auto scrollbar-none">

              {/* 1. Data Hub (First from the left) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white hover:bg-white/20 transition-colors group shrink-0 cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5 opacity-90 text-white" />
                    <span className="text-white font-bold tracking-tight">Data Hub</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-84 font-sans text-xs p-2 shadow-elevated space-y-1 bg-card border-border text-foreground">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                    Data Hub & Connectivity
                  </div>

                  {/* Item 1: Integration Hub */}
                  <DropdownMenuItem
                    onClick={() => navigate("/")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname === "/"
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Integration Hub</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Core connectivity matrix & central data commons
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 2: Global Integrations */}
                  <DropdownMenuItem
                    onClick={() => navigate("/global-integrations")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/global-integrations")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Global Integrations</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        External system hooks (Epic, Cosmos, GDC, cBioPortal)
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 3: Manual */}
                  <DropdownMenuItem
                    onClick={() => navigate("/manual")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/manual") || isActive("/architecture") || isActive("/data-quality")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-foreground border border-border shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Manual</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Documentation, architecture & ingestion logs
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 2. Clinical */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white hover:bg-white/20 transition-colors group shrink-0 cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5 opacity-90 text-white" />
                    <span className="text-white font-bold tracking-tight">Clinical</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-84 font-sans text-xs p-2 shadow-elevated space-y-1 bg-card border-border text-foreground">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                    Clinical & Diagnostic Tools
                  </div>

                  {/* Item 1: Clinical Trials */}
                  <DropdownMenuItem
                    onClick={() => navigate("/trial-matching")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/trial-matching")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <GitPullRequest className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">Clinical Trials</span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30 text-primary font-mono">Matching</Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Molecular pre-screening & protocol alignment
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 2: Imaging & Diagnostics */}
                  <DropdownMenuItem
                    onClick={() => navigate("/imaging-hub")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/imaging-hub")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">Imaging & Diagnostics</span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 border-accent/30 text-accent font-mono">OHIF</Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Zero-footprint DICOM radiology & pathology WSI
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 3: Patient 360 Orbit */}
                  <DropdownMenuItem
                    onClick={() => navigate("/patient-360")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname.startsWith("/patient-360")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Patient 360 Orbit</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Radial domain visualization & longitudinal EHR records
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 4: Patient Integration */}
                  <DropdownMenuItem
                    onClick={() => navigate("/patient-integration")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname.startsWith("/patient-integration")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Patient Integration</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Targeted analysis: treatments, RECIST, survival & CDS
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 3. Intelligence */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white hover:bg-white/20 transition-colors group shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 opacity-90 text-amber-300" />
                    <span className="text-white font-bold tracking-tight">Intelligence</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-84 font-sans text-xs p-2 shadow-elevated space-y-1 bg-card border-border text-foreground">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                    AI & Scientific Intelligence
                  </div>

                  {/* Item 1: iUCANDO */}
                  <DropdownMenuItem
                    onClick={() => setChatOpen(true)}
                    className="cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">iUCANDO</span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30 text-primary font-mono">Concierge</Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Platform-aware research concierge & protocol synthesis
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 2: Omics Integration */}
                  <DropdownMenuItem
                    onClick={() => navigate("/omics-view")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname.startsWith("/omics-view")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Dna className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">Omics Integration</span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 border-accent/30 text-accent font-mono">PhoenixMO</Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Somatic variants, OncoPrint matrix & composite risk score
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 3: iUCADO-Orbit Engine */}
                  <DropdownMenuItem
                    onClick={() => navigate("/iucado-orbit")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname.startsWith("/iucado-orbit")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">iUCADO-Orbit Engine</span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30 text-primary font-mono">GRADE PICO</Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Literature consensus, clinical trials & guideline reasoning
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 4. Analytics & Insights */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white hover:bg-white/20 transition-colors group shrink-0 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 opacity-90 text-white" />
                    <span className="text-white font-bold tracking-tight">Analytics & Insights</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-84 font-sans text-xs p-2 shadow-elevated space-y-1 bg-card border-border text-foreground">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                    Analytics & Research Studio
                  </div>

                  {/* Item 1: Cohort Builder */}
                  <DropdownMenuItem
                    onClick={() => navigate("/cohort-builder")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname.startsWith("/cohort-builder")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Cohort Builder</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Patient population filtering & mCODE query
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 2: Researcher Portal */}
                  <DropdownMenuItem
                    onClick={() => navigate("/researcher-portal")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isResearcherRoute
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Researcher Portal</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Access point for data analysis & RNA-seq Studio
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 3: RNA-seq Workspace */}
                  <DropdownMenuItem
                    onClick={() => navigate("/workspace")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      location.pathname.startsWith("/workspace") || location.pathname.startsWith("/rnaseq")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Sliders className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">RNA-seq Analysis Studio</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        DESeq2 GLMs (~ batch + condition), Volcano, PCA & GSEA
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 5. Governance & Admin */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white hover:bg-white/20 transition-colors group shrink-0 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 opacity-90 text-white" />
                    <span className="text-white font-bold tracking-tight">Governance & Admin</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-84 font-sans text-xs p-2 shadow-elevated space-y-1 bg-card border-border text-foreground">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                    Governance & Compliance
                  </div>

                  {/* Item 1: Governance */}
                  <DropdownMenuItem
                    onClick={() => navigate("/governance")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/governance")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Governance</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Policy, data compliance & framework rules
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 2: IRB Charter */}
                  <DropdownMenuItem
                    onClick={() => setCharterOpen(true)}
                    className="cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Landmark className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">IRB Charter</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Institutional Review Board protocols & ethical oversight
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 3: Authenticated */}
                  <DropdownMenuItem
                    onClick={() => setLoginOpen(true)}
                    className="cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">Authenticated</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] py-0 px-1 font-mono ${
                            isAuthenticated
                              ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/30 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isAuthenticated ? "Active" : "Sign In"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Session credentials, role delegation & auth state
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 4: Admin Census */}
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/admin")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <BarChart2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Admin Census</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        System usage, patient breakdown and node telemetry
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 3: Audit */}
                  <DropdownMenuItem
                    onClick={() => navigate("/audit-dashboard")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/audit-dashboard")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-primary border border-border shrink-0 mt-0.5">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Audit</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Zero-trust access and immutable OPA query logs
                      </span>
                    </div>
                  </DropdownMenuItem>

                  {/* Item 4: Consent Console */}
                  <DropdownMenuItem
                    onClick={() => navigate("/consent-console")}
                    className={`cursor-pointer p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      isActive("/consent-console")
                        ? "border-l-2 border-primary bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-surface text-accent border border-border shrink-0 mt-0.5">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">Consent Console</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-normal leading-snug">
                        Real-time OPA fine-grained consent management
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            {/* OmniSearch Search Box directly on the Horizontal Panel */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0">
              <OmniSearch />
            </div>

          </div>
        </nav>
      </header>

      {/* When inside an RNA-seq route, show the Analysis Status Banner */}
      {isRnaSeqRoute && <AnalysisStatusPanel />}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Floating iUCANDO AI Assistant Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <Button
          onClick={() => setChatOpen(true)}
          className="h-11 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs shadow-elevated flex items-center gap-2 border border-primary-foreground/20"
        >
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span>iUCANDO AI</span>
        </Button>
      </div>

      {/* Slide-in iUCANDO AI Drawer */}
      <IUCANDOChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        patientContext="UC-CCC Transcriptomics RNA-seq Cohort Analysis"
      />

      {/* Modals */}
      <ApiContractsModal open={contractsOpen} onOpenChange={setContractsOpen} />
      <IRBCharterModal open={charterOpen} onOpenChange={setCharterOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />

      {/* Institutional Footer */}
      <footer className="border-t border-border bg-card/60 px-6 py-4 text-xs text-muted-foreground font-sans">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-foreground">
              {institutionConfig.fullName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/methods" className="hover:text-foreground transition-colors">Methods</Link>
            <Link to="/governance" className="hover:text-foreground transition-colors">IRB Governance</Link>
            <button onClick={() => setContractsOpen(true)} className="hover:text-foreground transition-colors">
              GA4GH Contracts
            </button>
            <span className="text-border">|</span>
            <span>© {institutionConfig.copyrightYear} {institutionConfig.shortName}. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
