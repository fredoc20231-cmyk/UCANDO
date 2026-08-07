/**
 * Shared API types for UC-CCC Cancer Data Commons ("UCANDO")
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
  person_id: string; // OMOP CDM Person ID (synthetic UUID)
  deIdentifiedId: string;
  mrn: string;
  age: number;
  gender: string;
  sex: string; // OMOP CDM sex
  race: string; // OMOP CDM race
  ethnicity: string;
  primaryDiagnosis: string;
  stage: string;
  oncoSubtype: string;
  attendingPhysician: string;
  primaryCenter: string;
  consentStatus: "Consented" | "Pending" | "Restricted" | "Withdrawn";
}

// --- OMOP CDM COMMON DATA MODEL INTERFACES ---
export interface OmopConditionOccurrence {
  condition_occurrence_id: string;
  person_id: string;
  condition_concept_id: string; // Mock ICD-10 code + label (e.g. "ICD10:C50.911 - Malignant neoplasm of right breast")
  condition_start_date: string;
  condition_end_date?: string;
  condition_status?: string;
}

export interface OmopProcedureOccurrence {
  procedure_occurrence_id: string;
  person_id: string;
  procedure_concept_id: string; // Mock CPT code + label (e.g. "CPT:19301 - Mastectomy, partial")
  procedure_date: string;
}

export interface OmopMeasurement {
  measurement_id: string;
  person_id: string;
  measurement_concept_id: string; // LOINC code + label (e.g. "LOINC:17861-6 - CA 15-3 [Units/volume] in Serum")
  value_as_number: number;
  unit_concept_id: string; // e.g. "U/mL"
  measurement_date: string;
  range_low?: number;
  range_high?: number;
  flag?: "Normal" | "Elevated" | "High Risk" | "Low";
}

export interface OmopDrugExposure {
  drug_exposure_id: string;
  person_id: string;
  drug_concept_id: string; // RxNorm code + label (e.g. "RxNorm:1303251 - Trastuzumab 150mg Injection")
  drug_exposure_start_date: string;
  drug_exposure_end_date?: string;
  quantity: string;
  route?: string;
  cycle?: string;
  status?: "Completed" | "Active" | "Discontinued";
}

export interface OmopNote {
  note_id: string;
  person_id: string;
  note_date: string;
  note_class: "Progress Note" | "Discharge Summary" | "Tumor Board Summary" | "Surgical Pathology" | "Radiology Impression";
  note_text: string;
  nlp_scrubbed: boolean; // Automated PHI/identifier scrubbing flag
  safeHarborRedactionsCount?: number;
  authorRole?: string;
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

export interface OmopMetabolomics {
  metabolite_id: string;
  metabolite_name: string;
  value_as_number: number;
  unit: string;
  reference_range: string;
  flag: "Normal" | "Elevated" | "Low";
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
  // OMOP CDM Collections & De-Identification
  conditionOccurrences: OmopConditionOccurrence[];
  procedureOccurrences: OmopProcedureOccurrence[];
  measurements: OmopMeasurement[];
  drugExposures: OmopDrugExposure[];
  omopNotes: OmopNote[];
  metabolomics?: OmopMetabolomics[];
  dateShiftOffsetDays: number;
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

// --- COHORT BUILDER TYPES ---
export interface CohortFilterCriteria {
  gender?: string;
  ageRange?: [number, number];
  diagnoses?: string[];
  stages?: string[];
  genes?: string[];
  pathogenicity?: string[];
  treatmentTypes?: string[];
  hasBiospecimen?: boolean;
}

export interface KaplanMeierPoint {
  month: number;
  survivalRate: number;
  atRisk: number;
  lower: number;
  upper: number;
}

export interface CohortQueryResponse {
  totalPatients: number;
  filteredCount: number;
  privacyBudgetRemainingEpsilon: number;
  kaplanMeier: KaplanMeierPoint[];
  stageDistribution: { stage: string; count: number; percentage: number }[];
  mutationFrequencies: { gene: string; percentage: number; count: number }[];
  mcodeQueryJson: string;
  ga4ghBeaconQueryJson: string;
}

// --- MULTIOMICS TYPES ---
export interface OncoPrintSample {
  sampleId: string;
  patientId: string;
  tumorType: string;
  variants: Record<string, "somatic_snv" | "germline_snv" | "cnv_amp" | "cnv_del" | "fusion" | "none">;
}

export interface PathwayEnrichment {
  pathway: string;
  geneCount: number;
  pValue: number;
  fdr: number;
  enrichmentScore: number;
}

export interface MultiomicsDataset {
  variants: GenomicVariant[];
  oncoPrintSamples: OncoPrintSample[];
  pathways: PathwayEnrichment[];
  expressionMatrix: { gene: string; meanTpm: number; log2FC: number; pValue: number }[];
}

// --- IMAGING & PATHOLOGY TYPES ---
export interface DetailedImagingStudy extends ImagingStudy {
  seriesList: {
    seriesId: string;
    description: string;
    numSlices: number;
    sliceUrls: string[];
  }[];
  pathologySlide?: {
    slideId: string;
    stain: "H&E" | "IHC ER" | "IHC PR" | "IHC HER2";
    magnification: string;
    tumorPurityPercent: number;
    stromaPercent: number;
    necrosisPercent: number;
    aiTumorMaskUrl: string;
  };
  radiomicsFeatures: {
    featureName: string;
    category: "Shape" | "First Order Texture" | "GLCM" | "GLRLM";
    value: number;
    normalZScore: number;
  }[];
}

// --- TRIAL MATCHING TYPES ---
export interface ClinicalTrialMatch {
  nctId: string;
  title: string;
  phase: "Phase I" | "Phase II" | "Phase III" | "Phase IV" | "Phase I/II";
  sponsor: string;
  status: "Recruiting" | "Active, not recruiting" | "Enrolling by invitation";
  primaryLocation: string;
  matchScorePercent: number;
  matchingBiomarkers: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  contactEmail: string;
  principalInvestigator: string;
}

// --- GOVERNANCE & AUDIT TYPES ---
export interface WORMAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: "DATA_READ" | "EXPORT_REQUEST" | "CONSENT_WITHDRAWAL" | "POLICY_UPDATE" | "PII_DEIDENTIFICATION";
  resource: string;
  opaPolicyResult: "PERMIT" | "DENY" | "REDACTED";
  sha256Hash: string;
  ipAddress: string;
}

export interface DataQualityReport {
  overallScore: number;
  omopConformanceScore: number;
  mcodeCompletenessScore: number;
  bioComputeObjectValidCount: number;
  bioComputeObjectTotalCount: number;
  dataCompletenessByModalities: {
    modality: string;
    completenessPercent: number;
    recordCount: number;
    missingFieldsCount: number;
  }[];
  recentMappingErrors: {
    id: string;
    timestamp: string;
    sourceSystem: string;
    rawCode: string;
    mappedConcept: string;
    status: "Resolved" | "Pending Review" | "Failed";
    errorReason: string;
  }[];
}
