## 2026-06-19 - Localized Loading Feedback for Micro-actions
**Learning:** For background data refreshes that don't block the entire app (like `loadDB(true)`), localized loading feedback on the trigger element (e.g., spinning the refresh icon) provides a smoother experience than a global page-blocking overlay. It keeps the user in context while clearly communicating progress.
**Action:** Use `.btn-spin` class on icons and disable buttons during async micro-actions instead of using global `showLoading()` overlays.
