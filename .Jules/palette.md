# Palette's Journal

## 2026-08-19 - ARIA Live Regions for Dynamic Feedback and Toast Notifications
**Learning:** Dynamic status and error feedback elements in single-page static HTML applications (such as toasts created programmatically and inline error containers like `#loginError`) are ignored by screen readers unless explicitly marked with ARIA live region attributes (`role="status"` / `role="alert"` and `aria-live="polite"` / `aria-live="assertive"`).
**Action:** Always ensure dynamically spawned notifications (like `showToast`) set `role` and `aria-live` attributes programmatically based on message severity, and pre-existing inline message `div` elements include appropriate ARIA live region attributes in HTML.
