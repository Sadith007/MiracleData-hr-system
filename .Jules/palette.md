# Palette's Journal - Critical Learnings Only

## 2025-02-15 - Labels and ARIA attributes in hr-system
**Learning:** Forms must use associated labels with `for` attribute and inputs with `id` to ensure accessibility and click-to-focus behavior. Icon-only buttons must use `aria-label` and `title` to be accessible to screen readers and mouse users.
**Action:** Always associate `<label>` with `<input>` using matching `id`/`for` attributes and ensure icon-only buttons have descriptive labels.
