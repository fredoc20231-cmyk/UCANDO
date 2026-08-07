import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBackgroundTheme } from "@/context/BackgroundContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiContractsModal } from "./ApiContractsModal";
import { IRBCharterModal } from "./IRBCharterModal";
import { SyntheticDataBanner } from "./SyntheticDataBanner";
import { IUCANDOChat } from "./iUCANDOChat";
import { LoginModal } from "./LoginModal";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import {
  Activity,
  BarChart3,
  ShieldCheck,
  Search,
  User,
  FileCode,
  Landmark,
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  Lock,
  Image,
  Dna,
  GitPullRequest,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Layers,
  LogIn,
  Globe,
  HelpCircle,
  Database
} from "lucide-react";

function CloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { bgTheme, setBgTheme } = useBackgroundTheme();
  const { isAuthenticated, user, switchUser } = useAuth();
  const [contractsOpen, setContractsOpen] = useState(false);
  const [charterOpen, setCharterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("Clinician (Dr. Alex Rivera, MD)");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchQueryFocused] = useState(false);

  const navItems = [
    { label: "Integration Hub", path: "/", icon: LayoutDashboard },
    { label: "Data Architecture", path: "/architecture", icon: Database },
    { label: "iUCANDO AI", path: "#chat", icon: Sparkles, isChatTrigger: true, highlight: true },
    { label: "Clinician Patient 360", path: "/patient-360", icon: Users, highlight: true },
    { label: "Researcher Portal", path: "/researcher-portal", icon: Layers },
    { label: "Cohort Builder", path: "/cohort-builder", icon: SlidersHorizontal },
    { label: "Dynamic Consent", path: "/consent-console", icon: Lock },
    { label: "Imaging Launch Hub", path: "/imaging-hub", icon: Image },
    { label: "Omics Results", path: "/omics-view", icon: Dna },
    { label: "Trial Matching", path: "/trial-matching", icon: GitPullRequest },
    { label: "Governance & Admin", path: "/governance", icon: Shield },
    { label: "Admin Census", path: "/admin", icon: BarChart3 },
    { label: "Audit & Compliance", path: "/audit-dashboard", icon: Activity },
    { label: "Data Quality", path: "/data-quality", icon: FileSpreadsheet },
    { label: "Global Integrations", path: "/global-integrations", icon: Globe, hasDivider: true },
    { label: "Help / Manual", path: "/manual", icon: HelpCircle },
  ];

  const searchSuggestions = [
    { label: "UC-CCC-89421 (Stage IIIB Breast Cancer)", path: "/patient-360?id=UC-CCC-89421" },
    { label: "BRCA1 c.5266dupC pathogenic variant", path: "/patient-360?id=UC-CCC-89421" },
    { label: "ACC-2023-9941 (PET/CT Restaging Study)", path: "/imaging-hub" },
    { label: "TNBC Cohort (Stage III + Immunotherapy)", path: "/cohort-builder" }
  ];

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col relative transition-colors duration-500",
        bgTheme === "day" && "bg-white text-slate-900",
        bgTheme === "night" && "bg-slate-950 text-slate-100",
        bgTheme === "sky" && "bg-transparent text-slate-100"
      )}
    >
      {/* Decorative Background Elements */}
      {bgTheme === "day" && (
        <div className="fixed top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-amber-200/25 via-sky-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
      )}
      {bgTheme === "night" && (
        <div className="fixed top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-transparent blur-3xl pointer-events-none -z-10" />
      )}
      {bgTheme === "sky" && (
        <div className="fixed top-0 left-0 right-0 h-[650px] overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-100px] left-[10%] w-[800px] h-[450px] bg-sky-400/35 blur-[120px] rounded-full" />
          <div className="absolute top-[-50px] right-[5%] w-[700px] h-[400px] bg-cyan-300/30 blur-[100px] rounded-full" />
          <div className="absolute top-20 left-1/3 w-[600px] h-[300px] bg-blue-500/25 blur-[110px] rounded-full" />
          <div className="absolute top-10 left-12 opacity-50 text-sky-100 animate-cloud-float">
            <CloudIcon className="w-36 h-36" />
          </div>
          <div className="absolute top-20 right-24 opacity-45 text-cyan-100 animate-cloud-float" style={{ animationDelay: "3s" }}>
            <CloudIcon className="w-52 h-52" />
          </div>
          <div className="absolute top-44 left-1/3 opacity-35 text-sky-200 animate-cloud-float" style={{ animationDelay: "6s" }}>
            <CloudIcon className="w-40 h-40" />
          </div>
        </div>
      )}
      {/* Top Enterprise Header (NCI GDC Dark Navy Header in Day Mode) */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 text-white dark:bg-slate-900/95 backdrop-blur-md">
        <SyntheticDataBanner />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Codename */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-11 px-1.5 py-1 rounded-xl border border-cyan-500/50 bg-slate-950 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-cyan-400 transition-all shrink-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Ffc7eb0036adc46ad99a19a10591f08da?format=webp&width=800&height=1200"
                  alt="UCANDO Logo"
                  className="h-full w-auto object-contain rounded"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    UC-CCC Cancer Data Commons
                  </span>
                  <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/50 text-cyan-300 text-[10px] px-1.5 py-0 font-mono">
                    UCANDO
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-300">Enterprise Oncology Integration Hub • UCANDO</p>
              </div>
            </Link>

            {/* Zero PHI Security Shield Status Badge */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-700 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 text-[11px] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                HIPAA Zero-Trust
              </span>
              <Badge variant="secondary" className="bg-slate-800 text-emerald-400 text-[10px] border-slate-700">
                OPA Policy Active
              </Badge>
            </div>
          </div>

          {/* Center Search Input & User Profile */}
          <div className="flex items-center gap-3 hidden md:flex">
            <div className="relative w-40 lg:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchQueryFocused(true)}
                onBlur={() => setTimeout(() => setSearchQueryFocused(false), 200)}
                placeholder="Search patient ID, variant..."
                className="w-full pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />

              {/* Quick Search Autocomplete Popup */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 text-xs space-y-1">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase px-2 py-1">Quick Search Matches</div>
                  {searchSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery("");
                        navigate(s.path);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span>{s.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile (Pic & Name) next to search box with Persona Selector Dropdown */}
            <div className="flex items-center gap-2 pl-2.5 border-l border-slate-700 text-xs shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 p-1 px-2.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-left transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-[10px] shrink-0 shadow-sm">
                      {user?.avatarInitial || "AR"}
                    </div>
                    <div className="hidden sm:block truncate max-w-[125px]">
                      <p className="font-semibold text-slate-100 text-[11px] truncate leading-tight">
                        {user?.name || "Dr. Alex Rivera, MD"}
                      </p>
                      <p className="text-[9px] text-cyan-300 font-mono truncate leading-tight">
                        {user?.role || "Attending Oncologist (MD)"}
                      </p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs w-64 p-2 shadow-2xl z-50">
                  <DropdownMenuLabel className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono px-2 py-1">
                    Select User Persona
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800 my-1" />
                  {DEMO_USERS.map((persona) => (
                    <DropdownMenuItem
                      key={persona.id}
                      onClick={() => switchUser(persona)}
                      className={`hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer p-2 rounded-lg my-0.5 flex items-start justify-between ${
                        user?.id === persona.id ? "bg-slate-100 dark:bg-slate-950 border border-cyan-500/40" : ""
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{persona.name}</p>
                        <p className="text-[10px] text-cyan-600 dark:text-cyan-300">{persona.role}</p>
                      </div>
                      {user?.id === persona.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800 my-1" />
                  <DropdownMenuItem
                    onClick={() => setLoginOpen(true)}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-amber-600 dark:text-amber-300 font-semibold p-2"
                  >
                    Manage Auth Session & Roles...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right Action Tools & Theme Selector */}
          <div className="flex items-center gap-2">
            {/* Modal Triggers */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setContractsOpen(true)}
              className="h-7 px-2 text-[11px] border-slate-700 bg-slate-950 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200"
            >
              <FileCode className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span className="hidden sm:inline">API Contracts</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCharterOpen(true)}
              className="h-7 px-2 text-[11px] border-slate-700 bg-slate-950 hover:bg-slate-800 text-rose-300 hover:text-rose-200"
            >
              <Landmark className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
              <span className="hidden sm:inline">IRB Charter</span>
            </Button>

            {/* Auth Sign-In Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLoginOpen(true)}
              className={cn(
                "h-8 text-xs font-semibold border transition-colors",
                isAuthenticated
                  ? "border-emerald-600/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60"
                  : "border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60"
              )}
            >
              {isAuthenticated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span className="hidden md:inline">Authenticated</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  <span>Sign In</span>
                </>
              )}
            </Button>

            {/* Orchestration Rule Label */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-slate-200 text-xs">Orchestration Rule:</span>
            </div>

            {/* Background Theme Selector: Day / Night / Sky */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-700 text-xs shadow-inner gap-0.5">
              <button
                type="button"
                onClick={() => setBgTheme("day")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-xs font-semibold",
                  bgTheme === "day"
                    ? "bg-amber-400 text-amber-950 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                title="Switch to Day Background (Light Daylight)"
              >
                <Sun className={cn("w-3.5 h-3.5", bgTheme === "day" ? "text-amber-950 fill-amber-950/20" : "text-amber-400")} />
                <span>Day</span>
              </button>

              <button
                type="button"
                onClick={() => setBgTheme("night")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-xs font-semibold",
                  bgTheme === "night"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                title="Switch to Night Background (Deep Midnight Space)"
              >
                <Moon className={cn("w-3.5 h-3.5", bgTheme === "night" ? "text-white fill-white/20" : "text-indigo-400")} />
                <span>Night</span>
              </button>

              <button
                type="button"
                onClick={() => setBgTheme("sky")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-xs font-semibold",
                  bgTheme === "sky"
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                title="Switch to Sky Background (Azure Atmosphere)"
              >
                <CloudIcon className={cn("w-3.5 h-3.5", bgTheme === "sky" ? "text-slate-950" : "text-sky-400")} />
                <span>Sky</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Sub-Navigation Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 overflow-x-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <React.Fragment key={item.path}>
                  {item.hasDivider && (
                    <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-800 mx-1 shrink-0" />
                  )}
                  {item.isChatTrigger ? (
                    <button
                      type="button"
                      onClick={() => setChatOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/30"
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-primary dark:bg-brand-maroon text-white shadow-sm"
                          : item.highlight
                          ? "text-brand-maroon dark:text-rose-300 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 py-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-300">
              UCANDO — UC-CCC Cancer Data Commons
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 max-w-3xl leading-relaxed">
              © 2026 University of Chicago Comprehensive Cancer Center (UC-CCC). All rights reserved. This platform and its underlying source code are proprietary and confidential. Unauthorized reproduction, distribution, or use is prohibited without written permission.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium">
              Developed by the Computational Oncology and Bioinformatics Unit, UC-CCC.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setContractsOpen(true)} className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              OpenAPI Contracts (G1/G2)
            </button>
            <span>•</span>
            <button onClick={() => setCharterOpen(true)} className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
              IRB Governance Charter
            </button>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-500">System Time: UTC 2025-02-14</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiContractsModal open={contractsOpen} onOpenChange={setContractsOpen} />
      <IRBCharterModal open={charterOpen} onOpenChange={setCharterOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />

      {/* Floating Action Button for iUCANDO AI Assistant */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-bold text-xs ring-4 ring-primary/20 group"
        title="Open iUCANDO AI Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline">iUCANDO</span>
      </button>

      {/* iUCANDO AI Chat Slide-in Panel */}
      <IUCANDOChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
