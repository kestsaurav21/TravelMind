# ENGINEERING_GUIDELINES.md

# Engineering Guidelines

Version: 1.0

---

# Purpose

This document defines the coding standards, architecture principles, naming conventions, folder structure, and development rules for the AI Travel Planner project.

The goal is to ensure consistency, maintainability, scalability, and readability throughout the codebase.

---

# General Principles

## Clean Code

* Write self-explanatory code.
* Prefer readability over cleverness.
* Keep functions focused on a single responsibility.
* Avoid duplicated logic.
* Refactor when necessary.

## SOLID Principles

* Single Responsibility Principle
* Open/Closed Principle
* Liskov Substitution Principle
* Interface Segregation Principle
* Dependency Inversion Principle

---

# Technology Standards

## Frontend

* React
* TypeScript
* Tailwind CSS
* TanStack Query
* React Router

## Backend

* Python (3.10+)
* FastAPI
* Pydantic
* Uvicorn

## Database

* PostgreSQL
* SQLAlchemy ORM (or SQLModel)
* Alembic (Migrations)

---

# TypeScript Rules

## Strict Mode

Must be enabled.

```json
{
  "strict": true
}
```

## Avoid

```ts
any
```

Use:

```ts
interface
type
generics
```

instead.

## Type Safety

All:

* API responses
* Request bodies
* Database models
* Utility functions

must be typed.

---

# Python Rules

## Type Hinting

All Python function signatures must use explicit PEP 484 type hints.

```python
def get_trip(db: Session, trip_id: UUID) -> Optional[Trip]:
    ...
```

## Virtual Environments

Always run the backend in a virtual environment (`.venv` or `env`). Do not install packages globally.

## Pydantic Validation

Always define Pydantic schemas for request bodies (`TripCreate`, `TripUpdate`) and response models (`TripOut`). Let FastAPI handle validation and serialization.

---

# Naming Conventions

## Variables

* **Frontend (TypeScript)**: Use camelCase (e.g., `tripBudget`, `destinationName`).
* **Backend (Python)**: Use snake_case (e.g., `trip_budget`, `destination_name`).

---

## Functions

* **Frontend (TypeScript)**: Use camelCase (e.g., `generateItinerary()`, `calculateTripBudget()`).
* **Backend (Python)**: Use snake_case (e.g., `generate_itinerary()`, `calculate_trip_budget()`).

---

## Classes & React Components

* **Frontend (TypeScript Components)**: Use PascalCase (e.g., `TripCard.tsx`, `BudgetSummary.tsx`).
* **Backend (Python Classes/Models/Schemas)**: Use PascalCase (e.g., `TripModel`, `TripCreateSchema`).

---

## Interfaces & Types

* **Frontend (TypeScript)**: Use PascalCase (e.g., `interface Trip`, `type TravelStyle`).

---

## Constants

* **Both**: Use UPPER_SNAKE_CASE (e.g., `MAX_TRIP_DAYS`, `DEFAULT_BUDGET`).

---

## Files

* **Frontend (TypeScript)**: Use kebab-case (e.g., `trip-service.ts`, `budget-utils.ts`).
* **Backend (Python)**: Use snake_case (e.g., `trip_service.py`, `budget_utils.py`).

---

# Frontend Guidelines

## Component Rules

Components should:

* Have a single responsibility.
* Remain reusable.
* Avoid business logic.

---

## Business Logic

Avoid:

```tsx
TripPage.tsx
```

containing large calculation logic.

Move logic into:

```ts
hooks/
services/
utils/
```

---

## Custom Hooks

Reusable logic should be extracted.

Example:

```ts
useTrips()
useWeather()
useGenerateItinerary()
```

---

## API Calls

Never call APIs directly inside UI components.

Use:

```text
services/
```

and

```text
TanStack Query
```

---

# Backend Architecture

Use a layered architecture.

```text
Router (Endpoints)
    ↓
Service Layer
    ↓
CRUD / Repository
    ↓
Database
```

---

## Routers (Endpoints)

Responsibilities:

* Define HTTP path operations (e.g. `@router.post("/")`)
* Validate input payloads via Pydantic schemas
* Handle API dependencies (e.g. database sessions, current user authentication)
* Return responses serialized via Pydantic response models

Routers must not contain business logic.

---

## Services

Responsibilities:

* Business logic (e.g., prompt engineering, budget estimations)
* Data transformation and third-party API orchestration (Gemini, Open-Meteo)

---

## CRUD (Repositories)

Responsibilities:

* Database queries and data persistence operations using SQLAlchemy sessions

CRUD methods should not contain business logic.

---

# API Standards

## Versioning

```text
/api/v1
```

Example:

```text
/api/v1/trips
/api/v1/auth
```

---

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# Database Standards

## Primary Keys

Use:

```text
UUID
```

for all entities.

---

## Audit Fields

Every table must contain:

```text
id
createdAt
updatedAt
```

---

## Soft Delete

Future support:

```text
deletedAt
```

where applicable.

---

# Security Standards

## Authentication

Use:

* JWT Access Token
* Refresh Token

---

## Passwords

Store only hashed passwords.

Use:

```text
bcrypt
```

---

## Validation

Validate all user input.

Never trust client-side validation.

---

## Environment Variables

Never commit:

```text
.env
```

to Git.

---

# Logging

Log:

* Errors
* Warnings
* External API failures

Avoid logging:

* Passwords
* Tokens
* Sensitive user data

---

# Git Workflow

## Branch Naming

Feature:

```text
feature/trip-planner
```

Bug Fix:

```text
fix/weather-api
```

Refactor:

```text
refactor/auth-module
```

Documentation:

```text
docs/prd-update
```

---

## Commit Messages

Format:

```text
feat: add itinerary generation

fix: resolve weather api issue

refactor: simplify trip service

docs: update architecture document
```

---

# Code Review Checklist

Before merging:

* Code builds successfully
* No TypeScript or Python type/linting errors
* No unused code or imports
* No debug prints/console logs
* Proper error handling (HTTPException in Python, error boundary in React)
* Types and schemas are defined
* Tests pass

---

# Scalability Rules

* Keep modules independent.
* Minimize coupling between features.
* Prefer composition over inheritance.
* Design APIs with future expansion in mind.
* Keep AI functionality isolated in dedicated services.

---

# Future Architecture Goals

The application should support future additions without major refactoring:

* AI Chat Assistant
* Hotel Recommendation Engine
* Flight Search
* Train Search
* RAG Knowledge Base
* Mobile Application
* Team Trip Planning

The architecture should remain modular and scalable as these features are introduced.
