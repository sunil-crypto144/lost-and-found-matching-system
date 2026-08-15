# 5-Minute Video Presentation & Demo Script
> **Assessment Deliverable 6: Candidate Video Walkthrough Guide**  
> *Internship Hiring Assessment — Tactive (Total Time: Exactly 5:00 Minutes)*

---

## ⏱️ Video Structure Breakdown

| Segment | Timing | Topic | Visual on Screen |
|---|---|---|---|
| **Part 1: Problem & Motivation** | 0:00 – 1:00 (60s) | The Lost & Found Problem + Why Explainable AI | Slide Deck / Introduction |
| **Part 2: Architecture & Engineering** | 1:00 – 2:00 (60s) | 7-Factor Weighted Engine + AI Change Loop | Architecture Diagram |
| **Part 3: Live Public User Demo** | 2:00 – 3:30 (90s) | Public Zero-Signup Report + Instant Match & Explain Modal | Live Browser UI (`localhost:3000`) |
| **Part 4: Admin & Retrieval Demo** | 3:30 – 4:30 (60s) | Admin Moderation + Mark as Retrieved + Privacy Archive | Admin Portal (`/admin` & `/retrieved`) |
| **Part 5: QA Testing & Conclusion** | 4:30 – 5:00 (30s) | 16 Automated Tests + Deliberate Red Run + Wrap-up | Terminal (`pytest` running) |

---

## 🎙️ Spoken Script & Actions

### Part 1: Problem & Motivation (0:00 – 1:00)
> *"Hello everyone! My name is Sunil, and this is my submission for the Tactive Software Engineering and AI-Powered QA Assessment.
>
> Traditional lost and found systems fail for two major reasons: first, users are forced through tedious registration barriers just to report a lost item. Second, traditional keyword searches fail to capture real-world variances in locations, brand names, time windows, and descriptions.
>
> To solve this, I designed and built the **Lost & Found Matching System** — a full-stack web application powered by a deterministic, explainable multi-attribute matching engine."*

---

### Part 2: Architecture & Engineering (1:00 – 2:00)
> *"For the architecture, I chose **FastAPI with Python 3.12** on the backend for high performance and strict Pydantic validation, paired with a modern **React 18, TypeScript, and Tailwind CSS** frontend.
>
> The core technical innovation is our **Explainable Matching Engine**. Rather than using an opaque black box, it calculates calibrated weights across 7 attributes:
> - Location proximity (20%)
> - Category taxonomy (15%)
> - Brand & model entity NLP (15%)
> - Item title similarity (15%)
> - Date proximity with exponential decay (15%)
> - Color attribute correlation (10%)
> - Semantic TF-IDF description similarity (10%)
>
> Crucially, during this assessment, I executed three complete **AI feature change loops** — transitioning the system to public frictionless reporting, integrating database synchronization, and building an item retrieval lifecycle."*

---

### Part 3: Live Public User Demo (2:00 – 3:30)
*(Switch screen to browser at `http://localhost:3000`)*
> *"Let's see the application live.
> 
> As a public visitor on the landing page, notice that there is no login barrier. On the home page, we see real-time statistics, a 3-step workflow, and a link to the dedicated **'How It Works'** page with an interactive simulator.
>
> Let's report a lost item. I click **'Report Lost Item'**, enter my name 'Sunil', phone number, item 'Black Samsung Galaxy S23', category Electronics, location 'Central Park Library', and a description.
>
> When I hit submit — boom! The backend immediately creates the report, triggers the matching engine, and shows an instant **94% Strong Match** against an existing found phone.
>
> When I click **'Explain Score'**, it opens our transparent breakdown modal showing exactly how each factor scored: 100% on location, 100% on category, 100% on brand, and 88% on description semantics."*

---

### Part 4: Admin & Item Retrieval Lifecycle (3:30 – 4:30)
*(Click Admin Login -> Sign in with `sunil.reddyk06@gmail.com` / `prabhasstar01`)*
> *"Now let's log in as the Administrator.
>
> As Admin, I land directly on the **Administrator Control Panel**. Here we have a live directory of every report submitted across the system, with full reporter names, phone numbers, and emails.
>
> Under **Match Monitoring**, the Admin can review candidate matches. When the owner arrives and collects their item, the Admin clicks **'Mark as Collected & Retrieved'**.
>
> This instantly updates both reports to `RESOLVED`, crosses them out on the active listings, and archives them into the **'Successfully Found & Retrieved Archive'** — where the Admin can view permanent paired records of who lost it and who found it, while protecting user privacy from the public."*

---

### Part 5: Automated QA & Deliberate Red Test (4:30 – 5:00)
*(Switch screen to Terminal window)*
> *"Finally, let's look at quality assurance. We have a suite of **16 automated pytest unit and integration tests** covering normal paths, edge cases, and invalid inputs.
>
> Let's run `python -m pytest tests -v` — all 16 tests pass in under 5 seconds.
>
> Furthermore, as documented in `deliberate-red-test.md`, we proved test suite efficacy by deliberately breaking the scoring threshold in `matching.py`, capturing the exact test failure in red, and self-correcting it back to green.
>
> Thank you for reviewing my assessment submission!"*
