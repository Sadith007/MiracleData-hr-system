## 2024-07-07 - Icon-only Button Accessibility in Monolithic Apps
**Learning:** In monolithic apps with mixed static HTML and dynamic JS templates (e.g., using `innerHTML` with backticks), icon-only buttons (✕, ↺, ✓, 🗑) are often missed by simple static analysis. Standardizing accessibility requires auditing both HTML tags and JavaScript string literals to ensure `aria-label` and `title` coverage.
**Action:** Always search for common icon characters (✕, ✓, 🗑) inside script tags and template literals, not just in HTML tags, to ensure full accessibility coverage in single-file apps.
