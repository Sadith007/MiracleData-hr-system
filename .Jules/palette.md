## 2025-03-24 - Localized Loading Feedback for Icon Buttons
**Learning:** When implementing localized loading feedback for icon-only buttons, apply the rotation animation specifically to a wrapper around the icon (e.g., `<span id="refreshIcon">`) rather than the button element itself. Rotating the entire button container is visually jarring, especially for rectangular buttons.
**Action:** Always wrap icons in a `<span>` and target the span for animations like `.spin-icon`.
