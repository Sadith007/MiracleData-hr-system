## 2025-10-07 - Accessible Label Association for Select Dropdowns in Tabbed Modals
**Learning:** Select dropdowns inside tabbed modal dialogs (like `#lvBalEmpSel` in `#lvBalances`) often lack explicit `aria-label` or `<label>` wrappers, causing screen reader users to miss context when switching tabs.
**Action:** Ensure every `<select>` element without a visual `<label>` includes explicit `aria-label` and `title` attributes describing its purpose.
