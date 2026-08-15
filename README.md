# Lost & Found Matching System
> **AI-Powered QA Automation, Documentation & Software Engineering Assessment**  
> *Internship Hiring Assessment — Tactive*

A full-stack, production-quality **Lost & Found Matching System** web application featuring a deterministic, explainable multi-attribute matching engine, frictionless public reporting, administrative lifecycle control, and automated QA test suites.

---

## 🌟 Key Features & Capabilities

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
  - Documented **Deliberate Red Test Run** verifying failure detection.
  - Playwright E2E browser automation suite.

---

## 🛠️ Technology Stack & Architecture

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

## 🧪 Running Automated QA Tests

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

## 📑 Assessment Deliverables Index

All 6 assessment deliverables are organized and documented:

1. **Source Code & Working App**: `backend/` and `frontend/` (Instructions above).
2. **Test Suite & Deliberate Red Run**: [docs/deliberate-red-test.md](docs/deliberate-red-test.md) (Log evidence of intentional bug injection and test failure detection).
3. **AI Change-Loop Evidence Log**: [docs/ai-change-log.md](docs/ai-change-log.md) (Step-by-step prompt loop, failures, self-corrections, and attempt logs).
4. **Core Technical Documentation**:
   - [Architecture Document](docs/architecture.md) — System components, data flow diagram, and technology rationale.
   - [Design Document](docs/design.md) — Data models, scoring formulas, API endpoints, and error handling.
   - [User Guide](docs/user-guide.md) — Step-by-step non-technical walkthrough.
5. **Presentation Deck**: [docs/presentation_deck.html](docs/presentation_deck.html) (Interactive browser presentation deck with speaker notes).
6. **Video Recording Demo Script**: [docs/video_script.md](docs/video_script.md) (Structured 5-minute recording guide: 2 min problem/architecture + 3 min live demo walkthrough).
