export interface ThemePreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: 'lively-clear' | 'twilight-noir';
  colors: {
    primary: string;       // Primary accent (e.g. #0284c7, #d4af37)
    secondary: string;     // Lighter secondary tint
    accent: string;        // Deeper accent/hover tone
    background: string;    // Page background (can be lively clear or dark void)
    card: string;          // Card / surface base
    pale?: string;         // Pale highlight
    dark?: string;         // Dark accent shade
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  // ============================================================
  // LIVELY, CLEAR & COOL VIBES (Fresh, Bright, Luxurious Clarity)
  // ============================================================
  {
    id: 'cool-cloud-blue',
    name: 'Cool Cloud & Ice Blue',
    subtitle: 'Clear Glacier Chill',
    description: 'Crisp, lively frosted ice atmosphere with electric sapphire and cool cyan luminescence.',
    category: 'lively-clear',
    colors: {
      primary: '#0284c7',
      secondary: '#38bdf8',
      accent: '#0369a1',
      background: '#f0f8ff',
      card: '#ffffff',
      pale: '#e0f2fe',
      dark: '#075985',
    },
  },
  {
    id: 'mint-emerald-oasis',
    name: 'Mint & Emerald Oasis',
    subtitle: 'Fresh Botanical Breeze',
    description: 'Lively crystalline spring mint with fresh tropical jade and imperial botanical green accents.',
    category: 'lively-clear',
    colors: {
      primary: '#059669',
      secondary: '#34d399',
      accent: '#047857',
      background: '#f0fdf4',
      card: '#ffffff',
      pale: '#dcfce7',
      dark: '#065f46',
    },
  },
  {
    id: 'pearl-champagne-gold',
    name: 'Pure Pearl & Champagne',
    subtitle: 'Sunlit Ivory & Gold',
    description: 'Luminous French Riviera daylight aesthetic with radiant champagne gold on warm ivory alabaster.',
    category: 'lively-clear',
    colors: {
      primary: '#b48214',
      secondary: '#d4af37',
      accent: '#8a6208',
      background: '#faf8f5',
      card: '#ffffff',
      pale: '#fef3c7',
      dark: '#784d05',
    },
  },
  {
    id: 'aegean-sky-azure',
    name: 'Aegean Sky & Azure',
    subtitle: 'Cool Mediterranean Sea',
    description: 'Sunlit Greek island clarity with vibrant royal blue breezes on clean azure seafoam.',
    category: 'lively-clear',
    colors: {
      primary: '#2563eb',
      secondary: '#60a5fa',
      accent: '#1d4ed8',
      background: '#f4f9fd',
      card: '#ffffff',
      pale: '#dbeafe',
      dark: '#1e40af',
    },
  },
  {
    id: 'lavender-breeze-lilac',
    name: 'Lavender Breeze & Lilac',
    subtitle: 'Ethereal Violet Mist',
    description: 'Ultra-cool modern lilac clarity with rich amethyst and rare violet oud accents.',
    category: 'lively-clear',
    colors: {
      primary: '#8b5cf6',
      secondary: '#c084fc',
      accent: '#7c3aed',
      background: '#fbf8ff',
      card: '#ffffff',
      pale: '#f3e8ff',
      dark: '#6d28d9',
    },
  },
  {
    id: 'blush-peony-rose',
    name: 'Blush Peony & Silk Rose',
    subtitle: 'Chic French Floral',
    description: 'Lively Parisian rosewater glow with vibrant berry rouge and warm petal pink accents.',
    category: 'lively-clear',
    colors: {
      primary: '#e11d48',
      secondary: '#fb7185',
      accent: '#be123c',
      background: '#fff5f7',
      card: '#ffffff',
      pale: '#ffe4e6',
      dark: '#9f1239',
    },
  },
  {
    id: 'sunny-amber-dunes',
    name: 'Sunny Amber & Dunes',
    subtitle: 'Lively Sunlit Warmth',
    description: 'Golden hour sunshine inspired by Accra beaches and sun-drenched amber resin.',
    category: 'lively-clear',
    colors: {
      primary: '#d97706',
      secondary: '#fbbf24',
      accent: '#b45309',
      background: '#fffdf7',
      card: '#ffffff',
      pale: '#fef3c7',
      dark: '#92400e',
    },
  },
  {
    id: 'cool-slate-chrome',
    name: 'Cool Slate & Chrome',
    subtitle: 'Pristine Modern Studio',
    description: 'Architectural gallery minimal aesthetic with cool titanium slate on crisp ice white.',
    category: 'lively-clear',
    colors: {
      primary: '#475569',
      secondary: '#94a3b8',
      accent: '#1e293b',
      background: '#f8fafc',
      card: '#ffffff',
      pale: '#f1f5f9',
      dark: '#0f172a',
    },
  },

  // ============================================================
  // TWILIGHT NOIR (Velvet Night & Obsidian Moods)
  // ============================================================
  {
    id: 'royal-gold',
    name: 'Royal Gold Noir',
    subtitle: 'Signature Obsidian Gold',
    description: 'Timeless Ghanaian haute parfumerie aesthetic with radiant gold accents on obsidian black.',
    category: 'twilight-noir',
    colors: {
      primary: '#d4af37',
      secondary: '#f5e4ab',
      accent: '#b8902a',
      background: '#050508',
      card: '#0c0e18',
      pale: '#fdf8e8',
      dark: '#765217',
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold & Champagne Noir',
    subtitle: 'Romantic Champagne Noir',
    description: 'Delicate rose champagne glow with warm bronze undertones and velvety noir depths.',
    category: 'twilight-noir',
    colors: {
      primary: '#e0a899',
      secondary: '#fce7e1',
      accent: '#c48374',
      background: '#090507',
      card: '#140d12',
      pale: '#fff5f2',
      dark: '#8c4b3f',
    },
  },
  {
    id: 'emerald-royalty',
    name: 'Emerald Midnight',
    subtitle: 'Imperial African Jade Noir',
    description: 'Deep forest midnight illuminated with vibrant imperial emerald and gold.',
    category: 'twilight-noir',
    colors: {
      primary: '#10b981',
      secondary: '#6ee7b7',
      accent: '#059669',
      background: '#030906',
      card: '#071710',
      pale: '#d1fae5',
      dark: '#065f46',
    },
  },
  {
    id: 'sapphire-velvet',
    name: 'Sapphire Midnight',
    subtitle: 'Luminous Royal Cobalt',
    description: 'Deep oceanic twilight void illuminated with electric royal sapphire luminescence.',
    category: 'twilight-noir',
    colors: {
      primary: '#38bdf8',
      secondary: '#93c5fd',
      accent: '#2563eb',
      background: '#030712',
      card: '#091124',
      pale: '#e0f2fe',
      dark: '#1e40af',
    },
  },
  {
    id: 'amethyst-oud',
    name: 'Amethyst & Oud Noir',
    subtitle: 'Mystic Arabian Violet',
    description: 'Enchanting royal violet and rare oud incense tones from eastern luxury perfumery.',
    category: 'twilight-noir',
    colors: {
      primary: '#c084fc',
      secondary: '#e9d5ff',
      accent: '#9333ea',
      background: '#080410',
      card: '#130c22',
      pale: '#faf5ff',
      dark: '#7e22ce',
    },
  },
  {
    id: 'ruby-crimson',
    name: 'Ruby Crimson Noir',
    subtitle: 'Passionate Rouge Extrait',
    description: 'Bold, seductive ruby red accents with intense dark berry and smoked velvet undertones.',
    category: 'twilight-noir',
    colors: {
      primary: '#f43f5e',
      secondary: '#fda4af',
      accent: '#e11d48',
      background: '#0b0406',
      card: '#190b10',
      pale: '#ffe4e6',
      dark: '#9f1239',
    },
  },
];

export interface ThemeConfig {
  themePreset?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  cardColor?: string;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = (hex || '#d4af37').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const intVal = parseInt(clean, 16);
  if (isNaN(intVal) || clean.length !== 6) {
    return { r: 212, g: 175, b: 55 }; // Default gold fallback
  }
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
}

export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.48;
}

