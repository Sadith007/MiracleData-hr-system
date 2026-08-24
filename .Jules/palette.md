## 2026-08-24 - Explicit Label-Input Association for Authentication Forms
**Learning:** In static or monolithic HTML forms, omitting `for` attributes on `<label>` elements prevents screen readers from properly announcing inputs when focused and prevents mouse/touch users from focusing inputs by clicking on their labels.
**Action:** Always ensure every `<label>` element includes a `for` attribute matching the exact `id` of its target input, select, or textarea control.
