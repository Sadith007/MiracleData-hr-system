## 2026-05-18 - Accessible Modal Close Buttons
**Learning:** Modal header close buttons using character symbols ('✕') without explicit `aria-label` or `title` attributes are invisible to screen readers or announced as ambiguous symbols, breaking accessibility for non-visual users.
**Action:** Always ensure icon-only modal close buttons ('✕') include `aria-label="Close"` and `title="Close"` for both screen reader announcements and standard tooltip feedback.
