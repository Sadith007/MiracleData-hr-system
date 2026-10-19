## 2025-05-20 - Dynamic Template Images Accessibility
**Learning:** Dynamically rendered `<img>` elements within JavaScript template literals (such as employee cards, profile avatars, and photo upload previews) in monolithic single-page apps like `index.html` often miss `alt` attributes, causing screen readers to announce unhelpful placeholders or image URLs.
**Action:** Always ensure all dynamic `<img>` template tags explicitly include meaningful `alt` attributes (e.g. `alt="${emp.fullName || 'Employee'} photo"` or `alt="Uploaded photo preview"`) when rendering user photos or avatars.
