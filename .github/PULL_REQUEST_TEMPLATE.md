# Pull Request Template

## Description
Please include a summary of the changes and the related issue. Please also list any dependencies that are required for this change.

---

## Type of Change
Select the options that apply:
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactor / Documentation / Chore

---

## Verification Plan

### Automated Checks
- [ ] Backend: Code runs cleanly with no Pydantic validation/type hints errors
- [ ] Frontend: Code builds and typechecks without TypeScript errors

### Manual Verification
- Describe the steps you took to verify your changes (e.g. checked FastAPI `/docs` endpoint, validated React component responsiveness).

---

## Checklist
- [ ] My code follows the style guidelines of this project (PEP 8 for Python backend, ESLint/Prettier for React frontend).
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] My changes generate no new warnings or errors.
- [ ] I have updated the documentation accordingly.
