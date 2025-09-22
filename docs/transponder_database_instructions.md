# KCH Interactive Key Chip Database — Cursor Build Guide (Protected Paid/Trial Access)

This file (`CURSOR_TASKS.md`) provides a **single continuous set of instructions** for Cursor AI to build the KCH Interactive Key Chip Database. Cursor must generate the necessary code and components exactly as described. **No secrets or credentials should ever be embedded** in this file.

---

## 1. Objective

- Build a **protected, interactive database** for KCH users to look up automotive key chip (transponder) data using the provided source file (`Transponder data.md`).
- The database must be:
  - Accessible only to **paying members** (role: `BASEUSER`) and trial users during an **active trial period**.
  - Copy-resistant (discourage bulk copying/export).
  - Fast, accurate, and simple to use.
  - Designed with an intuitive UI that eliminates confusion.

---

## 2. Roles & Access Control

The system currently uses these roles:
- `SUPER_ADMIN`
- `ADMIN`
- `BASEUSER` (Paying user)
- `GUEST` (Non-paying user)

### Rules
- Access to the KCH Key Chip Database is allowed only for:
  - `SUPER_ADMIN` and `ADMIN` (full access).
  - `BASEUSER` (paying subscribers).
  - Trial users flagged as active trial period.
- Access must be denied to:
  - `GUEST` (non-paying users).
  - Expired trial users.

### Enforcement
- Add access checks at three layers:
  - **Middleware** (Edge check).
  - **SSR Page Load** (server component guard).
  - **API Route** (server handler guard).

---

## 3. Data Source & Schema

- Source file: `Transponder data.md`.  
- Normalize into PostgreSQL schema:

  - `make`: id, name  
  - `model`: id, make_id → make, name  
  - `vehicle_range`: id, model_id, year_from, year_to  
  - `system_type`: id, name  
  - `transponder_family`: id, name  
  - `transponder_detail`: id, detail  
  - `cross_ref`: id, label  
  - `oem_key`: id, code  
  - `note`: id, text  
  - `entry`: fact table linking a vehicle_range to system, family, details, cross_refs, oem_keys, and notes  

- Indexing:
  - Full-text search indexes on family, details, cross_refs, OEM codes.
  - Trigram index for fuzzy matches on model and OEM codes.

---

## 4. Ingestion (ETL)

- Parse `Transponder data.md` into normalized tables.
- Handle open-ended ranges: “2018+” → `year_from=2018`, `year_to=NULL`.
- Split multi-value fields (e.g., `PCF7937E, NCF2951E`).
- Normalize synonyms (ID46/Hitag2, ID48/Megamos, etc.).
- Idempotent ETL: reruns must not duplicate data.
- Log ETL version and timestamp.

---

## 5. Search & Query

- Input options:
  - Dropdowns/typedown: Make, Model, Year.
  - Free-text: chip type, OEM code, cross-ref.
- Query logic:
  - Exact matches ranked higher than fuzzy matches.
  - Filter by year within vehicle_range.
- Performance:
  - Redis cache for hot queries (TTL 10–30m).
  - P95 < 500ms cold; < 150ms cached.

---

## 6. UI/UX Requirements

- Route: `/kch-db`.
- **Filters panel**:
  - Make (typeahead).
  - Model (filtered by make).
  - Year (dropdown or range).
  - Quick toggles: ID46, ID48, 4Dxx, AES, etc.
- **Search bar**:
  - Free-text input with autocomplete for OEM codes and transponder families.
- **Results grid** (virtualized):
  - Columns: System Type, Family, Details, Cross-Refs, OEM Keys, Notes.
  - Tooltips for acronyms (e.g., ID46 = Philips Crypto 2).
  - Expandable rows for extended notes/related vehicles.
- **Mobile UX**:
  - Collapsible filters, sticky search bar.
- **Onboarding**:
  - Guided hints with example queries on first visit.

---

## 7. API Endpoints

- `GET /api/kch/search`  
  Auth: `SUPER_ADMIN`, `ADMIN`, `BASEUSER`, active trial.  
  Params: `make`, `model`, `year`, `q`, `page`, `pageSize`.  
  Returns paged results.

- `GET /api/kch/entry/:id`  
  Auth: same as above.  
  Returns full entry detail.

- `POST /api/kch/etl/run`  
  Auth: `SUPER_ADMIN` and `ADMIN` only.  
  Runs ingestion job.

### All APIs:
- Must validate role and active subscription/trial.
- Must enforce rate limits.
- Must log usage without exposing secrets.

---

## 8. Copy-Resistance

- Disable text selection (`user-select: none`) in results.
- Intercept `copy`, `cut`, `print` keyboard events; show warning toast.
- Render sensitive values (chip IDs, OEM part numbers) using `<canvas>` or background-image sprites.
- Dynamic per-session watermark overlay: userId hash + timestamp.
- Prevent printing/export: CSS `@media print { content: "Protected KCH Resource"; }`.
- Honeypot fields in DOM for bot detection.
- Audit logs for copy attempts.

---

## 9. Monitoring & Logging

- Log:
  - Successful/failed access attempts.
  - Search queries (hashed user ID, no PII).
  - Anomalies (e.g., rapid/bulk queries).
- Monitor:
  - Query latency.
  - Cache hit ratios.
  - Unauthorized access attempts.
- Alerts on scraping indicators or abuse patterns.

---

## 10. Acceptance Criteria

- `/kch-db` is accessible only to `SUPER_ADMIN`, `ADMIN`, `BASEUSER`, and active trial users.
- Unauthorized roles (`GUEST`, expired trials) are blocked.
- Database is fully populated from `Transponder data.md`.
- Queries return accurate, fast results.
- UI is intuitive with filters, search, tooltips, onboarding.
- Copy resistance features are active.
- Logs and monitoring functional.
- Test plan confirms RBAC, accuracy, performance, and UX.

---

## 11. Work Plan for Cursor

1. Build normalized PostgreSQL schema for transponder data.
2. Implement ETL parser for `Transponder data.md`.
3. Add entitlement enforcement across middleware, SSR, API routes using current roles.
4. Implement `/kch-db` UI with filters, search, and results grid.
5. Build APIs for search, entry detail, ETL admin control.
6. Add copy-protection measures (canvas, watermark, blocked copy/print).
7. Integrate Redis cache for performance.
8. Add monitoring and logging (access, searches, anomalies).
9. Test against acceptance criteria.

---

**End of Instructions — Cursor, generate all required code following this guide.**
