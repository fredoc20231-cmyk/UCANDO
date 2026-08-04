# Beacon — UCCANDO Precision Oncology Data Commons

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![mCODE](https://img.shields.io/badge/mCODE-FHIR_R4-emerald.svg)](https://hl7.org/fhir/us/mcode/)
[![OMOP](https://img.shields.io/badge/OMOP_CDM-v5.4-navy.svg)](https://ohdsi.github.io/CommonDataModels/)
[![GA4GH](https://img.shields.io/badge/GA4GH-Beacon_v2-purple.svg)](https://ga4gh-beacon.github.io/)

Beacon is an enterprise precision oncology integration hub and federated data commons for the **UChicago Cancer Data Commons (UCCANDO)**. It unifies clinical EHR records, multiomics sequencing, digital radiology DICOMweb studies, pathology Whole Slide Images (WSI), LIMS biospecimen lineages, and clinical trial matching under a strict zero-PHI dynamic consent framework.

---

## 🏛 Architecture & Hub-and-Spoke Topology

Beacon operates as a **Hub-and-Spoke** federated architecture where the central Hub acts as a single governed point of truth, orchestrating bidirectional data streams across six specialized domain spokes:

```
                          ┌──────────────────────────┐
                          │   Digital Radiology /    │
                          │   Pathology WSI Spoke    │
                          │ (DICOMweb / OHIF Viewer) │
                          └────────────┬─────────────┘
                                       │
┌──────────────────────────┐           │           ┌──────────────────────────┐
│   EHR Clinical Spoke     │           │           │   Multiomics Platform    │
│  (Epic HL7 / FHIR Bulk)  ├───────────┼───────────┤   (GATK / BioCompute)    │
└──────────────────────────┘           │           └──────────────────────────┘
                                       │
                               ┌───────┴───────┐
                               │  BEACON HUB   │
                               │  (OMOP CDM /  │
                               │  mCODE FHIR)  │
                               └───────┬───────┘
                                       │
┌──────────────────────────┐           │           ┌──────────────────────────┐
│  LIMS / Biobank Spoke    │           │           │   Research Workspaces    │
│  (HTRC Specimen Tracking)├───────────┼───────────┤   & Trial Matching       │
└──────────────────────────┘           │           └──────────────────────────┘
                                       │
                          ┌────────────┴─────────────┐
                          │ GA4GH Beacon v2 Spoke    │
                          │ (Federated Discovery API)│
                          └──────────────────────────┘
```

### Connected Spokes
1. **EHR Clinical Core (Epic Cadence)**: Ingests ADT encounters, LOINC lab results, ICD-10/SNOMED diagnoses, RxNorm orders, and oncology progress notes via HL7 v2 and FHIR R4 Bulk `$export`.
2. **Multiomics Analysis Platform**: Receives somatic/germline VCFs, gene expression TPM matrices, and single-cell RNA-seq. Pushes BioCompute Object (IEEE 2791-2020) provenance write-backs into FHIR `DiagnosticReport` / `MolecularSequence` bundles.
3. **Digital Radiology & Pathology Platform**: Integrates cloud DICOMweb (QIDO-RS, WADO-RS, STOW-RS) for PET/CT, MRI, and 40x WSI pathology scans with embedded OHIF viewer context-signed deep links.
4. **LIMS / Human Tissue Resource Center (HTRC)**: Tracks FFPE tumor blocks, plasma, buffy coat aliquots, cryo-preservation lineage, and QC metrics via FHIR `Specimen` and `Observation`.
5. **Cancer Tumor Registry**: Ingests SEER/CoC accredited staging, AJCC TNM classifications, first-course treatment, and 5-year survival status normalized to OMOP CDM v5.4.
6. **Research Workspaces & GA4GH Beacon**: Secure analytical sandboxes (Jupyter, Databricks) and GA4GH Beacon v2 federated discovery API with differential privacy budgeting.

---

## 🔒 Security Invariants & Zero-Trust Governance

### 1. Builder.io PHI-Free Architectural Invariant
**Non-Negotiable Constraint**: Builder.io serves strictly as a PHI-free visual orchestration layer. Protected Health Information (PHI) is never transmitted to, stored in, or processed by Builder CMS services. All clinical rendering occurs client-side or via authenticated server calls to the Beacon Hub.

### 2. Dynamic Open Policy Agent (OPA) Consent Engine
All data exports, research workspace queries, and federated GA4GH Beacon queries are evaluated in real-time against OPA Rego policies. When a patient modifies consent preferences (e.g. revoking AI model training or commercial sharing), policy enforcement propagates across downstream spokes within **< 24 hours**.

```rego
package beacon.consent

default allow = false

# Permit internal academic research if patient consent is active
allow {
    input.action == "DATA_READ"
    input.purpose == "academic_research"
    input.patient_consent.researchUse == true
    input.patient_consent.status == "Active"
}

# Enforce Safe Harbor de-identification for research exports
allow {
    input.action == "EXPORT_REQUEST"
    input.patient_consent.biospecimensUse == true
    input.deidentification_level == "SafeHarbor"
}
```

### 3. De-Identification Standards & Token Vault
- **Clinical Progress Notes**: Scrutinized by Safe Harbor regex scrubbing and clinical NLP tokenization.
- **Token Vault**: Re-identification tokens are encrypted with per-tenant HSM keys (AES-256-GCM) and stored in an air-gapped vault accessible only during authorized break-glass events with mandatory immutable audit logging.

---

## 📐 Data Harmonization Standards

- **mCODE (minimal Common Oncology Data Elements)**: Standardized FHIR R4 profile representation for genomics variants, cancer disease status, treatment termination, and surgical procedures.
- **OMOP CDM v5.4**: Relational schema harmonization for population health analytics, survival curves, and cross-modal cohort discovery.
- **BioCompute Objects (IEEE 2791-2020)**: Cryptographic execution JSON provenance wrappers attached to all variant pipeline executions (GATK / Dragen v4.2).

---

## 🛠 Tech Stack

- **Frontend**: React 18 SPA + React Router 6 + TypeScript + Vite + TailwindCSS 3 + Radix UI + Lucide React
- **Backend**: Express API server integrated into Vite dev middleware
- **AI Copilot**: Google Gemini 3.5 Flash API with prompt validation & rate limiting
- **State Management**: TanStack React Query + React Context (`AuthContext`, `BackgroundContext`)
- **Testing & Tooling**: Vitest, TypeScript `tsc`, PNPM

---

## 📁 Repository Structure

```
├── client/                      # React SPA Frontend
│   ├── components/              # UI components
│   │   ├── ui/                  # Radix UI primitives
│   │   ├── SyntheticDataBanner.tsx # Demo synthetic data warning banner
│   │   ├── RequireAuth.tsx      # Route auth guard
│   │   ├── LoginModal.tsx       # Demo clinician authentication dialog
│   │   ├── HubAndSpokeVisualizer.tsx # Interactive topology visualizer
│   │   ├── ApiContractsModal.tsx   # OpenAPI specification contracts
│   │   └── IRBCharterModal.tsx     # IRB governance charter
│   ├── context/                 # Application contexts
│   │   ├── AuthContext.tsx      # Demo authentication provider
│   │   └── BackgroundContext.tsx# Theme background context
│   ├── pages/                   # SPA page routes
│   │   ├── Index.tsx            # Hub Command Center dashboard
│   │   ├── Patient360.tsx       # Protected Clinician Patient 360 view
│   │   ├── CohortBuilder.tsx    # Visual Cohort Query Builder & Kaplan-Meier
│   │   ├── DynamicConsent.tsx   # Protected Dynamic Consent Console & OPA Rego
│   │   ├── Governance.tsx       # Protected Governance & DUC Access Matrix
│   │   ├── AuditDashboard.tsx   # Protected WORM Compliance & Audit Logs
│   │   ├── ImagingHub.tsx       # DICOMweb & Pathology WSI Launch Hub
│   │   ├── OmicsView.tsx        # Multiomics Variant & OncoPrint Viewer
│   │   ├── TrialMatching.tsx    # Precision Oncology Trial Prescreening
│   │   └── DataQuality.tsx      # OMOP/mCODE Conformance & Quality Engine
│   ├── App.tsx                  # SPA route definitions & Auth Guards
│   └── global.css               # TailwindCSS theme tokens
├── server/                      # Express Backend
│   ├── data/                    # Data Access Layer
│   │   └── beaconRepository.ts  # Decoupled mock repository & in-memory consent store
│   ├── routes/                  # Express API Route Handlers
│   │   └── beacon.ts            # Validated & rate-limited Express endpoints
│   └── index.ts                 # Express server entry point
└── shared/                      # Shared Interfaces & Types
    └── api.ts                   # TypeScript interfaces for API payloads
```

---

## 🔌 API Endpoints Reference

| Method | Route | Description | Auth Guard |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | Hub KPI stats, patient counts & data zone distribution | Public |
| `GET` | `/api/spokes` | Connected spoke latency, throughput & protocol status | Public |
| `GET` | `/api/patient360` | Full Patient 360 record (Demographics, Consent, Timeline, Omics, DICOM, Infusions) | Protected (`/patient-360`) |
| `POST` | `/api/consent/update` | Updates patient consent permissions in the in-memory repository store | Protected (`/consent-console`) |
| `POST` | `/api/cohort/query` | Executes visual cohort query, computes Kaplan-Meier survival curves & mCODE query spec | Public |
| `GET` | `/api/multiomics` | Retrieves somatic/germline variants, OncoPrint matrix & expression heatmap | Public |
| `GET` | `/api/imaging` | DICOMweb study details, WSI pathology metadata & radiomics features | Public |
| `GET` | `/api/trials` | AI precision trial Prescreen matching scores & biomarker eligibility | Public |
| `GET` | `/api/audit-logs` | Immutable WORM audit logs with SHA-256 verification hashes | Protected (`/audit-dashboard`) |
| `GET` | `/api/data-quality` | OMOP v5.4 conformance & mCODE mapping error metrics | Public |
| `POST` | `/api/copilot` | Hardened Gemini AI oncology copilot endpoint (Max 2,000 chars, 10 req/min/IP limit) | Public |

---

## ⚡ Gemini Copilot Endpoint Hardening

The `/api/copilot` route includes defensive middleware-level protections:
1. **Payload Sanitization**: Validates that `req.body.prompt` is a non-empty string under **2,000 characters** (returns HTTP `400 Bad Request` if invalid).
2. **Rate Limiting**: Custom sliding-window in-memory rate limiter enforcing **max 10 requests per minute per IP address** (returns HTTP `429 Too Many Requests` when exceeded).
3. **Graceful Fallback**: Returns structured fallback simulation payload when `GEMINI_API_KEY` is not configured.

---

## 🗄 Repository Pattern & Database Migration Strategy

Mock data and consent persistence are decoupled into `server/data/beaconRepository.ts`.

### Migration to Production Database
To migrate off mock data:
1. Replace functions in `server/data/beaconRepository.ts` with Prisma/Kysely/Drizzle ORM queries against PostgreSQL/Supabase.
2. Replace `consentStore` in `beaconRepository.ts` with a persistent `patient_consent` database table with row-level security (RLS) policies.
3. No changes to `server/routes/beacon.ts`, `server/index.ts`, or client UI components are required.

---

## 💻 Development Commands

```bash
# Install dependencies
pnpm install

# Start unified development server (Vite + Express on port 8080)
pnpm dev

# Type check TypeScript codebase
pnpm typecheck

# Production build
pnpm build

# Start production server
pnpm start
```

---

## 📄 License & Governance

© 2025 The Beacon Comprehensive Cancer Center Data Commons. All rights reserved. Operates under IRB Protocol `IRB-DEMO-0000` for consented clinical ecosystem data integration.
