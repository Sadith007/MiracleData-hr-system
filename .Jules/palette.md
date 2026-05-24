## 2024-05-24 - [Preserving Child Elements During Content Updates]
**Learning:** When updating the content of a button that has children (like a notification badge), using `textContent` or `innerHTML` on the button itself will destroy the children. It's better to wrap the icon/text in a separate span and update that.
**Action:** Use a dedicated span for dynamic icons/text within complex buttons to ensure secondary elements (badges, tooltips) are preserved.

## 2024-05-24 - [Accessibility for Icon-Only Buttons]
**Learning:** Monolithic single-file apps often miss ARIA labels on icon-only buttons, especially those rendered via JS strings. Screen readers need these for context.
**Action:** Always audit both static HTML and JS template strings for buttons containing only icons (like ✖, ↺, 🤖) and ensure they have `aria-label` and `title`.
