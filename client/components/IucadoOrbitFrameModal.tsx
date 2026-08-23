import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { IucadoOrbitEngine } from "./IucadoOrbitEngine";
import { Sparkles, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface IucadoOrbitFrameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function IucadoOrbitFrameModal({
  isOpen,
  onClose,
  initialQuery
}: IucadoOrbitFrameModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto p-0 bg-background border-border shadow-elevated">
        <DialogHeader className="p-4 border-b border-border bg-surface/80 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <DialogTitle className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>iUCADO-Orbit: Clinical Evidence & Literature Synthesis Frame</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-sans">
              High-confidence evidence reasoning grounded in PubMed, NCCN, and clinical trial matrices
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2 pr-6">
            <Link to="/iucado-orbit" onClick={onClose}>
              <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-border">
                <Maximize2 className="w-3 h-3" />
                <span>Open Full Page</span>
              </Button>
            </Link>
          </div>
        </DialogHeader>

        <div className="p-2 sm:p-4">
          <IucadoOrbitEngine
            initialQuery={initialQuery}
            isModal={true}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
