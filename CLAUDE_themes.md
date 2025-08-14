# CLAUDE_themes.md - Theme System Documentation

## 🎨 Theme System Architecture

### Overview
The Dudoxx Convex Frontend implements a sophisticated dual-theme system with **Ocean** and **Royal** palettes, each supporting both light and dark modes. Built on Tailwind CSS v4 with CSS custom properties for maximum flexibility.

### Theme Philosophy
```
Design Principles:
├── Accessibility First    # WCAG 2.1 compliant color contrasts
├── Brand Consistency     # Coherent visual identity
├── User Preference       # Respects system/user theme choice
└── Developer Experience  # Easy to customize and extend
```

## 🌊 Ocean Theme (Default)

### Color Palette
```css
/* Ocean Light Mode */
--ocean-primary: #1e3a8a;      /* Prussian Blue - Strong, professional */
--ocean-secondary: #93c5fd;    /* Light Blue - Soft, approachable */
--ocean-accent: #1d4ed8;       /* Medium Blue - Interactive elements */
--ocean-muted: #e0e7ff;        /* Very Light Blue - Backgrounds */
--ocean-border: #c7d2fe;       /* Border Blue - Subtle divisions */

/* Ocean Dark Mode */
--ocean-primary-dark: #3b82f6;     /* Bright Blue - Maintains visibility */
--ocean-secondary-dark: #1e40af;   /* Deep Blue - Rich background */
--ocean-accent-dark: #60a5fa;      /* Light Blue - Interactive contrast */
--ocean-muted-dark: #1e293b;       /* Dark Slate - Background */
--ocean-border-dark: #334155;      /* Slate Gray - Subtle borders */
```

### Gradient System
```css
/* Ocean Gradients */
--ocean-gradient-primary: linear-gradient(135deg, #1e3a8a 0%, #93c5fd 100%);
--ocean-gradient-secondary: linear-gradient(135deg, #1d4ed8 0%, #e0e7ff 100%);
--ocean-gradient-dark: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
```

### Usage Examples
```tsx
// Primary buttons
<button className="bg-ocean-primary text-white hover:bg-ocean-accent">
  Ocean Button
</button>

// Cards and containers  
<div className="bg-ocean-muted border border-ocean-border">
  Ocean Card
</div>

// Gradient backgrounds
<div className="bg-gradient-to-br from-ocean-primary to-ocean-secondary">
  Ocean Gradient
</div>
```

## 👑 Royal Theme

### Color Palette
```css
/* Royal Light Mode */
--royal-primary: #1e40af;      /* Royal Blue - Regal, trustworthy */
--royal-secondary: #f59e0b;    /* Gold - Luxurious, premium */
--royal-accent: #3730a3;       /* Indigo - Deep, sophisticated */
--royal-muted: #fef3c7;        /* Light Gold - Warm backgrounds */
--royal-border: #fbbf24;       /* Bright Gold - Attention-drawing */

/* Royal Dark Mode */
--royal-primary-dark: #6366f1;    /* Bright Indigo - Night visibility */
--royal-secondary-dark: #d97706;  /* Dark Gold - Rich luxury */
--royal-accent-dark: #8b5cf6;     /* Purple - Premium contrast */
--royal-muted-dark: #1c1917;      /* Dark Brown - Warm dark base */
--royal-border-dark: #a16207;     /* Dark Gold - Subtle luxury */
```

### Gradient System  
```css
/* Royal Gradients */
--royal-gradient-primary: linear-gradient(135deg, #1e40af 0%, #f59e0b 100%);
--royal-gradient-secondary: linear-gradient(135deg, #3730a3 0%, #fef3c7 100%);
--royal-gradient-dark: linear-gradient(135deg, #4338ca 0%, #d97706 100%);
```

### Usage Examples
```tsx
// Premium buttons
<button className="bg-royal-primary text-white border border-royal-secondary">
  Royal Button  
</button>

// Luxury cards
<div className="bg-royal-muted border border-royal-border">
  Royal Card
</div>

// Premium gradients
<div className="bg-gradient-to-br from-royal-primary to-royal-secondary">
  Royal Gradient
</div>
```

## 🔧 Technical Implementation

### CSS Custom Properties Structure

**File**: `src/app/globals.css`

