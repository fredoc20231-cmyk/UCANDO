/**
 * Shared Theme Tokens & Data Visualization Palettes
 * Exact visual standard for the UCANDO platform.
 */

export const THEME_COLORS = {
  brand: {
    primary: "#636EFA",
    primaryDark: "#4C59E6",
    primaryLight: "#E8EAFF",
    primaryBg: "#EEF1FF",
    secondary: "#AB63FA",
    accent: "#00CC96"
  },
  semantic: {
    success: "#00CC96",
    successBg: "#ECFDF5",
    warning: "#FFA15A",
    warningBg: "#FFF7ED",
    danger: "#EF553B",
    dangerBg: "#FEF2F2",
    info: "#19D3F3",
    infoBg: "#ECFEFF"
  },
  light: {
    background: "#FFFFFF",
    surface: "#F9FAFB",
    surfaceElevated: "#FFFFFF",
    border: "#E5E7EB",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textDisabled: "#9CA3AF"
  },
  dark: {
    background: "#0B1220",
    surface: "#111827",
    surfaceElevated: "#1F2937",
    border: "#374151",
    textPrimary: "#F9FAFB",
    textSecondary: "#D1D5DB",
    textDisabled: "#6B7280"
  }
} as const;

/**
 * Data Visualization Palettes (Exact Order)
 */
export const CHART_PALETTES = {
  // Categorical palette (must be used in this exact order)
  categorical: [
    "#636EFA",
    "#EF553B",
    "#00CC96",
    "#FFA15A",
    "#AB63FA",
    "#19D3F3",
    "#B6E880",
    "#FF97FF"
  ],
  // Sequential palette (low to high magnitude/intensity)
  sequential: [
    "#FFF7EC",
    "#FEE8C8",
    "#FDD49E",
    "#FDBB84",
    "#FC8D59",
    "#EF6548",
    "#D7301F",
    "#990000"
  ],
  // Diverging palette (negative to positive signed values)
  diverging: [
    "#2166AC",
    "#4393C3",
    "#92C5DE",
    "#D1E5F0",
    "#F7F7F7",
    "#FDDBC7",
    "#F4A582",
    "#D6604D",
    "#B2182B"
  ]
} as const;
