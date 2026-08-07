import React from "react";
import { Patient360Record } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Cpu,
  FlaskConical,
  Activity,
  Layers,
  Image as ImageIcon,
  User,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface PatientOrbitViewProps {
  patient: Patient360Record;
  onSelectTab: (tabKey: string) => void;
}

export function PatientOrbitView({ patient, onSelectTab }: PatientOrbitViewProps) {
  const satellites = [
    {
      id: "ehr",
      label: "EHR & Demographics",
      sublabel: `${patient.conditionOccurrences.length} Conditions • ${patient.procedureOccurrences.length} Procedures`,
      icon: Server,
      tabKey: "timeline",
      colorClass: "border-sky-500 text-sky-400 bg-slate-900/90 hover:bg-sky-950/80 shadow-sky-500/20"
    },
    {
      id: "omics",
      label: "Genomics & Omics",
      sublabel: `${patient.genomics.length} Variants Detected (BRCA1)`,
      icon: Cpu,
      tabKey: "omics",
      colorClass: "border-purple-500 text-purple-400 bg-slate-900/90 hover:bg-purple-950/80 shadow-purple-500/20"
    },
    {
      id: "metabolomics",
      label: "Metabolomics",
      sublabel: `${patient.metabolomics?.length || 4} Biomarkers (D-2-HG)`,
      icon: Activity,
      tabKey: "labs",
      colorClass: "border-amber-500 text-amber-400 bg-slate-900/90 hover:bg-amber-950/80 shadow-amber-500/20"
    },
    {
      id: "labs",
      label: "Lab Results",
      sublabel: `${patient.measurements.length} LOINC Measurements`,
      icon: FlaskConical,
      tabKey: "labs",
      colorClass: "border-emerald-500 text-emerald-400 bg-slate-900/90 hover:bg-emerald-950/80 shadow-emerald-500/20"
    },
    {
      id: "pathology",
      label: "Pathology WSI",
      sublabel: "Whole Slide Digital Tissue",
      icon: Layers,
      tabKey: "imaging",
      colorClass: "border-rose-500 text-rose-400 bg-slate-900/90 hover:bg-rose-950/80 shadow-rose-500/20"
    },
    {
      id: "imaging",
      label: "Radiology DICOM",
      sublabel: `${patient.imaging.length} PET/CT & MRI Studies`,
      icon: ImageIcon,
      tabKey: "imaging",
      colorClass: "border-indigo-500 text-indigo-400 bg-slate-900/90 hover:bg-indigo-950/80 shadow-indigo-500/20"
    }
  ];

  // Orbit radius in pixels
  const radius = 210;

  return (
    <div className="relative w-full min-h-[560px] p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
      {/* Background Orbit Ring SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        <defs>
          <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#636EFA" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#636EFA" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background glow circle */}
        <circle cx="50%" cy="50%" r={radius} fill="url(#orbitGlow)" />
        
        {/* Main orbit track circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-300 dark:text-slate-800 stroke-dasharray-[6_6]"
        />

        {/* Outer secondary track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius + 35}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-slate-200 dark:text-slate-900 stroke-dasharray-[4_8]"
        />

        {/* Connecting spokes from center to 6 satellites */}
        {satellites.map((_, idx) => {
          const angleDeg = -90 + idx * 60;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x2 = 50 + (radius / 5.5) * Math.cos(angleRad);
          const y2 = 50 + (radius / 5.5) * Math.sin(angleRad);

          return (
            <line
              key={idx}
              x1="50%"
              y1="50%"
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-slate-300 dark:text-slate-800 transition-colors"
            />
          );
        })}
      </svg>

      {/* Orbit Container */}
      <div className="relative w-full max-w-[620px] h-[500px] flex items-center justify-center z-10">
        
        {/* Central Patient Node */}
        <div className="relative z-20 flex flex-col items-center justify-center w-48 h-48 rounded-full bg-white dark:bg-slate-900 border-4 border-primary shadow-2xl p-4 text-center space-y-1.5 transition-all transform hover:scale-105 ring-8 ring-primary/10">
          <div className="p-2 rounded-full bg-primary/10 text-primary border border-primary/30 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="font-mono font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
              {patient.demographics.id}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {patient.demographics.age} y/o {patient.demographics.sex}
            </p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/40 text-[10px] px-2 py-0.5 truncate max-w-[160px]">
            {patient.demographics.oncoSubtype || patient.demographics.primaryDiagnosis}
          </Badge>
        </div>

        {/* 6 Orbital Satellite Nodes */}
        {satellites.map((node, idx) => {
          const angleDeg = -90 + idx * 60;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Compute pixel offset from center
          const x = radius * Math.cos(angleRad);
          const y = radius * Math.sin(angleRad);

          const Icon = node.icon;

          return (
            <button
              key={node.id}
              onClick={() => onSelectTab(node.tabKey)}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              className={`absolute p-3 rounded-2xl border shadow-xl flex items-center gap-3 transition-all duration-300 group hover:scale-110 hover:z-30 text-left w-48 ${node.colorClass}`}
              title={`Click to inspect ${node.label}`}
            >
              <div className="p-2 rounded-xl bg-white/10 border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center justify-between">
                  <span>{node.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                  {node.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
