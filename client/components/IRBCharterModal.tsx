import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, FileText, CheckCircle2, UserCheck, Scale } from "lucide-react";

interface IRBCharterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IRBCharterModal({ open, onOpenChange }: IRBCharterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card text-foreground border-border shadow-elevated">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-serif text-foreground">
                Institutional Review Board (IRB) Protocol Charter
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs mt-0.5">
                Protocol #2024-ONC-0891: Governed Multi-Omic & Clinical Data Lakehouse Federation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs leading-relaxed text-foreground/90">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-surface border border-border">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Status</span>
              <Badge className="bg-primary/15 text-primary border-primary/30 mt-1 font-semibold text-[10px]">
                Active / Approved
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Principal Investigator</span>
              <span className="font-semibold text-foreground text-xs mt-1 block">Dr. Marcus Vance, MD</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Approval Date</span>
              <span className="font-mono text-foreground text-xs mt-1 block">2024-03-15</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Annual Renewal</span>
              <span className="font-mono text-foreground text-xs mt-1 block">2025-03-14</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm font-serif">
              <ShieldCheck className="w-4 h-4 text-accent" />
              1. Regulatory Authorization & Scope
            </h4>
            <p className="text-muted-foreground text-xs">
              This charter governs the secondary research use of de-identified electronic health records (EHR), whole exome sequencing (WES), bulk and single-cell RNA-sequencing (RNA-seq), digital whole slide imaging (WSI), and radiology DICOM series collected across UC-CCC Comprehensive Cancer Center network facilities.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm font-serif">
              <Lock className="w-4 h-4 text-primary" />
              2. Safe Harbor & Cryptographic De-identification
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground text-xs">
              <li>All 18 HIPAA identifiers are scrubbed prior to ingestion into the research enclave.</li>
              <li>Medical Record Numbers (MRNs) are irreversibly hashed using HMAC-SHA256 with key rotation.</li>
              <li>Dates of service are normalized using randomized temporal shifting (-30 to +30 days per cohort).</li>
              <li>Genomic variant calling complies with GA4GH genomic privacy guidelines.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm font-serif">
              <UserCheck className="w-4 h-4 text-accent" />
              3. Dynamic Consent & Open Policy Agent (OPA) Enforcement
            </h4>
            <p className="text-muted-foreground text-xs">
              Every query dispatched through the Cancer Data Commons is evaluated in real-time by the OPA policy engine against individual patient dynamic consent directives. Any patient who updates or revokes consent triggers instant query exclusion across analytical pipelines.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between text-muted-foreground text-xs">
            <span>IRB Compliance Office: <strong className="text-foreground">compliance@ucccc-commons.org</strong></span>
            <span className="font-mono text-[11px]">Version 4.2.0-PROD</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IRBCharterModal;
