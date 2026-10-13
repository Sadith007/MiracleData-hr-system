# Palette's UX Journal

## 2025-05-14 - Global Window Scope for Inline Event Handlers
**Learning:** Functions invoked via inline HTML event attributes (such as `oninput` or `onclick`) in a monolithic HTML file must be explicitly assigned to `window` if defined inside enclosed script blocks or event listeners (e.g., `DOMContentLoaded`).
**Action:** Always assign functions called by inline HTML attributes to `window` (e.g., `window.clearSidebarSearch = function() { ... }`).
