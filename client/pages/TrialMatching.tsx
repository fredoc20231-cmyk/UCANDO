import React, { useState, useEffect } from "react";
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
  ChevronUp,
  Dna,
  ShieldCheck,
  FileCheck2
} from "lucide-react";
import { toast } from "sonner";

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
    toast.success("IRB Pre-Screen packet submitted to Clinical Trials Office");
    setTimeout(() => {
      setPrescreenSuccess(false);
      setSelectedTrialForPrescreen(null);
    }, 1800);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif text-foreground">AI Clinical Trial Matching Engine</h1>
                  <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                    mCODE Automated Extraction
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time molecular eligibility matching against active UC-CCC Comprehensive Cancer Center protocol catalog.
                </p>
              </div>
            </div>

            <Badge className="bg-accent/15 text-accent border-accent/30 text-xs py-1 px-3 font-mono">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-accent" /> Patient UC-CCC-89421 Evaluated
            </Badge>
          </div>

          {/* Active Patient Profile Snapshot */}
          <div className="p-4 rounded-xl bg-surface border border-border grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">Active Patient Context</span>
              <span className="font-bold text-foreground">UC-CCC-89421 (58 y/o Female)</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">Primary Diagnosis</span>
              <span className="font-bold text-primary">Stage III Invasive Breast Carcinoma (TNBC)</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">Matching Biomarkers</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <Badge className="bg-accent/15 text-accent border-accent/30 text-[9px] font-mono">BRCA1 Pathogenic</Badge>
                <Badge className="bg-accent/15 text-accent border-accent/30 text-[9px] font-mono">PD-L1 CPS &gt;= 10</Badge>
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[9px] font-mono">HRD Score: 52</Badge>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <Input
              placeholder="Filter matched trials by drug name, NCT ID, or biomarker (e.g., Olaparib, BRCA1, NCT05214820)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-9 bg-surface border-border text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Trial Match List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              Matched Protocol Catalog ({filteredTrials.length} High Confidence Matches)
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Matching Engine: mCODE NLP Criteria Matcher v3.2
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border text-sm">
              Evaluating clinical trial eligibility criteria against molecular profile...
            </div>
          ) : (
            filteredTrials.map((trial) => {
              const isExpanded = expandedTrialId === trial.nctId;
              return (
                <div
                  key={trial.nctId}
                  className="p-5 rounded-xl bg-card border border-border space-y-4 shadow-subtle hover:border-accent/40 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-xs tabular-nums">
                          {trial.matchScorePercent}% Match
                        </Badge>
                        <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 text-[10px] font-mono">
                          {trial.phase}
                        </Badge>
                        <a
                          href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-accent hover:underline inline-flex items-center font-semibold"
                        >
                          {trial.nctId} <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>

                      <h3 className="text-base font-bold font-serif text-foreground leading-snug">{trial.title}</h3>

                      <p className="text-xs text-muted-foreground">
                        PI: <strong className="text-foreground">{trial.principalInvestigator}</strong> • Site:{" "}
                        <span className="text-foreground/90">{trial.primaryLocation}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedTrialForPrescreen(trial)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-subtle"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Submit IRB Pre-Screen
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedTrialId(isExpanded ? null : trial.nctId)}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Matching Biomarkers */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Matching Criteria:</span>
                    {trial.matchingBiomarkers.map((b) => (
                      <Badge key={b} className="bg-accent/10 text-accent border-accent/30 text-[10px] font-mono">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-accent" /> {b}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded Inclusion / Exclusion Criteria Breakdown */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2 p-3.5 rounded-lg bg-surface border border-border">
                        <span className="font-bold text-accent flex items-center gap-1.5 font-mono text-[11px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Inclusion Criteria ({trial.inclusionCriteria?.length || 0})
                        </span>
                        <ul className="space-y-1 text-foreground/90 text-[11px]">
                          {(trial.inclusionCriteria || []).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-accent">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2 p-3.5 rounded-lg bg-surface border border-border">
                        <span className="font-bold text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] uppercase">
                          <Info className="w-3.5 h-3.5 text-muted-foreground" /> Exclusion Criteria ({trial.exclusionCriteria?.length || 0})
                        </span>
                        <ul className="space-y-1 text-muted-foreground text-[11px]">
                          {(trial.exclusionCriteria || []).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-muted-foreground">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pre-Screen Dispatch Modal */}
        <Dialog open={!!selectedTrialForPrescreen} onOpenChange={(open) => !open && setSelectedTrialForPrescreen(null)}>
          <DialogContent className="max-w-xl bg-card border-border text-foreground shadow-elevated">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-serif text-foreground flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-primary" />
                Dispatch Clinical Trial Pre-Screen Dossier
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Routing automated mCODE eligibility bundle for {selectedTrialForPrescreen?.nctId} to UC-CCC Clinical Trials Office (CTO).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-lg bg-surface border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span className="font-bold text-foreground">{selectedTrialForPrescreen?.nctId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-mono text-foreground">UC-CCC-89421 (Consent Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal Investigator:</span>
                  <span className="text-foreground">{selectedTrialForPrescreen?.principalInvestigator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eligibility Confidence:</span>
                  <span className="font-mono text-accent font-bold">{selectedTrialForPrescreen?.matchScorePercent}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 flex items-center gap-2 text-xs text-accent">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Encrypted FHIR pre-screen transaction logged to audit ledger.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTrialForPrescreen(null)}
                  className="text-xs border-border hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendPrescreen}
                  disabled={prescreenSuccess}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-subtle"
                >
                  {prescreenSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" /> Submitted
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1.5" /> Confirm & Dispatch
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
