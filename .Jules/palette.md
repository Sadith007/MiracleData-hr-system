## 2026-07-04 - Modal Close Buttons ARIA Accessibility
**Learning:** Icon-only close buttons (e.g. '✕') in static HTML modal headers and mobile navigation drawers lack implicit text content, causing screen readers to announce them ambiguously.
**Action:** Always provide explicit `aria-label="Close"` (or context-specific label like "Close navigation drawer") and matching `title` attributes on icon-only close buttons.
