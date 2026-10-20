# Palette Journal

## 2026-10-20 - Password Visibility Toggle with ARIA Attributes
**Learning:** In authentication and user forms, masking passwords by default protects privacy, but providing an accessible inline visibility toggle button (`👁️`/`🙈`) with dynamic `aria-label` ("Show password" / "Hide password") improves usability for users verifying complex inputs while preserving screen reader accessibility.
**Action:** When adding password inputs, wrap them in `.password-wrapper`, ensure `type="button"` on the toggle button so form submission on Enter is not interrupted, and dynamically update `aria-label` and `title` on state toggles.
