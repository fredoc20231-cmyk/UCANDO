import { PlaceholderPage } from "@/components/PlaceholderPage";
import { SlidersHorizontal, Users, Filter, BarChart3, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CohortBuilder() {
  return (
    <PlaceholderPage
      title="Visual Cohort Query Builder"
      subtitle="Federated cross-modal cohort discovery across demographics, ICD/SNOMED/LOINC codes, genomic biomarkers, and treatment outcomes."
      badge="De-identified Analytics Zone"
      icon={<SlidersHorizontal className="w-6 h-6 text-sky-400" />}
      specs={[
        "Visual drag-and-drop query logic: Demographics, ICD-10 diagnoses, LOINC lab ranges, and genomic variants.",
        "Genomic biomarker filtering: Filter by gene (e.g. BRCA1, TP53, EGFC), VAF %, expression thresholds, and fusion transcripts.",
        "Treatment lines & outcomes: Filter by chemotherapy cycles, immunotherapy response, and 5-year survival.",
        "Live de-identified counts with differential privacy budgeting on data exports."
      ]}
      previewContent={
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-sky-400" /> Active Query Criteria
              </span>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800">
                12,480 Cohort Patients
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Diagnosis & Stage</span>
                <p className="font-semibold text-sky-300">Breast Cancer (ICD-10 C50.9) • Stage III</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Genomic Biomarker</span>
                <p className="font-semibold text-emerald-300">BRCA1 Pathogenic Variant (VAF &gt; 20%)</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Live Privacy Budget Remaining: <strong className="text-white font-mono">98.4 / 100.0 ε</strong></span>
            </div>
            <Badge variant="outline" className="border-slate-700 text-slate-300">OPA Evaluated</Badge>
          </div>
        </div>
      }
    />
  );
}
