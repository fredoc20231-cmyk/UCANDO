export interface PatientProfile {
  id: string;
  mrn: string;
  deIdentifiedId: string;
  name: string;
  age: number;
  gender: string;
  cancerType: string;
  stage: string;
  ecogScore: number;
  histology: string;
  biomarkers: {
    name: string;
    value: string;
    status: "Pathogenic" | "VUS" | "Positive" | "Negative" | "High" | "Normal";
    targetable: boolean;
  }[];
  tmb: string;
  msiStatus: string;
  pdl1Tps: string;
  currentRegimen: {
    name: string;
    line: string;
    startDate: string;
    cycle: string;
    schedule: string;
    intent: "Curative / Neoadjuvant" | "Adjuvant" | "First-Line Metastatic" | "Second-Line Metastatic" | "Maintenance";
    drugs: {
      name: string;
      dose: string;
      route: string;
      frequency: string;
      target: string;
    }[];
    toxicities: {
      event: string;
      grade: number;
      ctcaeCategory: string;
      management: string;
    }[];
  };
  outcomesResponse: {
    recistResponse: "Complete Response (CR)" | "Partial Response (PR)" | "Stable Disease (SD)" | "Progressive Disease (PD)";
    targetLesionChangePercent: number; // e.g. -42%
    baselineSumDiameterMm: number;
    currentSumDiameterMm: number;
    durationOfResponseMonths: number;
    pfsMonthsToDate: number;
    biomarkerTracking: {
      name: string;
      unit: string;
      normalThreshold: number;
      series: { date: string; value: number; event?: string }[];
    };
    radiologicEvaluations: {
      date: string;
      modality: string;
      findings: string;
      recistAssessment: string;
      sumDiameterMm: number;
    }[];
  };
  pastTreatments: {
    line: string;
    treatmentName: string;
    category: "Systemic Chemotherapy" | "Targeted Therapy" | "Immunotherapy" | "Surgery" | "Radiation" | "Endocrine Therapy";
    startDate: string;
    endDate: string;
    duration: string;
    bestResponse: string;
    discontinuationReason: string;
    keyToxicities: string[];
    details: string;
  }[];
  futureExpectedTreatments: {
    priorityRank: number;
    regimenName: string;
    category: string;
    nccnConcordance: "Category 1" | "Category 2A" | "Category 2B" | "Investigational";
    rationale: string;
    matchingBiomarkers: string[];
    expectedResponseRate: string;
    medianPfsExpected: string;
    fdaStatus: "FDA Approved" | "NCCN Off-Label" | "Phase 3 Clinical Trial";
    associatedTrialId?: string;
  }[];
  survivalPredictions: {
    baselineRiskScore: number; // 0 - 100
    riskCategory: "Favorable" | "Intermediate" | "High Risk" | "Very High Risk";
    modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2";
    estimatedOs: {
      oneYear: number;
      threeYear: number;
      fiveYear: number;
      medianMonths: number;
    };
    estimatedPfs: {
      oneYear: number;
      twoYear: number;
      medianMonths: number;
    };
    modalitiesFused: string[];
    counterfactualRegimens: {
      regimen: string;
      projectedMedianOsMonths: number;
      projectedMedianPfsMonths: number;
      fiveYearOsProb: number;
      hazardRatioVsSoc: number;
      pfsGainMonths: number;
    }[];
    riskFactors: {
      factor: string;
      impact: "protective" | "adverse";
      weight: number;
      annotation: string;
    }[];
  };
}

