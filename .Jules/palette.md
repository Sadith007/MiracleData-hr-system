## 2025-05-18 - Explicit Label Association for Authentication Forms
**Learning:** Form labels lacking explicit `for` attributes prevent screen readers from announcing field context when focusing inputs and disable native click-to-focus interactivity for users.
**Action:** Always ensure `<label>` elements include a `for` attribute strictly matching the `id` of their corresponding input or select field.
