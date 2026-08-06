# Palette's Journal

## 2026-08-06 - Interactive Element Accessibility
**Learning:** Icon-only buttons (e.g. '↺', '✕', '✓', '✗', '🗑️', '📋') require explicit `aria-label` and `title` attributes to be perceivable by screen readers. However, adding these attributes to buttons with visible text creates redundant screen reader announcements.
**Action:** Only apply `aria-label` and `title` to strictly icon-only buttons. Ensure elements like the clear search button ('✕') have explicit names like 'Clear search' rather than generic names.

## 2026-08-06 - Modal Dialog Keyboard Focus Restoration
**Learning:** When modals close via backdrop clicks or keypresses, focus is often lost. Restoring focus to the triggering element (via a global trigger map) maintains context for assistive and keyboard-only users.
**Action:** Record the `document.activeElement` during modal open calls, and restore focus to it on close. Use a brief 300ms delay to allow transitions to finish.

## 2026-08-06 - Global Search Keyboard Shortcuts and Visual Hints
**Learning:** Adding global key bindings (like `/` or `Ctrl+K`) for focusing the main search input makes the app feel extremely responsive and pleasant. Presenting a visual shortcut indicator badge (like `/`) inside the field on the right adds a touch of delight but must be faded out upon focus or text input to reduce visual clutter. Additionally, any interactive overlay elements inside inputs (like a clear button) must support explicit `:focus-visible` styles so keyboard-only users who Tab onto them can see their focused state.
**Action:** Implement keydown listeners that selectively focus inputs only when the user is not already typing in other form fields. Support fading indicator opacities on focus/blur, and always style custom focus rings on clear buttons.
