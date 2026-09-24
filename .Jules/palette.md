## 2026-05-18 - Explicit Label-Input Associations on Auth Views
**Learning:** Labels in monolithic single-page auth views without explicit `for` attributes fail screen reader accessibility guidelines and diminish click-to-focus interactivity on custom input groups.
**Action:** Ensure every `<label>` element in static forms across `index.html` strictly includes a `for` attribute referencing its target input field's ID.
