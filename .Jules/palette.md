## 2025-05-15 - Localized Loading Feedback
**Learning:** For background data refreshes in monolithic applications, localized loading feedback (disabling the button and animating the icon) is superior to global loading overlays. It keeps the user in context, reduces perceived latency, and prevents "UI flickering" associated with full-screen transitions.
**Action:** Prioritize localized `try...finally` loading states for non-blocking asynchronous operations to maintain user flow.
