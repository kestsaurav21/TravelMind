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

FastAPI Router

↓

Service Layer

↓

CRUD / Repository Layer

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

Layered Architecture (FastAPI standards)

---

# Backend Folder Structure

```text
app/

├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── trips.py
│   │   │   ├── itinerary.py
│   │   │   ├── weather.py
│   │   │   └── maps.py
│   │   └── api.py
│
├── core/
│   ├── config.py
│   ├── security.py
│   └── database.py
│
├── crud/
│   ├── crud_user.py
│   ├── crud_trip.py
│   └── ...
│
├── models/
│   ├── user.py
│   ├── trip.py
│   └── ...
│
├── schemas/
│   ├── user.py
│   ├── trip.py
│   └── ...
│
├── services/
│   ├── ai.py
│   ├── weather.py
│   ├── maps.py
│   └── ...
│
└── main.py
```

---

# Domain Structure

Each domain model has its components defined in their respective directories:

- **Router**: `app/api/v1/endpoints/trips.py`
- **CRUD Operations**: `app/crud/crud_trip.py`
- **SQLAlchemy Model**: `app/models/trip.py`
- **Pydantic Schemas / DTOs**: `app/schemas/trip.py`
- **Business Logic Services**: `app/services/trip_service.py`

---

# Layer Responsibilities

## Router Layer (Endpoints)

Responsibilities:

* Receive HTTP requests
* Define path operations and request query/path parameters
* Call services or CRUD layers
* Return responses serialized via Pydantic schemas

Should NOT:

* Perform direct database access (queries/inserts) without using database session dependency

---

## Service Layer

Responsibilities:

* Complex business logic (e.g. AI prompt generation, weather data integration)
* Orchestrating third-party APIs
* Data transformation

---

## CRUD / Repository Layer

Responsibilities:

* Database access
* Standard create, read, update, delete operations using SQLAlchemy session

Should NOT:

* Contain domain-specific business logic

---

# AI Architecture

Create a dedicated AI module inside the services layer. *(Note: For the MVP, this module will make raw SDK calls directly to the Gemini API. LangChain & RAG will be deferred to V2 future extensions).*

```text
app/services/ai/

├── ai_service.py
├── prompt_builder.py
├── itinerary_generator.py
├── budget_generator.py
└── schemas.py
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

Dedicated Weather Module in Services/Endpoints

```text
app/services/weather/

├── weather_service.py
├── weather_provider.py
└── schemas.py
```

Provider handles:

* Open-Meteo API
* Data mapping
* Error handling

---

# Map Architecture

Dedicated Maps Module in Services/Endpoints

```text
app/services/maps/

├── maps_service.py
├── maps_provider.py
└── schemas.py
```

Responsibilities:

* Geocoding
* Destination lookup
* Attraction lookup

---

# Database Access

Use SQLAlchemy ORM & Alembic Migrations

Application

↓

CRUD Layer

↓

SQLAlchemy Session

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
