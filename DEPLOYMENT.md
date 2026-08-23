# Institutional Deployment & Adoption Guide

This guide provides step-by-step instructions for cancer centers, academic medical institutions, and oncology research networks adopting the **UCANDO Cancer Data Commons** platform.

---

## 1. Fork and Configure

The platform has been engineered with a centralized institutional abstraction layer so you can rebrand and adapt the commons by editing a single configuration file.

### Step 1: Institutional Settings (`client/config/institution.ts`)
Edit `client/config/institution.ts` with your institution's particulars:

```typescript
export const institutionConfig = {
  name: "Your Cancer Center Name",
  shortName: "YCC",
  platformName: "YCC-COMMONS",
  fullName: "Your Comprehensive Cancer Center Data Commons Operations",
  primaryColorOklch: "oklch(0.38 0.14 20)", // Your primary academic color token
  accentColorOklch: "oklch(0.50 0.08 200)",  // Your analytical accent color token
  logoPath: "/assets/your-logo.png",
  legalEntity: "Your Health System / University Medical Center",
  supportEmail: "datacommons-support@yourcenter.edu",
  copyrightYear: "2026",
  tagline: "Enterprise Oncology Integration Hub & Multi-Omics Analytics",
  governanceBody: "Your Institutional Review Board (IRB) & Data Use Committee"
};
```

### Step 2: Environment Secrets
Configure your deployment environment variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | HTTP port | `8080` |
| `GEMINI_API_KEY` | Google Gemini Flash API key for iUCANDO AI Concierge | *(Optional: platform operates in local simulation mode if omitted)* |
| `EPIC_FHIR_CLIENT_ID` | SMART on FHIR OAuth2 Client ID for EHR launch | `SMART-SANDBOX-CLIENT-ID` |
| `DICOM_WADO_URL` | DICOMweb WADO-RS endpoint for OHIF radiology studies | `https://viewer.ohif.org/` |

---

## 2. Data Model & Compliance Invariants

### Synthetic Demo Baseline
All default records provided in this repository are **100% synthetic, mathematically generated, and fully de-identified**. No actual Protected Health Information (PHI) is included.

### Transitioning to Live Institutional Data
Replacing synthetic fixtures with real clinical records requires:
1. **Institutional Review Board (IRB) Protocol:** Approved protocol governing secondary research use of electronic health records and biospecimens.
2. **Business Associate Agreement (BAA):** Executed agreements with all hosting infrastructure and cloud vendors.
3. **Epic / EHR Vendor Credentialing:** SMART on FHIR app registration in the Epic App Orchard / vendor portal.
4. **OMOP CDM v5.4 Harmonization:** Ingestion of EHR tables into standard OMOP Common Data Model tables (`person`, `condition_occurrence`, `procedure_occurrence`, `measurement`, `drug_exposure`).
5. **Open Policy Agent (OPA) Integration:** Real-time enforcement of patient Dynamic Consent permissions before export or analysis.

---

## 3. Production Deployment

### Containerization (Docker)
Build the production container:

```bash
docker build -t your-registry/cancer-data-commons:latest .
docker run -p 8080:8080 -e NODE_ENV=production your-registry/cancer-data-commons:latest
```

### Google Cloud Run / Kubernetes Deployment
1. Push the container image to Google Artifact Registry / AWS ECR.
2. Deploy to Cloud Run / EKS:

```bash
gcloud run deploy cancer-data-commons \
  --image your-registry/cancer-data-commons:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

---

## 4. What's Real vs. Roadmap

To maintain complete scientific and institutional credibility, the following table outlines the current operational status of each module:

| Capability / Module | Current Operational Status | Underlying Technology & Architecture |
| :--- | :--- | :--- |
| **RNA-seq Analytics Studio** | **Live & Operational** | WebAssembly & browser-side FastQC/DESeq2 GLM modeling (`~ batch + condition`), Volcano plots, 3D PCA/UMAP, Hierarchical Heatmaps, and GSEA across Hallmark, Reactome, and KEGG. |
| **Cohort Builder & mCODE** | **Live & Operational** | In-memory differential privacy query engine generating HL7 FHIR mCODE JSON and GA4GH Beacon v2 payloads. |
| **Patient 360 & Patient Integration** | **Live & Operational** | Radial domain visualization and longitudinal clinical analytics (RECIST 1.1 curves, CTCAE toxicities, DeepSurv survival estimations) over synthetic OMOP CDM records. |
| **iUCADO-Orbit Evidence Engine** | **Live & Operational** | PICO structured evidence reasoning engine grounded in published PubMed/PMC citations and NCCN/ASCO guideline matrices. |
| **iUCANDO AI Research Concierge** | **Live & Operational** | Platform-aware oncology concierge connected to Gemini Flash 3.5 with fallback simulated reasoning. |
| **NCI GDC External Cohort Query** | **Live & Operational** | Real-time REST API integration with NIH NCI Genomic Data Commons. |
| **Epic EHR SMART-on-FHIR** | **Live Sandbox Integration** | Connects to SMART Health IT FHIR R4 sandbox; production requires institutional Epic OAuth2 registration. |
| **DICOM Imaging / OHIF** | **Live Embedded Deep-Link** | Zero-footprint web viewer deep-linking to OHIF DICOMweb endpoints. |
| **Epic Cosmos / Genomics / MyChart** | **Roadmap / Federated Target** | Architecture defined in API interoperability contracts; requires production vendor credentials. |
