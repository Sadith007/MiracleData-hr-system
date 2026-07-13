## 2025-05-15 - Missing Label-Input Associations
**Learning:** Form labels in this application often lack the `for` attribute, which breaks the semantic link between the label and its input. This hinders screen reader accessibility and prevents users from focusing inputs by clicking their labels.
**Action:** Always check form groups for matching `id` and `for` attributes. When adding or auditing forms, ensure every `label` is explicitly linked to its corresponding `input` or `select` element.
