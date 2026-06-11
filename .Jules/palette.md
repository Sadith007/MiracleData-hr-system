## 2026-06-11 - Accessibility in Monolithic Apps
**Learning:** Accessibility audits in monolithic single-file applications must examine both static HTML and JavaScript template strings (e.g., inside `render` functions or `innerHTML` assignments) to ensure consistent `aria-label` coverage for icon-only buttons.
**Action:** Perform a regex-based sweep of the entire file for known icon characters and interactive patterns, even within string literals, to identify missing accessibility attributes.
