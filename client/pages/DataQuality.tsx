import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DataQualityReport } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
  Activity,
  AlertCircle
} from "lucide-react";

export default function DataQuality() {
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/beacon/data-quality")
      .then((res) => res.json())
      .then((data: DataQualityReport) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data quality report:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-950 text-sky-300 border border-sky-700/50 shadow-md">
                <Database className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">OMOP CDM v5.4 & mCODE Data Quality Hub</h1>
                  <Badge variant="outline" className="border-sky-500/40 text-sky-300 bg-sky-950/40 text-[10px]">
                    Automated Harmonization Engine
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated vocabulary normalization (SNOMED CT, LOINC, RxNorm, HGVS) & mCODE completeness scoring.
                </p>
              </div>
            </div>

            <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-xs py-1 px-3">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Overall Data Quality: {report?.overallScore}%
            </Badge>
          </div>

          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">OMOP CDM v5.4 Conformance</span>
              <p className="text-2xl font-bold text-emerald-400">{report?.omopConformanceScore}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">HL7 mCODE Completeness</span>
              <p className="text-2xl font-bold text-sky-400">{report?.mcodeCompletenessScore}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">BioCompute Object Provenance Valid</span>
              <p className="text-2xl font-bold text-purple-400">
                {report?.bioComputeObjectValidCount.toLocaleString()} / {report?.bioComputeObjectTotalCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Data Completeness by Modality */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Data Completeness Across Connected Spokes</h3>

          <div className="space-y-3">
            {report?.dataCompletenessByModalities.map((m) => (
              <div key={m.modality} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white">{m.modality}</span>
                  <span className="text-emerald-400 font-bold">{m.completenessPercent}% Complete</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${m.completenessPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Record Count: {m.recordCount.toLocaleString()}</span>
                  <span>Missing Fields: {m.missingFieldsCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Harmonization Log */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Vocabulary Mapping & Standardization Log</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Source System</th>
                  <th className="py-2.5 px-3">Raw Code</th>
                  <th className="py-2.5 px-3">Mapped Standard Term</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {report?.recentMappingErrors.map((err) => (
                  <tr key={err.id} className="hover:bg-slate-950/60">
                    <td className="py-3 px-3 text-slate-400">{err.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-white">{err.sourceSystem}</td>
                    <td className="py-3 px-3 text-amber-300">{err.rawCode}</td>
                    <td className="py-3 px-3 text-emerald-300">{err.mappedConcept}</td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          err.status === "Resolved"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]"
                            : "bg-amber-950 text-amber-300 border-amber-800 text-[10px]"
                        }
                      >
                        {err.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