```css
/* Theme Definition Structure */
@theme {
  /* Base theme (Ocean Light) */
  --color-primary: var(--ocean-primary);
  --color-secondary: var(--ocean-secondary);
  --color-accent: var(--ocean-accent);
  
  /* Semantic colors */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: var(--ocean-muted);
  --color-border: var(--ocean-border);
  
  /* Interactive states */
  --color-primary-hover: var(--ocean-accent);
  --color-destructive: #ef4444;
  --color-constructive: #10b981;
}

/* Dark mode variants */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-primary: var(--ocean-primary-dark);
    --color-secondary: var(--ocean-secondary-dark);
    --color-background: #0f172a;
    --color-foreground: #f8fafc;
  }
}

/* Royal theme overrides */
[data-theme="royal"] {
  --color-primary: var(--royal-primary);
  --color-secondary: var(--royal-secondary);
  --color-accent: var(--royal-accent);
  --color-muted: var(--royal-muted);
  --color-border: var(--royal-border);
}

/* Royal dark mode */
[data-theme="royal"][data-mode="dark"] {
  --color-primary: var(--royal-primary-dark);
  --color-secondary: var(--royal-secondary-dark);
  --color-background: #1c1917;
  --color-foreground: #fef3c7;
}
```

### Next.js Theme Provider

**File**: `src/components/theme-provider.tsx`

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-mode"          // Controls light/dark mode
      defaultTheme="system"          // Respects system preference
      enableSystem={true}            // System theme detection
      disableTransitionOnChange={false}  // Smooth theme transitions
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

### Theme Switcher Component

**File**: `src/components/theme-switcher.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Palette } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("ocean");
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "ocean" ? "royal" : "ocean";
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("ui-theme", newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle (Light/Dark) */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? 
          <Sun className="h-4 w-4" /> : 
          <Moon className="h-4 w-4" />
        }
      </button>

      {/* Theme Toggle (Ocean/Royal) */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
        title={`Switch to ${currentTheme === "ocean" ? "royal" : "ocean"} theme`}
      >
        <Palette className="h-4 w-4" />
      </button>
    </div>
  );
}
```

## 🎯 Tailwind CSS v4 Integration

### Configuration File

**File**: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        // Semantic color system
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
          hover: "var(--color-primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", 
          foreground: "var(--color-secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
        destructive: "var(--color-destructive)",
        constructive: "var(--color-constructive)",
        
        // Theme-specific colors
        ocean: {
          primary: "var(--ocean-primary)",
          secondary: "var(--ocean-secondary)",
          accent: "var(--ocean-accent)",
          muted: "var(--ocean-muted)",
          border: "var(--ocean-border)",
        },
        royal: {
          primary: "var(--royal-primary)",
          secondary: "var(--royal-secondary)", 
          accent: "var(--royal-accent)",
          muted: "var(--royal-muted)",
          border: "var(--royal-border)",
        },
      },
      backgroundImage: {
        "gradient-ocean": "var(--ocean-gradient-primary)",
        "gradient-royal": "var(--royal-gradient-primary)",
      },
    },
  },
  plugins: [],
};

