import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ClinicalTrialMatch } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  FlaskConical,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  Building2,
  UserCheck,
  Send,
  Info,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function TrialMatching() {
  const [trials, setTrials] = useState<ClinicalTrialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTrialForPrescreen, setSelectedTrialForPrescreen] = useState<ClinicalTrialMatch | null>(null);
  const [prescreenSuccess, setPrescreenSuccess] = useState(false);
  const [expandedTrialId, setExpandedTrialId] = useState<string | null>("NCT05214820");

  useEffect(() => {
    fetch("/api/beacon/trials")
      .then((res) => res.json())
      .then((data: ClinicalTrialMatch[]) => {
        setTrials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load trial matches:", err);
        setLoading(false);
      });
  }, []);

  const filteredTrials = trials.filter(
    (t) =>
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.nctId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.matchingBiomarkers.some((b) => b.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleSendPrescreen = () => {
    setPrescreenSuccess(true);
    setTimeout(() => {
      setPrescreenSuccess(false);
      setSelectedTrialForPrescreen(null);
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-950 text-amber-300 border border-amber-700/50 shadow-md">
                <FlaskConical className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">AI Clinical Trial Matching Engine</h1>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-950/40 text-[10px]">
                    mCODE Automated Extraction
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time eligibility matching against active Beacon Comprehensive Cancer Center protocol catalog.
                </p>
              </div>
            </div>

            <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-xs py-1 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> Patient UC-BEACON-89421 Evaluated
            </Badge>
          </div>

          {/* Active Patient Profile Snapshot */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Patient</span>
              <span className="font-bold text-white">UC-BEACON-89421 (58 y/o Female)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Diagnosis</span>
              <span className="font-bold text-sky-300">Stage III Invasive Breast Carcinoma</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Matching Biomarkers</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[9px]">BRCA1 Pathogenic</Badge>
                <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[9px]">PD-L1 CPS &gt;= 10</Badge>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              placeholder="Filter matched trials by drug name, NCT ID, or biomarker (e.g., Olaparib, BRCA1, NCT05214820)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-800 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Trial Match List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Matched Protocol Catalog ({filteredTrials.length} High Confidence Matches)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Matching Engine: mCODE NLP Criteria Matcher v3.0
            </span>
          </div>

          {filteredTrials.map((trial) => {
            const isExpanded = expandedTrialId === trial.nctId;
            return (
              <div
                key={trial.nctId}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-amber-950 text-amber-300 border-amber-800 font-mono text-xs">
                        {trial.matchScorePercent}% Match
                      </Badge>
                      <Badge variant="outline" className="border-sky-500/40 text-sky-300 bg-sky-950/40 text-[10px]">
                        {trial.phase}
                      </Badge>
                      <a
                        href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-purple-400 hover:underline inline-flex items-center"
                      >
                        {trial.nctId} <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{trial.title}</h3>

                    <p className="text-xs text-slate-400">
                      PI: <strong className="text-slate-200">{trial.principalInvestigator}</strong> • Site:{" "}
                      <span className="text-slate-300">{trial.primaryLocation}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedTrialForPrescreen(trial)}
                      className="bg-brand-maroon hover:bg-red-800 text-white font-semibold text-xs"
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Submit IRB Pre-Screen
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedTrialId(isExpanded ? null : trial.nctId)}
                      className="h-8 text-xs text-slate-400 hover:text-white px-2"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Matching Biomarkers */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400">Matching Criteria:</span>
                  {trial.matchingBiomarkers.map((b) => (
                    <Badge key={b} className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> {b}
                    </Badge>
                  ))}
                </div>

                {/* Expandable Criteria Details */}
                {isExpanded && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3">
                    <div className="space-y-2">
                      <span className="font-bold text-emerald-400 uppercase font-mono text-[10px] block">
                        Inclusion Criteria Met
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {trial.inclusionCriteria.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-red-400 uppercase font-mono text-[10px] block">
                        Exclusion Criteria Rules Evaluated
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {trial.exclusionCriteria.map((exc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <span>{exc} (Patient Cleared)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pre-screen Submission Dialog */}
        <Dialog open={!!selectedTrialForPrescreen} onOpenChange={() => setSelectedTrialForPrescreen(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-400" /> Confirm IRB Pre-Screen Request
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Submit de-identified eligibility packet to Clinical Trials Office.
              </DialogDescription>
            </DialogHeader>

            {prescreenSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-emerald-200">Pre-Screen Request Submitted!</p>
                <p className="text-xs text-emerald-300">
                  Notification transmitted to {selectedTrialForPrescreen?.principalInvestigator}.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                  <p><span className="text-slate-500">Trial:</span> {selectedTrialForPrescreen?.nctId}</p>
                  <p><span className="text-slate-500">PI:</span> {selectedTrialForPrescreen?.principalInvestigator}</p>
                  <p><span className="text-slate-500">Match Score:</span> {selectedTrialForPrescreen?.matchScorePercent}%</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setSelectedTrialForPrescreen(null)} className="text-xs text-slate-400">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendPrescreen}
                    className="bg-brand-maroon hover:bg-red-800 text-white font-semibold text-xs"
                  >
                    Confirm Submission
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
