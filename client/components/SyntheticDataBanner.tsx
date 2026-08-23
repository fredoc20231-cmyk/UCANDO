import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export const SyntheticDataBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-1.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 shadow-subtle backdrop-blur-sm z-50 relative">
      <div className="max-w-[1700px] mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-950 dark:text-amber-100">Synthetic de-identified research data</strong> — for demonstration and hypothesis generation
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:text-amber-950 dark:text-amber-400 dark:hover:text-white hover:bg-amber-500/20 p-1 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/50 shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SyntheticDataBanner;
