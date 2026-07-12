## 2026-07-12 - [Input Field Actions]
**Learning:** When adding internal action buttons (like 'Clear' or 'Show Password') to an input field, the input's `padding` must be explicitly adjusted on the corresponding side to prevent text from overlapping with the absolute-positioned button.
**Action:** Always verify text overflow and increase `padding-right` or `padding-left` by at least 1.5rem-2rem when embedding icons/buttons inside inputs.