export default config;
```

## 📱 Responsive Theme Behavior

### Mobile Optimizations
```css
/* Mobile-first responsive adjustments */
@media (max-width: 768px) {
  :root {
    /* Increase contrast for mobile visibility */
    --color-primary: var(--ocean-primary);
    --color-border: #94a3b8; /* Stronger borders */
  }
  
  /* Larger touch targets */
  .theme-switcher button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-border: #000000;
    --color-primary: #000080;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

### Theme Persistence
```typescript
// Theme persistence across sessions
useEffect(() => {
  const savedTheme = localStorage.getItem("ui-theme");
  const savedMode = localStorage.getItem("theme");
  
  if (savedTheme) {
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
  
  if (savedMode) {
    setTheme(savedMode);
  }
}, []);

// Save theme changes
const handleThemeChange = (newTheme: string) => {
  setCurrentTheme(newTheme);
  localStorage.setItem("ui-theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
};
```

## 🎨 Adding New Themes

### Step 1: Define Color Palette
```css
/* Add to globals.css */
:root {
  /* Forest Theme */
  --forest-primary: #166534;     /* Forest Green */
  --forest-secondary: #84cc16;   /* Lime Green */ 
  --forest-accent: #15803d;      /* Medium Green */
  --forest-muted: #f0fdf4;       /* Light Green */
  --forest-border: #bbf7d0;      /* Soft Green */
  
  /* Forest Dark Mode */
  --forest-primary-dark: #22c55e;
  --forest-secondary-dark: #166534;
  --forest-accent-dark: #4ade80;
  --forest-muted-dark: #0f1419;
  --forest-border-dark: #374151;
}
```

### Step 2: Add Theme Variant
```css
[data-theme="forest"] {
  --color-primary: var(--forest-primary);
  --color-secondary: var(--forest-secondary);
  --color-accent: var(--forest-accent);
  --color-muted: var(--forest-muted);
  --color-border: var(--forest-border);
}

[data-theme="forest"][data-mode="dark"] {
  --color-primary: var(--forest-primary-dark);
  --color-secondary: var(--forest-secondary-dark);
  --color-background: #0f1419;
  --color-foreground: #f0fdf4;
}
```

### Step 3: Update Theme Switcher
```tsx
const themes = ["ocean", "royal", "forest"];
const [themeIndex, setThemeIndex] = useState(0);

const cycleTheme = () => {
  const nextIndex = (themeIndex + 1) % themes.length;
  const newTheme = themes[nextIndex];
  setThemeIndex(nextIndex);
  setCurrentTheme(newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("ui-theme", newTheme);
};
```

### Step 4: Add to Tailwind Config
```typescript
// Extend colors in tailwind.config.ts
forest: {
  primary: "var(--forest-primary)",
  secondary: "var(--forest-secondary)",
  accent: "var(--forest-accent)",
  muted: "var(--forest-muted)",
  border: "var(--forest-border)",
},
```

## 🧪 Testing Themes

### Manual Testing
```bash
# Test theme switching in browser
1. Open browser dev tools
2. Go to Application → Local Storage
3. Check 'ui-theme' and 'theme' values
4. Toggle themes and verify persistence
5. Test in both light and dark system modes
6. Verify accessibility with screen readers
```

### Automated Testing
```typescript
// Jest/Testing Library example
describe('Theme System', () => {
  it('should persist theme selection', () => {
    render(<ThemeSwitcher />);
    
    const themeButton = screen.getByTitle(/switch to royal theme/i);
    fireEvent.click(themeButton);
    
    expect(localStorage.getItem('ui-theme')).toBe('royal');
    expect(document.documentElement.getAttribute('data-theme')).toBe('royal');
  });
  
  it('should respect system theme preference', () => {
    // Mock system dark mode
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => ({ matches: true }))
    });
    
    render(<ThemeProvider><App /></ThemeProvider>);
    
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
  });
});
```

### Accessibility Testing
```typescript
// Check color contrast ratios
const checkContrast = (foreground: string, background: string) => {
  // Use tools like 'color-contrast' npm package
  const ratio = getContrastRatio(foreground, background);
  expect(ratio).toBeGreaterThan(4.5); // WCAG AA standard
};

// Test all theme combinations
['ocean', 'royal'].forEach(theme => {
  ['light', 'dark'].forEach(mode => {
    it(`${theme} ${mode} meets contrast requirements`, () => {
      // Test primary text on background
      // Test secondary text on background
      // Test interactive elements
    });
  });
});
```

## 🔍 Troubleshooting

### Common Issues

**1. Theme not applying on first load**
```tsx
// Ensure ThemeProvider wraps entire app
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationOnWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**2. Flashing incorrect theme (FOUC)**
```tsx
// Add theme-aware loading state
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) {
  return <div className="animate-pulse bg-muted h-screen" />;
}
```

**3. CSS custom properties not updating**
```css
/* Ensure proper specificity */
:root {
  --color-primary: var(--ocean-primary); /* Lower specificity */
}

[data-theme="royal"] {
  --color-primary: var(--royal-primary); /* Higher specificity */
}
```

**4. Theme switcher not working**
```tsx
// Check for proper event handlers
const handleThemeChange = useCallback((newTheme: string) => {
  setCurrentTheme(newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("ui-theme", newTheme);
}, []);
```

### Debug Mode
```tsx
// Add theme debug component
export function ThemeDebug() {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("ocean");
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-muted border rounded">
      <div>Mode: {theme}</div>
      <div>Theme: {currentTheme}</div>
      <div>Computed Primary: {getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}</div>
    </div>
  );
}
```

---

**🎨 The theme system is designed for maximum flexibility while maintaining excellent performance and accessibility. Each theme tells a story and creates an emotional connection with users.**