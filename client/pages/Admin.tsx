import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Users,
  Database,
  GitPullRequest,
  BarChart3,
  TrendingUp,
  Activity,
  ShieldAlert,
  Loader2,
  RotateCcw,
  UserPlus,
  CheckCircle2,
  Clock
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
import { toast } from "sonner";
import { CHART_PALETTES } from "@/lib/theme";

interface RegisteredPatient {
  patientId: string;
  name: string;
  mrn: string;
  diagnosis: string;
  primarySite: string;
  age: number;
  gender: string;
  treatment?: string;
  registeredAt: string;
}

interface AdminStats {
  totalPatients: number;
  totalSamples: number;
  totalActiveTrials: number;
  registeredPatientsCount?: number;
  patientsByCancerType: { cancerType: string; count: number }[];
  patientsByTreatment: { treatment: string; count: number }[];
  recentRegistrations?: RegisteredPatient[];
}

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [regDialogOpen, setRegDialogOpen] = useState(false);
  const [submittingReg, setSubmittingReg] = useState(false);

  // Form state
  const [regName, setRegName] = useState("Eleanor Vance");
  const [regMrn, setRegMrn] = useState("UC-884920-X");
  const [regDiagnosis, setRegDiagnosis] = useState("Invasive Breast Carcinoma");
  const [regAge, setRegAge] = useState(54);
  const [regGender, setRegGender] = useState("Female");
  const [regTreatment, setRegTreatment] = useState("AC-T Chemo + Pembrolizumab");

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/beacon/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      toast.error("Failed to refresh admin stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRegisterPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReg(true);

    try {
      const res = await fetch("/api/beacon/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          mrn: regMrn,
          diagnosis: regDiagnosis,
          age: Number(regAge),
          gender: regGender,
          treatment: regTreatment
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Registered Patient ${data.patientId}!`, {
          description: `MRN: ${data.patient?.mrn || regMrn} • ${regDiagnosis}`
        });
        setRegDialogOpen(false);
        await fetchStats();
      } else {
        toast.error("Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Failed to submit patient registration");
    } finally {
      setSubmittingReg(false);
    }
  };

  const chartColors = CHART_PALETTES.categorical;

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

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchStats}
              disabled={refreshing}
              className="border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
              <span>Refresh Stats</span>
            </Button>

            <Dialog open={regDialogOpen} onOpenChange={setRegDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-md">
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  <span>+ Register New Patient</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Register New Consented Patient
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegisterPatientSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Patient Full Name</Label>
                    <Input
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      required
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">MRN Identifier</Label>
                      <Input
                        value={regMrn}
                        onChange={(e) => setRegMrn(e.target.value)}
                        placeholder="e.g. UC-884920-X"
                        required
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Age & Gender</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={regAge}
                          onChange={(e) => setRegAge(Number(e.target.value))}
                          placeholder="Age"
                          required
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs w-20"
                        />
                        <Input
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value)}
                          placeholder="Female/Male"
                          required
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Oncologic Diagnosis</Label>
                    <Input
                      value={regDiagnosis}
                      onChange={(e) => setRegDiagnosis(e.target.value)}
                      placeholder="e.g. Invasive Breast Carcinoma"
                      required
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Treatment Regimen</Label>
                    <Input
                      value={regTreatment}
                      onChange={(e) => setRegTreatment(e.target.value)}
                      placeholder="e.g. AC-T Chemo + Pembrolizumab"
                      required
                      className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="button" variant="ghost" onClick={() => setRegDialogOpen(false)} className="text-xs">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submittingReg} className="bg-primary hover:bg-primary/90 text-white text-xs font-bold">
                      {submittingReg ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                      Register & Update Census
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
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
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
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

        {/* Live Registrations Section */}
        {stats.recentRegistrations && stats.recentRegistrations.length > 0 && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl p-5">
            <CardHeader className="px-1 pt-0 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Live Session Patient Registrations ({stats.registeredPatientsCount})
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Patients registered during this live demo session with automatic OPA consent initialization
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                Active Census Feed
              </Badge>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">
                      <th className="py-2 px-3">Patient ID</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">MRN</th>
                      <th className="py-2 px-3">Diagnosis</th>
                      <th className="py-2 px-3">Age / Sex</th>
                      <th className="py-2 px-3">Treatment Regimen</th>
                      <th className="py-2 px-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-mono">
                    {stats.recentRegistrations.map((p) => (
                      <tr key={p.patientId} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-primary">{p.patientId}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-500">{p.mrn}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{p.diagnosis}</td>
                        <td className="py-2.5 px-3">{p.age} y/o {p.gender}</td>
                        <td className="py-2.5 px-3 text-purple-600 dark:text-purple-400">{p.treatment || "N/A"}</td>
                        <td className="py-2.5 px-3 text-right text-slate-400 text-[10px]">
                          {new Date(p.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
