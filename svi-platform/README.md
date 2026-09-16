# SVI Mentorship Platform

A real, runnable project: Django REST API + SQLite on the backend,
React (Vite) on the frontend, seeded with your actual mentor/mentee
data and your own matching engine. Everything below was tested
end-to-end before packaging — not just scaffolded.

## Run it (two terminals)

**Terminal 1 — backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open **http://localhost:5173**. Log in as:
- a mentee: `55169@svi.demo` / `password123`
- a mentor: `45446@svi.demo` / `password123`

(`seed_data` prints these — and the full mentor/mentee list is right
there in `backend/matching_engine/data/*.json` if you want to try
others. Every seeded account uses `password123`.)

## What's real vs. what's demo

| | |
|---|---|
| **Real** | All 24 mentors + 27 mentees from your Excel/JSON, all 648 match scores computed by your actual `calculate_matching_score()`, a real SQLite database, a real DRF API, token auth, CORS, signal-based notifications |
| **Demo-grade, worth hardening before production** | Dev-server-only (no gunicorn/nginx config), no automated test suite, SECRET_KEY defaults to a placeholder, no rate limiting, file uploads (photos/attachments) accepted but no size/type validation added |

## Try the full flow

1. Log in as a mentee → see your 4 top-matched mentors with % scores → click **Select mentor**
2. Log out, log in as that mentor → see the incoming request with match detail → click **Accept**
3. Either of you → go to **Workspace** → mentor clicks **+ Assign task** → mentee opens it and posts an update
4. Check `/api/notifications/` (or wire up a bell icon in the UI) → see it fired automatically at every step above

## Project layout

```
svi-platform/
├── backend/     # Django + DRF + SQLite — see backend/README.md
└── frontend/    # React + Vite         — see frontend/README.md
```

Each has its own README with more detail (API reference, folder
structure, config). This file is just the "get it running" version.
