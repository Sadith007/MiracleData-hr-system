## 2026-09-05 - Modal Focus Restoration & Select Label Accessibility

**Learning:** In monolithic single-page applications with modal overlays, closing a modal without restoring focus resets keyboard and screen reader focus to `<body>`, confusing keyboard/assistive technology users. Furthermore, `<select>` dropdown controls without matching `<label for="...">` break click-to-focus interactivity and screen reader field announcements.
**Action:** Store `document.activeElement` before opening a modal in a global lookup map, and restore focus on modal closure. Ensure all `<select>` form fields are explicitly linked to their corresponding `<label>` elements via `for` attributes.
