## 2025-05-18 - Inline Quick-Copy Action Buttons in Data Cards
**Learning:** In data-dense detail views (like employee profiles), users frequently need to extract single fields (Email, Phone, Employee ID) without selecting text manually. Adding inline, accessible micro-copy buttons (`📋`) with custom toast feedback improves user workflow efficiency.
**Action:** Use `.btn-copy-sm` with `aria-label` and `copyToClipboard(text, msg)` for key identifier fields across card and detail views.