export function resolveTheme(config?: ThemeConfig | null): {
  presetId: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  pale: string;
  dark: string;
  isLight: boolean;
  rgb: { r: number; g: number; b: number };
} {
  const presetId = config?.themePreset || 'royal-gold';
  const matchedPreset = THEME_PRESETS.find((p) => p.id === presetId);

  const primary = config?.primaryColor || matchedPreset?.colors.primary || '#d4af37';
  const secondary = config?.secondaryColor || matchedPreset?.colors.secondary || '#f5e4ab';
  const accent = config?.accentColor || matchedPreset?.colors.accent || '#b8902a';
  const background = config?.backgroundColor || matchedPreset?.colors.background || '#050508';
  const card = config?.cardColor || matchedPreset?.colors.card || '#0c0e18';

  const rgb = hexToRgb(primary);
  const pale = matchedPreset?.colors.pale || secondary;
  const dark = matchedPreset?.colors.dark || accent;
  const isLight = isLightColor(background);

  return {
    presetId,
    primary,
    secondary,
    accent,
    background,
    card,
    pale,
    dark,
    isLight,
    rgb,
  };
}

export function generateThemeCSS(config?: ThemeConfig | null): string {
  const t = resolveTheme(config);
  const { r, g, b } = t.rgb;

  // Decide button text contrast based on primary accent brightness
  const primaryRgb = hexToRgb(t.primary);
  const primaryLuminance = (0.299 * primaryRgb.r + 0.587 * primaryRgb.g + 0.114 * primaryRgb.b) / 255;
  const btnTextColor = primaryLuminance > 0.65 ? '#07080b' : '#ffffff';

  if (t.isLight) {
    // ============================================================
    // CLEAR, LIVELY & COOL VIBES LIGHT MODE ENGINE
    // ============================================================
    return `
:root {
  /* Dynamic Core Palette (Lively & Clear) */
  --bg-void: ${t.background};
  --bg-dark: ${t.background};
  --bg-card: rgba(255, 255, 255, 0.92);
  --bg-elevated: #ffffff;
  
  --text-main: #0f172a;
  --text-sub: #334155;
  --text-dim: #64748b;
  
  /* Primary & Accent Spectrum */
  --gold-primary: ${t.primary};
  --gold-light: ${t.secondary};
  --gold-pale: ${t.pale};
  --gold-warm: ${t.secondary};
  --gold-deep: ${t.accent};
  --gold-dark: ${t.dark};

  /* Radiant Glows */
  --amber-glow-xs: rgba(${r}, ${g}, ${b}, 0.08);
  --amber-glow-sm: rgba(${r}, ${g}, ${b}, 0.18);
  --amber-glow-md: rgba(${r}, ${g}, ${b}, 0.30);
  --amber-glow-lg: rgba(${r}, ${g}, ${b}, 0.50);
}

/* Site Background & Body (Clear & Lively) */
body {
  background-color: ${t.background} !important;
  color: #0f172a !important;
  background-image:
    radial-gradient(ellipse 90% 60% at 50% -15%, rgba(${r}, ${g}, ${b}, 0.14) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 100% 100%, rgba(${r}, ${g}, ${b}, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 0% 60%, rgba(${r}, ${g}, ${b}, 0.05) 0%, transparent 60%) !important;
}

/* Header & Announcement on Clear Background */
header {
  background-color: rgba(255, 255, 255, 0.90) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
}

header > div:first-child {
  background: linear-gradient(90deg, ${t.background} 0%, rgba(${r}, ${g}, ${b}, 0.14) 50%, ${t.background} 100%) !important;
  color: ${t.accent} !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
}

/* Typography on Clear Background */
.text-white,
.text-\\[\\#eef1f8\\],
.text-\\[\\#f8fafc\\] {
  color: #0f172a !important;
}

.text-\\[\\#cbd5e1\\],
.text-\\[\\#94a3b8\\] {
  color: #334155 !important;
}

.text-\\[\\#64748b\\] {
  color: #64748b !important;
}

/* Gradients on Clear Background */
.gold-gradient-text {
  background: linear-gradient(135deg, ${t.accent} 0%, ${t.primary} 50%, ${t.dark} 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.gold-gradient-subtle {
  background: linear-gradient(135deg, ${t.accent} 0%, ${t.primary} 60%, ${t.dark} 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.gold-gradient-warm {
  background: linear-gradient(135deg, ${t.dark} 0%, ${t.primary} 60%, ${t.accent} 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

/* Dynamic Buttons */
.btn-gold-luxury {
  background: linear-gradient(135deg, ${t.secondary} 0%, ${t.primary} 45%, ${t.accent} 100%) !important;
  color: ${btnTextColor} !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 20px rgba(${r}, ${g}, ${b}, 0.32), 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.btn-gold-luxury:hover {
  background: linear-gradient(135deg, ${t.pale} 0%, ${t.primary} 45%, ${t.dark} 100%) !important;
  box-shadow: 0 8px 28px rgba(${r}, ${g}, ${b}, 0.45) !important;
}

.btn-outline-luxury {
  border-color: ${t.primary} !important;
  color: ${t.accent} !important;
  background: rgba(255, 255, 255, 0.90) !important;
}

.btn-outline-luxury:hover {
  background: rgba(${r}, ${g}, ${b}, 0.12) !important;
  border-color: ${t.dark} !important;
}

/* Frosted Glass Cards on Clear Background */
.glass-luxury,
.glass-luxury-dark,
.glass-luxury-card,
.bg-\\[\\#0c0e18\\],
.bg-\\[\\#050508\\],
.bg-\\[\\#080a10\\],
.bg-\\[\\#10121e\\] {
  background: rgba(255, 255, 255, 0.90) !important;
  border-color: rgba(${r}, ${g}, ${b}, 0.18) !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03) !important;
  color: #0f172a !important;
}

.glass-luxury-card:hover {
  background: #ffffff !important;
  border-color: rgba(${r}, ${g}, ${b}, 0.45) !important;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.10), 0 0 25px rgba(${r}, ${g}, ${b}, 0.14) !important;
}

.glass-luxury-card::before {
  background: linear-gradient(90deg, transparent 0%, rgba(${r}, ${g}, ${b}, 0.35) 50%, transparent 100%) !important;
}

/* Inputs on Clear Background */
input,
select,
textarea,
.input-luxury {
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.14) !important;
}

input::placeholder,
textarea::placeholder {
  color: #94a3b8 !important;
}

/* Mobile Bottom Navigation Bar on Clear Background */
div.sm\\:hidden.fixed.bottom-0 {
  background: rgba(255, 255, 255, 0.95) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05) !important;
}

/* Footer on Clear Background */
footer {
  background: linear-gradient(180deg, ${t.background} 0%, rgba(${r}, ${g}, ${b}, 0.06) 100%) !important;
  border-top: 1px solid rgba(${r}, ${g}, ${b}, 0.20) !important;
  color: #334155 !important;
}
footer .text-white {
  color: #0f172a !important;
}

/* Badges on Clear Background */
.badge-gold {
  background: rgba(${r}, ${g}, ${b}, 0.12) !important;
  border-color: rgba(${r}, ${g}, ${b}, 0.35) !important;
  color: ${t.accent} !important;
}

/* Dividers on Clear Background */
.gold-divider {
  background: linear-gradient(90deg, transparent 0%, rgba(${r}, ${g}, ${b}, 0.45) 50%, transparent 100%) !important;
}

.section-label,
.text-gold {
  color: ${t.primary} !important;
}

.text-gold-light {
  color: ${t.accent} !important;
}

.text-gold-pale {
  color: ${t.dark} !important;
}

.border-gold {
  border-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
}

.bg-gold-glow {
  background: rgba(${r}, ${g}, ${b}, 0.12) !important;
}

::selection {
  background-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
  color: #0f172a !important;
}

::-webkit-scrollbar-thumb {
  background: rgba(${r}, ${g}, ${b}, 0.30) !important;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(${r}, ${g}, ${b}, 0.60) !important;
}

/* Utility mappings */
.text-\\[\\#d4af37\\],
.text-\\[\\#e8c97a\\] {
  color: ${t.primary} !important;
}

.text-\\[\\#f5e4ab\\] {
  color: ${t.accent} !important;
}

.bg-\\[\\#d4af37\\] {
  background-color: ${t.primary} !important;
}

.border-\\[\\#d4af37\\] {
  border-color: ${t.primary} !important;
}

.border-\\[\\#d4af37\\]\\/10,
.border-\\[\\#d4af37\\]\\/20,
.border-\\[\\#d4af37\\]\\/30,
.border-\\[\\#d4af37\\]\\/40 {
  border-color: rgba(${r}, ${g}, ${b}, 0.22) !important;
}

.bg-\\[\\#d4af37\\]\\/10 {
  background-color: rgba(${r}, ${g}, ${b}, 0.10) !important;
}

.bg-\\[\\#d4af37\\]\\/20 {
  background-color: rgba(${r}, ${g}, ${b}, 0.18) !important;
}
`.trim();
  }

  // ============================================================
  // TWILIGHT & VELVET NOIR ENGINE (Dark Mode)
  // ============================================================
  return `
:root {
  /* Dynamic Core Palette (Dark / Obsidian) */
  --bg-void: ${t.background};
  --bg-dark: ${t.background};
  --bg-card: ${t.card};
  --bg-elevated: ${t.card};
  
  /* Primary & Accent Spectrum */
  --gold-primary: ${t.primary};
  --gold-light: ${t.secondary};
  --gold-pale: ${t.pale};
  --gold-warm: ${t.secondary};
  --gold-deep: ${t.accent};
  --gold-dark: ${t.dark};

  /* Radiant Glows */
  --amber-glow-xs: rgba(${r}, ${g}, ${b}, 0.06);
  --amber-glow-sm: rgba(${r}, ${g}, ${b}, 0.14);
  --amber-glow-md: rgba(${r}, ${g}, ${b}, 0.25);
  --amber-glow-lg: rgba(${r}, ${g}, ${b}, 0.45);
}

/* Site Background & Body (Obsidian Dark) */
body {
  background-color: ${t.background} !important;
  color: #eef1f8 !important;
  background-image:
    radial-gradient(ellipse 90% 60% at 50% -15%, rgba(${r}, ${g}, ${b}, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 100% 100%, rgba(${r}, ${g}, ${b}, 0.05) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 0% 60%, rgba(${r}, ${g}, ${b}, 0.04) 0%, transparent 60%) !important;
}

/* Dynamic Gradients */
.gold-gradient-text {
  background: linear-gradient(130deg, ${t.pale} 0%, ${t.secondary} 25%, ${t.primary} 55%, ${t.accent} 85%, ${t.primary} 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.gold-gradient-subtle {
  background: linear-gradient(130deg, #ffffff 0%, ${t.secondary} 40%, ${t.primary} 70%, ${t.accent} 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.gold-gradient-warm {
  background: linear-gradient(135deg, ${t.pale} 0%, ${t.secondary} 50%, ${t.primary} 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

/* Dynamic Buttons */
.btn-gold-luxury {
  background: linear-gradient(135deg, ${t.secondary} 0%, ${t.primary} 40%, ${t.accent} 70%, ${t.dark} 100%) !important;
  color: ${btnTextColor} !important;
  box-shadow: 0 4px 20px rgba(${r}, ${g}, ${b}, 0.35), 0 1px 3px rgba(0, 0, 0, 0.5) !important;
}

.btn-gold-luxury:hover {
  background: linear-gradient(135deg, ${t.pale} 0%, ${t.secondary} 40%, ${t.accent} 70%, ${t.primary} 100%) !important;
  box-shadow: 0 8px 32px rgba(${r}, ${g}, ${b}, 0.55), 0 2px 8px rgba(0, 0, 0, 0.4) !important;
}

.btn-outline-luxury {
  border-color: rgba(${r}, ${g}, ${b}, 0.40) !important;
  color: ${t.secondary} !important;
}

.btn-outline-luxury:hover {
  background: rgba(${r}, ${g}, ${b}, 0.10) !important;
  border-color: rgba(${r}, ${g}, ${b}, 0.75) !important;
  box-shadow: 0 0 20px rgba(${r}, ${g}, ${b}, 0.20) !important;
}

/* Glass Luxury Cards & Dividers */
.glass-luxury {
  border-color: rgba(${r}, ${g}, ${b}, 0.18) !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(${r}, ${g}, ${b}, 0.15) !important;
}

.glass-luxury-card {
  border-color: rgba(${r}, ${g}, ${b}, 0.12) !important;
}

.glass-luxury-card:hover {
  border-color: rgba(${r}, ${g}, ${b}, 0.40) !important;
  box-shadow: 0 20px 50px -8px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(${r}, ${g}, ${b}, 0.20) !important;
}

.glass-luxury-card::before {
  background: linear-gradient(90deg, transparent 0%, rgba(${r}, ${g}, ${b}, 0.45) 50%, transparent 100%) !important;
}

.gold-divider {
  background: linear-gradient(90deg, transparent 0%, rgba(${r}, ${g}, ${b}, 0.65) 50%, transparent 100%) !important;
}

.badge-gold {
  background: linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.16) 0%, rgba(${r}, ${g}, ${b}, 0.05) 100%) !important;
  border-color: rgba(${r}, ${g}, ${b}, 0.40) !important;
  color: ${t.secondary} !important;
}

.section-label,
.text-gold {
  color: ${t.primary} !important;
}

.text-gold-light {
  color: ${t.secondary} !important;
}

.text-gold-pale {
  color: ${t.pale} !important;
}

.border-gold {
  border-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
}

.bg-gold-glow {
  background: rgba(${r}, ${g}, ${b}, 0.10) !important;
}

::selection {
  background-color: rgba(${r}, ${g}, ${b}, 0.35) !important;
  color: #fff !important;
}

::-webkit-scrollbar-thumb {
  background: rgba(${r}, ${g}, ${b}, 0.35) !important;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(${r}, ${g}, ${b}, 0.65) !important;
}

/* Comprehensive utility mappings */
.text-\\[\\#d4af37\\],
.text-\\[\\#e8c97a\\] {
  color: ${t.primary} !important;
}

.text-\\[\\#f5e4ab\\] {
  color: ${t.secondary} !important;
}

.bg-\\[\\#d4af37\\] {
  background-color: ${t.primary} !important;
}

.border-\\[\\#d4af37\\] {
  border-color: ${t.primary} !important;
}

.border-\\[\\#d4af37\\]\\/10,
.border-\\[\\#d4af37\\]\\/20,
.border-\\[\\#d4af37\\]\\/30,
.border-\\[\\#d4af37\\]\\/40 {
  border-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
}

.bg-\\[\\#d4af37\\]\\/10 {
  background-color: rgba(${r}, ${g}, ${b}, 0.10) !important;
}

.bg-\\[\\#d4af37\\]\\/20 {
  background-color: rgba(${r}, ${g}, ${b}, 0.20) !important;
}

.shadow-\\[\\#d4af37\\]\\/10,
.shadow-\\[\\#d4af37\\]\\/20,
.shadow-\\[\\#d4af37\\]\\/30 {
  box-shadow: 0 4px 20px rgba(${r}, ${g}, ${b}, 0.25) !important;
}
`.trim();
}

