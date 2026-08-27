## 2026-07-04 - Dynamic Template String Icon Buttons
**Learning:** Icon-only buttons rendered dynamically via JS string templates (e.g. `renderLeaveList` or `renderDocList`) are frequently missed during static HTML ARIA audits and leave screen readers without context for actions like approve, reject, or delete.
**Action:** Always inspect JS template strings when auditing interactive elements, and include explicit `aria-label` and `title` attributes on all dynamic icon-only controls.
