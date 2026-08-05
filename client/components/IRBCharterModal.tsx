import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IRBCharterDoc } from "@shared/api";
import { ShieldCheck, FileText, Lock, Landmark } from "lucide-react";

interface IRBCharterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IRBCharterModal({ open, onOpenChange }: IRBCharterModalProps) {
  const [charter, setCharter] = useState<IRBCharterDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && !charter) {
      fetch("/api/beacon/governance/charter")
        .then((res) => res.json())
        .then((data) => {
          setCharter(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load IRB charter:", err);
          setLoading(false);
        });
    }
  }, [open, charter]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                IRB Governance Charter & Consent Framework
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Phase 0 Governance Charter, IRB Approval Protocol & Builder.io PHI-Free Compliance Directives.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading IRB Governance Charter...</div>
        ) : charter ? (
          <div className="space-y-4 text-xs mt-2">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{charter.title}</p>
                <div className="flex items-center gap-3 mt-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>IRB Approval: <strong className="text-amber-700 dark:text-amber-400 font-mono">{charter.irbApprovalNumber}</strong></span>
                  <span>•</span>
                  <span>Version: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{charter.version}</strong></span>
                  <span>•</span>
                  <span>Effective: <strong className="text-slate-800 dark:text-slate-200">{charter.effectiveDate}</strong></span>
                </div>
              </div>
              <Badge className="bg-emerald-100 dark:bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> IRB Approved
              </Badge>
            </div>

            <div className="space-y-3">
              {charter.sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-maroon dark:text-rose-400" />
                    {sec.heading}
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-brand-maroon dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <p className="font-semibold text-rose-950 dark:text-rose-300">Mandatory Security Sign-off Gate</p>
                <p className="text-rose-900/80 dark:text-rose-200/80 mt-0.5">
                  Standing rule: No platform go-live without formal sign-off from IRB liaison, Chief Information Security Officer (CISO), and UCANDO Privacy Officer.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
