# Code Review Guidelines

This document details the code review process and checklist for developers and reviewers on the AI Travel Planner project.

---

## Code Review Process

1. **Self-Review**: Authors must review their own Pull Request (PR) diffs before requesting a review. Remove debug prints, `console.log` statements, and unused imports/dependencies.
2. **Code Ownership**: Ensure the PR is assigned to the appropriate reviewer(s).
3. **Merging Requirements**:
   - The code must compile and pass all automated CI checks (linter, types, tests).
   - At least one approving review is required.
   - All discussion threads must be resolved or have a documented follow-up.

---

## Reviewer Checklist

### 1. General Architecture & Design
- **Single Responsibility**: Do modules, classes, and functions have a single responsibility?
- **Separation of Concerns**: Is business logic kept out of React components (moved to hooks/services) and FastAPI routers (moved to services/CRUD)?
- **Scalability**: Can new travel planning features (e.g. flight/hotel search, chat assistant) be added to these modules without major restructuring?

### 2. Python & FastAPI Backend
- **PEP 8**: Does the code follow Python formatting and styling guidelines?
- **Type Hinting**: Are all functions properly typed using PEP 484 type hints?
- **Schemas**: Are request parameters and response models validated using Pydantic schemas?
- **Database Safety**: 
  - Are database sessions handled via FastAPI dependency injection (`Depends`)?
  - Are database relationships and constraints declared correctly?
  - Are queries optimized to prevent N+1 query problems?
- **Error Handling**: Are errors caught and returned using appropriate `HTTPException` status codes (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`)?

### 3. React & TypeScript Frontend
- **Type Safety**: Are there any instances of `any`? If so, they must be refactored to specific interfaces or types.
- **Hooks & State**: Are custom hooks utilized for business logic and data fetching (TanStack Query)?
- **styling**: Are Tailwind CSS classes clean and responsive across standard screen widths?
- **Performance**: Are expensive computations optimized (e.g. using `useMemo` or `useCallback` where applicable)?

### 4. Security & Safety
- **Data Protection**: Ensure no sensitive variables, credentials, or keys are committed to Git or logged in plain text.
- **Input Sanitization**: Is user input properly validated on the backend? Do not trust client-side validation alone.
- **Access Control**: Are routes and endpoints protected with authentication decorators or dependencies where necessary?
