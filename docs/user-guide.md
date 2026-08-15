# Lost & Found Matching System - User Guide

Welcome to the **Lost & Found Matching System**. This guide walks you through registering an account, submitting reports, searching items, reviewing explainable match scores, and confirming matches.

---

## 1. Getting Started & Authentication

### 1.1 Registering a New Account
1. Open the application homepage at `http://localhost:3000`.
2. Click **Get Started** in the top navigation bar.
3. Fill in your **Full Name**, **Email Address**, and a secure **Password** (minimum 6 characters).
4. Click **Register**. You will be automatically logged in and taken to your personal Dashboard.

### 1.2 Demo Accounts
If you are testing the system with pre-loaded demo data, use these credentials:

* **User (Alice)**: `alice@example.com` / `Password123!`
* **User (Bob)**: `bob@example.com` / `Password123!`
* **Admin**: `admin@lostfound.com` / `Password123!`

---

## 2. Reporting a Lost Item

1. Click **Lost Item** or navigate to **Report Lost** from your Dashboard.
2. Enter the **Item Name** (e.g. *"Black Samsung Galaxy S23 Ultra"*).
3. Select the appropriate **Category** (Electronics, Bags, Keys, Documents, etc.).
4. Optionally provide the **Brand** and **Color**.
5. Select the **Date Lost** and approximate **Time Lost**.
6. Enter the **Location Lost** (e.g. *"Central Park Library 2nd Floor"*).
7. Write a detailed **Description** noting distinguishing marks, cases, or contents.
8. Optionally upload an item photo (JPEG, PNG, WEBP, max 5MB).
9. Click **Submit Lost Item Report**. The system saves your report and instantly runs background matching against existing found reports.

---

## 3. Reporting a Found Item

1. Click **Found Item** or navigate to **Report Found**.
2. Enter the item details for the item you found.
3. Click **Submit Found Item Report**.
4. The matching engine compares your report against all active lost items in the database and generates potential match suggestions.

---

## 4. Reviewing Matches & Explainable Score Breakdowns

1. Go to your **User Dashboard** or click **Potential Matches**.
2. Each potential match card displays the overall **Match Score Percentage** (e.g. `91% Strong Match`).
3. Click **Explain Score** to open the explainability modal.
4. Review the breakdown showing exact score contributions for Location, Category, Brand, Color, Date Proximity, Description, and Visual Image Similarity.
5. Click **Confirm Match** if the suggested item is your lost/found belonging. The status updates to `ACCEPTED` and locks the item from duplicate matching.
6. Click **Reject** if the suggested match is incorrect.

---

## 5. Search and Filtering

1. Click **Search** in the navigation bar.
2. Type search terms into the query bar (e.g. *"Samsung"*, *"Backpack"*).
3. Filter by **Category**, **Report Type** (Lost vs Found), or **Location Area**.
4. Sort listings by **Newest First** or **Oldest First**.

---

## 6. Administrator Functions (Admins Only)

1. Log in with an administrator account (`admin@lostfound.com`).
2. Click **Admin** in the navigation bar to open the Admin Control Panel.
3. View global system statistics across users, lost reports, found reports, and confirmed matches.
4. Navigate to **Manage Reports** to inspect or delete inappropriate listings.
5. Navigate to **Manage Users** to inspect account registrations.
6. Navigate to **Match Monitoring** to view real-time similarity calculations.
