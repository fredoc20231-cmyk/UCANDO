import {
  HubStats,
  SpokeConnection,
  Patient360Record,
  OmopConditionOccurrence,
  OmopProcedureOccurrence,
  OmopMeasurement,
  OmopDrugExposure,
  OmopNote,
  ApiContractSpec,
  IRBCharterDoc
} from "@shared/api";

/**
 * DATE-SHIFTING DE-IDENTIFICATION ALGORITHM:
 * For each synthetic patient, a single random integer offset (between -60 and +60 days) is generated
 * at record-creation / query time. This offset is applied consistently to every date field in that
 * patient's ConditionOccurrence, ProcedureOccurrence, Measurement, DrugExposure, Note, and timeline records.
 *
 * WHY THIS IS CRITICAL:
 * Date-shifting preserves exact longitudinal time intervals between clinical events (e.g. days from diagnosis
 * to surgery, or days between chemotherapy cycles) which are essential for survival and outcome research, while
 * obfuscating absolute calendar dates to prevent re-identification through external data matching.
 * This matches the Safe Harbor / Expert Determination methodology used in research databases like Vanderbilt's
 * Synthetic Derivative.
 */
function getDateShiftOffsetForPatient(patientId: string): number {
  let hash = 0;
  for (let i = 0; i < patientId.length; i++) {
    hash = (hash << 5) - hash + patientId.charCodeAt(i);
    hash |= 0;
  }
  const rawOffset = (Math.abs(hash) % 120) - 60;
  return rawOffset === 0 ? 14 : rawOffset;
}

function shiftDateString(dateStr: string, offsetDays: number): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

// NOTE: Temporary in-memory consent store. Must be replaced by a real database (e.g., PostgreSQL/Supabase) when moving off Builder hosting.

interface ConsentPermissions {
  researchUse: boolean;
  recontactGranted: boolean;
  biospecimensUse: boolean;
  aiModelTraining: boolean;
  commercialSharing: boolean;
  [key: string]: boolean;
}

interface PatientConsentState {
  status: "Active" | "Pending" | "Withdrawn";
  effectiveDate: string;
  lastVerified: string;
  opaPolicyId: string;
  permissions: ConsentPermissions;
}

const defaultConsentPermissions: ConsentPermissions = {
  researchUse: true,
  recontactGranted: true,
  biospecimensUse: true,
  aiModelTraining: true,
  commercialSharing: false
};

const consentStore: Record<string, PatientConsentState> = {
  "UC-BEACON-89421": {
    status: "Active",
    effectiveDate: "2023-08-14",
    lastVerified: "2024-02-10 (OPA Policy #UC-CONSENT-9942)",
    opaPolicyId: "opa:policy:beacon:cancer:beacon:consent_v2_4",
    permissions: { ...defaultConsentPermissions }
  }
};

let patientCountOffset = 0;
const registeredPatientsList: Patient360Record[] = [];

export function getHubStats(): HubStats {
  const currentTotal = 104280 + patientCountOffset;
  return {
    totalConsentedPatients: currentTotal,
    totalBiospecimens: 1240500 + patientCountOffset * 3,
    totalImagingStudies: 462100 + patientCountOffset * 2,
    totalOmicsProfiles: 84910 + patientCountOffset,
    activeWorkspaces: 342,
    hipaaComplianceScore: 100,
    eventBusTps: 1845,
    opaPolicyEnforcementsToday: 49210 + patientCountOffset * 5,
    dataZones: [
      {
        name: "Raw (Identified)",
        code: "raw",
        count: currentTotal,
        description: "Zero-Trust HIPAA Vault. EHR HL7/FHIR feeds, identified MRN/PHI isolated in encrypted tenant vault.",
        securityLevel: "AES-256 + HSM Isolated"
      },
      {
        name: "Curated (Controlled)",
        code: "curated",
        count: 98450 + patientCountOffset,
        description: "OMOP CDM v5.4 harmonized data, validated mCODE oncology profiles & BioCompute provenance.",
        securityLevel: "RBAC + Dynamic OPA Consent"
      },
      {
        name: "De-identified (Analytics)",
        code: "deid",
        count: 98450 + patientCountOffset,
        description: "Safe Harbor & Expert Determination de-identified clinical, omics & radiomics lakehouse zone.",
        securityLevel: "Tokenized Research ID"
      },
      {
        name: "Public (GA4GH Beacon)",
        code: "public",
        count: 85200 + patientCountOffset,
        description: "GA4GH Beacon v2 federated discovery endpoint. Aggregate frequency queries only, zero PHI.",
        securityLevel: "Differential Privacy Budgeted"
      }
    ]
  };
}

export function registerPatient(data: {
  name?: string;
  mrn?: string;
  diagnosis?: string;
  primarySite?: string;
  age?: number;
  gender?: string;
}): { success: boolean; patientId: string; stats: HubStats } {
  patientCountOffset += 1;
  const newId = `UC-BEACON-${89421 + patientCountOffset}`;

  consentStore[newId] = {
    status: "Active",
    effectiveDate: new Date().toISOString().split("T")[0],
    lastVerified: `${new Date().toISOString().split("T")[0]} (OPA Policy #UC-CONSENT-${9942 + patientCountOffset})`,
    opaPolicyId: "opa:policy:beacon:cancer:beacon:consent_v2_4",
    permissions: { ...defaultConsentPermissions }
  };

  return {
    success: true,
    patientId: newId,
    stats: getHubStats()
  };
}