export interface SimpleColorOption {
  id: string;
  name: string;
  color: string;
  cardColor?: string;
  secondary?: string;
  accent?: string;
  description: string;
}

export const SIMPLE_BACKGROUNDS: SimpleColorOption[] = [
  // Lively & Clear Cool Tones
  { id: 'ice', name: 'Cool Glacier Ice', color: '#f0f8ff', cardColor: '#ffffff', description: 'Fresh, clear & lively cool blue' },
  { id: 'mint', name: 'Fresh Spring Mint', color: '#f0fdf4', cardColor: '#ffffff', description: 'Crisp lively botanical green' },
  { id: 'ivory', name: 'Warm Pearl Ivory', color: '#faf8f5', cardColor: '#ffffff', description: 'Sunlit French luxury alabaster' },
  { id: 'sky', name: 'Clear Sky Blue', color: '#f4f9fd', cardColor: '#ffffff', description: 'Bright sunny Aegean seafoam' },
  { id: 'aqua', name: 'Aqua Lagoon Breeze', color: '#ecfeff', cardColor: '#ffffff', description: 'Cool tropical crystalline water' },
  { id: 'fjord', name: 'Polar Fjord Blue', color: '#e0f2fe', cardColor: '#ffffff', description: 'Cool refreshing deep glacier' },
  { id: 'sage', name: 'Herbal Sage Silk', color: '#f2f7f4', cardColor: '#ffffff', description: 'Calming natural botanical sage' },
  { id: 'honeydew', name: 'Fresh Honeydew', color: '#f7fee7', cardColor: '#ffffff', description: 'Lively crisp citrus green' },
  { id: 'lavender', name: 'Soft Lilac Mist', color: '#fbf8ff', cardColor: '#ffffff', description: 'Modern chic ethereal violet' },
  { id: 'wisteria', name: 'Frosted Wisteria', color: '#f5f3ff', cardColor: '#ffffff', description: 'Dreamy cool lavender petal' },
  { id: 'blush', name: 'Chic Blush Rose', color: '#fff5f7', cardColor: '#ffffff', description: 'Sweet romantic French rosewater' },
  { id: 'himalayan', name: 'Himalayan Rose Salt', color: '#fdf2f4', cardColor: '#ffffff', description: 'Delicate soft mineral rose' },
  { id: 'orchid', name: 'Cotton Candy Orchid', color: '#fdf4ff', cardColor: '#ffffff', description: 'Playful chic pastel lilac' },
  { id: 'peach', name: 'Sunset Peach Silk', color: '#fff7ed', cardColor: '#ffffff', description: 'Gentle warm sunset peach' },
  { id: 'sand', name: 'Golden Cream', color: '#fffdf7', cardColor: '#ffffff', description: 'Warm sunbeam beach dunes' },
  { id: 'champagne', name: 'Pale Champagne Sparkle', color: '#fefce8', cardColor: '#ffffff', description: 'Sparkling celebratory champagne' },
  { id: 'vanilla', name: 'French Vanilla Cream', color: '#fffbeb', cardColor: '#ffffff', description: 'Rich soft Parisian patisserie' },
  { id: 'linen', name: 'Natural Luxury Linen', color: '#f5f5f0', cardColor: '#ffffff', description: 'Organic breezy textured ecru' },
  { id: 'dove-grey', name: 'Cool Dove Grey', color: '#f1f5f9', cardColor: '#ffffff', description: 'Architectural cool mist grey' },
  { id: 'white', name: 'Pure Clean White', color: '#ffffff', cardColor: '#ffffff', description: 'Crisp minimalist modern gallery' },
  // Twilight & Velvet Dark Tones
  { id: 'emerald-dark', name: 'Deep Forest Canopy', color: '#04150d', cardColor: '#092316', description: 'Mystic twilight tropical jade' },
  { id: 'navy-dark', name: 'Royal Fjord Navy', color: '#060c1c', cardColor: '#0d172e', description: 'Deep majestic midnight ocean' },
  { id: 'plum-dark', name: 'Velvet Dark Plum', color: '#14070e', cardColor: '#24101b', description: 'Rich seductive cherry velvet' },
  { id: 'titanium-dark', name: 'Titanium Charcoal', color: '#0e1117', cardColor: '#181c26', description: 'Ultra-modern sleek dark studio' },
  { id: 'night', name: 'Velvet Midnight Black', color: '#050508', cardColor: '#0c0e18', description: 'Classic moody obsidian void' },
];

