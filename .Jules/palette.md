# Palette's Journal - Critical UX & Accessibility Learnings

## 2024-10-11 - ARIA Labels on Icon-Only Buttons
**Learning:** Icon-only buttons (such as modal close '✕', theme toggle '🌙', window open '⧉', refresh '↺', leave approve '✓', and photo remove '✕') lack screen reader accessible names unless explicitly given `aria-label` and `title` attributes.
**Action:** Always include both `aria-label` and `title` on all icon-only buttons in both static HTML markup and dynamic JS template strings.
