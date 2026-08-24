import "./global.css";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BackgroundProvider } from "@/context/BackgroundContext";
import { AuthProvider } from "@/context/AuthContext";
import { RnaSeqProvider } from "@/context/RnaSeqContext";
import { RequireAuth } from "@/components/RequireAuth";

// Integration Hub Homepage
const Index = React.lazy(() => import("./pages/Index"));

// Core Scientific Modules
const Workspace = React.lazy(() => import("./pages/Workspace"));
const Login = React.lazy(() => import("./pages/Login"));

// Data Module
const DataUpload = React.lazy(() => import("./pages/DataUpload"));
const SampleMetadata = React.lazy(() => import("./pages/SampleMetadata"));
const QualityControl = React.lazy(() => import("./pages/QualityControl"));
const DatasetCatalog = React.lazy(() => import("./pages/DatasetCatalog"));

// Expression Module
const DifferentialExpression = React.lazy(() => import("./pages/DifferentialExpression"));
const Normalization = React.lazy(() => import("./pages/Normalization"));
const GeneLevelResults = React.lazy(() => import("./pages/GeneLevelResults"));
const IsoformAnalysis = React.lazy(() => import("./pages/IsoformAnalysis"));

// Pathways Module
const PathwaysGsea = React.lazy(() => import("./pages/PathwaysGsea"));
const PathwayActivity = React.lazy(() => import("./pages/PathwayActivity"));
const FunctionalAnnotation = React.lazy(() => import("./pages/FunctionalAnnotation"));
const NetworkAnalysis = React.lazy(() => import("./pages/NetworkAnalysis"));

// Visualization Module
const VolcanoStudio = React.lazy(() => import("./pages/VolcanoStudio"));
const PcaStudio = React.lazy(() => import("./pages/PcaStudio"));
const HeatmapStudio = React.lazy(() => import("./pages/HeatmapStudio"));
const DistributionsStudio = React.lazy(() => import("./pages/DistributionsStudio"));

// Advanced Module
const BatchCorrection = React.lazy(() => import("./pages/BatchCorrection"));
const CellDeconvolution = React.lazy(() => import("./pages/CellDeconvolution"));
const PredictiveModeling = React.lazy(() => import("./pages/PredictiveModeling"));
const MultiomicsIntegration = React.lazy(() => import("./pages/MultiomicsIntegration"));

// Informational & Documentation Modules
const Reports = React.lazy(() => import("./pages/Reports"));
const Methods = React.lazy(() => import("./pages/Methods"));
const About = React.lazy(() => import("./pages/About"));

