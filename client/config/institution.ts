export interface InstitutionConfig {
  name: string;
  shortName: string;
  platformName: string;
  fullName: string;
  primaryColorOklch: string;
  accentColorOklch: string;
  logoPath: string;
  legalEntity: string;
  supportEmail: string;
  copyrightYear: string;
  tagline: string;
  governanceBody: string;
}

export const institutionConfig: InstitutionConfig = {
  name: "University of Chicago Comprehensive Cancer Center",
  shortName: "UC-CCC",
  platformName: "UCANDO",
  fullName: "The University of Chicago Comprehensive Cancer Center Data Commons Operations",
  primaryColorOklch: "oklch(0.38 0.14 20)", // Deep Academic Maroon
  accentColorOklch: "oklch(0.50 0.08 200)", // Analytical Teal
  logoPath: "/platform-logo.svg",
  legalEntity: "The University of Chicago Medical Center",
  supportEmail: "datacommons-support@bsd.uchicago.edu",
  copyrightYear: "2026",
  tagline: "Enterprise Clinical Oncology and Research Integration Hub",
  governanceBody: "UC-CCC Data Governance & Institutional Review Board (IRB)"
};
