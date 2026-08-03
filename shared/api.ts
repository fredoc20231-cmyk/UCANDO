/**
 * Shared API types for Beacon — UChicago Cancer Data Commons ("UCCANDO")
 */

export interface DemoResponse {
  message: string;
}

export interface HubDataZone {
  name: "Raw (Identified)" | "Curated (Controlled)" | "De-identified (Analytics)" | "Public (GA4GH Beacon)";
  code: "raw" | "curated" | "deid" | "public";
  count: number;
  description: string;
  securityLevel: string;
}

export interface HubStats {
  totalConsentedPatients: number;
  totalBiospecimens: number;
  totalImagingStudies: number;
  totalOmicsProfiles: number;
  activeWorkspaces: number;
  hipaaComplianceScore: number;
  dataZones: HubDataZone[];
  eventBusTps: number;
  opaPolicyEnforcementsToday: number;
}

export type SpokeId = "ehr" | "omics" | "imaging" | "lims" | "registry" | "workspaces" | "beacon";

export interface SpokeConnection {
  id: SpokeId;
  name: string;
  subtitle: string;
  integrationMode: string;
  status: "connected" | "degraded" | "syncing" | "offline";
  latencyMs: number;
  throughputTps: number;
  lastSync: string;
  protocol: string;
  eventsCountToday: number;
  description: string;
}

export interface PatientDemographics {
  id: string;
  deIdentifiedId: string;
  mrn: string;
  age: number;
  gender: string;
  ethnicity: string;
  primaryDiagnosis: string;
  stage: string;
  oncoSubtype: string;
  attendingPhysician: string;
  primaryCenter: string;
  consentStatus: "Consented" | "Pending" | "Restricted" | "Withdrawn";
}

export interface PatientConsent {
  status: "Active" | "Pending" | "Withdrawn";
  effectiveDate: string;
  lastVerified: string;
  opaPolicyId: string;
  permissions: {
    researchUse: boolean;
    recontactGranted: boolean;
    biospecimensUse: boolean;
    aiModelTraining: boolean;
    commercialSharing: boolean;
  };
}

export type ClinicalEventType = 
  | "diagnosis" 
  | "surgery" 
  | "treatment" 
  | "genomics" 
  | "imaging" 
  | "toxicity" 
  | "recurrence" 
  | "survival" 
  | "lab";

export interface ClinicalTimelineEvent {
  id: string;
  date: string;
  type: ClinicalEventType;
  title: string;
  description: string;
  category: string;
  severity?: "normal" | "mild" | "moderate" | "severe" | "critical";
  sourceSpoke: SpokeId;
  metadata?: Record<string, string | number>;
  smartLaunchAvailable?: boolean;
  deepLink?: string;
}

export interface GenomicVariant {
  id: string;
  gene: string;
  hgvs: string;
  variantType: "SNV" | "Indel" | "CNV" | "FUSION";
  vafPercent: number;
  consequence: string;
  pathogenicity: "Pathogenic" | "Likely Pathogenic" | "VUS" | "Benign";
  readDepth: number;
  pipelineVersion: string;
  bioComputeObject: string;
  multiomicsPlatformJobId: string;
}

export interface ImagingStudy {
  studyId: string;
  accessionNumber: string;
  modality: "CT" | "MRI" | "PET/CT" | "WSI" | "Pathology";
  studyDate: string;
  bodyPart: string;
  instancesCount: number;
  dicomWebEndpoint: string;
  ohifViewerUrl: string;
  aiAnnotationsCount: number;
  findingsSummary: string;
}

export interface LabResult {
  date: string;
  marker: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: "Normal" | "Elevated" | "High Risk" | "Low";
}

export interface InfusionRegimen {
  id: string;
  drugName: string;
  dose: string;
  route: string;
  cycle: string;
  startDate: string;
  endDate?: string;
  toxicityGrade?: number;
  toxicityNotes?: string;
  status: "Completed" | "Active" | "Discontinued";
}

export interface Biospecimen {
  specimenId: string;
  type: "FFPE Tumor Block" | "Frozen Tissue" | "Buffy Coat Blood" | "Plasma";
  anatomicSite: string;
  volume: string;
  collectionDate: string;
  limsBarcode: string;
  storageTemp: string;
  lineageStage: "Surgical Resection" | "Pathology QC" | "DNA Extraction" | "Sequencing Ready";
}

export interface ClinicalNote {
  noteId: string;
  date: string;
  authorRole: string;
  noteType: "Oncology Progress Note" | "Tumor Board Summary" | "Surgical Pathology" | "Radiology Impression";
  deIdentifiedContent: string;
  safeHarborRedactionsCount: number;
}

export interface Patient360Record {
  demographics: PatientDemographics;
  consent: PatientConsent;
  timeline: ClinicalTimelineEvent[];
  genomics: GenomicVariant[];
  imaging: ImagingStudy[];
  labs: LabResult[];
  infusions: InfusionRegimen[];
  biospecimens: Biospecimen[];
  notes: ClinicalNote[];
}

export interface ApiContractSpec {
  platformName: string;
  version: string;
  protocol: string;
  authMethod: string;
  endpoints: {
    method: "GET" | "POST" | "PUT";
    path: string;
    summary: string;
    description: string;
    requestBodySample?: string;
    responseBodySample?: string;
  }[];
  eventSchema: {
    eventName: string;
    description: string;
    payloadSample: string;
  }[];
  complianceNote: string;
}

export interface IRBCharterDoc {
  title: string;
  irbApprovalNumber: string;
  version: string;
  effectiveDate: string;
  sections: {
    heading: string;
    content: string;
  }[];
}
