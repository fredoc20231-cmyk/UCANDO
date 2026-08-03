import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Image, ExternalLink, Play, Eye } from "lucide-react";

export default function ImagingHub() {
  return (
    <PlaceholderPage
      title="Imaging Launch Hub"
      subtitle="Study list from FHIR ImagingStudy, DICOMweb QIDO/WADO study retrieval, and one-click OHIF viewer deep-links."
      badge="DICOMweb + OHIF Embedded"
      icon={<Image className="w-6 h-6 text-sky-400" />}
      specs={[
        "Study List Ingestion: Real-time synchronization of radiology DICOM (CT, MRI, PET/CT) and digital pathology Whole Slide Images (WSI).",
        "One-Click OHIF Viewer Launch: Launches zero-client OHIF viewer canvas inside the Beacon UI shell.",
        "Signed Context Tokens: Short-lived 15-minute context tokens carrying zero-PHI research parameters into PACS platforms.",
        "AI Radiomics Write-Back: Radiomics and pathology AI outputs return to hub as FHIR Observation and DiagnosticReport."
      ]}
    />
  );
}
