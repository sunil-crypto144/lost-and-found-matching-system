# Lost & Found Matching System - Architecture Document

## System Overview

The Lost & Found Matching System is structured as a decoupled full-stack web application consisting of a React + TypeScript single-page application (SPA), a FastAPI REST backend, a relational SQLite database, and an isolated deterministic matching engine service.

```
+-------------------------------------------------------------------+
|                        React SPA Frontend                         |
|      React Router v6 | Tailwind CSS | Lucide Icons | Axios       |
+---------------------------------+---------------------------------+
                                  | HTTP / JSON REST APIs
                                  v
+-------------------------------------------------------------------+
|                       FastAPI Backend Service                     |
|  +--------------------+  +--------------------+  +--------------+ |
|  | Auth & OAuth2 JWT  |  | Item Management    |  | Admin Router | |
|  +--------------------+  +--------------------+  +--------------+ |
+---------------------------------+---------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|  SQLAlchemy Database  |                   |    Matching Engine    |
| Users, Items, Matches |                   | Text & Image Scorer   |
+-----------------------+                   +-----------------------+
```

---

## 1. Core Architectural Components

### 1.1 Backend API Service (`FastAPI`)
- **FastAPI Layer**: Asynchronous REST API routing, dependency injection for DB sessions and JWT security context.
- **Data Models (`SQLAlchemy`)**: ORM mappings for `User`, `Item`, `Match`, and `MatchFactor`.
- **Validation Schemas (`Pydantic v2`)**: Strict request validation for forms, inputs, and response DTOs.
- **Security (`Bcrypt + PyJWT`)**: Native bcrypt password hashing and 7-day JWT bearer tokens.

### 1.2 Matching Engine Service (`app.services.matching`)
- **Deterministic Multi-Factor Scoring**:
  - Weight configuration stored in single settings module (`app.core.config`).
  - Factor evaluation: Location (20%), Category (15%), Item Name (15%), Brand (15%), Date/Time (15%), Color (10%), Description Semantic (10%).
- **Semantic Text Similarity (`app.services.text_similarity`)**:
  - Token set intersection cosine similarity blended with Levenshtein fuzzy string ratio.
- **Visual Image Similarity (`app.services.image_similarity`)**:
  - 64-bit average perceptual hashing (`aHash`) and Hamming distance visual scoring.
- **Explainability Generator**:
  - Produces plain-language natural language reasons explaining why two items match.

### 1.3 React SPA Frontend (`Vite + TypeScript`)
- **Client Architecture**: Clean component-page separation with `AuthContext` state management.
- **Styling**: Vanilla Tailwind CSS with custom glassmorphic utility classes (`glass-card`, `glass-input`).
- **Explainability Visualization**: Modal rendering individual factor score progress bars and matching reasons.

---

## 2. Data Flow Architecture

```
User submits Lost/Found Report
       |
       v
FastAPI /items/lost or /items/found
       |
       v
Database stores Item Record
       |
       v
Trigger run_auto_matching_for_item()
       |
       +---> Query candidate items of opposite type with OPEN status
       |
       +---> Compute factor scores (Category, Brand, Color, Location, Time, Description, Image)
       |
       +---> Compute weighted overall score
       |
       +---> If overall score >= 40.0:
                  Store Match & MatchFactor records in DB
       |
       v
User receives real-time match recommendations on Dashboard
```

---

## 3. Technology Choices & Justification

1. **FastAPI**: Extremely fast execution, automatic OpenAPI schema generation, Pydantic type safety.
2. **SQLite / SQLAlchemy**: Zero-configuration local database setup for immediate evaluation while remaining 100% abstract and PostgreSQL ready.
3. **React + TypeScript**: Strong client typing, modular component reuse, reactive state management.
4. **Tailwind CSS**: Modern visual polish, dark mode styling, glassmorphism UI aesthetics without heavy CSS frameworks.
