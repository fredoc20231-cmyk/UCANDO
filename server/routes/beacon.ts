import { RequestHandler } from "express";
import {
  HubStats,
  SpokeConnection,
  Patient360Record,
  ApiContractSpec,
  IRBCharterDoc
} from "@shared/api";

export const handleGetHubStats: RequestHandler = (_req, res) => {
  const stats: HubStats = {
    totalConsentedPatients: 104280,
    totalBiospecimens: 1240500,
    totalImagingStudies: 462100,
    totalOmicsProfiles: 84910,
    activeWorkspaces: 342,
    hipaaComplianceScore: 100,
    eventBusTps: 1845,
    opaPolicyEnforcementsToday: 49210,
    dataZones: [
      {
        name: "Raw (Identified)",
        code: "raw",
        count: 104280,
        description: "Zero-Trust HIPAA Vault. EHR HL7/FHIR feeds, identified MRN/PHI isolated in encrypted tenant vault.",
        securityLevel: "AES-256 + HSM Isolated"
      },
      {
        name: "Curated (Controlled)",
        code: "curated",
        count: 98450,
        description: "OMOP CDM v5.4 harmonized data, validated mCODE oncology profiles & BioCompute provenance.",
        securityLevel: "RBAC + Dynamic OPA Consent"
      },
      {
        name: "De-identified (Analytics)",
        code: "deid",
        count: 98450,
        description: "Safe Harbor & Expert Determination de-identified clinical, omics & radiomics lakehouse zone.",
        securityLevel: "Tokenized Research ID"
      },
      {
        name: "Public (GA4GH Beacon)",
        code: "public",
        count: 85200,
        description: "GA4GH Beacon v2 federated discovery endpoint. Aggregate frequency queries only, zero PHI.",
        securityLevel: "Differential Privacy Budgeted"
      }
    ]
  };
  res.json(stats);
};

