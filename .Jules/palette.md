## 2026-07-04 - Accessible Modal Close Buttons
**Learning:** Icon-only modal close buttons using symbolic characters like '✕' require explicit `aria-label` and `title` attributes ("Close modal") so that screen readers don't announce ambiguous glyphs (or "multiplication sign") and mouse users receive consistent hover feedback.
**Action:** When creating or reviewing modal dialog headers, ensure close buttons have descriptive `aria-label="Close modal"` and `title="Close modal"` attributes.