export function getSpokes(): SpokeConnection[] {
  return [
    {
      id: "ehr",
      name: "EHR (Epic Cadence)",
      subtitle: "UCANDO EHR Core",
      integrationMode: "HL7 v2 Feeds + FHIR R4 + SMART on FHIR",
      status: "connected",
      latencyMs: 12,
      throughputTps: 420,
      lastSync: "Just now (Live Feed)",
      protocol: "HL7 ADT/ORU / FHIR R4 Bulk $export",
      eventsCountToday: 382400,
      description: "Streams ADT patient encounters, labs (LOINC), diagnoses (ICD-10/SNOMED), medication orders (RxNorm) and oncology notes."
    },
    {
      id: "omics",
      name: "Multiomics Analysis Platform",
      subtitle: "High-Throughput Genomics & Proteomics",
      integrationMode: "OAuth2 Client Credentials + Signed Webhooks",
      status: "connected",
      latencyMs: 28,
      throughputTps: 180,
      lastSync: "2 mins ago",
      protocol: "GA4GH DRS / HTSget / BioCompute Objects",
      eventsCountToday: 14210,
      description: "Pushes somatic & germline VCFs, gene expression matrices, single-cell RNA-seq, and proteomics write-back into FHIR."
    },
    {
      id: "imaging",
      name: "Digital Imaging Platform",
      subtitle: "PACS / Cloud DICOMweb & Pathology WSI",
      integrationMode: "DICOMweb (QIDO/WADO/STOW) + Embedded Viewer",
      status: "connected",
      latencyMs: 34,
      throughputTps: 310,
      lastSync: "1 min ago",
      protocol: "DICOM STOW-RS / FHIR ImagingStudy",
      eventsCountToday: 28940,
      description: "Stores radiology DICOM (CT, MRI, PET) and digital pathology Whole Slide Images (WSI) with integrated OHIF viewer deep-links."
    },
    {
      id: "lims",
      name: "LIMS / Tissue Bank",
      subtitle: "Human Tissue Resource Center (HTRC)",
      integrationMode: "FHIR Specimen / Observation + REST API",
      status: "connected",
      latencyMs: 18,
      throughputTps: 65,
      lastSync: "5 mins ago",
      protocol: "REST JSON / Barcode Scan Events",
      eventsCountToday: 4820,
      description: "Tracks biospecimen collection, FFPE tissue blocks, liquid biopsies, cryo-preservation lineage, and QC metrics."
    },
    {
      id: "registry",
      name: "Cancer Tumor Registry",
      subtitle: "SEER / CoC Accredited Registry",
      integrationMode: "mCODE / OMOP Ingestion Pipelines",
      status: "connected",
      latencyMs: 45,
      throughputTps: 40,
      lastSync: "12 mins ago",
      protocol: "mCODE FHIR / OMOP CDM v5.4",
      eventsCountToday: 2150,
      description: "Ingests standardized staging,AJCC TNM classifications, first-course treatment, and 5-year survival status."
    },
    {
      id: "workspaces",
      name: "Research Workspaces",
      subtitle: "Secure Analytical Sandboxes & GPU Clusters",
      integrationMode: "De-identified Sandboxes + Jupyter / RStudio",
      status: "connected",
      latencyMs: 15,
      throughputTps: 520,
      lastSync: "Live Active",
      protocol: "Databricks Delta / Snowflake / OPA Token",
      eventsCountToday: 189400,
      description: "Governed secure computing environments with differential privacy budgets and GPU clusters for AI model training."
    },
    {
      id: "beacon",
      name: "Trial Matching & GA4GH Beacon",
      subtitle: "Global Federated Research Network",
      integrationMode: "GA4GH Beacon v2 API + Federated Query",
      status: "connected",
      latencyMs: 52,
      throughputTps: 110,
      lastSync: "3 mins ago",
      protocol: "Beacon v2 Specification / OAuth2 OIDC",
      eventsCountToday: 8930,
      description: "Enables zero-PHI genomic and phenotypic discovery queries for international precision oncology trial matching."
    }
  ];
}