export const handleGetSpokes: RequestHandler = (_req, res) => {
  const spokes: SpokeConnection[] = [
    {
      id: "ehr",
      name: "EHR (Epic Cadence)",
      subtitle: "UChicago Medicine EHR Core",
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
  res.json(spokes);
};

export const handleGetPatient360: RequestHandler = (req, res) => {
  const patientId = (req.query.id as string) || "UC-BEACON-89421";

  const patientRecord: Patient360Record = {
    demographics: {
      id: patientId,
      deIdentifiedId: "DEID-BEACON-772910",
      mrn: "UC-4892104-A",
      age: 54,
      gender: "Female",
      ethnicity: "Non-Hispanic White",
      primaryDiagnosis: "Invasive Ductal Carcinoma of Breast",
      stage: "Stage IIIB (pT3, pN2a, cM0)",
      oncoSubtype: "Triple-Negative Breast Cancer (TNBC) - High Risk",
      attendingPhysician: "Dr. Fred, MD, PhD (Oncology)",
      primaryCenter: "UChicago Comprehensive Cancer Center",
      consentStatus: "Consented"
    },
    consent: {
      status: "Active",
      effectiveDate: "2023-08-14",
      lastVerified: "2024-02-10 (OPA Policy #UC-CONSENT-9942)",
      opaPolicyId: "opa:policy:uchicago:cancer:beacon:consent_v2_4",
      permissions: {
        researchUse: true,
        recontactGranted: true,
        biospecimensUse: true,
        aiModelTraining: true,
        commercialSharing: false
      }
    },
    timeline: [
      {
        id: "evt-01",
        date: "2023-07-28",
        type: "diagnosis",
        title: "Initial Diagnosis: Right Breast Invasive Carcinoma",
        description: "Core needle biopsy confirmed invasive ductal carcinoma, Grade 3. ER 0%, PR 0%, HER2 1+ (Triple Negative).",
        category: "Diagnosis & Pathology",
        severity: "severe",
        sourceSpoke: "ehr"
      },
      {
        id: "evt-02",
        date: "2023-08-04",
        type: "surgery",
        title: "Surgical Resection & Biospecimen Collection",
        description: "Right modified radical mastectomy with axillary lymph node dissection. 4 of 12 lymph nodes positive.",
        category: "Surgery & LIMS",
        severity: "normal",
        sourceSpoke: "lims"
      },
      {
        id: "evt-03",
        date: "2023-08-18",
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
        date: "2023-09-01",
        type: "treatment",
        title: "Initiation of Dose-Dense AC-T + Pembrolizumab Regimen",
        description: "Cycle 1: Doxorubicin (60 mg/m²) + Cyclophosphamide (600 mg/m²) + Pembrolizumab (200 mg).",
        category: "Infusion / Medical Oncology",
        severity: "normal",
        sourceSpoke: "ehr"
      },
      {
        id: "evt-05",
        date: "2023-10-14",
        type: "toxicity",
        title: "Adverse Toxicity: Grade 3 Febrile Neutropenia",
        description: "ANC dropped to 0.4 x 10^9/L. Hospitalized for 48 hours, resolved after G-CSF (Filgrastim) support.",
        category: "Toxicity & Safety",
        severity: "severe",
        sourceSpoke: "ehr"
      },
      {
        id: "evt-06",
        date: "2023-11-20",
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
        date: "2024-01-15",
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
        bioComputeObject: "https://beacon.uchicago.edu/bco/BCO-2023-BRCA1-094",
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
        bioComputeObject: "https://beacon.uchicago.edu/bco/BCO-2023-TP53-112",
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
        bioComputeObject: "https://beacon.uchicago.edu/bco/BCO-2023-PIK3-004",
        multiomicsPlatformJobId: "OMICS-JOB-884920"
      }
    ],
    imaging: [
      {
        studyId: "STD-2023-9941",
        accessionNumber: "ACC-2023-9941",
        modality: "PET/CT",
        studyDate: "2023-11-20",
        bodyPart: "Chest/Abdomen/Pelvis",
        instancesCount: 480,
        dicomWebEndpoint: "https://imaging.uchicago.edu/dicomweb/studies/1.2.840.113619.2.55.3.28",
        ohifViewerUrl: "https://beacon.uchicago.edu/viewer?studyInstanceUID=1.2.840.113619.2.55.3.28&token=signed_ctx_9941",
        aiAnnotationsCount: 3,
        findingsSummary: "No FDG-avid residual tumor in primary bed. Axillary lymphadenopathy resolved."
      },
      {
        studyId: "STD-2023-8102",
        accessionNumber: "ACC-2023-8102",
        modality: "MRI",
        studyDate: "2023-08-01",
        bodyPart: "Bilateral Breast with Contrast",
        instancesCount: 320,
        dicomWebEndpoint: "https://imaging.uchicago.edu/dicomweb/studies/1.2.840.113619.2.55.3.10",
        ohifViewerUrl: "https://beacon.uchicago.edu/viewer?studyInstanceUID=1.2.840.113619.2.55.3.10&token=signed_ctx_8102",
        aiAnnotationsCount: 5,
        findingsSummary: "4.2 cm lobulated heterogeneously enhancing mass in right upper outer quadrant."
      },
      {
        studyId: "STD-2023-WSI-04",
        accessionNumber: "ACC-WSI-2023-441",
        modality: "WSI",
        studyDate: "2023-08-05",
        bodyPart: "Surgical Specimen Histology",
        instancesCount: 12,
        dicomWebEndpoint: "https://pathology.uchicago.edu/dicomweb/studies/1.3.6.1.4.1.59973.1",
        ohifViewerUrl: "https://beacon.uchicago.edu/viewer/wsi?studyUID=1.3.6.1.4.1.59973.1",
        aiAnnotationsCount: 18,
        findingsSummary: "Whole slide pathology 40x scan. Tumor infiltrating lymphocytes (TILs) elevated at 45%."
      }
    ],
    labs: [
      { date: "2023-07-28", marker: "CA 15-3", value: 68.4, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Elevated" },
      { date: "2023-09-01", marker: "CA 15-3", value: 42.1, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Elevated" },
      { date: "2023-11-20", marker: "CA 15-3", value: 18.2, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Normal" },
      { date: "2024-02-01", marker: "CA 15-3", value: 14.5, unit: "U/mL", referenceRange: "< 30.0 U/mL", status: "Normal" },
      { date: "2023-10-14", marker: "Absolute Neutrophil Count (ANC)", value: 0.4, unit: "x10^9/L", referenceRange: "1.5 - 8.0 x10^9/L", status: "High Risk" },
      { date: "2023-10-18", marker: "Absolute Neutrophil Count (ANC)", value: 2.8, unit: "x10^9/L", referenceRange: "1.5 - 8.0 x10^9/L", status: "Normal" },
      { date: "2024-02-01", marker: "Hemoglobin", value: 12.8, unit: "g/dL", referenceRange: "12.0 - 15.5 g/dL", status: "Normal" }
    ],
    infusions: [
      {
        id: "inf-101",
        drugName: "Pembrolizumab (Keytruda)",
        dose: "200 mg IV",
        route: "Intravenous Infusion",
        cycle: "Cycle 1 - 8 (Every 3 Weeks)",
        startDate: "2023-09-01",
        status: "Active"
      },
      {
        id: "inf-102",
        drugName: "Doxorubicin (Adriamycin)",
        dose: "60 mg/m²",
        route: "IV Push",
        cycle: "Cycle 1 - 4 (Dose-Dense)",
        startDate: "2023-09-01",
        endDate: "2023-10-26",
        toxicityGrade: 3,
        toxicityNotes: "Grade 3 neutropenia managed with G-CSF",
        status: "Completed"
      },
      {
        id: "inf-103",
        drugName: "Cyclophosphamide (Cytoxan)",
        dose: "600 mg/m²",
        route: "IV Infusion",
        cycle: "Cycle 1 - 4 (Dose-Dense)",
        startDate: "2023-09-01",
        endDate: "2023-10-26",
        toxicityGrade: 1,
        status: "Completed"
      },
      {
        id: "inf-104",
        drugName: "Paclitaxel (Taxol)",
        dose: "175 mg/m²",
        route: "IV Infusion",
        cycle: "Cycle 5 - 8 (Dose-Dense)",
        startDate: "2023-11-09",
        status: "Active"
      }
    ],
    biospecimens: [
      {
        specimenId: "SPEC-2023-FFPE-904",
        type: "FFPE Tumor Block",
        anatomicSite: "Right Breast Primary Tumor",
        volume: "1 Tissue Block (10 slides cut)",
        collectionDate: "2023-08-04",
        limsBarcode: "HTRC-BC-2023-88901",
        storageTemp: "-20°C Vault",
        lineageStage: "Sequencing Ready"
      },
      {
        specimenId: "SPEC-2023-PLASMA-112",
        type: "Plasma",
        anatomicSite: "Peripheral Blood Draw",
        volume: "4 mL Aliqout x 3",
        collectionDate: "2023-11-20",
        limsBarcode: "HTRC-PL-2023-99411",
        storageTemp: "-80°C Cryo",
        lineageStage: "DNA Extraction"
      },
      {
        specimenId: "SPEC-2023-BUFFY-04",
        type: "Buffy Coat Blood",
        anatomicSite: "Germline Control Draw",
        volume: "2 mL Aliquot",
        collectionDate: "2023-08-04",
        limsBarcode: "HTRC-GERM-2023-0041",
        storageTemp: "-80°C Cryo",
        lineageStage: "Sequencing Ready"
      }
    ],
    notes: [
      {
        noteId: "NOTE-2023-8820",
        date: "2023-08-20",
        authorRole: "Attending Oncologist (Dr. Fred)",
        noteType: "Oncology Progress Note",
        deIdentifiedContent: "54-year-old female patient presented with Stage IIIB TNBC. Germline panel positive for pathogenic [REDACTED_GENE_MUTATION]. Multidisciplinary tumor board recommended dose-dense AC-T regimen combined with neoadjuvant pembrolizumab immunotherapy. Patient consented for UChicago Beacon Data Commons biobanking under protocol [REDACTED_IRB].",
        safeHarborRedactionsCount: 4
      },
      {
        noteId: "NOTE-2023-9914",
        date: "2023-11-22",
        authorRole: "Radiologist",
        noteType: "Radiology Impression",
        deIdentifiedContent: "Restaging PET/CT performed after 4 cycles of AC chemotherapy. Complete resolution of FDG uptake in the surgical bed (SUV max 1.2 vs 12.4 baseline). No distant metastatic lesions identified.",
        safeHarborRedactionsCount: 2
      }
    ]
  };

  res.json(patientRecord);
};

export const handleGetApiContracts: RequestHandler = (_req, res) => {
  const contracts: Record<string, ApiContractSpec> = {
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
          summary: "Multiomics Platform Results Write-Back to Beacon Hub",
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
              biocompute_object: "https://beacon.uchicago.edu/bco/BCO-2024-00129"
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

  res.json(contracts);
};

export const handleGetIRBCharter: RequestHandler = (_req, res) => {
  const charter: IRBCharterDoc = {
    title: "UChicago Cancer Data Commons 'Beacon' — Governance Charter & Consent Framework",
    irbApprovalNumber: "IRB23-0941-UCHICAGO",
    version: "v3.1",
    effectiveDate: "2024-01-01",
    sections: [
      {
        heading: "1. Scope & Primary Mandate",
        content: "The UChicago Cancer Data Commons ('Beacon') serves as the unified, HIPAA-compliant integration spine for all cancer center patient data (EHR, multiomics, digital radiology, digital pathology WSI, biospecimens, tumor registry, and PROs). Every consented patient record is ingested, harmonized under OMOP CDM v5.4 and mCODE FHIR, and governed strictly by dynamic consent preferences."
      },
      {
        heading: "2. Builder.io PHI-Free Architectural Invariant",
        content: "Non-Negotiable Rule: Builder.io is strictly a PHI-free visual layer. No protected health information (PHI) or patient record shall ever be transmitted to or stored within Builder content or services. All patient rendering occurs client-side or via authenticated server calls directly to the Beacon Hub."
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

  res.json(charter);
};
