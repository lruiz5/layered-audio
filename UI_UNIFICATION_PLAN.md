# Lofi ATC Player - UI Unification Plan

## 🎨 Design System (User Approved)

This document outlines the unified design system for the Lofi ATC Player application.

---

## ✅ Confirmed Design Choices

### Primary Color: Emerald

```css
--emerald-50: #eefff6;
--emerald-100: #d7ffec;
--emerald-200: #b2ffdb;
--emerald-300: #76ffc2;
--emerald-400: #34f49e;
--emerald-500: #09d178;
--emerald-600: #01b866;
--emerald-700: #059053;
--emerald-800: #0a7144;
--emerald-900: #0b5c3a;
--emerald-950: #00341f;
```

### Secondary Color: Coral

```css
--coral-300: #ffa8a8;
--coral-400: #ff7f7f;
--coral-500: #ff6b6b;
--coral-600: #ee5a5a;
--coral-700: #d94545;
```

### Typography: Frutiger

- **Font Files:** `public/fonts/Frutiger.ttf`, `public/fonts/Frutiger_bold.ttf`
- **Weights:** Regular (400), Bold (700)

### Button Style: Animated Pill (Primary Actions Only)

- Pill-shaped with animated emerald fill effect
- Secondary buttons use simpler styling

### No Grays

- All neutral tones derived from emerald palette

---

## 🎨 Complete Color Palette

### Backgrounds

```css
--bg-primary: #0b5c3a; /* Emerald-900 - Main background */
--bg-secondary: #0a7144; /* Emerald-800 - Cards/sections */
--bg-tertiary: #059053; /* Emerald-700 - Elevated elements */
--bg-card: rgba(10, 113, 68, 0.5); /* Emerald-800/50 - Glass cards */
```

### Text Colors

```css
--text-primary: #eefff6; /* Emerald-50 - Primary text */
--text-secondary: #b2ffdb; /* Emerald-200 - Secondary text */
--text-muted: #76ffc2; /* Emerald-300 - Muted/helper text */
--text-accent: #34f49e; /* Emerald-400 - Accent text */
```

### Borders

```css
--border-default: #059053; /* Emerald-700 */
--border-hover: #01b866; /* Emerald-600 */
--border-focus: #09d178; /* Emerald-500 */
```

### Interactive States

```css
--interactive-default: #09d178; /* Emerald-500 */
--interactive-hover: #01b866; /* Emerald-600 */
--interactive-active: #059053; /* Emerald-700 */
```

### Semantic Colors

```css
--success: #09d178; /* Emerald-500 */
--warning: #ff6b6b; /* Coral-500 */
--error: #ee5a5a; /* Coral-600 */
--info: #34f49e; /* Emerald-400 */
```

---

## 🔤 Typography System

### Font Face Definitions

```css
@font-face {
  font-family: "Frutiger";
  src: url("/fonts/Frutiger.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Frutiger";
  src: url("/fonts/Frutiger_bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Font Scale

```css
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
```

---

## 🔘 Button System

### Primary Button (Animated Pill)

```css
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 10;
  padding: 0.5rem 1rem;
  overflow: hidden;
  border: 2px solid var(--emerald-50);
  border-radius: 9999px;
  background: var(--emerald-50);
  color: var(--emerald-900);
  font-family: "Frutiger", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  isolation: isolate;
  transition: color 0.3s ease;
}

.btn-primary::before {
  content: "";
  position: absolute;
  width: 100%;
  aspect-ratio: 1;
  left: -100%;
  border-radius: 9999px;
  background: var(--emerald-500);
  z-index: -1;
  transition: all 0.7s ease;
}

.btn-primary:hover {
  color: var(--emerald-50);
}

.btn-primary:hover::before {
  left: 0;
  transform: scale(1.5);
}
```

### Secondary Button

```css
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--emerald-600);
  border-radius: 9999px;
  background: transparent;
  color: var(--emerald-200);
  font-family: "Frutiger", sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--emerald-700);
  border-color: var(--emerald-500);
  color: var(--emerald-50);
}
```

### Coral Button (Plex/Disconnect)

```css
.btn-coral {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid var(--coral-500);
  border-radius: 9999px;
  background: var(--coral-500);
  color: var(--emerald-950);
  font-family: "Frutiger", sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-coral:hover {
  background: var(--coral-600);
  border-color: var(--coral-600);
}
```

### Ghost Button (Icon buttons, controls)

```css
.btn-ghost {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 9999px;
  background: transparent;
  color: var(--emerald-300);
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--emerald-700);
  color: var(--emerald-50);
}

.btn-ghost.active {
  background: rgba(9, 209, 120, 0.2);
  color: var(--emerald-400);
}
```

---

## 📦 Card Component

```css
.card {
  background: var(--bg-card);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-default);
  border-radius: 1rem;
  padding: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-title {
  font-family: "Frutiger", sans-serif;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.card-content {
  color: var(--text-primary);
}
```

---

## 📝 Form Elements

### Input

```css
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-family: "Frutiger", sans-serif;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 2px rgba(9, 209, 120, 0.2);
}
```

### Select

```css
.select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-family: "Frutiger", sans-serif;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.select:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 2px rgba(9, 209, 120, 0.2);
}
```

### Range Slider

```css
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--emerald-700);
  border-radius: 2px;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--emerald-400);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: var(--emerald-300);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--emerald-400);
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
```

---

## 🎯 Status Indicators

```css
.status-connected {
  background: var(--emerald-400);
  box-shadow: 0 0 8px var(--emerald-400);
}

.status-connecting {
  background: var(--coral-400);
  animation: pulse 1.5s infinite;
}

.status-error {
  background: var(--coral-600);
}

.status-idle {
  background: var(--emerald-700);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

---

## 📱 Scrollbar Styling

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--emerald-800);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--emerald-600);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--emerald-500);
}
```

---

## 📋 Implementation Phases

### Phase 1: Foundation ✅ COMPLETE

- [x] Update `globals.css` with CSS custom properties
- [x] Add Frutiger font-face declarations
- [x] Create button variant classes
- [x] Create card and form component classes
- [x] Update scrollbar styles

### Phase 2: Core Components ✅ COMPLETE

- [x] **Header.tsx** - New emerald theme, Frutiger font
- [x] **AirportList.tsx** - Update button styles, emerald backgrounds
- [x] **AirportSearch.tsx** - New input styles

### Phase 3: Player Components ✅ COMPLETE

- [x] **MusicPlayer.tsx** - Full redesign with new system
- [x] **ATCPlayer.tsx** - Match new design
- [x] **PlexAuth.tsx** - Coral accent for Plex

### Phase 4: Plex Components ✅ COMPLETE

- [x] **PlexBrowser.tsx** - Update all styles
- [x] **PlexPlayer.tsx** - Standardize with system
- [x] **ATCStatusIndicator.tsx** - New status colors

### Phase 5: Testing & Polish ✅ COMPLETE

- [x] Visual consistency check
- [x] Accessibility verification
- [x] Update documentation
- [x] Replace generic icons with custom Plex logo
- [x] Fix Plex disconnect functionality
- [x] Improve dropdown styling and theme consistency

---

## 🎨 Visual Preview

**Background:** Rich forest green (`#0b5c3a`)
**Cards:** Semi-transparent emerald with blur
**Text:** Mint white (`#eefff6`) on emerald
**Buttons:** Animated pill with emerald fill
**Accents:** Coral for Plex/warnings

---

**Status:** ✅ IMPLEMENTATION COMPLETE
**Actual Time:** ~6 hours
**Priority:** High