export function getPatient360(patientId: string): Patient360Record {
  const currentConsent = consentStore[patientId] || {
    status: "Active",
    effectiveDate: "2023-08-14",
    lastVerified: new Date().toISOString().split("T")[0] + " (OPA Policy #UC-CONSENT-9942)",
    opaPolicyId: "opa:policy:beacon:cancer:beacon:consent_v2_4",
    permissions: { ...defaultConsentPermissions }
  };

  const offsetDays = getDateShiftOffsetForPatient(patientId);
  const personId = `synthetic-omop-uuid-${patientId.toLowerCase()}`;

  // OMOP CDM Condition Occurrences
  const conditionOccurrences: OmopConditionOccurrence[] = [
    {
      condition_occurrence_id: "cond-occ-101",
      person_id: personId,
      condition_concept_id: "ICD10:C50.911 - Malignant neoplasm of unspecific site of right female breast",
      condition_start_date: shiftDateString("2023-07-28", offsetDays),
      condition_status: "Active Primary Malignancy"
    },
    {
      condition_occurrence_id: "cond-occ-102",
      person_id: personId,
      condition_concept_id: "ICD10:C77.3 - Secondary and unspecified malignant neoplasm of axillary lymph nodes",
      condition_start_date: shiftDateString("2023-08-04", offsetDays),
      condition_status: "Pathology Confirmed N2a"
    }
  ];

  // OMOP CDM Procedure Occurrences
  const procedureOccurrences: OmopProcedureOccurrence[] = [
    {
      procedure_occurrence_id: "proc-occ-201",
      person_id: personId,
      procedure_concept_id: "CPT:19307 - Modified radical mastectomy with axillary lymphadenectomy",
      procedure_date: shiftDateString("2023-08-04", offsetDays)
    },
    {
      procedure_occurrence_id: "proc-occ-202",
      person_id: personId,
      procedure_concept_id: "CPT:71260 - Computed tomography, thorax, with contrast material(s)",
      procedure_date: shiftDateString("2023-11-20", offsetDays)
    }
  ];

  // OMOP CDM Measurements (Labs & Biomarkers)
  const rawLabs = [
    { date: "2023-07-28", marker: "LOINC:17861-6 - CA 15-3 [Units/volume] in Serum", value: 68.4, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Elevated" as const },
    { date: "2023-09-01", marker: "LOINC:17861-6 - CA 15-3 [Units/volume] in Serum", value: 42.1, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Elevated" as const },
    { date: "2023-11-20", marker: "LOINC:17861-6 - CA 15-3 [Units/volume] in Serum", value: 18.2, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Normal" as const },
    { date: "2024-02-01", marker: "LOINC:17861-6 - CA 15-3 [Units/volume] in Serum", value: 14.5, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Normal" as const },
    { date: "2023-10-14", marker: "LOINC:26499-4 - Absolute Neutrophil Count (ANC)", value: 0.4, unit: "x10^9/L", referenceRange: "1.5 - 8.0 x10^9/L", status: "High Risk" as const },
    { date: "2023-10-18", marker: "LOINC:26499-4 - Absolute Neutrophil Count (ANC)", value: 2.8, unit: "x10^9/L", referenceRange: "1.5 - 8.0 x10^9/L", status: "Normal" as const },
    { date: "2024-02-01", marker: "LOINC:718-7 - Hemoglobin [Mass/volume] in Blood", value: 12.8, unit: "g/dL", referenceRange: "12.0 - 15.5 g/dL", status: "Normal" as const }
  ];

  const measurements: OmopMeasurement[] = rawLabs.map((l, idx) => ({
    measurement_id: `meas-${300 + idx}`,
    person_id: personId,
    measurement_concept_id: l.marker,
    value_as_number: l.value,
    unit_concept_id: l.unit,
    measurement_date: shiftDateString(l.date, offsetDays),
    flag: l.status
  }));

  // OMOP CDM Drug Exposures (Infusions)
  const rawInfusions = [
    { id: "inf-101", drugName: "RxNorm:1303251 - Pembrolizumab 200 mg IV Injection", dose: "200 mg IV", route: "Intravenous Infusion", cycle: "Cycle 1 - 8 (Every 3 Weeks)", startDate: "2023-09-01", status: "Active" as const },
    { id: "inf-102", drugName: "RxNorm:105260 - Doxorubicin 60 mg/m² Injection", dose: "60 mg/m²", route: "IV Push", cycle: "Cycle 1 - 4 (Dose-Dense)", startDate: "2023-09-01", endDate: "2023-10-26", status: "Completed" as const },
    { id: "inf-103", drugName: "RxNorm:3002 - Cyclophosphamide 600 mg/m² Injection", dose: "600 mg/m²", route: "IV Infusion", cycle: "Cycle 1 - 4 (Dose-Dense)", startDate: "2023-09-01", endDate: "2023-10-26", status: "Completed" as const },
    { id: "inf-104", drugName: "RxNorm:7804 - Paclitaxel 175 mg/m² Injection", dose: "175 mg/m²", route: "IV Infusion", cycle: "Cycle 5 - 8 (Dose-Dense)", startDate: "2023-11-09", status: "Active" as const }
  ];

  const drugExposures: OmopDrugExposure[] = rawInfusions.map((d) => ({
    drug_exposure_id: d.id,
    person_id: personId,
    drug_concept_id: d.drugName,
    drug_exposure_start_date: shiftDateString(d.startDate, offsetDays),
    drug_exposure_end_date: d.endDate ? shiftDateString(d.endDate, offsetDays) : undefined,
    quantity: d.dose,
    route: d.route,
    cycle: d.cycle,
    status: d.status
  }));

  // OMOP CDM Notes
  const rawNotes = [
    {
      noteId: "NOTE-2023-8820",
      date: "2023-08-20",
      authorRole: "Attending Oncologist (Dr. Alex Rivera)",
      noteType: "Oncology Progress Note" as const,
      deIdentifiedContent: "54-year-old female patient presented with Stage IIIB TNBC. Germline panel positive for pathogenic [REDACTED_GENE_MUTATION]. Multidisciplinary tumor board recommended dose-dense AC-T regimen combined with neoadjuvant pembrolizumab immunotherapy. Patient consented for UCANDO Data Commons biobanking under protocol [REDACTED_IRB].",
      safeHarborRedactionsCount: 4
    },
    {
      noteId: "NOTE-2023-9914",
      date: "2023-11-22",
      authorRole: "Radiologist",
      noteType: "Radiology Impression" as const,
      deIdentifiedContent: "Restaging PET/CT performed after 4 cycles of AC chemotherapy. Complete resolution of FDG uptake in the surgical bed (SUV max 1.2 vs 12.4 baseline). No distant metastatic lesions identified.",
      safeHarborRedactionsCount: 2
    }
  ];

  const omopNotes: OmopNote[] = rawNotes.map((n) => ({
    note_id: n.noteId,
    person_id: personId,
    note_date: shiftDateString(n.date, offsetDays),
    note_class: n.noteType === "Oncology Progress Note" ? "Progress Note" : "Radiology Impression",
    note_text: n.deIdentifiedContent,
    nlp_scrubbed: true,
    safeHarborRedactionsCount: n.safeHarborRedactionsCount,
    authorRole: n.authorRole
  }));

  return {
    demographics: {
      id: patientId,
      person_id: personId,
      deIdentifiedId: "DEID-BEACON-772910",
      mrn: "UC-4892104-A",
      age: 54,
      gender: "Female",
      sex: "Female",
      race: "White",
      ethnicity: "Non-Hispanic White",
      primaryDiagnosis: "Invasive Ductal Carcinoma of Breast",
      stage: "Stage IIIB (pT3, pN2a, cM0)",
      oncoSubtype: "Triple-Negative Breast Cancer (TNBC) - High Risk",
      attendingPhysician: "Dr. Alex Rivera, MD, PhD (Oncology)",
      primaryCenter: "UC-CCC Comprehensive Cancer Center",
      consentStatus: "Consented"
    },
    consent: currentConsent,
    dateShiftOffsetDays: offsetDays,
    conditionOccurrences,
    procedureOccurrences,
    measurements,
    drugExposures,
    omopNotes,
    timeline: [
      {
        id: "evt-01",
        date: shiftDateString("2023-07-28", offsetDays),
        type: "diagnosis",
        title: "Initial Diagnosis: Right Breast Invasive Carcinoma",
        description: "Core needle biopsy confirmed invasive ductal carcinoma, Grade 3. ER 0%, PR 0%, HER2 1+ (Triple Negative).",
        category: "Diagnosis & Pathology",
        severity: "severe",
        sourceSpoke: "ehr"
      },
      {
        id: "evt-02",
        date: shiftDateString("2023-08-04", offsetDays),
        type: "surgery",
        title: "Surgical Resection & Biospecimen Collection",
        description: "Right modified radical mastectomy with axillary lymph node dissection. 4 of 12 lymph nodes positive.",
        category: "Surgery & LIMS",
        severity: "normal",
        sourceSpoke: "lims"
      },
      {
        id: "evt-03",
        date: shiftDateString("2023-08-18", offsetDays),
        type: "genomics",
        title: "Multiomics Profiling: BRCA1 Germline Pathogenic Variant",
        description: "Comprehensive genomic profiling identified BRCA1 c.5266dupC (p.Gln1756Profs*74) frameshift variant with 48.2% VAF.",
        category: "Genomics Write-back",
        severity: "critical",
        sourceSpoke: "omics",
        smartLaunchAvailable: true
      },
      {
        id: "evt-04",
        date: shiftDateString("2023-09-01", offsetDays),
        type: "treatment",
        title: "Initiation of Dose-Dense AC-T + Pembrolizumab Regimen",
        description: "Cycle 1: Doxorubicin (60 mg/m²) + Cyclophosphamide (600 mg/m²) + Pembrolizumab (200 mg).",
        category: "Infusion / Medical Oncology",
        severity: "normal",
        sourceSpoke: "ehr"
      },
      {
        id: "evt-05",
        date: shiftDateString("2023-10-14", offsetDays),
        type: "toxicity",
        title: "Adverse Toxicity: Grade 3 Febrile Neutropenia",
        description: "ANC dropped to 0.4 x 10^9/L. Hospitalized for 48 hours, resolved after G-CSF (Filgrastim) support.",
        category: "Toxicity & Safety",
        severity: "severe",
        sourceSpoke: "ehr"
      },
      {
        id: "evt-06",
        date: shiftDateString("2023-11-20", offsetDays),
        type: "imaging",
        title: "Restaging PET/CT & MRI Radiology Study",
        description: "Restaging PET/CT scan demonstrates complete metabolic response in surgical bed and axillary nodes.",
        category: "Digital Radiology",
        severity: "normal",
        sourceSpoke: "imaging",
        smartLaunchAvailable: true,
        deepLink: "/imaging/launch?accession=ACC-2023-9941"
      },
      {
        id: "evt-07",
        date: shiftDateString("2024-01-15", offsetDays),
        type: "genomics",
        title: "ctDNA Liquid Biopsy Monitoring (Signatera)",
        description: "Circulating tumor DNA test: Undetectable ctDNA (<0.01 MTM/mL). Molecular complete response.",
        category: "Multiomics Liquid Biopsy",
        severity: "normal",
        sourceSpoke: "omics",
        smartLaunchAvailable: true
      }
    ],
    genomics: [
      {
        id: "var-01",
        gene: "BRCA1",
        hgvs: "c.5266dupC (p.Gln1756Profs*74)",
        variantType: "Indel",
        vafPercent: 48.2,
        consequence: "Frameshift Truncation",
        pathogenicity: "Pathogenic",
        readDepth: 1240,
        pipelineVersion: "Multiomics-GATK-v4.2.1",
        bioComputeObject: "https://ucando.demo-cancercenter.org/bco/BCO-2023-BRCA1-094",
        multiomicsPlatformJobId: "OMICS-JOB-884920"
      },
      {
        id: "var-02",
        gene: "TP53",
        hgvs: "c.818G>A (p.Arg273His)",
        variantType: "SNV",
        vafPercent: 32.5,
        consequence: "Missense Variant",
        pathogenicity: "Pathogenic",
        readDepth: 980,
        pipelineVersion: "Multiomics-GATK-v4.2.1",
        bioComputeObject: "https://ucando.demo-cancercenter.org/bco/BCO-2023-TP53-112",
        multiomicsPlatformJobId: "OMICS-JOB-884920"
      },
      {
        id: "var-03",
        gene: "PIK3CA",
        hgvs: "c.1633G>A (p.Glu545K)",
        variantType: "SNV",
        vafPercent: 12.1,
        consequence: "Missense Variant",
        pathogenicity: "Likely Pathogenic",
        readDepth: 850,
        pipelineVersion: "Multiomics-GATK-v4.2.1",
        bioComputeObject: "https://ucando.demo-cancercenter.org/bco/BCO-2023-PIK3-004",
        multiomicsPlatformJobId: "OMICS-JOB-884920"
      }
    ],
    imaging: [
      {
        studyId: "STD-2023-9941",
        accessionNumber: "ACC-2023-9941",
        modality: "PET/CT",
        studyDate: shiftDateString("2023-11-20", offsetDays),
        bodyPart: "Chest/Abdomen/Pelvis",
        instancesCount: 480,
        dicomWebEndpoint: "https://imaging.demo-cancercenter.org/dicomweb/studies/1.2.840.113619.2.55.3.28",
        ohifViewerUrl: "https://beacon.demo-cancercenter.org/viewer?studyInstanceUID=1.2.840.113619.2.55.3.28&token=signed_ctx_9941",
        aiAnnotationsCount: 3,
        findingsSummary: "No FDG-avid residual tumor in primary bed. Axillary lymphadenopathy resolved."
      },
      {
        studyId: "STD-2023-8102",
        accessionNumber: "ACC-2023-8102",
        modality: "MRI",
        studyDate: shiftDateString("2023-08-01", offsetDays),
        bodyPart: "Bilateral Breast with Contrast",
        instancesCount: 320,
        dicomWebEndpoint: "https://imaging.demo-cancercenter.org/dicomweb/studies/1.2.840.113619.2.55.3.10",
        ohifViewerUrl: "https://beacon.demo-cancercenter.org/viewer?studyInstanceUID=1.2.840.113619.2.55.3.10&token=signed_ctx_8102",
        aiAnnotationsCount: 5,
        findingsSummary: "4.2 cm lobulated heterogeneously enhancing mass in right upper outer quadrant."
      },
      {
        studyId: "STD-2023-WSI-04",
        accessionNumber: "ACC-WSI-2023-441",
        modality: "WSI",
        studyDate: shiftDateString("2023-08-05", offsetDays),
        bodyPart: "Surgical Specimen Histology",
        instancesCount: 12,
        dicomWebEndpoint: "https://pathology.demo-cancercenter.org/dicomweb/studies/1.3.6.1.4.1.59973.1",
        ohifViewerUrl: "https://beacon.demo-cancercenter.org/viewer/wsi?studyUID=1.3.6.1.4.1.59973.1",
        aiAnnotationsCount: 18,
        findingsSummary: "Whole slide pathology 40x scan. Tumor infiltrating lymphocytes (TILs) elevated at 45%."
      }
    ],
    labs: rawLabs.map((l) => ({
      ...l,
      date: shiftDateString(l.date, offsetDays)
    })),
    infusions: rawInfusions.map((d) => ({
      ...d,
      startDate: shiftDateString(d.startDate, offsetDays),
      endDate: d.endDate ? shiftDateString(d.endDate, offsetDays) : undefined
    })),
    biospecimens: [
      {
        specimenId: "SPEC-2023-FFPE-904",
        type: "FFPE Tumor Block",
        anatomicSite: "Right Breast Primary Tumor",
        volume: "1 Tissue Block (10 slides cut)",
        collectionDate: shiftDateString("2023-08-04", offsetDays),
        limsBarcode: "HTRC-BC-2023-88901",
        storageTemp: "-20°C Vault",
        lineageStage: "Sequencing Ready"
      },
      {
        specimenId: "SPEC-2023-PLASMA-112",
        type: "Plasma",
        anatomicSite: "Peripheral Blood Draw",
        volume: "4 mL Aliqout x 3",
        collectionDate: shiftDateString("2023-11-20", offsetDays),
        limsBarcode: "HTRC-PL-2023-99411",
        storageTemp: "-80°C Cryo",
        lineageStage: "DNA Extraction"
      },
      {
        specimenId: "SPEC-2023-BUFFY-04",
        type: "Buffy Coat Blood",
        anatomicSite: "Germline Control Draw",
        volume: "2 mL Aliquot",
        collectionDate: shiftDateString("2023-08-04", offsetDays),
        limsBarcode: "HTRC-GERM-2023-0041",
        storageTemp: "-80°C Cryo",
        lineageStage: "Sequencing Ready"
      }
    ],
    notes: rawNotes.map((n) => ({
      ...n,
      date: shiftDateString(n.date, offsetDays)
    }))
  };
}

export function updateConsent(patientId?: string, consentType?: string, enabled?: boolean, permissions?: Record<string, boolean>) {
  const targetId = patientId || "UC-BEACON-89421";
  if (!consentStore[targetId]) {
    consentStore[targetId] = {
      status: "Active",
      effectiveDate: "2023-08-14",
      lastVerified: new Date().toISOString().split("T")[0] + " (OPA Policy Verified)",
      opaPolicyId: "opa:policy:beacon:cancer:beacon:consent_v2_4",
      permissions: { ...defaultConsentPermissions }
    };
  }

  if (permissions && typeof permissions === "object") {
    Object.assign(consentStore[targetId].permissions, permissions);
    consentStore[targetId].lastVerified = new Date().toISOString() + " (OPA Policy Mass Update)";
  } else if (consentType) {
    consentStore[targetId].permissions[consentType] = Boolean(enabled);
    consentStore[targetId].lastVerified = new Date().toISOString() + " (OPA Policy Updated)";
  }

  return {
    status: "Updated",
    patientId: targetId,
    consentType,
    enabled,
    permissions: { ...consentStore[targetId].permissions },
    timestamp: new Date().toISOString(),
    opaPolicyVerified: true,
    wormAuditReceipt: {
      receiptId: `worm_receipt_${Math.floor(Math.random() * 90000 + 10000)}`,
      timestamp: new Date().toISOString(),
      sha256Signature: `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      storeLocation: "AWS S3 Object Lock (WORM) Compliance Bucket",
      downstreamPropagatedSpokes: ["EHR Spoke", "Multiomics Lakehouse", "DICOM Store", "GA4GH Beacon Node"]
    }
  };
}

export function getApiContracts(): Record<string, ApiContractSpec> {
  return {
    multiomics: {
      platformName: "G1. Multiomics Analysis Platform",
      version: "v1.4.0",
      protocol: "REST OpenAPI 3.0 / JSON Schema + OAuth2 Scoped Tokens",
      authMethod: "OAuth2 Client Credentials (scopes: omics:read, omics:results.write)",
      complianceNote: "Platform NEVER receives identified PHI. All jobs process tokenized Research IDs with signed context tokens.",
      endpoints: [
        {
          method: "POST",
          path: "/v1/jobs",
          summary: "Dispatch Sequencing Job from Hub to Multiomics Platform",
          description: "Hub sends sample manifest, BAM/CRAM references, and signed context token to trigger variant calling or transcriptomic pipeline.",
          requestBodySample: JSON.stringify(
            {
              job_id: "JOB-2024-99102",
              tokenized_patient_id: "DEID-BEACON-772910",
              sample_manifest: {
                specimen_id: "SPEC-2023-FFPE-904",
                specimen_type: "FFPE Tumor Tissue",
                sequencing_assay: "Whole Exome + Somatic RNA-seq",
                target_depth: "500x"
              },
              context_token: "eyJhbGciOiJSUzI1NiIs..."
            },
            null,
            2
          )
        },
        {
          method: "POST",
          path: "/v1/results/genomics",
          summary: "Multiomics Platform Results Write-Back to UCANDO Hub",
          description: "Delivers FHIR DiagnosticReport + MolecularSequence bundles containing called variants, VAFs, and BioCompute provenance.",
          requestBodySample: JSON.stringify(
            {
              job_id: "JOB-2024-99102",
              tokenized_patient_id: "DEID-BEACON-772910",
              fhir_bundle: {
                resourceType: "Bundle",
                type: "transaction",
                entry: [
                  {
                    resource: {
                      resourceType: "DiagnosticReport",
                      status: "final",
                      code: { coding: [{ system: "http://loinc.org", code: "81247-9", display: "Master HL7 genetic variant report" }] },
                      result: [{ reference: "Observation/MolecularSequence-BRCA1" }]
                    }
                  }
                ]
              },
              biocompute_object: "https://ucando.demo-cancercenter.org/bco/BCO-2024-00129"
            },
            null,
            2
          )
        }
      ],
      eventSchema: [
        {
          eventName: "omics.result.ready",
          description: "Emitted on Kafka event bus when variant classification and provenance assembly complete.",
          payloadSample: JSON.stringify(
            {
              event_id: "evt_om_8820",
              event_type: "omics.result.ready",
              timestamp: "2024-02-14T18:30:00Z",
              patient_deid: "DEID-BEACON-772910",
              variants_count: 3,
              pathogenic_count: 1
            },
            null,
            2
          )
        }
      ]
    },
    imaging: {
      platformName: "G2. Digital Imaging Platform",
      version: "v2.1.0",
      protocol: "DICOMweb (QIDO-RS / WADO-RS / STOW-RS) + OHIF Viewer",
      authMethod: "Bearer Token with Signed Context Claims",
      complianceNote: "Hub creates FHIR ImagingStudy + ImagingMedia for every accession upon STOW-RS DICOM push.",
      endpoints: [
        {
          method: "POST",
          path: "/dicomweb/studies (STOW-RS)",
          summary: "DICOMweb Push from Acquisition Modal into Hub Store",
          description: "Pushes raw or annotated DICOM instances into cloud DICOM store and auto-indexes study in FHIR server.",
          requestBodySample: `POST /dicomweb/studies HTTP/1.1\nContent-Type: multipart/related; type="application/dicom"\nAuthorization: Bearer eyJhbGci...`
        },
        {
          method: "GET",
          path: "/viewer/launch?studyInstanceUID={uid}&token={jwt}",
          summary: "OHIF Viewer Embedded Launch Deep Link",
          description: "Launches OHIF viewer inside Beacon UI shell using a 15-minute short-lived signed context token.",
          responseBodySample: `Redirects to embedded OHIF iframe with zero-PHI viewer canvas.`
        }
      ],
      eventSchema: [
        {
          eventName: "imaging.study.completed",
          description: "Published when STOW-RS ingestion and FHIR ImagingStudy resource mapping finalize.",
          payloadSample: JSON.stringify(
            {
              event_id: "evt_img_9910",
              event_type: "imaging.study.completed",
              study_instance_uid: "1.2.840.113619.2.55.3.28",
              modality: "PET/CT",
              patient_deid: "DEID-BEACON-772910"
            },
            null,
            2
          )
        }
      ]
    }
  };
}

export function getIRBCharter(): IRBCharterDoc {
  return {
    title: "UCANDO — Governance Charter & Consent Framework",
    irbApprovalNumber: "IRB-DEMO-0000",
    version: "v3.1",
    effectiveDate: "2024-01-01",
    sections: [
      {
        heading: "1. Scope & Primary Mandate",
        content: "UCANDO serves as the unified, HIPAA-compliant integration spine for all cancer center patient data (EHR, multiomics, digital radiology, digital pathology WSI, biospecimens, tumor registry, and PROs). Every consented patient record is ingested, harmonized under OMOP CDM v5.4 and mCODE FHIR, and governed strictly by dynamic consent preferences."
      },
      {
        heading: "2. Builder.io PHI-Free Architectural Invariant",
        content: "Non-Negotiable Rule: Builder.io is strictly a PHI-free visual layer. No protected health information (PHI) or patient record shall ever be transmitted to or stored within Builder content or services. All patient rendering occurs client-side or via authenticated server calls directly to the UCANDO Hub."
      },
      {
        heading: "3. Open Policy Agent (OPA) Consent Enforcement",
        content: "All data exports, research workspace queries, and federated GA4GH Beacon queries are evaluated against OPA policies in real-time. If a patient withdraws consent for AI model training or partner data sharing, OPA policies propagate withdrawal within < 24 hours across all downstream spokes."
      },
      {
        heading: "4. De-Identification Standards & Token Vault",
        content: "Clinical text notes undergo combined Safe Harbor automated regex scrubbing and trained clinical NLP tokenization. Re-identification tokens are encrypted with per-tenant HSM keys and stored in an air-gapped vault accessible only during authorized break-glass events with mandatory IRB audit logging."
      }
    ]
  };
}

export function queryCohort(filters: any) {
  let baseCount = 98450;
  if (filters?.diagnoses && filters.diagnoses.length > 0) baseCount = Math.floor(baseCount * 0.28);
  if (filters?.genes && filters.genes.length > 0) baseCount = Math.floor(baseCount * 0.35);
  if (filters?.stages && filters.stages.length > 0) baseCount = Math.floor(baseCount * 0.45);
  if (filters?.hasBiospecimen) baseCount = Math.floor(baseCount * 0.72);

  const finalFiltered = Math.max(12, baseCount);

  return {
    totalPatients: 98450,
    filteredCount: finalFiltered,
    privacyBudgetRemainingEpsilon: 98.4,
    kaplanMeier: [
      { month: 0, survivalRate: 100, atRisk: finalFiltered, lower: 100, upper: 100 },
      { month: 6, survivalRate: 94.2, atRisk: Math.floor(finalFiltered * 0.94), lower: 92.1, upper: 96.3 },
      { month: 12, survivalRate: 88.5, atRisk: Math.floor(finalFiltered * 0.88), lower: 85.0, upper: 91.2 },
      { month: 24, survivalRate: 79.1, atRisk: Math.floor(finalFiltered * 0.79), lower: 75.3, upper: 82.8 },
      { month: 36, survivalRate: 71.4, atRisk: Math.floor(finalFiltered * 0.71), lower: 67.2, upper: 75.6 },
      { month: 48, survivalRate: 64.8, atRisk: Math.floor(finalFiltered * 0.64), lower: 60.1, upper: 69.5 },
      { month: 60, survivalRate: 59.2, atRisk: Math.floor(finalFiltered * 0.59), lower: 54.0, upper: 64.3 }
    ],
    stageDistribution: [
      { stage: "Stage I", count: Math.floor(finalFiltered * 0.18), percentage: 18 },
      { stage: "Stage II", count: Math.floor(finalFiltered * 0.29), percentage: 29 },
      { stage: "Stage III", count: Math.floor(finalFiltered * 0.38), percentage: 38 },
      { stage: "Stage IV", count: Math.floor(finalFiltered * 0.15), percentage: 15 }
    ],
    mutationFrequencies: [
      { gene: "TP53", percentage: 48.2, count: Math.floor(finalFiltered * 0.482) },
      { gene: "BRCA1", percentage: 28.5, count: Math.floor(finalFiltered * 0.285) },
      { gene: "PIK3CA", percentage: 24.1, count: Math.floor(finalFiltered * 0.241) },
      { gene: "BRCA2", percentage: 14.8, count: Math.floor(finalFiltered * 0.148) },
      { gene: "EGFR", percentage: 9.3, count: Math.floor(finalFiltered * 0.093) },
      { gene: "ERBB2", percentage: 8.1, count: Math.floor(finalFiltered * 0.081) }
    ],
    mcodeQueryJson: JSON.stringify(
      {
        resourceType: "Bundle",
        type: "searchset",
        entry: [
          {
            resource: {
              resourceType: "Observation",
              meta: { profile: ["http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-genomic-variant"] },
              status: "final",
              code: { coding: [{ system: "http://loinc.org", code: "69548-6", display: "Genetic variant assessment" }] },
              valueCodeableConcept: { coding: [{ system: "http://www.ncbi.nlm.nih.gov/clinvar", code: "376371", display: "Pathogenic" }] }
            }
          }
        ]
      },
      null,
      2
    ),
    ga4ghBeaconQueryJson: JSON.stringify(
      {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        meta: { beaconId: "org.beacon.cancer.beacon", apiVersion: "v2.0.0" },
        query: {
          requestParameters: {
            g_variant: {
              assemblyId: "GRCh38",
              referenceName: "17",
              start: 43044295,
              referenceBases: "C",
              alternateBases: "T"
            }
          },
          filters: [
            { id: "NCIT:C3058", scope: "individual", label: "Invasive Breast Carcinoma" }
          ]
        }
      },
      null,
      2
    )
  };
}

export function getMultiomics() {
  return {
    variants: [
      {
        id: "var_01",
        gene: "BRCA1",
        hgvs: "NM_007294.4:c.5266dupC (p.Gln1756ProfsTer74)",
        variantType: "SNV",
        vafPercent: 38.5,
        consequence: "frameshift_variant",
        pathogenicity: "Pathogenic",
        readDepth: 420,
        pipelineVersion: "BioCompute-Dragen-v4.2",
        bioComputeObject: "https://bco.demo-cancercenter.org/objects/BCO-2024-8841",
        multiomicsPlatformJobId: "job_seq_99201"
      },
      {
        id: "var_02",
        gene: "TP53",
        hgvs: "NM_000546.5:c.818G>A (p.Arg273His)",
        variantType: "SNV",
        vafPercent: 44.1,
        consequence: "missense_variant",
        pathogenicity: "Pathogenic",
        readDepth: 512,
        pipelineVersion: "BioCompute-Dragen-v4.2",
        bioComputeObject: "https://bco.demo-cancercenter.org/objects/BCO-2024-8842",
        multiomicsPlatformJobId: "job_seq_99202"
      },
      {
        id: "var_03",
        gene: "PIK3CA",
        hgvs: "NM_006218.4:c.1633G>A (p.Glu545K)",
        variantType: "SNV",
        vafPercent: 22.0,
        consequence: "missense_variant",
        pathogenicity: "Pathogenic",
        readDepth: 380,
        pipelineVersion: "BioCompute-Dragen-v4.2",
        bioComputeObject: "https://bco.demo-cancercenter.org/objects/BCO-2024-8843",
        multiomicsPlatformJobId: "job_seq_99203"
      },
      {
        id: "var_04",
        gene: "ERBB2",
        hgvs: "Amplification (Copy Number: 8)",
        variantType: "CNV",
        vafPercent: 0,
        consequence: "transcript_amplification",
        pathogenicity: "Likely Pathogenic",
        readDepth: 610,
        pipelineVersion: "BioCompute-Dragen-v4.2",
        bioComputeObject: "https://bco.demo-cancercenter.org/objects/BCO-2024-8844",
        multiomicsPlatformJobId: "job_seq_99204"
      }
    ],
    oncoPrintSamples: [
      { sampleId: "SMP-001", patientId: "UC-BEACON-89421", tumorType: "Breast Invasive", variants: { BRCA1: "somatic_snv", TP53: "somatic_snv", PIK3CA: "none", ERBB2: "cnv_amp" } },
      { sampleId: "SMP-002", patientId: "UC-BEACON-89422", tumorType: "Breast Invasive", variants: { BRCA1: "germline_snv", TP53: "none", PIK3CA: "somatic_snv", ERBB2: "none" } },
      { sampleId: "SMP-003", patientId: "UC-BEACON-89423", tumorType: "Ovarian High Grade", variants: { BRCA1: "somatic_snv", TP53: "somatic_snv", PIK3CA: "none", ERBB2: "none" } },
      { sampleId: "SMP-004", patientId: "UC-BEACON-89424", tumorType: "Breast Invasive", variants: { BRCA1: "none", TP53: "somatic_snv", PIK3CA: "somatic_snv", ERBB2: "cnv_amp" } },
      { sampleId: "SMP-005", patientId: "UC-BEACON-89425", tumorType: "TNBC", variants: { BRCA1: "somatic_snv", TP53: "somatic_snv", PIK3CA: "somatic_snv", ERBB2: "none" } }
    ],
    pathways: [
      { pathway: "Homologous Recombination Repair (HRD)", geneCount: 14, pValue: 0.00001, fdr: 0.0001, enrichmentScore: 4.82 },
      { pathway: "PI3K-Akt Signaling Pathway", geneCount: 22, pValue: 0.0002, fdr: 0.0012, enrichmentScore: 3.41 },
      { pathway: "p53 Cell Cycle Regulation", geneCount: 18, pValue: 0.0005, fdr: 0.0028, enrichmentScore: 2.95 },
      { pathway: "ERBB2 / HER2 Receptor Cascade", geneCount: 12, pValue: 0.0018, fdr: 0.0085, enrichmentScore: 2.18 }
    ],
    expressionMatrix: [
      { gene: "BRCA1", meanTpm: 4.2, log2FC: -2.1, pValue: 0.00004 },
      { gene: "TP53", meanTpm: 18.5, log2FC: 3.4, pValue: 0.00001 },
      { gene: "ESR1", meanTpm: 42.1, log2FC: 4.8, pValue: 0.00001 },
      { gene: "PGR", meanTpm: 38.0, log2FC: 4.1, pValue: 0.00002 },
      { gene: "ERBB2", meanTpm: 92.4, log2FC: 5.6, pValue: 0.00001 },
      { gene: "MKI67", meanTpm: 54.2, log2FC: 3.9, pValue: 0.00003 }
    ]
  };
}

export function getImagingDetails() {
  return {
    studyId: "std_rad_881",
    accessionNumber: "ACC-UCANDO-2024-9910",
    modality: "PET/CT",
    studyDate: "2024-01-20",
    bodyPart: "Chest/Abdomen/Pelvis",
    instancesCount: 480,
    dicomWebEndpoint: "https://dicom.demo-cancercenter.org/dicomweb/studies/std_rad_881",
    ohifViewerUrl: "/viewer?study=std_rad_881",
    aiAnnotationsCount: 14,
    findingsSummary: "Right upper lobe pulmonary mass (3.2 x 2.8 cm) with SUVmax 11.4, consistent with primary non-small cell lung neoplasm. Subcarinal lymphadenopathy noted.",
    seriesList: [
      {
        seriesId: "ser_ct_axial",
        description: "Axial 1.25mm High-Res Lung CT",
        numSlices: 240,
        sliceUrls: ["/dicom/slice1.png", "/dicom/slice2.png"]
      },
      {
        seriesId: "ser_pet_coronal",
        description: "Coronal 18F-FDG PET SUV Map",
        numSlices: 120,
        sliceUrls: ["/dicom/pet1.png"]
      },
      {
        seriesId: "ser_fused",
        description: "Fused PET/CT Multiplanar Reconstruction",
        numSlices: 120,
        sliceUrls: ["/dicom/fused1.png"]
      }
    ],
    pathologySlide: {
      slideId: "WSI-PATH-2024-7712",
      stain: "H&E",
      magnification: "40x",
      tumorPurityPercent: 68,
      stromaPercent: 24,
      necrosisPercent: 8,
      aiTumorMaskUrl: "/pathology/mask_7712.png"
    },
    radiomicsFeatures: [
      { featureName: "Original Shape Surface Volume Ratio", category: "Shape", value: 0.142, normalZScore: 1.8 },
      { featureName: "GLCM Contrast (Tumor Heterogeneity)", category: "GLCM", value: 14.82, normalZScore: 2.4 },
      { featureName: "First Order 90th Percentile Hounsfield Unit", category: "First Order Texture", value: 48.2, normalZScore: 1.2 },
      { featureName: "GLRLM High Gray Level Run Emphasis", category: "GLRLM", value: 128.4, normalZScore: 2.1 }
    ]
  };
}

export function getTrialMatches() {
  return [
    {
      nctId: "NCT05214820",
      title: "Phase II Study of Olaparib + Pembrolizumab in BRCA1-Mutated Advanced Solid Tumors",
      phase: "Phase II",
      sponsor: "UC-CCC",
      status: "Recruiting",
      primaryLocation: "UC-CCC Main Medical Center",
      matchScorePercent: 96,
      matchingBiomarkers: ["BRCA1 Pathogenic Variant", "PD-L1 CPS >= 10", "Prior Platinum Chemotherapy"],
      inclusionCriteria: [
        "Confirmed pathogenic germline or somatic BRCA1/2 mutation",
        "Measurable disease per RECIST v1.1",
        "ECOG performance status 0-1",
        "Adequate organ & bone marrow function"
      ],
      exclusionCriteria: [
        "Prior PARP inhibitor therapy within 6 months",
        "Active brain metastases without local control",
        "Severe active infection or autoimmune flare"
      ],
      contactEmail: "trials@demo-cancercenter.org",
      principalInvestigator: "Dr. Elena Vance, MD, FACP"
    },
    {
      nctId: "NCT04882194",
      title: "Targeted Alpha Therapy (225Ac-PSMA) for Advanced Metastatic Cancer",
      phase: "Phase I/II",
      sponsor: "UC-CCC / NIH NCI",
      status: "Recruiting",
      primaryLocation: "UC-CCC Specialty Care Center",
      matchScorePercent: 88,
      matchingBiomarkers: ["High SUVmax on PET/CT", "Refractory to Standard Regimen"],
      inclusionCriteria: [
        "Metastatic or unresectable disease",
        "Positive target expression on diagnostic PET scan",
        "Life expectancy > 12 weeks"
      ],
      exclusionCriteria: [
        "Platelet count < 75,000/mcL",
        "Prior total body irradiation"
      ],
      contactEmail: "radiotheranostics@demo-cancercenter.org",
      principalInvestigator: "Dr. Marcus Thorne, MD"
    },
    {
      nctId: "NCT05102941",
      title: "Neoadjuvant mRNA Neoantigen Vaccine Combined with Nivolumab in Stage III Malignancy",
      phase: "Phase I",
      sponsor: "UC-CCC Center for Personalized Therapeutics",
      status: "Enrolling by invitation",
      primaryLocation: "UC-CCC Regional Center",
      matchScorePercent: 82,
      matchingBiomarkers: ["High Tumor Mutational Burden (TMB > 10 mut/Mb)", "HLA-A*02:01 Positive"],
      inclusionCriteria: [
        "Fresh tumor tissue biopsy available for neoantigen sequencing",
        "No prior PD-1/PD-L1 checkpoint inhibitor resistance"
      ],
      exclusionCriteria: [
        "Concurrent immunosuppressive therapy",
        "Active solid organ transplant"
      ],
      contactEmail: "cpt-trials@demo-cancercenter.org",
      principalInvestigator: "Dr. Sarah Chen, MD, PhD"
    }
  ];
}

export function getAuditLogs() {
  return [
    {
      id: "worm_88401",
      timestamp: new Date().toISOString(),
      actor: "dr.vance@demo-cancercenter.org",
      actorRole: "Attending Oncologist / PI",
      action: "DATA_READ",
      resource: "Patient 360 Record UC-BEACON-89421",
      opaPolicyResult: "PERMIT",
      sha256Hash: "8f4a3e210b39c4d2e85a1a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
      ipAddress: "128.135.102.44"
    },
    {
      id: "worm_88400",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      actor: "researcher_agent_88@demo-cancercenter.org",
      actorRole: "Biostatistician",
      action: "EXPORT_REQUEST",
      resource: "De-identified Cohort #4921 (12,480 patients)",
      opaPolicyResult: "PERMIT",
      sha256Hash: "7a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
      ipAddress: "128.135.210.12"
    },
    {
      id: "worm_88399",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      actor: "patient_portal_sync@demo-cancercenter.org",
      actorRole: "Dynamic Consent Engine",
      action: "CONSENT_WITHDRAWAL",
      resource: "Commercial Sharing Permission (Patient UC-BEACON-7720)",
      opaPolicyResult: "PERMIT",
      sha256Hash: "1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
      ipAddress: "10.240.12.8"
    },
    {
      id: "worm_88398",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      actor: "ext_partner_api@pharma.com",
      actorRole: "External Federated Query",
      action: "EXPORT_REQUEST",
      resource: "GA4GH Beacon Aggregate Variant Count Query",
      opaPolicyResult: "REDACTED",
      sha256Hash: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      ipAddress: "198.51.100.42"
    }
  ];
}

export function getDataQuality() {
  return {
    overallScore: 98.6,
    omopConformanceScore: 99.1,
    mcodeCompletenessScore: 97.8,
    bioComputeObjectValidCount: 84910,
    bioComputeObjectTotalCount: 84910,
    dataCompletenessByModalities: [
      { modality: "EHR Clinical Core (Demographics/Labs/Meds)", completenessPercent: 99.8, recordCount: 104280, missingFieldsCount: 120 },
      { modality: "Multiomics NGS VCF & Expression", completenessPercent: 98.2, recordCount: 84910, missingFieldsCount: 1510 },
      { modality: "Digital Radiology DICOM Studies", completenessPercent: 97.4, recordCount: 462100, missingFieldsCount: 12010 },
      { modality: "Digital Pathology WSI Slides", completenessPercent: 96.8, recordCount: 124000, missingFieldsCount: 3960 },
      { modality: "LIMS Biospecimen Lineage", completenessPercent: 99.4, recordCount: 1240500, missingFieldsCount: 7440 }
    ],
    recentMappingErrors: [
      {
        id: "err_9901",
        timestamp: "10 mins ago",
        sourceSystem: "Epic Cadence EHR",
        rawCode: "LOINC 99201-9 (Custom Lab)",
        mappedConcept: "OMOP Concept 4012891",
        status: "Resolved",
        errorReason: "Non-standard unit string ('mg/dL/hr') mapped to UCUM canonical unit ('mg/dL/h')"
      },
      {
        id: "err_9902",
        timestamp: "32 mins ago",
        sourceSystem: "Oncology LIMS",
        rawCode: "Specimen Site: 'L RUL Lung'",
        mappedConcept: "mCODE Specimen Site (SNOMED 39607008)",
        status: "Resolved",
        errorReason: "Abbreviated anatomical site string normalized to SNOMED CT term"
      },
      {
        id: "err_9903",
        timestamp: "2 hours ago",
        sourceSystem: "FoundationOne NGS VCF",
        rawCode: "HGVS p.G12C (KRAS)",
        mappedConcept: "HGVS Transvar canonical transcript NM_004985.5",
        status: "Pending Review",
        errorReason: "Transcript isoform discrepancy between RefSeq v109 and ENSEMBL v104"
      }
    ]
  };
}
