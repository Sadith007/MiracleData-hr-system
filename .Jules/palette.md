## 2025-05-15 - Standardizing Empty States
**Learning:** Decorative elements (such as emojis) within '.empty-state' containers should use 'aria-hidden="true"' to prevent them from being announced by screen readers, as the text description already provides the necessary context. Standardizing these states improves visual consistency and helps users quickly identify when a list is empty.
**Action:** Always wrap decorative icons/emojis in 'span aria-hidden="true"' and use the established '.empty-state' class for all empty list views.
