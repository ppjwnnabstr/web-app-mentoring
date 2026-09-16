# SVI Mentorship — Frontend (React + Vite)

A real Vite project, wired to the actual Django API (not mock data).
4 pages, React Router, a small fetch-based API client, and a
localStorage-backed auth token — nothing framework-heavy.

## Quick start

```bash
npm install
cp .env.example .env    # defaults already point at http://127.0.0.1:8000/api
npm run dev              # http://localhost:5173
```

Make sure the backend (`../backend`) is running first — see its
README for `migrate` + `seed_data` + `runserver`. Log in with any
seeded account, e.g.:

- mentee: `55169@svi.demo` / `password123`
- mentor: `45446@svi.demo` / `password123`

(Full employee-number list: `../backend/matching_engine/data/*.json`)

## Folder structure

```
src/
├── main.jsx, App.jsx        # entry point + router
├── api/                       # one file per resource, thin fetch wrappers
│   ├── client.js                # base URL, auth header, error handling
│   ├── auth.js, matches.js, requests.js, tasks.js, notifications.js
├── context/AuthContext.jsx     # holds the logged-in user, login()/logout()
├── components/ProtectedRoute.jsx
├── pages/
│   ├── LoginPage.jsx/.css
│   ├── MenteePage.jsx/.css       # 4 mentor cards, % match ring, Select mentor
│   ├── MentorPage.jsx/.css        # incoming requests, match detail, Accept/Reject
│   └── WorkspacePage.jsx/.css      # Kanban task board, assign/update tasks
└── styles/theme.css                 # shared color/font tokens, loaded once
```

## Routes

| Path | Page | Guard |
|---|---|---|
| `/login` | Login | — |
| `/mentee` | Mentee matches | mentee role only |
| `/mentor` | Incoming requests | mentor role only |
| `/workspace` | Task board | any logged-in user (shows their active mentorship) |

`/` redirects to `/mentee` or `/mentor` based on role, or `/login` if
signed out. `ProtectedRoute` handles all of this — see
`src/components/ProtectedRoute.jsx`.

## How auth works

`POST /api/auth/login/` returns a DRF token, stored in
`localStorage` (`src/api/client.js`). Every subsequent request adds
`Authorization: Token <token>`. `AuthContext` fetches `/api/auth/me/`
on load to restore the session if a token is already saved.

## Config

`.env` / `.env.example`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
Change this if your backend runs somewhere other than the default.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Verified: `npm run build` completes cleanly with no errors before this
was packaged.
