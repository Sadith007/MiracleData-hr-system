## 2026-09-30 - Modal Search & Filter Accessibility
**Learning:** Standalone `<select>` filters and `<input>` search fields inside modal dialogs and report sub-views lack associated `<label>` elements, causing screen reader tools to announce them as unlabelled form controls.
**Action:** Always add explicit `aria-label` and `title` attributes to standalone modal search inputs and filter select dropdowns when visible `<label>` tags are omitted for layout density.
