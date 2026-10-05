## 2026-10-05 - Explicit Table Header Scopes (`scope="col"`)
**Learning:** Table header (`<th>`) elements in dynamic JS templates and static reports lacked `scope="col"` attributes. Without explicit column scopes, screen readers can struggle to associate table data cells (`<td>`) with their respective headers in multi-column payroll and report tables.
**Action:** Always include `scope="col"` on `<th>` elements when rendering data tables to ensure full screen reader accessibility.
