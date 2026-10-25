## 2025-05-20 - Standardizing List Empty States and Hiding Decorative Emojis
**Learning:** Decorative emojis in empty state containers (e.g., 👤, 🔍, 🏖️, 📁, 📍) can cause screen readers to announce meaningless or repetitive symbol names before the descriptive message. Furthermore, inconsistent plain-text empty messages degrade the overall visual hierarchy and user experience across lists.
**Action:** Always wrap empty state emoji icons in `<span aria-hidden="true">` and utilize the consistent `.empty-state` styling component across all dynamic list rendering functions.
