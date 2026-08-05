import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackgroundProvider } from "@/context/BackgroundContext";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";

import Index from "./pages/Index";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BackgroundProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
                path="/global-integrations"
                element={
                  <RequireAuth>
                    <GlobalIntegrations />
                  </RequireAuth>
                }
              />
              <Route path="/manual" element={<Manual />} />

              {/* CATCH-ALL CATCH ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BackgroundProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
