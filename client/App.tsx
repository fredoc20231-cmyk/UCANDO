import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BackgroundProvider } from "@/context/BackgroundContext";
import { AuthProvider } from "@/context/AuthContext";
import { RnaSeqProvider } from "@/context/RnaSeqContext";
import { RequireAuth } from "@/components/RequireAuth";

// Core Scientific Modules
import Workspace from "./pages/Workspace";
import Login from "./pages/Login";

// Data Module
import DataUpload from "./pages/DataUpload";
import SampleMetadata from "./pages/SampleMetadata";
import QualityControl from "./pages/QualityControl";
import DatasetCatalog from "./pages/DatasetCatalog";

// Expression Module
import DifferentialExpression from "./pages/DifferentialExpression";
import Normalization from "./pages/Normalization";
import GeneLevelResults from "./pages/GeneLevelResults";
import IsoformAnalysis from "./pages/IsoformAnalysis";

// Pathways Module
import PathwaysGsea from "./pages/PathwaysGsea";
import PathwayActivity from "./pages/PathwayActivity";
import FunctionalAnnotation from "./pages/FunctionalAnnotation";
import NetworkAnalysis from "./pages/NetworkAnalysis";

// Visualization Module
import VolcanoStudio from "./pages/VolcanoStudio";
import PcaStudio from "./pages/PcaStudio";
import HeatmapStudio from "./pages/HeatmapStudio";
import DistributionsStudio from "./pages/DistributionsStudio";

// Advanced Module
import BatchCorrection from "./pages/BatchCorrection";
import CellDeconvolution from "./pages/CellDeconvolution";
import PredictiveModeling from "./pages/PredictiveModeling";
import MultiomicsIntegration from "./pages/MultiomicsIntegration";

// Informational & Documentation Modules
import Reports from "./pages/Reports";
import Methods from "./pages/Methods";
import About from "./pages/About";

// Existing Supplementary Hub Pages
import Patient360 from "./pages/Patient360";
import ResearcherPortal from "./pages/ResearcherPortal";
import CohortBuilder from "./pages/CohortBuilder";
import DynamicConsent from "./pages/DynamicConsent";
import ImagingHub from "./pages/ImagingHub";
import OmicsView from "./pages/OmicsView";
import TrialMatching from "./pages/TrialMatching";
import Governance from "./pages/Governance";
import AuditDashboard from "./pages/AuditDashboard";
import DataQuality from "./pages/DataQuality";
import GlobalIntegrations from "./pages/GlobalIntegrations";
import Manual from "./pages/Manual";
import Architecture from "./pages/Architecture";
import Admin from "./pages/Admin";
import FhirCallback from "./pages/FhirCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BackgroundProvider>
        <RnaSeqProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Scientific Authentication */}
                <Route path="/login" element={<Login />} />

                {/* Primary Scientific Workspace */}
                <Route path="/" element={<Workspace />} />
                <Route path="/workspace" element={<Workspace />} />

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
            </BrowserRouter>
          </TooltipProvider>
        </RnaSeqProvider>
      </BackgroundProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
