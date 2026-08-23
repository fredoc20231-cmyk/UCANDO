import React, { ReactNode } from "react";
import { Download, FileText, Info, Maximize2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScientificCardProps {
  title: string;
  subtitle?: string;
  methodCaption?: string;
  citation?: string;
  isModelDerived?: boolean;
  onExportCsv?: () => void;
  onExportSvg?: () => void;
  onExportPng?: () => void;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  minHeight?: string;
}

export const ScientificCard: React.FC<ScientificCardProps> = ({
  title,
  subtitle,
  methodCaption,
  citation,
  isModelDerived = false,
  onExportCsv,
  onExportSvg,
  onExportPng,
  children,
  className = "",
  headerAction,
  minHeight = "360px"
}) => {
  const handleGenericExport = () => {
    if (onExportCsv) {
      onExportCsv();
    } else {
      toast.success(`Exporting figure: ${title}`);
    }
  };

  return (
    <div
      className={`bg-card rounded-lg border ${
        isModelDerived ? "border-dashed border-accent/60" : "border-border"
      } shadow-subtle flex flex-col scientific-fade-in ${className}`}
      style={{ minHeight }}
    >
      {/* Scientific Card Header */}
      <div className="px-4 py-3 border-b border-border flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-semibold text-sm tracking-tight text-foreground">
              {title}
            </h3>
            {isModelDerived ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded border border-dashed border-accent text-accent font-medium font-sans">
                Model-Derived
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 rounded border border-border bg-surface text-muted-foreground font-medium font-sans">
                Observed
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground mt-0.5 font-sans leading-tight">
              {subtitle}
            </p>
          )}
        </div>

        {/* Upper-right Export & Action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {headerAction}

          {onExportCsv && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="h-7 px-2 text-[11px] font-sans border-border text-foreground hover:bg-muted gap-1"
              title="Download Data as CSV"
            >
              <Download className="w-3 h-3 text-primary" />
              <span>CSV</span>
            </Button>
          )}

          {onExportPng && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPng}
              className="h-7 px-2 text-[11px] font-sans border-border text-foreground hover:bg-muted gap-1"
              title="Export Image as PNG"
            >
              <span>PNG</span>
            </Button>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        {children}
      </div>

      {/* Footer / Provenance note / Method Caption */}
      {(methodCaption || citation) && (
        <div className="px-4 py-2 border-t border-border/70 bg-surface/40 rounded-b-lg flex items-center justify-between gap-2 text-[11px] text-muted-foreground font-sans">
          <div className="flex items-center gap-1.5 truncate">
            {methodCaption && (
              <span className="truncate">
                <strong>Method:</strong> {methodCaption}
              </span>
            )}
          </div>
          {citation && (
            <span className="shrink-0 text-[10px] text-muted-foreground/80 font-mono">
              Ref: {citation}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
