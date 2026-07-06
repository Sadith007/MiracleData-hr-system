## 2025-02-05 - Standardizing Localized Loading and Accessibility
**Learning:** Icon-only buttons like 'Refresh' and 'Close' often lack ARIA labels. Users prefer localized feedback (spinning icons) over global overlays for background tasks.
**Action:** Implement `.spin-icon` class and apply it to the refresh button along with proper `aria-label` and `title`.
