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
      colorClass: "border-[#636EFA]/50 text-[#636EFA] bg-card hover:border-[#636EFA] hover:bg-[#EEF1FF] dark:hover:bg-[#1F2937]"
    },
    {
      id: "omics",
      label: "Genomics & Omics",
      sublabel: `${patient.genomics.length} Variants Detected (BRCA1)`,
      icon: Cpu,
      tabKey: "genomics",
      colorClass: "border-[#AB63FA]/50 text-[#AB63FA] bg-card hover:border-[#AB63FA] hover:bg-[#EEF1FF] dark:hover:bg-[#1F2937]"
    },
    {
      id: "metabolomics",
      label: "Metabolomics",
      sublabel: `${patient.metabolomics?.length || 4} Biomarkers (D-2-HG)`,
      icon: Activity,
      tabKey: "labs",
      colorClass: "border-[#FFA15A]/50 text-[#FFA15A] bg-card hover:border-[#FFA15A] hover:bg-[#FFF7ED] dark:hover:bg-[#1F2937]"
    },
    {
      id: "labs",
      label: "Lab Results",
      sublabel: `${patient.measurements.length} LOINC Measurements`,
      icon: FlaskConical,
      tabKey: "labs",
      colorClass: "border-[#00CC96]/50 text-[#00CC96] bg-card hover:border-[#00CC96] hover:bg-[#ECFDF5] dark:hover:bg-[#1F2937]"
    },
    {
      id: "pathology",
      label: "Pathology WSI",
      sublabel: "Whole Slide Digital Tissue",
      icon: Layers,
      tabKey: "imaging",
      colorClass: "border-[#EF553B]/50 text-[#EF553B] bg-card hover:border-[#EF553B] hover:bg-[#FEF2F2] dark:hover:bg-[#1F2937]"
    },
    {
      id: "imaging",
      label: "Radiology DICOM",
      sublabel: `${patient.imaging.length} PET/CT & MRI Studies`,
      icon: ImageIcon,
      tabKey: "imaging",
      colorClass: "border-[#19D3F3]/50 text-[#19D3F3] bg-card hover:border-[#19D3F3] hover:bg-[#ECFEFF] dark:hover:bg-[#1F2937]"
    }
  ];

  // Orbit radius in pixels
  const radius = 210;

  return (
    <div className="relative w-full min-h-[560px] p-6 rounded-xl bg-card border border-border shadow-subtle overflow-hidden flex items-center justify-center">
      {/* Background Orbit Ring SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        <defs>
          <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#636EFA" stopOpacity="0.08" />
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
          className="text-border stroke-dasharray-[6_6]"
        />

        {/* Outer secondary track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius + 35}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border/60 stroke-dasharray-[4_8]"
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
              strokeWidth="1"
              className="text-border transition-colors"
            />
          );
        })}
      </svg>

      {/* Orbit Container */}
      <div className="relative w-full max-w-[620px] h-[500px] flex items-center justify-center z-10">

        {/* Central Patient Node */}
        <div className="relative z-20 flex flex-col items-center justify-center w-48 h-48 rounded-full bg-card border-4 border-primary shadow-elevated p-4 text-center space-y-1.5 transition-all transform hover:scale-105 ring-8 ring-primary/10">
          <div className="p-2 rounded-full bg-primary/10 text-primary border border-primary/30 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-foreground tracking-tight">
              {patient.demographics.id}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              {patient.demographics.age} y/o {patient.demographics.sex}
            </p>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] px-2 py-0.5 truncate max-w-[160px] rounded-full">
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
              className={`absolute p-3 rounded-xl border shadow-subtle flex items-center gap-3 transition-all duration-200 group hover:scale-105 hover:z-30 text-left w-48 ${node.colorClass}`}
              title={`Click to inspect ${node.label}`}
            >
              <div className="p-2 rounded-lg bg-muted border border-border shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="font-semibold text-xs text-foreground truncate flex items-center justify-between">
                  <span>{node.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">
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
