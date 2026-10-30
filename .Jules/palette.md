## 2025-05-18 - Explicit Label For Associations
**Learning:** In this application's custom form layouts, form `<label>` elements were previously unlinked to their target input/select/textarea IDs, preventing click-to-focus interactivity and degrading screen reader accessibility.
**Action:** Always ensure every form `<label>` includes a `for` attribute matching the exact `id` of its corresponding form field.
