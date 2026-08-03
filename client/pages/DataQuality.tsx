import { PlaceholderPage } from "@/components/PlaceholderPage";
import { FileSpreadsheet, CheckCircle2, RefreshCw, BarChart2 } from "lucide-react";

export default function DataQuality() {
  return (
    <PlaceholderPage
      title="Data Quality Dashboard"
      subtitle="Data completeness metrics, OMOP CDM v5.4 vocabulary harmonization rates, mCODE conformance checks, and ingestion pipeline error queues."
      badge="OMOP CDM v5.4 Conformance"
      icon={<FileSpreadsheet className="w-6 h-6 text-teal-400" />}
      specs={[
        "OMOP Vocabulary Harmonization: Conformance tracking for SNOMED CT, LOINC, RxNorm, ICD-10-CM, and HGVS/HGNC gene symbols.",
        "mCODE FHIR Conformance: Automated validation of oncology profile constraints (Primary Cancer Condition, Genomic Variant, Cancer Disease Status).",
        "Ingestion Pipeline Health: HL7 v2 and FHIR bulk import throughput, retry queues, and dead-letter queue inspection.",
        "Probabilistic MPI Deduplication: Master Patient Index linkage score monitoring and merge conflict resolution."
      ]}
    />
  );
}
