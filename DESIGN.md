# Design System: ParkOps Terminal

## 1. Visual Theme & Atmosphere

ParkOps is a **cockpit-dense** parking-operations terminal: calm, exact, and scan-friendly at a busy entry booth. Density is 8/10, variance 3/10, and motion 3/10. Information is compact but never crowded: every operational region has a fixed, legible purpose—navigation, telemetry, ingress, active fleet, or lane status.

## 2. Color Palette & Roles

- **Terminal Canvas** (`#F8F9FF`) — main workspace background.
- **Surface White** (`#FFFFFF`) — panels, tables, and input areas.
- **Deep Navy** (`#00236F`) — sole primary accent: navigation selection, primary actions, number emphasis.
- **Sensor Teal** (`#006780`) — non-primary semantic telemetry and EV status.
- **Ink** (`#0B1C2E`) — primary content and headings.
- **Slate Metadata** (`#444651`) — labels, timestamps, secondary text.
- **Cool Divider** (`#D3E4FD`) — borders and structural bands.
- **Alert Red** (`#BA1A1A`) — exceptions only.

Never add neon effects, gradients, or another brand accent.

## 3. Typography Rules

- **Display and UI:** Hanken Grotesk, 600–800 weight. Dashboard headings range from 16px to 24px; landing display uses `clamp(2.75rem, 6vw, 5rem)`.
- **Operational data:** JetBrains Mono for plates, bay coordinates, timestamps, currency, telemetry, and all numeric counters.
- **Density rule:** Data labels are 10–12px mono; high-priority values are 24–36px mono.
- **Banned:** Inter, generic serif fonts, giant decorative type within the application shell.

## 4. Component Stylings

- **Navigation:** 48px rows, active state in Deep Navy, all other states are neutral with a Cool Divider hover tint.
- **Panels:** 8–12px radius, white fill, one low-opacity navy shadow. Panels group operations; do not use them merely to decorate.
- **Buttons:** 40–44px minimum interactive height. Deep Navy for irreversible/primary operation, Sensor Teal for utility actions, white/outlined for low-risk actions. Active press translates by 1px.
- **Inputs:** 1px Cool Divider border, mono text for scanning and plate inputs, explicit label or placeholder, navy focus ring.
- **Tables:** Header strip uses `#EEF4FF`; rows use dividers, never floating cards. Every row action must work.
- **States:** Inline errors in `#FFDAD6`; successful assignment/settlement in a pale teal surface; loading uses panel-shaped shimmer.

## 5. Layout Principles

- Desktop: fixed 288px sidebar, 64px utility bar, max workspace width 1720px.
- Main dashboard order: telemetry, ingress/exit, fleet table, right-hand operational rail.
- Mobile below 768px: sidebar becomes a compact top context bar; all layouts collapse to one column; no horizontal page overflow. Tables retain an explicitly scrollable inner region only.
- Every navigation item must resolve to an implemented route or be visibly disabled with an explanation.

## 6. Motion & Interaction

- Use 160–220ms `cubic-bezier(.2,.8,.2,1)` transitions for opacity, background, and transform only.
- Active sensor dots may pulse quietly; no decorative looping animation.
- Route transitions fade/translate the page content by 4px, respecting `prefers-reduced-motion`.
- Check-in, checkout, lookup, history filtering, rate import, clock automation, and plate transfer must show immediate inline feedback.

## 7. Anti-Patterns (Banned)

- No placeholder-only routes or dead buttons.
- No emoji stand-ins for icons; use the supplied Material Symbols glyphs.
- No generic dashboard cards that do not convey live operational data.
- No mobile layout that hides context or causes page-level horizontal scrolling.
- No fake vehicle data presented as real persisted data.
- No opaque full-page loading screens when a panel-level state is enough.
