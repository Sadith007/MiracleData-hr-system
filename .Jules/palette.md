## 2025-03-08 - Modal Dialog Accessibility (WAI-ARIA)
**Learning:** Monolithic HTML modal overlays lacked `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` attributes, preventing screen readers from recognizing modal context and properly announcing modal title headings when dialogs open.
**Action:** Always ensure modal overlays specify `role="dialog"` and `aria-modal="true"`, and pair them with `aria-labelledby="<titleId>"` matching the modal header's `<h3>` ID.
