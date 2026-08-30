## 2025-05-24 - Explicit Label-Input Association (`for` Attributes)
**Learning:** In forms across the app (Login, Reset Password, Attendance Settings, User Management, Location Management), labels lacked explicit `for` attributes matching input IDs. Adding `for` attributes improves screen reader semantics and enables click-to-focus behavior.
**Action:** Always ensure all form `<label>` tags include a `for` attribute matching the exact `id` of their target input/select/textarea.
