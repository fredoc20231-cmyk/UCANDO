import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { ApiContractsModal } from "./ApiContractsModal";
import { IRBCharterModal } from "./IRBCharterModal";
import {
  Activity,
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
  Layers
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [contractsOpen, setContractsOpen] = useState(false);
  const [charterOpen, setCharterOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("Clinician (Dr. Fred, MD)");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchQueryFocused] = useState(false);

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navItems = [
    { label: "Hub Command Center", path: "/", icon: LayoutDashboard },
    { label: "Clinician Patient 360", path: "/patient-360", icon: Users, highlight: true },
    { label: "Researcher Portal", path: "/researcher-portal", icon: Layers },
    { label: "Cohort Builder", path: "/cohort-builder", icon: SlidersHorizontal },
    { label: "Dynamic Consent", path: "/consent-console", icon: Lock },
    { label: "Imaging Launch Hub", path: "/imaging-hub", icon: Image },
    { label: "Omics Results", path: "/omics-view", icon: Dna },
    { label: "Trial Matching", path: "/trial-matching", icon: GitPullRequest },
    { label: "Governance & Admin", path: "/governance", icon: Shield },
    { label: "Audit & Compliance", path: "/audit-dashboard", icon: Activity },
    { label: "Data Quality", path: "/data-quality", icon: FileSpreadsheet },
  ];

  const searchSuggestions = [
    { label: "UC-BEACON-89421 (Stage IIIB Breast Cancer)", path: "/patient-360?id=UC-BEACON-89421" },
    { label: "BRCA1 c.5266dupC pathogenic variant", path: "/patient-360?id=UC-BEACON-89421" },
    { label: "ACC-2023-9941 (PET/CT Restaging Study)", path: "/imaging-hub" },
    { label: "TNBC Cohort (Stage III + Immunotherapy)", path: "/cohort-builder" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Enterprise Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Codename */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-uchicago-maroon to-red-950 border border-red-700/50 flex items-center justify-center shadow-lg shadow-red-950/40 group-hover:scale-105 transition-transform">
                <span className="font-bold text-white text-base tracking-tighter font-serif">UC</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white group-hover:text-red-300 transition-colors">
                    UChicago Cancer Data Commons
                  </span>
                  <Badge variant="outline" className="border-red-500/40 bg-red-950/50 text-red-300 text-[10px] px-1.5 py-0 font-mono">
                    BEACON
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">Enterprise Oncology Integration Hub • UCCANDO</p>
              </div>
            </Link>

            {/* Zero PHI Security Shield Status Badge */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
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

          {/* Center Search Input */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchQueryFocused(true)}
                onBlur={() => setTimeout(() => setSearchQueryFocused(false), 200)}
                placeholder="Search patient ID, variant (e.g. BRCA1), study, or cohort..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
              />
            </div>

            {/* Quick Search Autocomplete Popup */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-slate-900 border border-slate-800 shadow-xl z-50 text-xs space-y-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase px-2 py-1">Quick Search Matches</div>
                {searchSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery("");
                      navigate(s.path);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>{s.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Tools & Role Selector */}
          <div className="flex items-center gap-2">
            {/* Modal Triggers */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setContractsOpen(true)}
              className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200"
            >
              <FileCode className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span className="hidden sm:inline">API Contracts</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCharterOpen(true)}
              className="h-8 text-xs border-slate-700 bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200"
            >
              <Landmark className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
              <span className="hidden sm:inline">IRB Charter</span>
            </Button>

            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-300 hover:text-white border border-slate-800 bg-slate-900">
                  <User className="w-3.5 h-3.5 mr-1 text-sky-400" />
                  <span className="truncate max-w-[120px]">{userRole}</span>
                  <ChevronDown className="w-3 h-3 ml-1 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                <DropdownMenuLabel className="text-slate-400 text-[10px] uppercase">Switch User Context</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={() => setUserRole("Clinician (Dr. Fred, MD)")} className="hover:bg-slate-800 cursor-pointer">
                  Clinician (Dr. Fred, MD)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Bioinformatics Researcher")} className="hover:bg-slate-800 cursor-pointer">
                  Bioinformatics Researcher
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Compliance Officer")} className="hover:bg-slate-800 cursor-pointer">
                  Compliance & Safety Officer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole("Data Steward (IRB)")} className="hover:bg-slate-800 cursor-pointer">
                  Data Steward & IRB
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark / Light Mode Toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </Button>
          </div>
        </div>

        {/* Builder.io PHI-Free Notice Bar */}
        <div className="bg-gradient-to-r from-uchicago-dark-maroon via-slate-900 to-slate-950 border-t border-slate-800/80 py-1 px-4 text-[11px] text-slate-300 flex items-center justify-between">
          <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white font-semibold">Builder.io Orchestration Rule:</strong> PHI-free visual CMS layer. Patient data renders strictly from authenticated API props.
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] text-slate-400 shrink-0">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> OMOP v5.4
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> mCODE FHIR R4
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> GA4GH Beacon v2
              </span>
            </div>
          </div>
        </div>

        {/* Primary Sub-Navigation Bar */}
        <div className="border-t border-slate-800 bg-slate-950/80 overflow-x-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-uchicago-maroon text-white shadow-sm shadow-red-900/50"
                      : item.highlight
                      ? "text-sky-300 hover:bg-slate-900 hover:text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
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
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-300">
              Beacon — UChicago Cancer Data Commons (UCCANDO)
            </p>
            <p className="text-[11px] text-slate-500">
              © 2025 The University of Chicago Medicine Comprehensive Cancer Center. All rights reserved. HIPAA Consented Ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setContractsOpen(true)} className="hover:text-emerald-400 transition-colors">
              OpenAPI Contracts (G1/G2)
            </button>
            <span>•</span>
            <button onClick={() => setCharterOpen(true)} className="hover:text-rose-400 transition-colors">
              IRB Governance Charter
            </button>
            <span>•</span>
            <span className="text-slate-500">System Time: UTC 2025-02-14</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiContractsModal open={contractsOpen} onOpenChange={setContractsOpen} />
      <IRBCharterModal open={charterOpen} onOpenChange={setCharterOpen} />
    </div>
  );
}
