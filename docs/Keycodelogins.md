# Admin-Only OEM Keycode Portals — Cursor Build Guide (RBAC: `super_admin` & `admin`)

This file (`CURSOR_TASKS.md`) is a single continuous Markdown document. It contains **all instructions** for Cursor AI to build the secure OEM Keycode Portal feature. There must be no code in this file. Cursor’s task is to read these instructions and generate the required code in the repository.

---

## 1. Objective

- Build a secure admin-only page at `/keycodes`.
- Display OEM keycode portals from a JSON config file (`config/keycode-portals.json`).
- Provide two actions for each OEM:
  - **Launch** → open OEM portal in a new tab.
  - **Copy Creds** → retrieve username/password from environment variables via API.
- Restrict access strictly to roles **`super_admin`** and **`admin`**.
- Store credentials only in **environment variables**.
- Never commit secrets into Git.
- Log access metadata (without secrets) for auditing.

---

## 2. Required Files & Structure

- `config/keycode-portals.json`  
  Contains metadata, OEM URLs, notes, env var key names. No plaintext credentials.
- `secrets.env.template`  
  Lists all env var keys with blank values. Real values only go in platform env manager.
- `app/(admin)/keycodes/page.tsx`  
  Server component. Checks RBAC, loads config, renders page shell.
- `app/(admin)/keycodes/ui/KeycodeGrid.tsx`  
  Client component. Renders OEM cards, triggers Copy Creds API calls.
- `app/api/keycodes/creds/route.ts`  
  API route. Validates role, checks origin, logs metadata, returns creds if allowed.
- `types/next-auth.d.ts`  
  Extend session typing with `super_admin | admin | user`.
- `lib/audit.ts` (optional)  
  Helper to log access events to console or DB.
- `prisma/schema.prisma` (optional)  
  DB model for persistent audit logging.
- `next.config.js`  
  Add security headers (CSP, XFO, Referrer Policy).
- `.env.local` (dev only)  
  Includes `NEXT_PUBLIC_APP_URL` and non-secret vars. Secrets live only in platform env.

---

## 3. Configuration

### 3.1 JSON Config Requirements (`config/keycode-portals.json`)

- Top-level object with:
  - `meta.vsp_id` = `"4E1B0D2W"`.
  - `manufacturers`: array of OEM objects.
- Each OEM object must include:
  - `id`: string identifier (e.g., `"lexus"`, `"mercedes_benz"`).
  - `name`: display name.
  - `portal_url`: OEM site URL. If empty, card is disabled.
  - `notes`: optional string.
  - `sdrm`: optional boolean.
  - `comingSoon`: optional boolean.
  - `auth.username_env` and `auth.password_env`: environment variable names.

### 3.2 Environment Variables (`secrets.env.template`)

- Template listing all required variables:
  - `KCH_ACURA_USER=`
  - `KCH_ACURA_PASS=`
  - `KCH_FORD_USER=`
  - `KCH_FORD_PASS=`
  - …repeat for each OEM.
- Real values must be provided only in deployment platform’s secrets manager.
- Also include:
  - `NEXT_PUBLIC_APP_URL=`
  - `KCH_VSP_ID=`

---

## 4. RBAC & Session Rules

- Only `super_admin` and `admin` roles can access `/keycodes` and API.
- Unauthorized users and unauthenticated sessions → redirect or 403.
- Extend NextAuth session typing to include roles: `super_admin | admin | user`.
- Ensure authentication implementation sets `session.user.role`.

---

## 5. Security Requirements

- Never embed secrets in code, JSON, or client.
- API route must:
  - Validate role.
  - Validate `Origin` matches `NEXT_PUBLIC_APP_URL`.
  - Read secrets only from env vars.
  - Log access events without secrets.
  - Optionally apply rate limiting (20 requests per 5 minutes per user/IP).
