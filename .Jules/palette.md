## 2026-07-04 - Icon-only Static Navigation & Modal Close Buttons Accessibility
**Learning:** Icon-only controls (e.g., '✕' modal close, '↺' refresh list, '⧉' open window, '🌙' theme toggle) in single-page HTML apps frequently lack explicit `aria-label` attributes, rendering them unannounced or obscure to screen reader users.
**Action:** When working on HTML views or header components, audit all icon-only `<button>` elements and ensure they include descriptive `aria-label` and `title` attributes matching their action.
