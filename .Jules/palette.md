## 2025-05-15 - [Improving Accessibility in Monolithic HTML/JS Apps]
**Learning:** In projects without a component framework, accessibility features like label-input associations and icon-button descriptions are often overlooked. Explicitly using `htmlFor` (or `for`) and `aria-label` provides immediate ROI for both screen readers and usability (larger click targets).
**Action:** Always audit forms for missing `for` attributes and ensure all icon-only buttons have descriptive `aria-label` and `title` attributes.
