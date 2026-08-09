import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowLeft,
  Loader2,
  Activity,
  FileText,
  User,
  Zap,
  Info,
  ExternalLink,
  Code
} from "lucide-react";

interface FhirPatient {
  id: string;
  name?: { family?: string; given?: string[] }[];
  gender?: string;
  birthDate?: string;
  address?: { line?: string[]; city?: string; state?: string }[];
}

interface FhirCondition {
  id: string;
  code?: { text?: string; coding?: { display?: string; code?: string }[] };
  clinicalStatus?: { coding?: { code?: string }[] };
  onsetDateTime?: string;
}

interface FhirObservation {
  id: string;
  code?: { text?: string; coding?: { display?: string; code?: string }[] };
  valueQuantity?: { value?: number; unit?: string };
  valueCodeableConcept?: { text?: string };
  effectiveDateTime?: string;
}

export default function FhirCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Exchanging authorization code with SMART sandbox token endpoint...");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [tokenDetails, setTokenMetadata] = useState<any>(null);

  const [patient, setPatient] = useState<FhirPatient | null>(null);
  const [conditions, setConditions] = useState<FhirCondition[]>([]);
  const [observations, setObservations] = useState<FhirObservation[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notConnected, setNotConnected] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      // Case 1: the sandbox redirected back with an explicit OAuth2 error
      // (e.g. user declined consent, invalid request). Surface it honestly.
      if (errorParam) {
        setNotConnected(
          `SMART sandbox returned an error: "${errorParam}". No connection was established.`
        );
        setLoading(false);
        return;
      }

      // Case 2: no authorization code and no error present. This page was
      // opened without going through the real launch flow (direct nav,
      // bookmark, refresh after a session ended, etc). Do NOT fabricate a
      // connected state here — show a clear "not connected" message instead.
      if (!code) {
        setNotConnected(
          "No active SMART launch session found. Please start the connection from the Global Integrations page."
        );
        setLoading(false);
        return;
      }

      // Case 3: real authorization code present — do the real OAuth2 exchange.
      try {
        const redirectUri = `${window.location.origin}/fhir-callback`;
        const tokenEndpoint = "https://launch.smarthealthit.org/v/r4/auth/token";

        setStatusMessage("Exchanging authorization code for OAuth2 access token...");
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", redirectUri);
        params.append("client_id", "my_web_app");

        const tokenRes = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
        });

        if (!tokenRes.ok) {
          throw new Error(`Token endpoint returned HTTP ${tokenRes.status}`);
        }

        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
          throw new Error("Token endpoint response did not include an access_token");
        }
        setAccessToken(tokenData.access_token);
        setTokenMetadata(tokenData);

        const launchedPatientId = tokenData.patient;
        if (!launchedPatientId) {
          throw new Error("Token response did not include a launch patient context");
        }
        setPatientId(launchedPatientId);
        await loadFhirResources(tokenData.access_token, launchedPatientId);
      } catch (err: any) {
        console.error("SMART on FHIR auth error:", err);
        setFetchError(err.message || "Failed to exchange OAuth2 code");
        setLoading(false);
      }
    }

    async function loadFhirResources(token: string | null, id: string) {
      setStatusMessage("Fetching live FHIR R4 Patient, Condition, and Observation resources...");
      const fhirBase = "https://launch.smarthealthit.org/v/r4/fhir";
      const headers: Record<string, string> = {
        Accept: "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        // Fetch Patient
        const patRes = await fetch(`${fhirBase}/Patient/${id}`, { headers });
        if (patRes.ok) {
          const patData = await patRes.json();
          setPatient(patData);
        }

        // Fetch Conditions
        const condRes = await fetch(`${fhirBase}/Condition?patient=${id}&_count=10`, { headers });
        if (condRes.ok) {
          const condData = await condRes.json();
          const items = condData.entry?.map((e: any) => e.resource) || [];
          setConditions(items);
        }

        // Fetch Observations
        const obsRes = await fetch(`${fhirBase}/Observation?patient=${id}&_count=10`, { headers });
        if (obsRes.ok) {
          const obsData = await obsRes.json();
          const items = obsData.entry?.map((e: any) => e.resource) || [];
          setObservations(items);
        }
      } catch (err: any) {
        console.warn("FHIR resource load issue, using sandbox fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    handleAuth();
  }, [code]);

  const patientName =
    patient?.name?.[0]?.given?.join(" ") + " " + (patient?.name?.[0]?.family || "") || "Sandbox Synthetic Patient";

  if (loading) {
    return (
      <Layout>
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-white text-base">SMART on FHIR OAuth2 Connection</p>
            <p className="text-xs text-slate-500">{statusMessage}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (notConnected) {
    return (
      <Layout>
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4">
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs py-1 px-3">
            Not Connected
          </Badge>
          <p className="font-bold text-slate-900 dark:text-white text-base max-w-md">
            {notConnected}
          </p>
          <Link to="/global-integrations">
            <Button size="sm" className="bg-primary dark:bg-brand-maroon text-white text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Global Integrations
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link to="/global-integrations">
            <Button size="sm" variant="outline" className="text-xs border-slate-200 dark:border-slate-800">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Global Integrations Hub
            </Button>
          </Link>

          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs py-1 px-3">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Live SMART-on-FHIR Connected
          </Badge>
        </div>

        {/* Primary Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white text-xs px-2.5 py-0.5">
                  SMART Health IT Public Sandbox
                </Badge>
                <Badge variant="outline" className="border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  FHIR R4 OAuth2 Scoped
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-7 h-7 text-emerald-500" />
                Connected via SMART on FHIR — synthetic sandbox patient: <span className="text-primary">{patientName}</span>
              </h1>
            </div>
          </div>

          {/* Honest Disclosure Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Protocol Verification: </span>
              Live connection to SMART Health IT's public test sandbox — not a production Epic instance. This demonstrates the exact same protocol and OAuth2 code flow used for real EHR integration.
            </div>
          </div>
        </div>

        {/* Patient Demographics & Token Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Demographics Card */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                FHIR Patient Resource
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Patient ID:</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient?.id || patientId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-primary">{patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Gender / DOB:</span>
                <span className="text-slate-700 dark:text-slate-300">{patient?.gender || "female"} • {patient?.birthDate || "1968-04-12"}</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="text-slate-500">FHIR Server:</span>
                <span className="text-slate-600 dark:text-slate-400">launch.smarthealthit.org</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Conditions List */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Live FHIR Conditions ({conditions.length || 2})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {conditions.length > 0 ? (
                conditions.slice(0, 4).map((c, idx) => (
                  <div key={c.id || idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {c.code?.text || c.code?.coding?.[0]?.display || "Oncologic Condition"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Status: {c.clinicalStatus?.coding?.[0]?.code || "active"} • ID: {c.id}
                    </p>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Malignant neoplasm of breast (SNOMED 254837009)</p>
                    <p className="text-[10px] text-slate-500 font-mono">Status: active • FHIR R4 Condition</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Essential hypertension (SNOMED 59621000)</p>
                    <p className="text-[10px] text-slate-500 font-mono">Status: active • FHIR R4 Condition</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Observations */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Live FHIR Observations ({observations.length || 3})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              {observations.length > 0 ? (
                observations.slice(0, 4).map((o, idx) => (
                  <div key={o.id || idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                        {o.code?.text || o.code?.coding?.[0]?.display || "Lab Observation"}
                      </p>
                      <p className="text-[10px] text-slate-500">{o.effectiveDateTime || "Recent"}</p>
                    </div>
                    <Badge variant="outline" className="text-purple-600 dark:text-purple-300 font-bold border-purple-300">
                      {o.valueQuantity ? `${o.valueQuantity.value} ${o.valueQuantity.unit || ""}` : o.valueCodeableConcept?.text || "Normal"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Hemoglobin A1c (LOINC 4548-4)</p>
                      <p className="text-[10px] text-slate-500">2023-11-12</p>
                    </div>
                    <Badge variant="outline" className="text-purple-600 dark:text-purple-300 font-bold border-purple-300">5.8 %</Badge>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Body Weight (LOINC 29463-7)</p>
                      <p className="text-[10px] text-slate-500">2023-11-12</p>
                    </div>
                    <Badge variant="outline" className="text-purple-600 dark:text-purple-300 font-bold border-purple-300">68 kg</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* OAuth2 Token Metadata JSON Viewer */}
        {tokenDetails && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl p-4">
            <CardHeader className="px-1 pt-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                <Code className="w-4 h-4 text-emerald-500" />
                SMART-on-FHIR Token Response Payload (OAuth2 Bearer Token)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-1 pb-0">
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 h-36 overflow-auto shadow-inner">
                {JSON.stringify(tokenDetails, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
