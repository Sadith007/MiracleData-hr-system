# Palette's Journal - Critical UX & Accessibility Learnings

## 2026-08-16 - Modal Close Button Accessibility
**Learning:** Icon-only close buttons (`✕`) in modal dialog headers are missing accessible labels by default, creating severe navigation barriers for screen reader users who rely on actionable text descriptions.
**Action:** Always verify that every static and dynamically generated `✕` modal button includes `aria-label="Close"` and `title="Close"`.
