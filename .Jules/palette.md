## 2025-10-12 - Refresh Button Accessibility & Loading Feedback
**Learning:** Icon-only trigger buttons (such as `↺` for refresh) lack screen reader context and visible interaction state during async background operations if missing explicit ARIA labels and loading CSS classes.
**Action:** Always include `aria-label` and `title` attributes on icon-only buttons, and use a `try...finally` block in event listeners to toggle a spinning animation (`.spin-icon`) and `disabled` state during asynchronous tasks.
