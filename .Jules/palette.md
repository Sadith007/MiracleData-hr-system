## 2025-05-18 - Explicit Label-Input Association for Authentication Forms
**Learning:** In static single-page application views (Login, Register, Reset Password), form `<label>` elements without explicit `for` attributes fail screen reader accessibility associations and prevent click-to-focus interactivity on target inputs.
**Action:** Always ensure every form `<label>` includes a `for` attribute matching the exact `id` of its corresponding input or select element.
