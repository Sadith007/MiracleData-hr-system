## 2026-07-04 - Form Label Accessibility in Authentication Forms
**Learning:** In static single-page monolith applications, developers frequently forget to associate `<label>` elements with their respective `<input>` or `<select>` fields using the `for` attribute. This breaks keyboard accessibility, screen reader announcements, and the standard click-to-focus behavioral expectations of the user.
**Action:** Always scan form structures for `<label>` tags and systematically apply `for` attributes that strictly correspond to the `id` of target inputs.
