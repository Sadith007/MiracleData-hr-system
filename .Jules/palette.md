## 2025-05-18 - Accessible Dismiss Buttons on Dynamic Warning Popups
**Learning:** Dynamically injected floating warning popups (e.g. trial expiration alerts) often feature icon-only close buttons ('✕') that lack explicit `aria-label` or `title` attributes, rendering them unannounced to screen readers and lacking native hover tooltips.
**Action:** Always ensure dynamically generated popup close buttons include explicit `aria-label` (e.g., `aria-label="Dismiss warning"`) and `title` attributes upon template string creation.
