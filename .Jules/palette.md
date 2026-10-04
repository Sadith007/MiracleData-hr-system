## 2025-05-20 - Photo Removal Button Accessibility
**Learning:** Icon-only remove buttons embedded inside image upload zones (e.g. `.photo-remove`) were missing `aria-label` and `title` attributes across both static modal markup and dynamic JS template renders (`renderDetail`, `uploadPhoto`, `removeEmpPhoto`).
**Action:** Always include explicit `aria-label` and `title` attributes on `.photo-remove` icon buttons when defining HTML templates or updating DOM elements dynamically.
