// Aligned with the canonical design brief: docs/design.md (The Pet Lobby).
// Purple is the brand/action colour; surfaces stay white/light.
export const colors = {
  background: "#FAFAFC", // neutral.50
  surface: "#FFFFFF", // white
  surfaceMuted: "#F4F4F8", // neutral.100
  text: "#111122", // neutral.950
  muted: "#5C5C70", // neutral.600
  border: "#E8E8EF", // neutral.200
  accent: "#6F32F0", // brand.purple.500
  accentPressed: "#4B16A8", // brand.purple.700
  accentSoft: "#EFE8FF", // brand.purple.100
  accentDark: "#3B0D78", // brand.purple.900 (hero gradients)
  danger: "#D92D20", // danger
  dangerSurface: "#FEE4E2",
  successText: "#1FA66A", // success
  successSurface: "#E3F6EC", // pale green tint used for confirmation pills/icons
  warningSurface: "#FFF8DB",
  warningBorder: "#F0D26A",
  star: "#F6B93B", // rating stars
  onAccent: "#FFFFFF", // text/icon over purple surfaces
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
};

// Radius scale from design.md §3.
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  caption: 12,
  small: 14,
  body: 16,
  section: 20,
  display: 28,
};

// Reusable elevation presets (iOS shadow + Android elevation).
export const shadow = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  },
} as const;
