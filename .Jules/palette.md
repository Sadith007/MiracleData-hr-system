## 2025-05-18 - Table Column Scope and Icon Button ARIA Attributes
**Learning:** Tables dynamically rendered via JS string templates and static modal headers often omit explicit `scope="col"` on `<th>` elements and `aria-label` on icon-only buttons (such as '↺' or '✕'), preventing screen readers from contextually announcing column data and button actions.
**Action:** Always ensure all `<th>` tags in static HTML and JS template string renders include `scope="col"`, and all icon-only control buttons carry concise, descriptive `aria-label` attributes.
