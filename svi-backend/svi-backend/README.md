# SVI Mentorship — Backend (Django + SQLite)

Django models for the 4 pages you sketched: Login, Mentee, Mentor,
Workspace. React talks to this over a REST API (Django REST Framework
included in `requirements.txt`, not scaffolded here since your FE is
already built against a different shape — happy to add serializers/
views once the FE contract is settled).

## Folder structure

```
svi-backend/
├── accounts/          # User (auth), MentorProfile, MenteeProfile
├── matching/          # Match model — filled in from matching_engine's output
│   └── management/commands/import_matches.py
├── mentorship/        # MentorshipRequest (select/accept/reject), Mentorship
├── tasks/             # Task, TaskUpdate — the Workspace page
├── notifications/     # Notification — the "Noti" bell in every header
├── matching_engine/   # your standalone scoring project, nested here as-is
│   ├── main.py                    # -> output/matching_score.xlsx (unchanged)
│   ├── export_django.py           # NEW -> output/django_matches.csv
│   ├── data/mentor.json, mentee.json
│   └── src/matching_score.py, run_matching.py, export_for_django.py (NEW)
├── settings_snippet.py
└── requirements.txt
```

`matching_engine/` is your project exactly as you wrote it — `main.py`
and the xlsx output still work unchanged. The only addition is
`export_django.py` / `src/export_for_django.py`, which reuses your
`calculate_matching_score()` (same weights, same 0/1 match rules) to
also write a flat CSV that `import_matches` can load straight into
the `Match` table. See `matching_engine/README.md` for the details of
how `interest_score` / `goal_score` are derived from the same
focus/goal match booleans your engine already computes.

**Full pipeline, end to end:**
```bash
cd matching_engine
python export_django.py                       # writes output/django_matches.csv
cd ..
python manage.py import_matches matching_engine/output/django_matches.csv
```

Each folder is a normal Django app — drop them into a Django project
(`django-admin startproject svi_backend .` then copy these in, or
`python manage.py startapp <name>` first and overwrite `models.py`/
`apps.py`) and add the `INSTALLED_APPS` / `AUTH_USER_MODEL` lines from
`settings_snippet.py`.

## How the pages map to models

| Page | Wireframe | Models involved |
|---|---|---|
| Login | Users table | `accounts.User` (Django handles password hashing + sessions) |
| Mentee | 4 mentor cards, % match, send request | `matching.Match` (read), `mentorship.MentorshipRequest` (create) |
| Mentor | Mentee requested list, Accept/Reject | `mentorship.MentorshipRequest` (read + `.accept()`/`.reject()`) |
| Workspace | Create task, assign, attach file | `mentorship.Mentorship`, `tasks.Task`, `tasks.TaskUpdate` |

## Key flows

**Mentee sends a request** (the single "send email request to mentor"
button + checkbox-select pattern in your mockup):
```python
MentorshipRequest.objects.create(
    mentor=selected_mentor_profile,
    mentee=request.user.mentee_profile,
    match=Match.objects.get(mentee=..., mentor=selected_mentor_profile),
)
```

**Mentor accepts/rejects** — call the model methods rather than hand-
rolling the state change, since accepting also has to create the
`Mentorship` row:
```python
mentorship_request.accept()   # -> status="a", creates Mentorship
mentorship_request.reject()   # -> status="r"
```

**Importing match scores from your Python engine** — have your script
write a CSV (`mentee_id,mentor_id,interest_score,goal_score,overall_score`,
using employee numbers) and run:
```bash
python manage.py import_matches path/to/match_results.csv
```
This is a management command (`matching/management/commands/import_matches.py`),
so it can also be scheduled with cron or called from a small wrapper
script if you want the two systems to stay decoupled.

## Migrations

```bash
pip install -r requirements.txt
python manage.py makemigrations accounts matching mentorship tasks notifications
python manage.py migrate
python manage.py createsuperuser
```

## Notes / things worth deciding next

- **Notifications** are currently a loose pointer (`related_app_label` +
  `related_object_id`) rather than a `GenericForeignKey`, to keep SQLite
  queries simple — swap to `django.contrib.contenttypes` if you want
  proper joins later.
- **Task attachments**: one `FileField` per task, matching the single
  "Attach file" button in your mockup. If you need multiple files per
  task later, split into a `TaskAttachment` child table.
- **`capacity` / `is_accepting`** on `MentorProfile` are included so the
  Mentee page can filter out mentors who are already full — not in your
  wireframe, but worth having before this goes live with 24 mentors and
  27 mentees.
