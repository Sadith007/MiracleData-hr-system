## 2026-09-12 - Standardizing Location Search Accessibility & Empty States
**Learning:** Decorative emojis in empty state containers should always be wrapped in `<span aria-hidden="true">` to prevent screen readers from voicing redundant icons, while inputs embedded in modal panels require explicit `aria-label` attributes when visible text labels are omitted.
**Action:** Apply `.empty-state` with `aria-hidden="true"` spans and add explicit `aria-label` and `title` attributes on search inputs across modal views.
