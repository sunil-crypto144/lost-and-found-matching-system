# Lost & Found Matching System - Design Document

## 1. Data Model Schema Design

### `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Unique user identifier |
| `name` | String(100) | Not Null | User full name |
| `email` | String(255) | Unique, Indexed, Not Null | Unique login email |
| `password_hash` | String(255) | Not Null | Bcrypt hashed password |
| `role` | Enum | Default 'USER' | Role: USER or ADMIN |
| `created_at` | DateTime | Default UTC | Account creation timestamp |

### `items` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Unique item identifier |
| `user_id` | Integer | FK -> users.id | Reporting user |
| `type` | Enum | Indexed, Not Null | Item type: LOST or FOUND |
| `name` | String(200) | Indexed, Not Null | Item name |
| `category` | String(100) | Indexed, Not Null | Category classification |
| `brand` | String(100) | Nullable | Manufacturer brand |
| `color` | String(100) | Nullable | Primary color |
| `description` | Text | Not Null | Detailed description |
| `location` | String(255) | Not Null | Location area |
| `event_date` | String(50) | Not Null | Date lost/found (YYYY-MM-DD) |
| `image_url` | String(500) | Nullable | Uploaded image static URL |
| `status` | Enum | Default 'OPEN' | Status: OPEN, MATCHED, RESOLVED |

### `matches` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Unique match identifier |
| `lost_item_id` | Integer | FK -> items.id | Foreign key to lost item |
| `found_item_id` | Integer | FK -> items.id | Foreign key to found item |
| `match_score` | Float | Not Null | Calculated score (0.0 - 100.0) |
| `status` | Enum | Default 'SUGGESTED' | State: SUGGESTED, ACCEPTED, REJECTED |
| `confirmed_by` | Integer | FK -> users.id, Nullable | User who confirmed match |
| `confirmed_at` | DateTime | Nullable | Confirmation timestamp |

### `match_factors` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | PK, Auto Increment | Unique factor identifier |
| `match_id` | Integer | FK -> matches.id, Unique | Foreign key to match |
| `category_score` | Float | Not Null | Category similarity score |
| `item_score` | Float | Not Null | Title text similarity score |
| `brand_score` | Float | Not Null | Brand similarity score |
| `color_score` | Float | Not Null | Color similarity score |
| `location_score` | Float | Not Null | Location similarity score |
| `time_score` | Float | Not Null | Date/time proximity score |
| `description_score` | Float | Not Null | Description similarity score |
| `image_score` | Float | Default 0.0 | Visual image similarity score |

---

## 2. API Contract Design

### Authentication Endpoints
- `POST /api/v1/auth/register`: Register new user account.
- `POST /api/v1/auth/login`: Authenticate email/password, returns JWT token.
- `GET /api/v1/auth/me`: Get current user profile.

### Item Management Endpoints
- `POST /api/v1/items/lost`: Submit lost report + trigger auto matching.
- `POST /api/v1/items/found`: Submit found report + trigger auto matching.
- `GET /api/v1/items`: Search and filter items with query parameters.
- `GET /api/v1/items/my`: List items owned by current user.
- `GET /api/v1/items/{id}`: Get item details by ID.

### Matching Endpoints
- `GET /api/v1/matches`: Retrieve potential matches for authenticated user.
- `GET /api/v1/matches/{id}`: Retrieve single match detail with score breakdown.
- `POST /api/v1/matches/{id}/confirm`: Confirm match (requires item ownership or admin).
- `POST /api/v1/matches/{id}/reject`: Reject suggested match recommendation.

### Admin Endpoints
- `GET /api/v1/admin/stats`: Get dashboard statistics overview.
- `GET /api/v1/admin/reports`: List all reports for moderation.
- `DELETE /api/v1/admin/reports/{id}`: Delete inappropriate report listing.
- `GET /api/v1/admin/users`: List all registered system users.
- `GET /api/v1/admin/matches`: System-wide match monitoring stream.

---

## 3. Matching Algorithm Mathematics

The overall match score $S$ is calculated as the weighted sum of individual factor scores $s_i$:

$$S = \frac{\sum_{i=1}^{n} w_i \cdot s_i}{\sum_{i=1}^{n} w_i}$$

Where factor weights $w_i$ are configured as:
- $w_{\text{location}} = 0.20$ (Location similarity)
- $w_{\text{category}} = 0.15$ (Category classification)
- $w_{\text{item}} = 0.15$ (Item title similarity)
- $w_{\text{brand}} = 0.15$ (Brand matching)
- $w_{\text{time}} = 0.15$ (Date proximity)
- $w_{\text{color}} = 0.10$ (Color matching)
- $w_{\text{description}} = 0.10$ (Semantic TF-IDF similarity)

### Threshold Classification
- **$80.0 \le S \le 100.0$**: Strong Match
- **$60.0 \le S \le 79.9$**: Possible Match
- **$40.0 \le S \le 59.9$**: Weak Match
- **$S < 40.0$**: Filtered out (Do not recommend)
