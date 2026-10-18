## 2026-07-04 - Icon-only Close Buttons A11y & Tooltip Enhancement
**Learning:** Icon-only close buttons ('✕') across modal headers and overlays without explicit `aria-label` or `title` attributes leave screen reader users without context and mouse users without quick tooltip cues.
**Action:** Always add `aria-label="Close"` and `title="Close"` (or context-specific label like "Remove photo") to icon-only close/dismiss buttons across both static HTML markup and dynamic template renders.