export const SIMPLE_ACCENTS: SimpleColorOption[] = [
  // Blues & Aquas
  { id: 'blue', name: 'Electric Sapphire', color: '#0284c7', secondary: '#38bdf8', accent: '#0369a1', description: 'Cool vibrant blue' },
  { id: 'azure', name: 'Ocean Azure', color: '#2563eb', secondary: '#60a5fa', accent: '#1d4ed8', description: 'Deep royal blue' },
  { id: 'cyan', name: 'Electric Cyan', color: '#0ea5e9', secondary: '#7dd3fc', accent: '#0284c7', description: 'Ultra-cool bright neon water' },
  { id: 'turquoise', name: 'Tropical Turquoise', color: '#06b6d4', secondary: '#67e8f9', accent: '#0891b2', description: 'Vibrant Caribbean sea teal' },
  { id: 'mint-seafoam', name: 'Ocean Seafoam', color: '#14b8a6', secondary: '#5eead4', accent: '#0f766e', description: 'Cool soothing lagoon mint' },
  { id: 'indigo', name: 'Royal Indigo', color: '#4f46e5', secondary: '#818cf8', accent: '#4338ca', description: 'Majestic evening cobalt' },
  { id: 'midnight-navy', name: 'Deep Midnight Navy', color: '#1e3a8a', secondary: '#3b82f6', accent: '#172554', description: 'Classic authoritative navy' },
  // Greens
  { id: 'green', name: 'Imperial Emerald', color: '#059669', secondary: '#34d399', accent: '#047857', description: 'Fresh royal jade' },
  { id: 'forest-jade', name: 'Deep Forest Jade', color: '#047857', secondary: '#10b981', accent: '#065f46', description: 'Prestige dark African emerald' },
  { id: 'lime', name: 'Lime Zest', color: '#65a30d', secondary: '#a3e635', accent: '#4d7c0f', description: 'Lively fresh modern lime' },
  // Golds & Ambers
  { id: 'gold', name: 'Luxury Champagne Gold', color: '#b48214', secondary: '#d4af37', accent: '#8a6208', description: 'Rich French haute gold' },
  { id: 'gold-noir', name: 'Signature Pure Gold', color: '#d4af37', secondary: '#f5e4ab', accent: '#b8902a', description: 'Classic regal gold' },
  { id: 'amber', name: 'Sunlit Amber', color: '#d97706', secondary: '#fbbf24', accent: '#b45309', description: 'Warm glowing honey' },
  { id: 'sun-yellow', name: 'Sunbeam Ochre', color: '#eab308', secondary: '#fde047', accent: '#ca8a04', description: 'Radiant sunny gold yellow' },
  { id: 'copper-rose', name: 'Rose Gold Copper', color: '#be7968', secondary: '#e2a698', accent: '#9e5949', description: 'Warm metallic champagne copper' },
  { id: 'terracotta', name: 'Warm Terracotta', color: '#c2410c', secondary: '#fb923c', accent: '#9a3412', description: 'Earthy artisan burnt sienna' },
  { id: 'truffle', name: 'Dark Oud Truffle', color: '#78350f', secondary: '#b45309', accent: '#451a03', description: 'Rich Arabian oud bronze' },
  // Pinks, Reds & Purples
  { id: 'coral', name: 'Neon Coral', color: '#f97316', secondary: '#fdba74', accent: '#ea580c', description: 'Energizing bright tropical coral' },
  { id: 'rose', name: 'Berry Rouge', color: '#e11d48', secondary: '#fb7185', accent: '#be123c', description: 'Passionate French rouge' },
  { id: 'ruby', name: 'Crimson Ruby', color: '#dc2626', secondary: '#f87171', accent: '#b91c1c', description: 'Dramatic radiant red' },
  { id: 'bordeaux', name: 'Bordeaux Wine', color: '#9f1239', secondary: '#e11d48', accent: '#881337', description: 'Opulent French velvet wine' },
  { id: 'hot-pink', name: 'Paris Hot Pink', color: '#ec4899', secondary: '#f472b6', accent: '#db2777', description: 'Bold chic runway pink' },
  { id: 'magenta', name: 'Electric Magenta', color: '#c026d3', secondary: '#e879f9', accent: '#a21caf', description: 'Seductive violet orchid' },
  { id: 'purple', name: 'Royal Amethyst', color: '#8b5cf6', secondary: '#c084fc', accent: '#7c3aed', description: 'Mystic Arabian violet' },
  // Sleek Metallics
  { id: 'slate', name: 'Titanium Slate', color: '#475569', secondary: '#94a3b8', accent: '#1e293b', description: 'Modern polished chrome' },
];
