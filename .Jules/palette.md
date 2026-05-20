## 2026-05-20 - [Focus Management in Modals]
**Learning:** In applications using CSS transitions for modal entry, shifting focus immediately can lead to "focus jumps" or fail if the element is not yet interactable. A delay matching the transition (e.g., 300ms) ensures a smooth experience for keyboard users.
**Action:** When implementing modal focus logic, always check for CSS transition timings and use a small timeout to synchronize focus shifting with visual readiness.

## 2026-05-20 - [Semantic Search and Icon Accessibility]
**Learning:** Icon-only buttons are invisible to screen readers without ARIA labels. Using `type="search"` on inputs provides mobile users with a dedicated search keyboard button, improving mobile UX significantly.
**Action:** Audit all icon-only interactions for missing labels and ensure search inputs use the correct semantic type.
