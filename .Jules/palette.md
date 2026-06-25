## 2025-05-14 - Localized Loading and Icon Accessibility
**Learning:** Applying rotation animations specifically to an icon wrapper (e.g., `<span>`) rather than the parent button element prevents jarring container movement and layout shifts during loading states. Additionally, systematically auditing both static and dynamic HTML for icon-only buttons ensures comprehensive screen reader accessibility.
**Action:** Use a dedicated `<span>` for icon animations and always provide `aria-label` for buttons without visible text content.
