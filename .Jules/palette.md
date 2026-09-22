## 2026-09-22 - Icon-only buttons and modal close buttons accessibility
**Learning:** Icon-only buttons (such as '✕' close buttons and '↺' refresh buttons) across modals and sidebars in monolithic single-file web applications often lack explicit `aria-label` attributes, rendering them unannounced or opaque to assistive technologies like screen readers.
**Action:** Always audit static modal markup and dynamic HTML string templates for icon-only controls, ensuring both `aria-label` and `title` attributes are attached to provide clear screen reader announcements and standard hover tooltips.
