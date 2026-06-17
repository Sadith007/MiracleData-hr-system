## 2025-05-15 - [Localized Loading vs. Global Overlays]
**Learning:** Localized loading feedback (e.g., spinning icons and disabling specific buttons) provides a much smoother user experience than global page-blocking overlays for background data refreshes. It maintains user context and feels more responsive.
**Action:** Prefer `.btn-spin` and button disabling for localized actions; reserve `showLoading()` for major transitions or full-page data fetches.
