## 2025-03-24 - [Accidental ARIA label redundancy]
**Learning:** Adding `aria-label` to buttons that already have clear text content (like "Cancel" or "Close") is an anti-pattern because it replaces the accessible name for screen readers, potentially leading to confusion if the label differs from the visible text.
**Action:** Only apply `aria-label` to icon-only buttons or interactive elements where the visible text is missing or insufficient.
