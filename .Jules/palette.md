## 2026-05-26 - Icon-Only Button Interaction and Accessibility
**Learning:** In monolithic HTML structures where icons are toggled via `textContent`, wrapping the icon in a dedicated `<span>` (e.g., `#hcIcon`) prevents overwriting sibling elements like notification badges (`#hcNotif`) when the button's state changes. Additionally, icon-only buttons require state-aware ARIA updates (changing `aria-label` and `title`) to remain accessible.
**Action:** Always wrap toggleable icons in a span and update that span's text instead of the button's text; pair this with dynamic ARIA label updates.

## 2026-05-26 - Modal Keyboard Accessibility
**Learning:** Opening a modal without programmatically moving focus can leave the keyboard focus in a "ghost" state or trapped behind the modal overlay. A delay (e.g., 300ms) is often necessary to account for CSS transitions before focusing the first interactive element.
**Action:** Update the `openModal` utility to automatically focus the first interactive element (`input`, `select`, `textarea`, `button`) after a 300ms delay.
