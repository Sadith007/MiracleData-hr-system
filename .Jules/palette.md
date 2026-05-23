# 🎨 Palette's UX Journal

## 2025-05-14 - [Accessibility for Icon-Only Buttons]
**Learning:** In monolithic single-file applications with custom interactive elements (like the HR Chatbot), icon-only buttons often lack semantic meaning for screen readers. Furthermore, interactive state transitions (opening/closing a drawer) must be mirrored in ARIA attributes to maintain a predictable experience.
**Action:** Always audit icon-only buttons for `aria-label` and `title`. Ensure that JavaScript handlers for UI state transitions (e.g., `toggle` functions) programmatically update these attributes to reflect the current state (e.g., "Open HR Assistant" vs. "Close HR Assistant").
