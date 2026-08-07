import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Database,
  GitPullRequest,
  BarChart3,
  TrendingUp,
  Activity,
  ShieldAlert,
  Loader2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from "recharts";

interface AdminStats {
  totalPatients: number;
  totalSamples: number;
  totalActiveTrials: number;
  patientsByCancerType: { cancerType: string; count: number }[];
  patientsByTreatment: { treatment: string; count: number }[];
}

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/beacon/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
        setLoading(false);
      });
  }, []);

  const chartColors = [
    "#636EFA",
    "#EF553B",
    "#00CC96",
    "#FFA15A",
    "#AB63FA",
    "#19D3F3"
  ];

  if (loading || !stats) {
    return (
      <Layout>
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Loading UCANDO Admin Aggregate Statistics...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-white text-xs px-2.5 py-0.5">
                Executive Admin View
              </Badge>
              <Badge variant="outline" className="border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px]">
                Real-Time OMOP Aggregation
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-primary" />
              Institutional Administrative Dashboard
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Real-time patient census, multiomic sample inventory, and active clinical trial metrics across UC-CCC nodes.
            </p>
          </div>
        </div>

        {/* Top KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Consented Patients
              </CardTitle>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.totalPatients.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% MoM Population Ingestion
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Bio-Samples & Reads
              </CardTitle>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Database className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.totalSamples.toLocaleString()}
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> High-Throughput Sequenced
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Matching Trials
              </CardTitle>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <GitPullRequest className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.totalActiveTrials}
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> IRB Governed Protocols
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Patients by Cancer Type */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl p-4">
            <CardHeader className="px-2 pt-1 pb-4">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Patient Distribution by Tumor Type
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Primary oncologic diagnoses across active UC-CCC cohorts
              </p>
            </CardHeader>
            <CardContent className="px-0 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.patientsByCancerType}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="cancerType"
                    type="category"
                    tick={{ fontSize: 10 }}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {stats.patientsByCancerType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Patients by Treatment */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl p-4">
            <CardHeader className="px-2 pt-1 pb-4">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Patient Distribution by Treatment Regimen
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active protocol therapies & systemic treatment modalities
              </p>
            </CardHeader>
            <CardContent className="px-0 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.patientsByTreatment}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="treatment"
                    type="category"
                    tick={{ fontSize: 10 }}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {stats.patientsByTreatment.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[(index + 2) % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
