## 2026-05-19 - Centralized Modal Focus Management
**Learning:** In monolithic applications where modals are managed by a central `openModal` function, injecting focus logic directly into the utility ensures consistent accessibility across the entire platform. A 300ms delay is necessary to accommodate CSS transitions, preventing focus from being set before the element is visible.
**Action:** Always include focus management in modal utility functions, using a slight delay (e.g., 300ms) to sync with UI animations.
