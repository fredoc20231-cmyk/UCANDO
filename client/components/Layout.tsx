import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { SyntheticDataBanner } from "./SyntheticDataBanner";
import { cn } from "@/lib/utils";
import { useBackgroundTheme } from "@/context/BackgroundContext";
import {
  ShieldCheck,
  Search,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Users,
  Layers,
  SlidersHorizontal,
  Lock,
  Image,
  Dna,
  GitPullRequest,
  Shield,
  Activity,
  FileSpreadsheet,
  Globe,
  HelpCircle,
  Database,
  CheckCircle2,
  ExternalLink,
  Sun,
  Moon,
  LogIn,
  FileCode,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ApiContractsModal } from "./ApiContractsModal";
import { IRBCharterModal } from "./IRBCharterModal";
import { LoginModal } from "./LoginModal";
import { IUCANDOChat } from "./iUCANDOChat";

interface LayoutProps {
  children: React.ReactNode;
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
    { label: "Admin Census", path: "/admin", icon: BarChart3Icon },
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Top Main Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white dark:bg-[#111827] shadow-subtle">
        <SyntheticDataBanner />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Brand Logo & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-lg border border-border bg-muted flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Ffc7eb0036adc46ad99a19a10591f08da?format=webp&width=800&height=1200"
                  alt="UCANDO Logo"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                    UC-CCC Cancer Data Commons
                  </span>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[10px] px-1.5 py-0 font-mono">
                    UCANDO
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Enterprise Oncology Integration Hub</p>
              </div>
            </Link>

            {/* Zero PHI Security Shield Status Badge */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-border text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00CC96] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00CC96]"></span>
              </span>
              <span className="text-[11px] font-medium flex items-center gap-1 text-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00CC96]" />
                HIPAA Zero-Trust
              </span>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="relative w-48 lg:w-64 hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchQueryFocused(true)}
              onBlur={() => setTimeout(() => setSearchQueryFocused(false), 200)}
              placeholder="Search patient ID, variant..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />

            {/* Quick Search Autocomplete Popup */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-lg bg-card border border-border shadow-elevated z-50 text-xs space-y-1">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1">Quick Search Matches</div>
                {searchSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery("");
                      navigate(s.path);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-muted text-foreground flex items-center justify-between transition-colors"
                  >
                    <span>{s.label}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Tools & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 px-2 rounded-lg bg-muted/50 border border-border hover:bg-muted text-left transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-subtle">
                    {user?.avatarInitial || "AR"}
                  </div>
                  <div className="hidden sm:block truncate max-w-[120px]">
                    <p className="font-semibold text-foreground text-[11px] truncate leading-tight">
                      {user?.name || "Dr. Alex Rivera"}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border text-foreground text-xs w-64 p-2 shadow-elevated z-50">
                <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase font-mono px-2 py-1">
                  Select User Persona
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border my-1" />
                {DEMO_USERS.map((persona) => (
                  <DropdownMenuItem
                    key={persona.id}
                    onClick={() => switchUser(persona)}
                    className={cn(
                      "hover:bg-muted cursor-pointer p-2 rounded-md my-0.5 flex items-start justify-between",
                      user?.id === persona.id && "bg-muted border border-primary/40 font-semibold"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-foreground text-xs">{persona.name}</p>
                      <p className="text-[10px] text-muted-foreground">{persona.role}</p>
                    </div>
                    {user?.id === persona.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00CC96] shrink-0 mt-0.5" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-border my-1" />
                <DropdownMenuItem
                  onClick={() => setLoginOpen(true)}
                  className="hover:bg-muted cursor-pointer text-primary font-semibold p-2"
                >
                  Manage Session / Switch Role...
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal Triggers */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setContractsOpen(true)}
              className="h-8 px-2.5 text-xs font-semibold border-border hover:bg-muted text-foreground"
            >
              <FileCode className="w-3.5 h-3.5 mr-1 text-primary" />
              <span className="hidden sm:inline">API Contracts</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCharterOpen(true)}
              className="h-8 px-2.5 text-xs font-semibold border-border hover:bg-muted text-foreground"
            >
              <Landmark className="w-3.5 h-3.5 mr-1 text-primary" />
              <span className="hidden sm:inline">IRB Charter</span>
            </Button>

            {/* Auth Sign-In Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLoginOpen(true)}
              className={cn(
                "h-8 px-2.5 text-xs font-semibold border transition-colors",
                isAuthenticated
                  ? "border-[#00CC96]/40 bg-[#00CC96]/10 text-[#00CC96] hover:bg-[#00CC96]/20"
                  : "border-[#FFA15A]/40 bg-[#FFA15A]/10 text-[#FFA15A] hover:bg-[#FFA15A]/20"
              )}
            >
              {isAuthenticated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#00CC96]" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 mr-1 text-[#FFA15A]" />
                  <span>Sign In</span>
                </>
              )}
            </Button>

            {/* Theme Toggle (Day / Night) */}
            <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border text-xs gap-0.5">
              <button
                type="button"
                onClick={() => setBgTheme("day")}
                className={cn(
                  "p-1.5 rounded-md transition-colors text-xs font-semibold flex items-center justify-center",
                  bgTheme === "day"
                    ? "bg-white text-primary shadow-subtle font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Switch to Light / Day Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setBgTheme("night")}
                className={cn(
                  "p-1.5 rounded-md transition-colors text-xs font-semibold flex items-center justify-center",
                  bgTheme === "night"
                    ? "bg-[#1F2937] text-white shadow-subtle font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Switch to Dark / Night Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Sub-Navigation Bar */}
        <div className="border-t border-border bg-muted/40 overflow-x-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 flex items-center gap-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <React.Fragment key={item.path}>
                  {item.hasDivider && (
                    <div className="h-4 w-[1px] bg-border mx-1 shrink-0" />
                  )}
                  {item.isChatTrigger ? (
                    <button
                      type="button"
                      onClick={() => setChatOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all border border-primary/30 shadow-subtle"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                        isActive
                          ? "bg-primary text-white shadow-subtle font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-muted-foreground")} />
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

      {/* Floating iUCANDO Assistant Button */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary hover:bg-[#4C59E6] text-white shadow-elevated flex items-center gap-2 text-xs font-semibold transition-transform hover:scale-105 active:scale-95"
        title="Open iUCANDO AI Oncology Assistant"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">iUCANDO AI</span>
      </button>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-6 text-xs text-muted-foreground">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              UCANDO — UC-CCC Cancer Data Commons
            </p>
            <p className="text-[11px] max-w-3xl leading-relaxed">
              © 2026 University of Chicago Comprehensive Cancer Center (UC-CCC). All rights reserved. Proprietary and confidential.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setContractsOpen(true)} className="hover:text-primary transition-colors">
              OpenAPI Contracts
            </button>
            <span>•</span>
            <button onClick={() => setCharterOpen(true)} className="hover:text-primary transition-colors">
              IRB Governance Charter
            </button>
            <span>•</span>
            <span className="text-muted-foreground">System Time: UTC 2025-02-14</span>
          </div>
        </div>
      </footer>

      {/* Modals & Chat Drawer */}
      <ApiContractsModal open={contractsOpen} onOpenChange={setContractsOpen} />
      <IRBCharterModal open={charterOpen} onOpenChange={setCharterOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <IUCANDOChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
