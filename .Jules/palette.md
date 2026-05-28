## 2026-05-28 - Preserving child elements during dynamic state updates
**Learning:** In monolithic apps where buttons contain both icons and dynamic badges (like notification counts), updating textContent directly on the parent button destroys the badge elements.
**Action:** Wrap the icon in a dedicated span (e.g., id='hcIcon') and target its textContent for state changes to preserve surrounding DOM structure.

## 2026-05-28 - State-aware ARIA updates for interactive toggles
**Learning:** Icon-only toggles (like chatbots) require their ARIA labels and titles to be programmatically updated during state transitions to remain accessible.
**Action:** Ensure JavaScript handlers for visibility toggles use setAttribute('aria-label', ...) to reflect the current action (Open vs Close) to screen reader users.
