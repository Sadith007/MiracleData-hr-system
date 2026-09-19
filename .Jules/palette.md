## 2026-09-19 - Modal Close Button Accessibility
**Learning:** Icon-only close buttons ('✕') across modal overlays and dismissable popups are easily missed by screen readers unless explicitly marked with `aria-label="Close"` and `title="Close"`.
**Action:** When adding or auditing modal dialogs, ensure every close button has both `aria-label` and `title` attributes, preserving file line endings (CRLF) during automated byte replacements.
