# SVI Mentorship — Backend (Django + DRF + SQLite)

A real, runnable Django project — not just app scaffolding. Tested end
to end: migrations, seeding real data, login, sending/accepting a
request, creating/updating tasks, and notifications all verified
working before this was packaged.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py seed_data        # imports mentor.json/mentee.json + computes all match scores
python manage.py runserver        # http://127.0.0.1:8000
```

That's it — `db.sqlite3` gets created by `migrate`, then `seed_data`
loads 24 mentors + 27 mentees from `matching_engine/data/` and computes
all 648 match scores using your own `calculate_matching_score()`
(imported directly from `matching_engine/`, not reimplemented).

Every seeded account's password is **`password123`**. Emails are
`<employee_no>@svi.demo`, e.g. `55169@svi.demo` (mentee) or
`45446@svi.demo` (mentor) — `seed_data` prints two real sample logins
and the admin login when it finishes. Full list of employee numbers is
in `matching_engine/data/mentor.json` / `mentee.json`.

An admin account is also created: `admin@svi.demo` / `password123`,
with access to `/admin/` (Django admin — useful for poking at the data
directly).

## Folder structure

```
svi-backend/
├── manage.py
├── svi_backend/            # settings.py, urls.py, wsgi.py, asgi.py
├── accounts/                # User (auth), MentorProfile, MenteeProfile
│   └── management/commands/seed_data.py
├── matching/                 # Match model + read-only "my matches" endpoint
│   └── management/commands/import_matches.py   (alternative to seed_data, CSV-based)
├── mentorship/                # MentorshipRequest (select/accept/reject), Mentorship
├── tasks/                      # Task, TaskUpdate — the Workspace page
├── notifications/               # Notification + signals that auto-create them
├── matching_engine/              # your standalone scoring project, nested as-is
└── requirements.txt
```

## API (all under `/api/`, DRF Token auth)

| Method | Path | Who | What |
|---|---|---|---|
| POST | `/api/auth/login/` | anyone | `{email, password}` → `{token, role, user}` |
| POST | `/api/auth/logout/` | authed | invalidates the token |
| GET  | `/api/auth/me/` | authed | current user |
| GET  | `/api/matches/mine/?limit=4` | mentee | top mentor matches (Mentee page cards) |
| POST | `/api/requests/` | mentee | `{mentor_id}` → send a request (Select mentor) |
| GET  | `/api/requests/mine/?status=p` | mentor | incoming requests (Mentor page) |
| POST | `/api/requests/<id>/accept/` | mentor | accept → creates a `Mentorship` |
| POST | `/api/requests/<id>/reject/` | mentor | reject |
| GET  | `/api/mentorships/mine/` | either | active mentorship(s) → which workspace to load |
| GET  | `/api/tasks/?mentorship=<id>` | either | task board for one workspace |
| POST | `/api/tasks/` | mentor only | `{mentorship, task_name, task_detail, due_date}` |
| PATCH | `/api/tasks/<id>/` | either | e.g. `{status: "in_progress"}` |
| POST | `/api/tasks/<id>/updates/` | either | `{note}` — progress comment thread |
| GET  | `/api/notifications/` | authed | bell icon dropdown |
| POST | `/api/notifications/<id>/read/` | authed | mark one read |

Authenticate every request after login with:
```
Authorization: Token <token>
```

## Connecting the React frontend

CORS is already open for `http://localhost:5173` (Vite's default) —
see `CORS_ALLOWED_ORIGINS` in `.env.example`. Run the frontend from
`../frontend` per its own README; the two are designed to run side by
side with zero extra config in local dev.

## Notifications

`notifications/signals.py` listens for `MentorshipRequest` and `Task`/
`TaskUpdate` saves and creates the right `Notification` row
automatically (request received, accepted, rejected, task assigned,
task commented on) — nothing to wire up manually in views.

## Re-running the matching engine

If you edit `matching_engine/data/mentor.json` or `mentee.json`, either:

- re-run `python manage.py seed_data --reset` (recomputes everything
  from the JSON files directly), or
- use the standalone engine's own CSV export + `import_matches` if you
  want to run scoring completely outside Django — see
  `matching_engine/README.md`.

## Admin

```bash
python manage.py createsuperuser   # if you want your own admin instead of the seeded one
```
Then visit `http://127.0.0.1:8000/admin/`.

## Tests

No automated test suite is included — the flows above (login → match
→ request → accept → task → update → notification) were verified
manually via Django's test client before packaging. Worth adding
`pytest-django` if this goes further than a demo.
