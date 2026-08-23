/**
 * Academic Maroon & Teal Design System Tokens
 * Publication-Grade Scientific RNA-seq Analytics Standard
 */

export const THEME_COLORS = {
  brand: {
    maroon: "#7D1B2D",
    maroonDark: "#5C1220",
    maroonLight: "#F8EAEC",
    maroonBg: "#FAF2F4",
    teal: "#157F8F",
    tealDark: "#0E5E6B",
    tealLight: "#E6F5F7",
    tealBg: "#F0FAF B",
    accent: "#157F8F"
  },
  semantic: {
    success: "#0D8269",
    successBg: "#ECFDF5",
    warning: "#B45309",
    warningBg: "#FFFBEB",
    danger: "#B91C1C",
    dangerBg: "#FEF2F2",
    info: "#157F8F",
    infoBg: "#F0F9FF"
  },
  light: {
    background: "#FAF9F6",
    surface: "#F4F2EC",
    surfaceElevated: "#FFFFFF",
    border: "#E2DED6",
    textPrimary: "#292524",
    textSecondary: "#6B655F",
    textDisabled: "#A8A29E"
  },
  dark: {
    background: "#1C1917",
    surface: "#24201E",
    surfaceElevated: "#2D2926",
    border: "#44403C",
    textPrimary: "#F5F5F4",
    textSecondary: "#A8A29E",
    textDisabled: "#78716C"
  }
} as const;

/**
 * RNA-seq Scientific Visualization Palettes
 */
export const CHART_PALETTES = {
  // Categorical palette (colorblind-safe, academic hierarchy)
  categorical: [
    "#7D1B2D", // Deep Academic Maroon
    "#157F8F", // Analytical Teal
    "#D97706", // Warm Ochre / Amber
    "#475569", // Slate / Steel
    "#059669", // Emerald / Sage
    "#7C3AED", // Plum / Deep Violet
    "#EA580C", // Rust / Coral
    "#2563EB"  // Cobalt
  ],

  // Volcano plot specific highlights
  volcano: {
    upregulated: "#7D1B2D",   // Deep Maroon for significant overexpressed
    downregulated: "#157F8F", // Analytical Teal for significant repressed
    nonsignificant: "#A8A29E" // Muted warm grey for non-significant
  },

  // Sequential expression palette (low to high expression)
  sequential: [
    "#F5F5F4",
    "#E7E5E4",
    "#D6D3D1",
    "#A8A29E",
    "#78716C",
    "#A83246",
    "#7D1B2D",
    "#4E0F1A"
  ],

  // Balanced diverging heatmap scale (Teal -> Neutral -> Maroon)
  diverging: [
    "#0E5E6B", // Strong down-regulation (z <= -2.5)
    "#157F8F", // Down-regulation (z ~ -1.5)
    "#6BB5C2", // Mild down-regulation (z ~ -0.75)
    "#C8E6EB", // Slight down-regulation (z ~ -0.25)
    "#FAF9F6", // Neutral / baseline expression (z = 0)
    "#F6D5DC", // Slight up-regulation (z ~ +0.25)
    "#D97388", // Mild up-regulation (z ~ +0.75)
    "#A83246", // Up-regulation (z ~ +1.5)
    "#7D1B2D"  // Strong up-regulation (z >= +2.5)
  ]
} as const;
