## 2026-10-22 - Form Label Associations in Monolithic Modals
**Learning:** In complex HTML modal forms with multiple tabs (like #empModal), omitting 'for' attributes on labels prevents screen readers from announcing field names on focus and prevents click-to-focus interactivity.
**Action:** Ensure all '<label>' elements explicitly specify a 'for' attribute matching the exact 'id' of their corresponding '<input>', '<select>', or '<textarea>' element.
