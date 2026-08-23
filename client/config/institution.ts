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
  logoPath: "https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Ffc7eb0036adc46ad99a19a10591f08da?format=webp&width=800&height=1200",
  legalEntity: "The University of Chicago Medical Center",
  supportEmail: "datacommons-support@bsd.uchicago.edu",
  copyrightYear: "2026",
  tagline: "Enterprise Clinical Oncology and Research Integration Hub",
  governanceBody: "UC-CCC Data Governance & Institutional Review Board (IRB)"
};