- Security headers in `next.config.js`:
  - CSP with `default-src 'self'`.
  - X-Frame-Options = `SAMEORIGIN`.
  - X-Content-Type-Options = `nosniff`.
  - Referrer-Policy = `strict-origin-when-cross-origin`.

---

## 6. UI Requirements

- Page route: `/keycodes`.
- Page header: “Keycode Portals”.
- Subheader: show `meta.vsp_id` from JSON.
- OEM cards:
  - Show OEM `name`.
  - Show `notes` if present.
  - Badges: `SDRM` if true, `Coming Soon` if true or URL missing.
  - Actions:
    - **Launch**: open `portal_url` in new tab with `noopener noreferrer`.
    - **Copy Creds**: call API and copy username/password bundle.
  - Show env var keys (`username_env` / `password_env`) for admin visibility, never values.
- Feedback messages:
  - Success: “Credentials copied to clipboard.”
  - Errors: 
    - 403: “You do not have access.”
    - 404: “Unknown OEM.”
    - 409: “Missing credentials. Update environment variables for this OEM.”
    - 429: “Rate limit. Try again later.”
    - Default: “Failed to copy credentials.”

---

## 7. API Contract

- Method: `POST`.
- Path: `/api/keycodes/creds`.
- Request body: `{ "oem": "<id>" }`.
- Behavior:
  - Verify user role.
  - Verify Origin.
  - Validate body.
  - Find OEM in config.
  - Resolve env var keys → load from `process.env`.
  - If missing → 409 error.
  - Log access metadata: timestamp, userId, role, oem, ip (no secrets).
  - Return `{ username, password }`.
- Possible responses:
  - 200: `{ username, password }`.
  - 400: `{ error: "Invalid body" }`.
  - 403: `{ error: "Forbidden" }` or `{ error: "Invalid origin" }`.
  - 404: `{ error: "Unknown OEM" }`.
  - 409: `{ error: "Missing credentials..." }`.
  - 429: `{ error: "Rate limit" }`.

---

## 8. Audit Logging

- Minimum: log to console each successful Copy Creds with timestamp, userId, role, oem, ip.
- Optional: Prisma `KeycodeAccessLog` model:
  - Fields: id, userId, role, oem, ip, createdAt.
- Implement `lib/audit.ts` helper to insert logs if DB used.
- Never log secrets.

---

## 9. Environment & Secrets

- All OEM-specific env vars must exist in platform.
- `NEXT_PUBLIC_APP_URL` must match actual site URL.
- Rotate credentials by updating env vars and redeploying.
- If OEMs share creds (e.g., Acura/Honda), set same values in their distinct env vars.

---

## 10. Test Plan

- RBAC:
  - Unauthenticated → denied.
  - `user` role → denied.
  - `admin` and `super_admin` → allowed.
- Grid renders all OEMs from config.
- Launch button opens correct URL in new tab.
- Copy Creds:
  - Returns creds when env vars exist.
  - Returns 409 if missing.
  - Returns 403 if unauthorized.
  - Returns 403 if origin mismatch.
  - Returns 429 if rate limited.
- Audit log entry created for successful Copy Creds (no secrets).

---

## 11. Definition of Done

- `/keycodes` exists and is accessible only to `super_admin` and `admin`.
- Config-driven OEM grid is displayed.
- Launch and Copy Creds actions work per requirements.
- Credentials are never embedded in code, JSON, or client bundle.
- API enforces RBAC, origin check, and optional rate limiting.
- Audit log works.
- Test plan passes.

---

## 12. Work Plan for Cursor

1. Create `config/keycode-portals.json` with OEMs and env var names.
2. Create `secrets.env.template` with all env keys (no values).
3. Update session typing to include `super_admin | admin | user`.
4. Add security headers in `next.config.js`.
5. Implement RBAC-gated server page at `/keycodes`.
6. Build client grid rendering OEM cards and handling Copy Creds.
7. Implement secure API route `/api/keycodes/creds`.
8. Add console or DB audit logging.
9. Validate everything against the test plan.