// Supplementary Hub Pages
const Patient360 = React.lazy(() => import("./pages/Patient360"));
const PatientIntegration = React.lazy(() => import("./pages/PatientIntegration"));
const IucadoOrbitPage = React.lazy(() => import("./pages/IucadoOrbit"));
const ResearcherPortal = React.lazy(() => import("./pages/ResearcherPortal"));
const CohortBuilder = React.lazy(() => import("./pages/CohortBuilder"));
const DynamicConsent = React.lazy(() => import("./pages/DynamicConsent"));
const ImagingHub = React.lazy(() => import("./pages/ImagingHub"));
const OmicsView = React.lazy(() => import("./pages/OmicsView"));
const TrialMatching = React.lazy(() => import("./pages/TrialMatching"));
const Governance = React.lazy(() => import("./pages/Governance"));
const AuditDashboard = React.lazy(() => import("./pages/AuditDashboard"));
const DataQuality = React.lazy(() => import("./pages/DataQuality"));
const GlobalIntegrations = React.lazy(() => import("./pages/GlobalIntegrations"));
const Manual = React.lazy(() => import("./pages/Manual"));
const Architecture = React.lazy(() => import("./pages/Architecture"));
const Admin = React.lazy(() => import("./pages/Admin"));
const FhirCallback = React.lazy(() => import("./pages/FhirCallback"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-sans p-6 space-y-4">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <div className="absolute font-serif font-bold text-xs text-primary">UC</div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-sm font-serif font-semibold text-foreground tracking-tight">
        Loading Module...
      </p>
      <p className="text-xs text-muted-foreground font-mono">
        UCANDO Cancer Data Commons
      </p>
    </div>
  </div>
);

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BackgroundProvider>
        <RnaSeqProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Integration Hub Homepage */}
                  <Route path="/" element={<Index />} />

                  {/* Scientific Authentication */}
                  <Route path="/login" element={<Login />} />

                  {/* Primary Scientific Workspace */}
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/rnaseq" element={<Workspace />} />

                  {/* Data Sub-Module */}
                  <Route path="/data" element={<Navigate to="/data/upload" replace />} />
                  <Route path="/data/upload" element={<DataUpload />} />
                  <Route path="/data/samples" element={<SampleMetadata />} />
                  <Route path="/data/qc" element={<QualityControl />} />
                  <Route path="/data/catalog" element={<DatasetCatalog />} />

                  {/* Expression Sub-Module */}
                  <Route path="/expression" element={<Navigate to="/expression/differential" replace />} />
                  <Route path="/expression/differential" element={<DifferentialExpression />} />
                  <Route path="/expression/normalization" element={<Normalization />} />
                  <Route path="/expression/genes" element={<GeneLevelResults />} />
                  <Route path="/expression/isoforms" element={<IsoformAnalysis />} />

                  {/* Pathways Sub-Module */}
                  <Route path="/pathways" element={<Navigate to="/pathways/gsea" replace />} />
                  <Route path="/pathways/gsea" element={<PathwaysGsea />} />
                  <Route path="/pathways/activity" element={<PathwayActivity />} />
                  <Route path="/pathways/annotation" element={<FunctionalAnnotation />} />
                  <Route path="/pathways/network" element={<NetworkAnalysis />} />

                  {/* Visualization Sub-Module */}
                  <Route path="/visualization" element={<Navigate to="/visualization/volcano" replace />} />
                  <Route path="/visualization/volcano" element={<VolcanoStudio />} />
                  <Route path="/visualization/pca" element={<PcaStudio />} />
                  <Route path="/visualization/heatmap" element={<HeatmapStudio />} />
                  <Route path="/visualization/distributions" element={<DistributionsStudio />} />

                  {/* Advanced Sub-Module */}
                  <Route path="/advanced" element={<Navigate to="/advanced/batch" replace />} />
                  <Route path="/advanced/batch" element={<BatchCorrection />} />
                  <Route path="/advanced/deconvolution" element={<CellDeconvolution />} />
                  <Route path="/advanced/predictive" element={<PredictiveModeling />} />
                  <Route path="/advanced/multiomics" element={<MultiomicsIntegration />} />

                  {/* Reports, Methods, About */}
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/methods" element={<Methods />} />
                  <Route path="/about" element={<About />} />

                  {/* Supplementary Hub Integrations */}
                  <Route
                    path="/patient-360"
                    element={
                      <RequireAuth>
                        <Patient360 />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/patient-integration"
                    element={
                      <RequireAuth>
                        <PatientIntegration />
                      </RequireAuth>
                    }
                  />
                  <Route path="/iucado-orbit" element={<IucadoOrbitPage />} />
                  <Route path="/researcher-portal" element={<ResearcherPortal />} />
                  <Route path="/cohort-builder" element={<CohortBuilder />} />
                  <Route
                    path="/consent-console"
                    element={
                      <RequireAuth>
                        <DynamicConsent />
                      </RequireAuth>
                    }
                  />
                  <Route path="/imaging-hub" element={<ImagingHub />} />
                  <Route path="/omics-view" element={<OmicsView />} />
                  <Route path="/trial-matching" element={<TrialMatching />} />
                  <Route
                    path="/governance"
                    element={
                      <RequireAuth>
                        <Governance />
                      </RequireAuth>
                    }
                  />
                  <Route path="/fhir-callback" element={<FhirCallback />} />
                  <Route
                    path="/audit-dashboard"
                    element={
                      <RequireAuth>
                        <AuditDashboard />
                      </RequireAuth>
                    }
                  />
                  <Route path="/data-quality" element={<DataQuality />} />
                  <Route
                    path="/admin"
                    element={
                      <RequireAuth>
                        <Admin />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/global-integrations"
                    element={
                      <RequireAuth>
                        <GlobalIntegrations />
                      </RequireAuth>
                    }
                  />
                  <Route path="/manual" element={<Manual />} />
                  <Route path="/architecture" element={<Architecture />} />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </RnaSeqProvider>
      </BackgroundProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  const globalWithRoot = window as any;
  if (!globalWithRoot.__reactRoot) {
    globalWithRoot.__reactRoot = createRoot(rootElement);
  }
  globalWithRoot.__reactRoot.render(<App />);
}

export default App;
