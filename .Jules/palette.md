## 2025-05-18 - Accessibility Attributes on Icon-Only Buttons & Standalone Inputs

**Learning:** Icon-only control buttons (e.g., '✕' close buttons, '↺' refresh buttons) and standalone search inputs without visible `<label>` elements are unannounced or confusing for screen reader users unless explicit `aria-label` and `title` attributes are attached.
**Action:** Always complement icon-only buttons and label-less search inputs with descriptive `aria-label` and `title` attributes to ensure screen reader clarity and desktop tooltip support.
