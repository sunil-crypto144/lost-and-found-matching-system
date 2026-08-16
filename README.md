# Lost & Found Matching System

A full-stack, production-ready **Lost & Found Matching System** web application featuring an explainable multi-attribute AI matching engine, frictionless public guest reporting, administrative lifecycle management, and automated test suites.

---

## 🎥 Demo Video & Walkthrough

Watch the complete 5-minute video demonstration covering problem motivation, system architecture, public guest reporting, explainable score breakdown modals, and admin retrieval resolution:

▶️ **[Click Here to Watch the Demo Video](DEMO/2026-08-16-12-08-54.mov)** *(Plays directly in GitHub)*

- **Presentation Script**: [docs/video_script.md](docs/video_script.md)
- **Interactive Slide Deck**: [docs/presentation_deck.html](docs/presentation_deck.html)

---

## 🌟 Key Features

- **Frictionless Public Reporting**: Anyone can report a lost or found item in 30 seconds without mandatory registration. Captures full reporter contact details (Name, Email, Phone).
- **Explainable Multi-Factor AI Engine 2.0**:
  - Deterministic mathematical scoring across 7 structured attributes: Location Proximity (20%), Category Taxonomy (15%), Brand & Model NLP (15%), Title Similarity (15%), Date/Time Delta (15%), Color Correlation (10%), and Semantic Description (10%).
  - Bonus Perceptual Image Hashing (`aHash`) for visual image similarity.
  - Transparent match explanation modals detailing plain-language reasons and percentage factor breakdown bars.
- **Match Lifecycle & Retrieval Workflow**:
  - Match states: `SUGGESTED` ➔ `ACCEPTED` ➔ `RESOLVED` (or `REJECTED`).
  - **"Mark as Collected & Retrieved"**: When the owner collects the item, matches are archived into a dedicated **Successfully Found & Retrieved Archive** with full contact records of who lost it and who found it (protected for Admin access).
  - Public live statistics counter celebrating retrieved items on the home page.
- **Administrator Control Panel**:
  - Real-time submission directory with instant search and category/type/status filters.
  - Match stream monitoring and confirmation/resolution controls.
  - User management and report moderation (deletion of inappropriate listings).
- **Automated QA & Test Automation**:
  - 16 automated `pytest` unit & API integration tests covering normal paths, edge cases, and invalid inputs.
  - Test suite resilience validation covering error detection and boundary conditions.
  - Playwright E2E browser automation suite.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.12, FastAPI (REST API), SQLAlchemy ORM, SQLite (absolute path configuration), Pydantic v2 validation, Bcrypt & PyJWT security.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Custom Dark Glassmorphic Design System), Lucide Icons, React Router v6, Axios.
- **Testing**: `pytest`, `httpx`, `@playwright/test`.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.10+** (with pip)
- **Node.js 18+** & npm

---

### Step 1: Clone Repository & Setup Backend

```bash
cd backend
python -m pip install -r requirements.txt
python seed.py
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Step 2: Setup and Launch Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```
- **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Credentials Directory

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Administrator** | `sunil.reddyk06@gmail.com` | `prabhasstar01` | Full Admin Control Panel & Retrieved Archive |
| **System Admin** | `admin@lostfound.com` | `Password123!` | Full Admin Control Panel & Retrieved Archive |
| **Public User** | *No login needed* | *No login needed* | Report Lost/Found, View How It Works, Check Live Stats |

---

## 🧪 Running Automated Tests

### 1. Run Backend Unit & Integration Tests (16 Tests)
```bash
cd backend
python -m pytest tests -v
```

### 2. Run Playwright E2E Browser Automation Tests
```bash
cd e2e
npm install
npx playwright test
```

---

## 📑 Project Documentation Index

- [Architecture Document](docs/architecture.md) — System components, data flow diagram, and technology rationale.
- [Design Document](docs/design.md) — Data models, scoring formulas, API endpoints, and error handling.
- [User Guide](docs/user-guide.md) — Step-by-step user guide for public reporting, explainable score reading, and admin moderation.
- [Test Suite & Red Run Documentation](docs/deliberate-red-test.md) — Verification of test suite failure detection and edge-case resilience.
- [Engineering Change Log](docs/ai-change-log.md) — Feature evolution, database synchronization, and route optimization.
- [Presentation Deck](docs/presentation_deck.html) — Interactive slide deck covering problem, architecture, matching engine, and QA results.
- [Demo Video](DEMO/2026-08-16-12-08-54.mov) — 5-minute video walkthrough in DEMO folder.
