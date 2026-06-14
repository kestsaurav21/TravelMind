# ARCHITECTURE.md

# AI Travel Planner Architecture

Version: 1.0

---

# Architecture Goals

The architecture should be:

* Scalable
* Modular
* Maintainable
* Testable
* Feature-Oriented
* Easy to Extend

Future features should be added without major refactoring.

Examples:

* AI Chat Assistant
* Flight Search
* Hotel Recommendations
* RAG Knowledge Base
* Team Trip Planning
* Mobile Application

---

# High-Level System Architecture

User

↓

React Frontend

↓

Express API

↓

Service Layer

↓

Repository Layer

↓

PostgreSQL

↓

External Services

* Gemini AI
* Open-Meteo
* OpenStreetMap

---

# Frontend Architecture

Pattern:

Feature-Based Architecture

---

# Frontend Folder Structure

```text
src/

├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── features/
│   ├── auth/
│   ├── trips/
│   ├── itinerary/
│   ├── weather/
│   ├── maps/
│   └── profile/
│
├── components/
│   ├── ui/
│   ├── shared/
│
├── hooks/
│
├── services/
│
├── lib/
│
├── types/
│
├── utils/
│
└── pages/
```

---

# Frontend Layer Responsibilities

## Pages

Responsibilities:

* Route-level screens
* Page composition

Example:

```text
pages/
├── home-page.tsx
├── trip-details-page.tsx
└── create-trip-page.tsx
```

---

## Features

Each feature owns:

* Components
* Hooks
* Services
* Types

Example:

```text
features/
└── trips/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── utils/
```

---

## Shared Components

Reusable UI components.

Example:

```text
Button
Input
Modal
Card
Loader
```

---

# Backend Architecture

Pattern:

Layered Modular Architecture

---

# Backend Folder Structure

```text
src/

├── modules/
│   ├── auth/
│   ├── users/
│   ├── trips/
│   ├── itinerary/
│   ├── weather/
│   └── maps/
│
├── shared/
│   ├── middleware/
│   ├── errors/
│   ├── logger/
│   ├── validators/
│   └── utils/
│
├── config/
│
├── prisma/
│
└── server.ts
```

---

# Module Structure

Each module contains:

```text
trips/

├── trip.controller.ts
├── trip.service.ts
├── trip.repository.ts
├── trip.routes.ts
├── trip.validator.ts
├── trip.types.ts
└── trip.dto.ts
```

---

# Layer Responsibilities

## Controller Layer

Responsibilities:

* Receive requests
* Validate request payload
* Return responses

Should NOT:

* Access database directly
* Contain business logic

---

## Service Layer

Responsibilities:

* Business logic
* AI orchestration
* External API integration
* Data transformation

Should NOT:

* Directly communicate with HTTP requests

---

## Repository Layer

Responsibilities:

* Database access
* CRUD operations

Should NOT:

* Contain business logic

---

# AI Architecture

Create a dedicated AI module. *(Note: For the MVP, this module will make raw SDK calls directly to the Gemini API. LangChain & RAG will be deferred to V2 future extensions).*

```text
modules/

ai/

├── ai.service.ts
├── prompt-builder.ts
├── itinerary-generator.ts
├── budget-generator.ts
└── ai.types.ts
```

---

# AI Workflow

User Creates Trip

↓

Trip Service

↓

AI Service

↓

Gemini API

↓

Structured JSON Response

↓

Database

↓

Frontend

---

# Weather Architecture

Dedicated Weather Module

```text
modules/

weather/

├── weather.controller.ts
├── weather.service.ts
├── weather.provider.ts
└── weather.types.ts
```

Provider handles:

* Open-Meteo API
* Data mapping
* Error handling

---

# Map Architecture

Dedicated Maps Module

```text
modules/

maps/

├── maps.controller.ts
├── maps.service.ts
├── maps.provider.ts
└── maps.types.ts
```

Responsibilities:

* Geocoding
* Destination lookup
* Attraction lookup

---

# Database Access

Use Prisma ORM

Application

↓

Repository

↓

Prisma Client

↓

PostgreSQL

---

# API Architecture

Base URL

```text
/api/v1
```

Routes

```text
/api/v1/auth
/api/v1/users
/api/v1/trips
/api/v1/itineraries
/api/v1/weather
/api/v1/maps
```

---

# Error Handling Strategy

Global Error Handler

```text
AppError
ValidationError
AuthenticationError
NotFoundError
```

All errors should return:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# Future Architecture Extensions

Planned modules:

```text
modules/

flights/
hotels/
recommendations/
chat/
rag/
notifications/
```

*(Note: The `chat` and `rag` modules will integrate LangChain and RAG technologies when introduced in V2).*

No existing module should require major restructuring when these are added.

---

# Architecture Principles

* Feature-first organization
* Separation of concerns
* Single responsibility
* Reusable modules
* Strong typing
* API-first development
* Scalable folder structure
* Future-ready AI integration

```
```