export const PATIENT_CATALOG: PatientProfile[] = [
  {
    id: "UC-CCC-89421",
    mrn: "MRN-90241-B",
    deIdentifiedId: "DEID-UCANDO-894210",
    name: "Patient 89421 (Consented Cohort A)",
    age: 52,
    gender: "Female",
    cancerType: "Triple-Negative Breast Carcinoma (TNBC)",
    stage: "Stage IIIB (cT3N2aM0)",
    ecogScore: 1,
    histology: "Invasive Ductal Carcinoma, Nottingham Grade 3",
    biomarkers: [
      { name: "BRCA1 c.5266dupC (p.Gln1756Profs*74)", value: "Pathogenic Germline (VAF 49.8%)", status: "Pathogenic", targetable: true },
      { name: "TP53 c.743G>A (p.Arg248Gln)", value: "Somatic Missense (VAF 38.2%)", status: "Pathogenic", targetable: false },
      { name: "PD-L1 (22C3)", value: "CPS = 12 (Positive ≥ 10)", status: "Positive", targetable: true },
      { name: "ER / PR", value: "ER 0%, PR 0% (Allred 0/8)", status: "Negative", targetable: false },
      { name: "HER2 (IHC / FISH)", value: "IHC 1+ (HER2-Low), FISH Ratio 1.1", status: "Normal", targetable: true },
      { name: "Ki-67 Proliferation", value: "85% (Highly Proliferative)", status: "High", targetable: false }
    ],
    tmb: "9.4 mut/Mb (Intermediate)",
    msiStatus: "MSS (Microsatellite Stable)",
    pdl1Tps: "CPS 12",
    currentRegimen: {
      name: "KEYNOTE-522 Regimen (Pembrolizumab + Carboplatin + Paclitaxel)",
      line: "Neoadjuvant / First-Line Curative Intent",
      startDate: "2023-09-01",
      cycle: "Cycle 4 of 8 (Phase 2 Dose-Dense AC followed by Chemo-IO)",
      schedule: "Q3W Pembrolizumab (200mg) + Weekly Paclitaxel/Carboplatin",
      intent: "Curative / Neoadjuvant",
      drugs: [
        { name: "Pembrolizumab", dose: "200 mg", route: "IV Infusion", frequency: "Q3W", target: "PD-1 Immune Checkpoint" },
        { name: "Carboplatin", dose: "AUC 5", route: "IV Infusion", frequency: "Q3W", target: "DNA Cross-Linking" },
        { name: "Paclitaxel", dose: "80 mg/m²", route: "IV Infusion", frequency: "Weekly x 12", target: "Microtubule Stabilization" }
      ],
      toxicities: [
        { event: "Neutropenia", grade: 2, ctcaeCategory: "Hematologic", management: "Dose held 4 days; recovered to ANC 1.8x10^9/L with G-CSF support" },
        { event: "Peripheral Sensory Neuropathy", grade: 1, ctcaeCategory: "Neurological", management: "Mild fingertip numbness; monitored closely, no dose reduction" },
        { event: "Fatigue", grade: 1, ctcaeCategory: "Constitutional", management: "Managed with routine activity pacing and hydration" }
      ]
    },
    outcomesResponse: {
      recistResponse: "Partial Response (PR)",
      targetLesionChangePercent: -46.5,
      baselineSumDiameterMm: 58,
      currentSumDiameterMm: 31,
      durationOfResponseMonths: 5.8,
      pfsMonthsToDate: 7.2,
      biomarkerTracking: {
        name: "CA 15-3 Serum Kinetic Tracking",
        unit: "U/mL",
        normalThreshold: 30.0,
        series: [
          { date: "2023-07-28", value: 68.4, event: "Diagnostic Biopsy" },
          { date: "2023-09-01", value: 54.2, event: "C1 Pembrolizumab + Chemo" },
          { date: "2023-10-15", value: 42.1, event: "C2 Interim Assessment" },
          { date: "2023-11-20", value: 24.8, event: "C3 Partial Response -32%" },
          { date: "2024-01-10", value: 18.2, event: "C4 Partial Response -46%" },
          { date: "2024-02-14", value: 14.5, event: "Pre-Surgical Restaging" }
        ]
      },
      radiologicEvaluations: [
        { date: "2023-08-10", modality: "PET/CT Chest & Breast MRI", findings: "58 mm primary upper outer quadrant mass with 2 enlarged Level I/II axillary nodes (max 21 mm)", recistAssessment: "Baseline Target Lesion: 58 mm", sumDiameterMm: 58 },
        { date: "2023-11-22", modality: "Contrast Breast MRI", findings: "Marked interval tumor regression to 39 mm; axillary nodes decreased to 11 mm", recistAssessment: "Partial Response (-32.7%)", sumDiameterMm: 39 },
        { date: "2024-02-05", modality: "Restaging PET/CT & MRI", findings: "Residual primary density 31 mm; metabolic SUVmax down from 14.2 to 2.1; no distant metastasis", recistAssessment: "Confirmed PR (-46.5%)", sumDiameterMm: 31 }
      ]
    },
    pastTreatments: [
      {
        line: "Initial Diagnostic Workup & Biopsy",
        treatmentName: "Core Needle Biopsy & Sentinel Node Mapping",
        category: "Surgery",
        startDate: "2023-07-28",
        endDate: "2023-08-04",
        duration: "1 week",
        bestResponse: "Confirmed Nottingham Grade 3 TNBC",
        discontinuationReason: "Diagnostic Completion",
        keyToxicities: ["Grade 1 localized hematoma"],
        details: "Pathology confirmed ER 0%, PR 0%, HER2 1+, Ki-67 85%, PD-L1 CPS 12."
      }
    ],
    futureExpectedTreatments: [
      {
        priorityRank: 1,
        regimenName: "Definitive Surgery (Modified Radical Mastectomy + Axillary Dissection) + Adjuvant Olaparib",
        category: "PARP Inhibitor Targeted Therapy",
        nccnConcordance: "Category 1",
        rationale: "Patient carries pathogenic germline BRCA1 c.5266dupC mutation. OlympiA trial demonstrates significant 3-year IDFS (85.9% vs 77.1%) and OS benefit with adjuvant Olaparib for 1 year post-neoadjuvant chemo.",
        matchingBiomarkers: ["BRCA1 Germline Pathogenic", "High-Risk TNBC Residual Risk"],
        expectedResponseRate: "88% 3-Yr IDFS",
        medianPfsExpected: "Not Reached (> 48 mos)",
        fdaStatus: "FDA Approved"
      },
      {
        priorityRank: 2,
        regimenName: "Sacituzumab Govitecan-hziy (Trop-2 ADC)",
        category: "Antibody-Drug Conjugate",
        nccnConcordance: "Category 1",
        rationale: "If disease recurs with distant metastatic progression, Sacituzumab Govitecan is preferred 2nd-line standard based on ASCENT trial (mPFS 5.6 mos vs 1.7 mos, mOS 12.1 mos vs 6.7 mos).",
        matchingBiomarkers: ["Trop-2 Expression", "TNBC Lineage"],
        expectedResponseRate: "35% ORR",
        medianPfsExpected: "5.6 - 7.0 mos",
        fdaStatus: "FDA Approved"
      },
      {
        priorityRank: 3,
        regimenName: "Trastuzumab Deruxtecan (T-DXd) for HER2-Low Subgroup",
        category: "HER2 ADC Targeted Therapy",
        nccnConcordance: "Category 2A",
        rationale: "Patient is HER2 IHC 1+ (HER2-Low). DESTINY-Breast04 demonstrated substantial PFS and OS improvements with T-DXd in HER2-low metastatic cohorts.",
        matchingBiomarkers: ["HER2 IHC 1+ (HER2-Low)"],
        expectedResponseRate: "50% ORR",
        medianPfsExpected: "8.5 mos",
        fdaStatus: "FDA Approved"
      }
    ],
    survivalPredictions: {
      baselineRiskScore: 34,
      riskCategory: "Favorable",
      modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2",
      estimatedOs: {
        oneYear: 94.2,
        threeYear: 82.8,
        fiveYear: 76.4,
        medianMonths: 72
      },
      estimatedPfs: {
        oneYear: 86.5,
        twoYear: 74.2,
        medianMonths: 54
      },
      modalitiesFused: [
        "Genomic Variant Pathogenicity (BRCA1, TP53)",
        "DESeq2 50-Gene Hallmarks Expression Signature",
        "PET/CT Radiomics Metabolic Volume (SUVmax 14.2 → 2.1)",
        "EHR Clinical Variables (Age 52, ECOG 1, cT3N2a)"
      ],
      counterfactualRegimens: [
        {
          regimen: "Standard Chemo Alone (AC-T without Pembrolizumab/Olaparib)",
          projectedMedianOsMonths: 46,
          projectedMedianPfsMonths: 28,
          fiveYearOsProb: 56.2,
          hazardRatioVsSoc: 1.0,
          pfsGainMonths: 0
        },
        {
          regimen: "KEYNOTE-522 Neoadjuvant Chemo-IO + Adjuvant Pembrolizumab",
          projectedMedianOsMonths: 64,
          projectedMedianPfsMonths: 48,
          fiveYearOsProb: 71.8,
          hazardRatioVsSoc: 0.63,
          pfsGainMonths: 20
        },
        {
          regimen: "Precision Arm: Chemo-IO + Post-Op PARP Maintenance (Olaparib 1-Yr)",
          projectedMedianOsMonths: 78,
          projectedMedianPfsMonths: 62,
          fiveYearOsProb: 81.5,
          hazardRatioVsSoc: 0.44,
          pfsGainMonths: 34
        }
      ],
      riskFactors: [
        { factor: "Germline BRCA1 with PARP Vulnerability", impact: "protective", weight: -0.38, annotation: "Predicts high sensitivity to platinum and PARP inhibition" },
        { factor: "High PD-L1 Expression (CPS 12)", impact: "protective", weight: -0.29, annotation: "Predicts superior pathological complete response (pCR) with immune checkpoint inhibitor" },
        { factor: "High Baseline Tumor Burden (cT3N2a)", impact: "adverse", weight: +0.42, annotation: "Increases risk of locoregional and distant micrometastatic recurrence" },
        { factor: "Ki-67 Proliferation Rate 85%", impact: "adverse", weight: +0.25, annotation: "Correlates with high mitotic activity and rapid cell turnover" }
      ]
    }
  },
  {
    id: "UC-CCC-49120",
    mrn: "MRN-48190-L",
    deIdentifiedId: "DEID-UCANDO-491200",
    name: "Patient 49120 (Targeted Lung Cohort)",
    age: 64,
    gender: "Male",
    cancerType: "Non-Small Cell Lung Adenocarcinoma (NSCLC)",
    stage: "Stage IVB (cT2aN3M1c with Bone & Pleural Metastases)",
    ecogScore: 1,
    histology: "Papillary/Acinar Adenocarcinoma, TTF-1 Positive",
    biomarkers: [
      { name: "EGFR c.2573T>G (p.Leu858R)", value: "Exon 21 Activating Driver (VAF 44.1%)", status: "Pathogenic", targetable: true },
      { name: "EGFR c.2369C>T (p.Thr790M)", value: "Exon 20 Resistance Mutation (VAF 12.3%)", status: "Pathogenic", targetable: true },
      { name: "TP53 c.524G>A (p.Arg175His)", value: "Somatic Mutation (VAF 32.5%)", status: "Pathogenic", targetable: false },
      { name: "PD-L1 (22C3)", value: "TPS = 65% (High ≥ 50%)", status: "High", targetable: true },
      { name: "ALK / ROS1 / RET", value: "Fusions Negative by NGS & FISH", status: "Negative", targetable: false }
    ],
    tmb: "14.2 mut/Mb (High)",
    msiStatus: "MSS",
    pdl1Tps: "TPS 65%",
    currentRegimen: {
      name: "Osimertinib 80mg Daily Oral Therapy",
      line: "First-Line Targeted Tyrosine Kinase Inhibitor",
      startDate: "2023-06-15",
      cycle: "Month 8 of Continuous Daily Dosing",
      schedule: "80 mg PO Once Daily",
      intent: "First-Line Metastatic",
      drugs: [
        { name: "Osimertinib (Tagrisso)", dose: "80 mg", route: "Oral", frequency: "Daily", target: "EGFR Sensitizing & T790M Mutant Kinase" }
      ],
      toxicities: [
        { event: "Acneiform Rash", grade: 1, ctcaeCategory: "Dermatologic", management: "Controlled with topical clindamycin 1% and oral doxycycline" },
        { event: "Diarrhea", grade: 1, ctcaeCategory: "Gastrointestinal", management: "Managed with PRN loperamide; 1-2 episodes weekly" },
        { event: "Paronychia", grade: 1, ctcaeCategory: "Dermatologic", management: "Warm vinegar soaks and topical mupirocin" }
      ]
    },
    outcomesResponse: {
      recistResponse: "Partial Response (PR)",
      targetLesionChangePercent: -54.0,
      baselineSumDiameterMm: 74,
      currentSumDiameterMm: 34,
      durationOfResponseMonths: 7.8,
      pfsMonthsToDate: 8.5,
      biomarkerTracking: {
        name: "Plasma ctDNA EGFR L858R Variant Allele Fraction (VAF %)",
        unit: "% VAF",
        normalThreshold: 0.1,
        series: [
          { date: "2023-06-10", value: 18.4, event: "Pre-Treatment Baseline ctDNA" },
          { date: "2023-07-15", value: 4.2, event: "Month 1 Rapid Molecular Clearance" },
          { date: "2023-09-20", value: 1.1, event: "Month 3 PR Confirmed" },
          { date: "2023-12-10", value: 0.3, event: "Month 6 Deep Molecular Response" },
          { date: "2024-02-01", value: 0.25, event: "Month 8 Stable ctDNA Suppression" }
        ]
      },
      radiologicEvaluations: [
        { date: "2023-06-12", modality: "Diagnostic Chest/Abdomen CT & Brain MRI", findings: "46 mm right upper lobe mass, 28 mm subcarinal node, 3 osteolytic bone lesions", recistAssessment: "Baseline Target Sum: 74 mm", sumDiameterMm: 74 },
        { date: "2023-09-22", modality: "Restaging CT Thorax/Pelvis", findings: "Primary mass shrunk to 25 mm; subcarinal node to 14 mm; bone lesions sclerotic", recistAssessment: "Confirmed PR (-47.3%)", sumDiameterMm: 39 },
        { date: "2024-01-20", modality: "Restaging CT Thorax/Pelvis", findings: "Primary mass stable at 22 mm; subcarinal node 12 mm; no new intracranial or visceral lesions", recistAssessment: "Ongoing PR (-54.0%)", sumDiameterMm: 34 }
      ]
    },
    pastTreatments: [
      {
        line: "Diagnostic Biopsy & Molecular Staging",
        treatmentName: "CT-Guided Right Lung Transthoracic Biopsy",
        category: "Surgery",
        startDate: "2023-05-28",
        endDate: "2023-06-05",
        duration: "1 week",
        bestResponse: "Confirmed EGFR L858R+ Adenocarcinoma",
        discontinuationReason: "Staging Complete",
        keyToxicities: ["Grade 1 small pneumothorax, resolved conservatively"],
        details: "Pathology NGS detected EGFR L858R VAF 44.1% and co-occurring TP53 Arg175His."
      }
    ],
    futureExpectedTreatments: [
      {
        priorityRank: 1,
        regimenName: "Amivantamab + Lazertinib (MARIPOSA Regimen) upon Osimertinib Resistance",
        category: "EGFR-MET Bispecific + 3rd Gen TKI",
        nccnConcordance: "Category 1",
        rationale: "Phase 3 MARIPOSA study demonstrated superior PFS (23.7 mos vs 16.6 mos) with EGFR/MET bispecific amivantamab combined with lazertinib. Liquid biopsy ctDNA will be drawn at progression to distinguish MET amplification from C797S or SCLC transformation.",
        matchingBiomarkers: ["EGFR Activating Mutation", "Potential MET Amplification Bypass"],
        expectedResponseRate: "60% ORR Post-Osimertinib",
        medianPfsExpected: "12.8 mos",
        fdaStatus: "FDA Approved"
      },
      {
        priorityRank: 2,
        regimenName: "Datopotamab Deruxtecan (Dato-DXd Trop-2 ADC)",
        category: "Trop-2 Directed Antibody-Drug Conjugate",
        nccnConcordance: "Category 2A",
        rationale: "TROPION-Lung01 demonstrated meaningful PFS improvements in non-squamous EGFR-mutated NSCLC progressing after targeted TKI and platinum chemotherapy.",
        matchingBiomarkers: ["Trop-2 Positive NSCLC"],
        expectedResponseRate: "42% ORR",
        medianPfsExpected: "7.2 mos",
        fdaStatus: "Phase 3 Clinical Trial",
        associatedTrialId: "NCT04650191"
      },
      {
        priorityRank: 3,
        regimenName: "Platinum-Doublet Chemotherapy (Carboplatin + Pemetrexed) + Bevacizumab",
        category: "Systemic Chemotherapy + Anti-Angiogenic",
        nccnConcordance: "Category 1",
        rationale: "Standard second-line salvage chemotherapy maintaining systemic disease control when targeted pathway exhaustion occurs.",
        matchingBiomarkers: ["Non-Squamous Histology"],
        expectedResponseRate: "30% ORR",
        medianPfsExpected: "5.4 mos",
        fdaStatus: "FDA Approved"
      }
    ],
    survivalPredictions: {
      baselineRiskScore: 48,
      riskCategory: "Intermediate",
      modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2",
      estimatedOs: {
        oneYear: 88.0,
        threeYear: 61.5,
        fiveYear: 42.0,
        medianMonths: 44
      },
      estimatedPfs: {
        oneYear: 72.0,
        twoYear: 46.5,
        medianMonths: 22
      },
      modalitiesFused: [
        "EGFR L858R + TP53 Co-mutation Status",
        "ctDNA Rapid Clearance Trajectory (18.4% → 0.25%)",
        "Baseline Stage IVB with Bone/Pleural Spread",
        "Smoking History (Never Smoker, Favorable TKI Sensitivity)"
      ],
      counterfactualRegimens: [
        {
          regimen: "Old Standard 1st Gen TKI (Erlotinib / Gefitinib)",
          projectedMedianOsMonths: 26,
          projectedMedianPfsMonths: 10.2,
          fiveYearOsProb: 18.5,
          hazardRatioVsSoc: 1.0,
          pfsGainMonths: 0
        },
        {
          regimen: "Frontline Osimertinib Monotherapy (FLAURA Standard)",
          projectedMedianOsMonths: 44,
          projectedMedianPfsMonths: 18.9,
          fiveYearOsProb: 38.6,
          hazardRatioVsSoc: 0.61,
          pfsGainMonths: 8.7
        },
        {
          regimen: "Osimertinib + Platinum/Pemetrexed Combo (FLAURA2 Approach)",
          projectedMedianOsMonths: 52,
          projectedMedianPfsMonths: 25.5,
          fiveYearOsProb: 47.8,
          hazardRatioVsSoc: 0.49,
          pfsGainMonths: 15.3
        }
      ],
      riskFactors: [
        { factor: "Exon 21 L858R Sensitizing Mutation", impact: "protective", weight: -0.45, annotation: "Predicts sustained response to 3rd generation EGFR TKIs" },
        { factor: "Rapid ctDNA Molecular Clearance", impact: "protective", weight: -0.32, annotation: "Early molecular response correlates with prolonged progression-free survival" },
        { factor: "Co-occurring TP53 Arg175His Mutation", impact: "adverse", weight: +0.28, annotation: "Co-mutations in TP53 reduce durability of single-agent EGFR inhibition" },
        { factor: "Presence of Bone Metastases", impact: "adverse", weight: +0.22, annotation: "Associated with higher skeletal-related event risk and shorter median OS" }
      ]
    }
  },
  {
    id: "UC-CCC-77291",
    mrn: "MRN-77291-C",
    deIdentifiedId: "DEID-UCANDO-772910",
    name: "Patient 77291 (Colorectal Precision Cohort)",
    age: 58,
    gender: "Male",
    cancerType: "Colorectal Adenocarcinoma (CRC)",
    stage: "Stage IIIC (pT4aN2bM0)",
    ecogScore: 0,
    histology: "Moderately Differentiated Colon Adenocarcinoma",
    biomarkers: [
      { name: "KRAS c.35G>T (p.Gly12Cys)", value: "KRAS G12C Driver (VAF 36.8%)", status: "Pathogenic", targetable: true },
      { name: "APC c.3920dupA (p.Glu1309fs)", value: "Loss of Function (VAF 41.2%)", status: "Pathogenic", targetable: false },
      { name: "SMAD4 c.1097G>A (p.Arg361His)", value: "Pathogenic Missense (VAF 29.5%)", status: "Pathogenic", targetable: false },
      { name: "Mismatch Repair (MMR / MSI)", value: "MLH1+, MSH2+, MSH6+, PMS2+ (MSS / pMMR)", status: "Normal", targetable: false },
      { name: "BRAF V600E", value: "Wild-Type (Negative)", status: "Negative", targetable: false }
    ],
    tmb: "6.8 mut/Mb",
    msiStatus: "MSS (pMMR)",
    pdl1Tps: "TPS < 1%",
    currentRegimen: {
      name: "Adjuvant mFOLFOX6 (Oxaliplatin + Leucovorin + 5-Fluorouracil)",
      line: "Adjuvant Post-Surgical Chemotherapy",
      startDate: "2023-11-05",
      cycle: "Cycle 7 of 12 (Bi-weekly)",
      schedule: "Q2W Oxaliplatin 85 mg/m² + Leucovorin 400 mg/m² + 5-FU 2400 mg/m² 46hr Infusion",
      intent: "Adjuvant",
      drugs: [
        { name: "Oxaliplatin", dose: "85 mg/m²", route: "IV Infusion", frequency: "Q2W", target: "DNA Adduct Formation" },
        { name: "5-Fluorouracil", dose: "2400 mg/m²", route: "Continuous 46hr IV", frequency: "Q2W", target: "Thymidylate Synthase Inhibition" },
        { name: "Leucovorin", dose: "400 mg/m²", route: "IV Infusion", frequency: "Q2W", target: "5-FU Biochemical Modulation" }
      ],
      toxicities: [
        { event: "Cold-Induced Dysesthesia", grade: 2, ctcaeCategory: "Neurological", management: "Advised to avoid cold liquids; warm gloves; monitored for persistent paresthesia" },
        { event: "Nausea", grade: 1, ctcaeCategory: "Gastrointestinal", management: "Controlled with ondansetron 8mg + dexamethasone prior to infusion" }
      ]
    },
    outcomesResponse: {
      recistResponse: "Complete Response (CR)",
      targetLesionChangePercent: -100,
      baselineSumDiameterMm: 62,
      currentSumDiameterMm: 0,
      durationOfResponseMonths: 4.2,
      pfsMonthsToDate: 5.5,
      biomarkerTracking: {
        name: "Carcinoembryonic Antigen (CEA Serum ng/mL)",
        unit: "ng/mL",
        normalThreshold: 5.0,
        series: [
          { date: "2023-09-14", value: 48.2, event: "Pre-Operative Colonoscopy" },
          { date: "2023-10-10", value: 6.4, event: "Post-Hemicolectomy Week 2" },
          { date: "2023-11-05", value: 3.8, event: "Cycle 1 mFOLFOX6 Baseline" },
          { date: "2023-12-20", value: 2.1, event: "Cycle 4 mFOLFOX6 Assessment" },
          { date: "2024-02-05", value: 1.8, event: "Cycle 7 ctDNA Negative" }
        ]
      },
      radiologicEvaluations: [
        { date: "2023-09-18", modality: "Contrast Abdomen/Pelvis CT", findings: "62 mm circumferential cecal mass infiltrating visceral peritoneum; 7 regional pericolic lymph nodes", recistAssessment: "Baseline Surgical Specimen: 62 mm", sumDiameterMm: 62 },
        { date: "2023-10-02", modality: "Surgical Pathology Review", findings: "Right hemicolectomy: R0 resection, 24 lymph nodes harvested, 8 positive for metastasis (pN2b)", recistAssessment: "Complete Resection (R0)", sumDiameterMm: 0 },
        { date: "2024-01-15", modality: "Post-Op Restaging CT Chest/Abdomen/Pelvis", findings: "No evidence of local recurrence or distant hepatic/pulmonary metastatic disease", recistAssessment: "No Evidence of Disease (NED)", sumDiameterMm: 0 }
      ]
    },
    pastTreatments: [
      {
        line: "Surgical Resection",
        treatmentName: "Laparoscopic Right Hemicolectomy + Extended Lymphadenectomy",
        category: "Surgery",
        startDate: "2023-09-28",
        endDate: "2023-10-02",
        duration: "5 days in-hospital",
        bestResponse: "R0 Complete Resection",
        discontinuationReason: "Surgical Completion",
        keyToxicities: ["Grade 1 post-op ileus, resolved with conservative bowel rest"],
        details: "Tumor measured 6.2 cm with serosal penetration (pT4a) and 8/24 positive mesenteric lymph nodes (pN2b)."
      }
    ],
    futureExpectedTreatments: [
      {
        priorityRank: 1,
        regimenName: "Adagrasib + Cetuximab (KRYSTAL-1 Regimen) in Case of Distant Recurrence",
        category: "KRAS G12C Inhibitor + EGFR Monoclonal Antibody",
        nccnConcordance: "Category 1",
        rationale: "KRYSTAL-1 trial proved that blocking KRAS G12C with adagrasib combined with cetuximab overcomes EGFR feedback activation in KRAS G12C mutated colorectal cancer, achieving 46% response rate vs < 20% monotherapy.",
        matchingBiomarkers: ["KRAS G12C Pathogenic Mutation"],
        expectedResponseRate: "46% ORR",
        medianPfsExpected: "6.9 mos",
        fdaStatus: "FDA Approved"
      },
      {
        priorityRank: 2,
        regimenName: "FOLFIRI (Irinotecan) + Bevacizumab (Avastin)",
        category: "Second-Line Chemotherapy + Anti-VEGF",
        nccnConcordance: "Category 1",
        rationale: "Standard second-line backbone if recurrence occurs following oxaliplatin-based adjuvant therapy.",
        matchingBiomarkers: ["MSS Status", "Oxaliplatin Exposure"],
        expectedResponseRate: "25% ORR",
        medianPfsExpected: "6.0 mos",
        fdaStatus: "FDA Approved"
      }
    ],
    survivalPredictions: {
      baselineRiskScore: 52,
      riskCategory: "Intermediate",
      modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2",
      estimatedOs: {
        oneYear: 91.5,
        threeYear: 68.0,
        fiveYear: 58.2,
        medianMonths: 66
      },
      estimatedPfs: {
        oneYear: 78.4,
        twoYear: 62.0,
        medianMonths: 42
      },
      modalitiesFused: [
        "Surgical Pathology (pT4aN2b, 8/24 Positive Nodes)",
        "KRAS G12C Somatic Alteration",
        "Circulating CEA Kinetics (48.2 → 1.8 ng/mL)",
        "Signatera ctDNA Clearance Status"
      ],
      counterfactualRegimens: [
        {
          regimen: "Surgery Alone without Adjuvant Chemotherapy",
          projectedMedianOsMonths: 36,
          projectedMedianPfsMonths: 18,
          fiveYearOsProb: 38.0,
          hazardRatioVsSoc: 1.0,
          pfsGainMonths: 0
        },
        {
          regimen: "Adjuvant mFOLFOX6 x 6 Months (Current Standard)",
          projectedMedianOsMonths: 66,
          projectedMedianPfsMonths: 42,
          fiveYearOsProb: 58.2,
          hazardRatioVsSoc: 0.65,
          pfsGainMonths: 24
        },
        {
          regimen: "Adjuvant mFOLFOX6 + ctDNA-Guided Targeted Escalation",
          projectedMedianOsMonths: 76,
          projectedMedianPfsMonths: 54,
          fiveYearOsProb: 68.5,
          hazardRatioVsSoc: 0.51,
          pfsGainMonths: 36
        }
      ],
      riskFactors: [
        { factor: "High Nodal Burden (pN2b, 8 Positive Nodes)", impact: "adverse", weight: +0.48, annotation: "Stage IIIC nodal involvement is the primary driver of recurrence risk" },
        { factor: "KRAS G12C Mutation", impact: "adverse", weight: +0.22, annotation: "Confers intrinsic resistance to anti-EGFR monotherapy; eligible for dual KRAS/EGFR blockade" },
        { factor: "Complete R0 Surgical Resection with Adequate Nodes (24)", impact: "protective", weight: -0.35, annotation: "R0 margins and > 12 examined nodes correlate with optimal adjuvant efficacy" },
        { factor: "Rapid Post-Op CEA Normalization (< 2.5 ng/mL)", impact: "protective", weight: -0.28, annotation: "Strong predictor of disease-free interval" }
      ]
    }
  },
  {
    id: "UC-CCC-31890",
    mrn: "MRN-31890-O",
    deIdentifiedId: "DEID-UCANDO-318900",
    name: "Patient 31890 (Ovarian Multi-Omics Cohort)",
    age: 61,
    gender: "Female",
    cancerType: "High-Grade Serous Ovarian Carcinoma (HGSOC)",
    stage: "Stage IIIC (Peritoneal Carcinomatosis)",
    ecogScore: 1,
    histology: "High-Grade Serous Carcinoma, WT1 / PAX8 Positive, p53 Aberrant",
    biomarkers: [
      { name: "BRCA2 c.5946delT (p.Ser1982fs)", value: "Pathogenic Somatic Mutation (VAF 42.6%)", status: "Pathogenic", targetable: true },
      { name: "TP53 c.659A>G (p.Tyr220Cys)", value: "Pathogenic Clonal Driver (VAF 52.1%)", status: "Pathogenic", targetable: false },
      { name: "HRD Genomic Instability Score (GIS)", value: "Score = 58 (HRD Positive ≥ 42)", status: "Positive", targetable: true },
      { name: "Folate Receptor Alpha (FRα)", value: "PS2+ in 75% of Tumor Cells", status: "High", targetable: true }
    ],
    tmb: "7.2 mut/Mb",
    msiStatus: "MSS",
    pdl1Tps: "CPS 4",
    currentRegimen: {
      name: "Maintenance Olaparib + Bevacizumab",
      line: "First-Line Maintenance following Platinum Response",
      startDate: "2023-10-18",
      cycle: "Month 4 of 24 Planned Months",
      schedule: "Olaparib 300 mg BID PO + Bevacizumab 15 mg/kg Q3W IV",
      intent: "Maintenance",
      drugs: [
        { name: "Olaparib (Lynparza)", dose: "300 mg BID", route: "Oral", frequency: "Twice Daily", target: "PARP1 / PARP2 Trapping" },
        { name: "Bevacizumab (Avastin)", dose: "15 mg/kg", route: "IV Infusion", frequency: "Q3W", target: "VEGF-A Neutralization" }
      ],
      toxicities: [
        { event: "Anemia", grade: 2, ctcaeCategory: "Hematologic", management: "Hemoglobin stable at 9.4 g/dL; monitored bi-weekly, no transfusion needed" },
        { event: "Hypertension", grade: 1, ctcaeCategory: "Cardiovascular", management: "Controlled on amlodipine 5mg daily" }
      ]
    },
    outcomesResponse: {
      recistResponse: "Complete Response (CR)",
      targetLesionChangePercent: -100,
      baselineSumDiameterMm: 85,
      currentSumDiameterMm: 0,
      durationOfResponseMonths: 6.5,
      pfsMonthsToDate: 9.0,
      biomarkerTracking: {
        name: "CA-125 Serum Kinetic Tracking",
        unit: "U/mL",
        normalThreshold: 35.0,
        series: [
          { date: "2023-04-12", value: 410.0, event: "Primary Diagnosis / Ascites" },
          { date: "2023-06-20", value: 86.4, event: "Post-Interval Debulking" },
          { date: "2023-08-15", value: 24.1, event: "Post-Chemo Normalization" },
          { date: "2023-11-01", value: 12.8, event: "Maintenance Month 1" },
          { date: "2024-02-01", value: 10.4, event: "Maintenance Month 4" }
        ]
      },
      radiologicEvaluations: [
        { date: "2023-04-15", modality: "PET/CT Abdomen & Pelvis", findings: "85 mm bilateral ovarian masses with extensive peritoneal caking and ascites", recistAssessment: "Baseline Target: 85 mm", sumDiameterMm: 85 },
        { date: "2023-08-30", modality: "Restaging Contrast CT", findings: "Complete surgical resolution of gross peritoneal disease; no measurable lesions remaining", recistAssessment: "Complete Response (CR)", sumDiameterMm: 0 },
        { date: "2024-01-10", modality: "Surveillance CT Abdomen/Pelvis", findings: "No recurrent peritoneal nodules or lymphadenopathy; no ascites", recistAssessment: "Ongoing CR", sumDiameterMm: 0 }
      ]
    },
    pastTreatments: [
      {
        line: "Neoadjuvant Chemotherapy + Interval Debulking Surgery",
        treatmentName: "Carboplatin (AUC 6) + Paclitaxel (175 mg/m²) x 3 Cycles -> Optimal R0 Debulking -> Adjuvant x 3",
        category: "Systemic Chemotherapy",
        startDate: "2023-04-20",
        endDate: "2023-09-30",
        duration: "5 months",
        bestResponse: "Complete Clinical Response (CR)",
        discontinuationReason: "Planned Protocol Completion",
        keyToxicities: ["Grade 2 neutropenia", "Grade 2 alopecia"],
        details: "Optimal cytoreduction achieved with no gross residual disease (R0)."
      }
    ],
    futureExpectedTreatments: [
      {
        priorityRank: 1,
        regimenName: "Mirvetuximab Soravtansine-gynx (Elahere) for Platinum-Resistant Recurrence",
        category: "Folate Receptor Alpha (FRα) Targeted ADC",
        nccnConcordance: "Category 1",
        rationale: "Patient's tumor demonstrates high FRα expression (PS2+ in 75% of cells). The MIRASOL Phase 3 trial confirmed significant OS benefit (16.5 mos vs 12.8 mos, HR 0.67) and PFS superiority with mirvetuximab soravtansine over investigator choice chemotherapy in FRα-high recurrent ovarian cancer.",
        matchingBiomarkers: ["FRα High Expression (75%)"],
        expectedResponseRate: "42% ORR",
        medianPfsExpected: "5.6 - 7.2 mos",
        fdaStatus: "FDA Approved"
      }
    ],
    survivalPredictions: {
      baselineRiskScore: 36,
      riskCategory: "Favorable",
      modelName: "UC-DeepSurv Multi-Modal Cox GLM v4.2",
      estimatedOs: {
        oneYear: 95.0,
        threeYear: 78.5,
        fiveYear: 64.0,
        medianMonths: 68
      },
      estimatedPfs: {
        oneYear: 84.0,
        twoYear: 65.0,
        medianMonths: 48
      },
      modalitiesFused: [
        "BRCA2 Somatic Mutation + HRD Score 58",
        "R0 Cytoreduction (Zero Visible Residual Tumor)",
        "CA-125 Rapid Clearance Trajectory (410 → 10.4 U/mL)",
        "PAOLA-1 / SOLO-1 Predictive Biomarker Algorithms"
      ],
      counterfactualRegimens: [
        {
          regimen: "Chemotherapy Alone (Observation without PARP Maintenance)",
          projectedMedianOsMonths: 42,
          projectedMedianPfsMonths: 16.6,
          fiveYearOsProb: 44.0,
          hazardRatioVsSoc: 1.0,
          pfsGainMonths: 0
        },
        {
          regimen: "Olaparib Monotherapy Maintenance (SOLO-1 Approach)",
          projectedMedianOsMonths: 62,
          projectedMedianPfsMonths: 38.0,
          fiveYearOsProb: 59.5,
          hazardRatioVsSoc: 0.58,
          pfsGainMonths: 21.4
        },
        {
          regimen: "Olaparib + Bevacizumab Dual Maintenance (PAOLA-1 Precision Arm)",
          projectedMedianOsMonths: 72,
          projectedMedianPfsMonths: 48.0,
          fiveYearOsProb: 66.8,
          hazardRatioVsSoc: 0.42,
          pfsGainMonths: 31.4
        }
      ],
      riskFactors: [
        { factor: "BRCA2 Mutation + High HRD Genomic Instability (58)", impact: "protective", weight: -0.48, annotation: "Confers profound sensitivity to synthetic lethality via PARP inhibition" },
        { factor: "Optimal R0 Cytoreductive Surgery", impact: "protective", weight: -0.38, annotation: "Absence of macroscopic residual tumor is the strongest independent predictor of survival" },
        { factor: "Stage IIIC Peritoneal Dissemination", impact: "adverse", weight: +0.32, annotation: "Extensive baseline peritoneal involvement increases risk of late microscopic relapse" }
      ]
    }
  }
];
