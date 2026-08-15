# Engineering Change Log & Iteration History
> **System Evolution, Refactoring & Feature Development Log**

---

## 1. Overview & Objective

This log provides a record of major feature additions, architectural refactorings, database synchronizations, and defect resolution cycles across the development lifecycle of the **Lost & Found Matching System**.

---

## 2. Feature Milestone 1: Transitioning to Frictionless Public Reporting

### A. Requirement
Enable public visitors to submit lost and found reports in 30 seconds without mandatory authentication, capturing direct reporter contact information (Full Name, Email/Phone) to streamline item recovery.

### B. Architectural Changes
1. **Database Schema (`db_models.py`)**:
   - Made `user_id` nullable (`nullable=True`).
   - Added `reporter_name` (VARCHAR 100) and `reporter_contact` (VARCHAR 255) to the `Item` model.
2. **Pydantic Schemas (`schemas.py`)**:
   - Added `reporter_name` and `reporter_contact` to `ItemCreate` and `ItemOut`.
   - Added `ReportSubmissionResult` schema returning the created item + instant candidate matches.
3. **API Endpoints (`items.py`)**:
   - Removed mandatory `current_user` JWT dependency on `POST /items/lost` and `POST /items/found`.
   - Form parameters now accept `reporter_name` and `reporter_contact`.
4. **Frontend Forms & Navigation**:
   - Updated `ReportLost.tsx` and `ReportFound.tsx` with contact input fields and instant match result rendering.
   - Updated `Navbar.tsx` to expose public reporting buttons.

### C. Defect Detection & Resolution
1. **SQLite Column Missing Error**:
   - **Log Output**: `sqlalchemy.exc.OperationalError: table items has no column named reporter_name`.
   - **Cause**: Existing SQLite database file `lost_found.db` had been initialized with the old schema before the new columns were added.
2. **Database Working Directory Desynchronization**:
   - **Diagnosis**: Relative path `"sqlite:///./lost_found.db"` created two separate database files depending on the working directory (`backend/` vs root repository).
   - **Fix**: Configured absolute database URL in `config.py` referencing `backend/lost_found.db`.
3. **Test Suite Verification**:
   - Updated `test_items.py` and `test_matches.py` to test unauthenticated public submissions.
   - Ran `pytest`: **16/16 Tests PASSED**.

---

## 3. Feature Milestone 2: Item Retrieval Lifecycle ("Successfully Found & Retrieved")

### A. Requirement
When an owner collects their item from the finder, provide a mechanism to mark the match as `RESOLVED`, cross out the active listings, and archive the complete paired records of who lost it and who found it.

### B. Architectural Changes
1. **Backend Endpoint (`matches.py`)**:
   - Added `POST /api/v1/matches/{id}/resolve` endpoint to mark match as `RESOLVED`, set both `lost_item` and `found_item` to `RESOLVED`, and record `confirmed_at` timestamp.
   - Added `GET /api/v1/matches/resolved` to fetch all successfully retrieved matches.
2. **Frontend Service (`api.ts`)**:
   - Added `resolveMatch(id)` and `getResolvedRetrievals()`.
3. **New UI Page (`RetrievedItems.tsx`)**:
   - Built side-by-side comparison cards displaying full details of:
     - Person who lost it (Name, Contact, Date, Location, Description).
     - Person who found it (Name, Contact, Date, Location, Description).
     - Match Score breakdown & Verified Collection Stamp.
4. **Admin Actions & Status Filtering**:
   - Added "Mark as Collected & Retrieved" button to confirmed matches.
   - Struck through retrieved items (`line-through` with `✓ RETRIEVED` badge) on the active report table.

### C. Defect Detection & Resolution
1. **FastAPI Route Order Collision (HTTP 422 Error)**:
   - **Log Output**: `GET /api/v1/matches/resolved HTTP/1.1 422 Unprocessable Entity`.
   - **Cause**: FastAPI matched `/resolved` against `/{match_id: int}` because the parameterized route was declared above `/resolved`.
   - **Fix**: Reordered routes in `matches.py`, placing `/resolved` before `/{match_id}`.
2. **Admin Redirection on Login**:
   - **Fix**: Updated `AuthContext.tsx` and `Login.tsx` to inspect `user.role === 'ADMIN'` and redirect admins directly to `/admin`.

---

## 4. Feature Milestone 3: Privacy Isolation & Public Live Counter

### A. Requirement
Ensure sensitive personal contact records (names, phone numbers, emails) are only accessible to administrators, while public visitors see the real-time count of successfully retrieved items.

### B. Architectural Changes
1. **Privacy Protection**:
   - Protected `/retrieved` under `ProtectedRoute adminOnly`.
   - Removed "Retrieved Archive" link from public navbar; only rendered when Admin is authenticated.
2. **Public Live Reunion Counter (`Landing.tsx`)**:
   - Updated stats bar on the home page to fetch real-time count of resolved items (`status === 'RESOLVED'`) and display it in the public **"Successfully Retrieved & Returned"** card.

---

## 5. Engineering Quality Summary

| Metric | Result |
|---|---|
| **Backend Unit & Integration Tests** | **16 / 16 Passed (100%)** |
| **Frontend Production Build** | **0 Errors, Clean Bundle** |
| **Security & Access Control** | **Bcrypt Hashing, Role-Based Access Control, Privacy Isolation** |
