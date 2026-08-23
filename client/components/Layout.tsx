import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { useBackgroundTheme } from "@/context/BackgroundContext";
import { useRnaSeq } from "@/context/RnaSeqContext";
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
  Bot
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
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-lg border border-border bg-surface flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Ffc7eb0036adc46ad99a19a10591f08da?format=webp&width=800&height=1200"
                  alt="UCANDO Logo"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                    The University of Chicago Comprehensive Cancer Center Data Commons Operations (UCANDO)
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground hidden sm:block">Enterprise Oncology Integration Hub & RNA-seq Analytics</p>
              </div>
            </Link>
          </div>

          {/* OmniSearch Multi-Category Search Bar */}
          <OmniSearch />

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

            {/* IRB Charter */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCharterOpen(true)}
              className="h-8 px-2.5 text-xs bg-card border-border text-foreground hover:bg-muted gap-1.5 hidden lg:flex"
            >
              <Landmark className="w-3.5 h-3.5 text-primary" />
              <span>IRB Charter</span>
            </Button>

            {/* Authenticated Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLoginOpen(true)}
              className="h-8 px-2.5 text-xs bg-card border-border text-foreground hover:bg-muted gap-1.5 hidden sm:flex"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>{isAuthenticated ? "Authenticated" : "Sign In"}</span>
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

        {/* Global Horizontal Sub-Navigation Bar */}
        <div className="border-t border-border bg-surface/80 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-[1700px] mx-auto flex items-center gap-1 py-1.5 text-xs font-sans min-w-max">
            
            {/* Integration Hub */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/") && location.pathname === "/"
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Integration Hub</span>
            </Link>

            {/* RNA-seq Scientific Platform Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                    isRnaSeqRoute
                      ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Dna className="w-3.5 h-3.5" />
                  <span>RNA-seq Platform</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono ml-0.5 border-current">
                    v3.2
                  </Badge>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 font-sans text-xs">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  RNA-seq Analysis Core
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/workspace")} className="cursor-pointer font-semibold">
                  <Sliders className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Analysis Workspace (2-Pane Studio)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                  Data & Quant
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/data/upload")} className="cursor-pointer">
                  <Download className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Upload Counts & Metadata</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/expression/differential")} className="cursor-pointer">
                  <LineChart className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Differential Expression (DESeq2)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/expression/normalization")} className="cursor-pointer">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-accent" />
                  <span>Normalization (rlog / VST / TPM)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                  Visualization & Pathways
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/visualization/volcano")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <span>Volcano Plot Studio</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/visualization/pca")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-accent mr-2" />
                  <span>PCA / UMAP Projections</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/visualization/heatmap")} className="cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <span>Clustered Heatmap</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pathways/gsea")} className="cursor-pointer">
                  <BarChart2 className="w-3.5 h-3.5 mr-2 text-primary" />
                  <span>Gene Set Enrichment (GSEA)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/reports")} className="cursor-pointer">
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-foreground" />
                  <span>Biomarker Dossier Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/methods")} className="cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <span>Statistical Methods & Citations</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Patient 360 */}
            <Link
              to="/patient-360"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/patient-360")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patient 360 Orbit</span>
            </Link>

            {/* iUCANDO AI trigger */}
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>iUCANDO AI</span>
            </button>

            {/* Researcher Portal */}
            <Link
              to="/researcher-portal"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/researcher-portal")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Researcher Portal</span>
            </Link>

            {/* Cohort Builder */}
            <Link
              to="/cohort-builder"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/cohort-builder")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Cohort Builder</span>
            </Link>

            {/* Dynamic Consent */}
            <Link
              to="/consent-console"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/consent-console")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Consent Console</span>
            </Link>

            {/* Imaging Hub */}
            <Link
              to="/imaging-hub"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/imaging-hub")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imaging Launch (OHIF)</span>
            </Link>

            {/* Omics View */}
            <Link
              to="/omics-view"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/omics-view")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>Omics View</span>
            </Link>

            {/* Trial Matching */}
            <Link
              to="/trial-matching"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/trial-matching")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Trial Matching</span>
            </Link>

            {/* Governance */}
            <Link
              to="/governance"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/governance")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Governance</span>
            </Link>

            {/* Admin Census */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Admin Census</span>
            </Link>

            {/* Audit */}
            <Link
              to="/audit-dashboard"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/audit-dashboard")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Audit</span>
            </Link>

            {/* Global Integrations */}
            <Link
              to="/global-integrations"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/global-integrations")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global Integrations</span>
            </Link>

            {/* Manual */}
            <Link
              to="/manual"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                isActive("/manual")
                  ? "bg-primary text-primary-foreground font-semibold shadow-subtle"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Manual</span>
            </Link>

          </div>
        </div>
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
              The University of Chicago Comprehensive Cancer Center Data Commons Operations (UCANDO)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/methods" className="hover:text-foreground transition-colors">Methods</Link>
            <Link to="/governance" className="hover:text-foreground transition-colors">IRB Governance</Link>
            <button onClick={() => setContractsOpen(true)} className="hover:text-foreground transition-colors">
              GA4GH Contracts
            </button>
            <span className="text-border">|</span>
            <span>© 2026 UC-CCC. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
