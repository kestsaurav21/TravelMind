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

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

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

# Naming Conventions

## Variables

```ts
tripBudget
destinationName
```

Use:

```text
camelCase
```

---

## Functions

```ts
generateItinerary()
calculateTripBudget()
```

Use:

```text
camelCase
```

---

## React Components

```tsx
TripCard.tsx
BudgetSummary.tsx
```

Use:

```text
PascalCase
```

---

## Interfaces

```ts
interface Trip
interface User
```

Use:

```text
PascalCase
```

---

## Constants

```ts
MAX_TRIP_DAYS
DEFAULT_BUDGET
```

Use:

```text
UPPER_SNAKE_CASE
```

---

## Files

```text
trip-service.ts
budget-utils.ts
auth-controller.ts
```

Use:

```text
kebab-case
```

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
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

## Controllers

Responsibilities:

* Receive requests
* Validate inputs
* Return responses

Controllers must not contain business logic.

---

## Services

Responsibilities:

* Business logic
* Data transformation
* AI integration
* External API orchestration

---

## Repositories

Responsibilities:

* Database queries
* Data persistence

Repositories should not contain business logic.

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
* No TypeScript errors
* No unused code
* No console logs
* Proper error handling
* Types are defined
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