---

## 13. Hard Rules

- Never embed credentials in repo or client.
- Never return credentials to unauthorized roles.
- Never bypass RBAC or origin checks.
- Never auto-submit OEM forms.

---

**End of instructions — Cursor, generate all required code following this document exactly.**


Keycode links


4E1B0D2W VSIP

Automake


Keycode link
Notes
Acura
https://estore.honda.com/service-express/subscription-details.asp?sku=LCK001
User: Mrguru
PW:
Destiny@2026

Audi
https://erwin.audiusa.com/erwin/showKeycodeInstructions.do



Bentley
https://erwin.audiusa.com/erwin/showKeycodeInstructions.do


BMW
https://kcsp.bmwna.com/ckl/portal/poLogin.faces


FCA
https://www.moparkeycode.com/
User: mytech@metrepairs.com
PW: Destiny@2025
Ford
https://www.motorcraftservice.com/keycode/keycodelookup
User: mytech@metrepairs.com
PW: Destiny@2025
GM
https://www.acdelcotds.com/keycodes


User: MrGuru2024
Pw: Keycodehelp@2028
Genesis
https://www.genesistechinfo.com
User: 
Pw: Destiny2025


Honda
https://estore.honda.com/service-express/subscription-details.asp?sku=LCK001
Same as Acura
Hyundai,
https://www.hyundaitechinfo.com
User: Mrguru
Pw: Destiny2025
Infiniti
http://www.infiniti-techinfo.com/lsdemo/dept.aspx
User: Metrepairs
PW: Keycodehelp@2028
Isuzu
http://isuzusource.com/v2/store.php?category=8


Jaguar
http://topix.jaguar.jlrext.com/topix/content/document/view?id=490672


KIA
https://kiatechinfo.snapon.com/default.aspx
Same as Hyundai
Land Rover
http://topix.jaguar.jlrext.com/topix/content/document/view?id=490672


Lexus
https://techinfo.toyota.com/techInfoPortal/appmanager/t3/ti?_nfpb=true&_pageLabel=P800145021544253371383
Mazda
https://mazda.locksmithsdrm.com/MazdaSDRM/


McLaren
https://mclarencars.techinfoportal.com/McLarenEPA
Provide your VSP ID during registration so that you will have access to Security information. Follow site directions to access Vehicle Security Information
Mercedes Benz
https://sdrm.nastfsecurityregistry.org/
Keys are coming soon/This is a link to SDRM where Theft Relevant parts orders can be completed using the TRP D1 form. Order will be sent directly to the dealer of your choice. 
Mini
Need updated information for Mini


Mitsubishi




Nissan
https://www.nissan-techinfo.com/lsdemo/dept.aspx
user: Mrguru2025
Password: Keycodehelp@2028
Polestar
https://www.polestartechhub.com/categories/keycodes


Porsche
https://techinfo2.porsche.com/PassThru/user/ShowInfo.action?url=../user/pxnaccount.html&menulevel=0
Saab
https://tis.saabparts.com/products/saab-keycodes


Smart
Unaware of any program at this time


Sprinter
https://sdrm.nastfsecurityregistry.org/
Keys are coming soon/This is a link to SDRM where Theft Relevant parts orders can be completed using the TRP D1 form. Order will be sent directly to the dealer of your choice. 
Subaru
https://subaru.locksmithsdrm.com/SubaruSDRM


Suzuki
https://www.genuinesuzukimanuals.com/?rtn=2


Toyota
https://techinfo.toyota.com/techInfoPortal/appmanager/t3/ti?_nfpb=true&_pageLabel=P 800145021544253371383 
VW
https://erwin.vw.com/erwin/showKeycodeInstructions.do


Volvo
https://www.volvotechinfo.com/index.cfm?event=keycodes.info



User: mytech@metrepairs.com

Pw: Destiny@2025



Toyota and Lexus Login: mrguru@metrepairs.com
PW: Keycodehelp@2028

