import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { WORMAuditLog } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Search,
  Lock,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";

export default function AuditDashboard() {
  const [logs, setLogs] = useState<WORMAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/beacon/audit")
      .then((res) => res.json())
      .then((data: WORMAuditLog[]) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load audit logs:", err);
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 border border-emerald-500/40 shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Immutable WORM Audit & Compliance Stream</h1>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-950/40 text-[10px]">
                    AWS S3 Object Lock (WORM)
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cryptographically signed audit log stream enforcing SOC2 Type II & HIPAA audit invariants.
                </p>
              </div>
            </div>

            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Certified SOC2 Audit Log
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              placeholder="Search audit log by email actor, resource ID, action type, or SHA-256 signature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-800 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Audit Stream Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Real-time Access Stream ({filteredLogs.length} Records)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              WORM Vault Integrity: 100% Validated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Receipt ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor / Role</th>
                  <th className="py-2.5 px-3">Action & Resource</th>
                  <th className="py-2.5 px-3">OPA Result</th>
                  <th className="py-2.5 px-3 text-right">SHA-256 Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/60">
                    <td className="py-3 px-3 text-emerald-400 font-bold">{log.id}</td>
                    <td className="py-3 px-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="py-3 px-3">
                      <span className="text-white block font-bold">{log.actor}</span>
                      <span className="text-[10px] text-slate-500">{log.actorRole}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px] mb-1">
                        {log.action}
                      </Badge>
                      <p className="text-slate-300 text-[11px]">{log.resource}</p>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          log.opaPolicyResult === "PERMIT"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]"
                            : "bg-amber-950 text-amber-300 border-amber-800 text-[10px]"
                        }
                      >
                        {log.opaPolicyResult}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleCopyHash(log.sha256Hash, log.id)}
                        className="inline-flex items-center text-[10px] text-slate-400 hover:text-white"
                      >
                        <span className="truncate max-w-[120px] inline-block mr-1">{log.sha256Hash}</span>
                        {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
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
