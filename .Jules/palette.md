## 2024-05-18 - [Accessible Modals & Icon Buttons]
**Learning:** In a monolithic HTML/JS app with custom modals, focus management must be handled manually to ensure keyboard accessibility. Icon-only buttons (common in this app's UI) require explicit ARIA labels and titles for both screen readers and visual tooltips.
**Action:** Always update the `openModal` function to set focus on the first interactive element with a short delay (to allow for CSS transitions) and ensure all generated icon buttons (✓, ✗, 🗑) have `aria-label` and `title` attributes.
