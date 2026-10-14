## 2025-05-18 - ARIA Labels on Monolithic UI Icon Buttons
**Learning:** Monolithic single-file web applications using raw symbol/emoji icon buttons (such as '↺', '✕', '⧉', '🌙') often lack accessible names for screen reader users, despite tooltip `title` attributes.
**Action:** Always pair `aria-label` alongside `title` on all icon-only action and close buttons across topbar, navigation drawers, and overlay dialog headers.
