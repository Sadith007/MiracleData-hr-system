
## 2026-05-21 - [Accessibility & Structural Integrity in Monolithic Apps]
**Learning:** In monolithic single-page applications, duplicate DOM IDs and stubbed code blocks are common but dangerous. They not only violate HTML standards but also cause flaky behavior in automated verification scripts (like Playwright) and can confuse assistive technologies.
**Action:** Before applying UX enhancements in a monolith, audit for duplicate IDs and "ghost" components. Consolidate functional code into a single source of truth within the file to ensure accessibility attributes are applied to the active element.

## 2026-05-21 - [Semantic Labels for Minimalist Iconography]
**Learning:** Minimalist and emoji-based UIs often sacrifice clarity for aesthetics by using icon-only buttons without text labels. While visually pleasing, these are invisible to screen readers and lack the discoverability provided by hover tooltips.
**Action:** Systematically pair every functional icon-only button with both an 'aria-label' for accessibility and a 'title' for visual tooltips. This dual-purpose enhancement bridges the gap between minimalist design and inclusive usability.
