# SVI Project Description and How to Start

## Project overview

This project is a mentorship matching system for SVI with three main parts:

- Matching engine (Python): calculates mentor-mentee compatibility scores
- Backend (Django): stores users, mentor/mentee profiles, match results, mentorship requests, tasks, and notifications
- Frontend (React): provides the user interface for login, mentee matching, mentor approvals, and workspace collaboration

The system is designed to support:

- login page
- mentee page showing top mentor matches
- mentor page showing incoming requests and accept/reject actions
- workspace page for task tracking and assignment between mentor and mentee

---

## 1. Root-level project structure

### README.md
This file describes the core matching logic and how the scoring engine works.

It explains:

- mentor fields such as experience and strengths
- mentee fields such as interests and goals
- how each mentee is compared against each mentor
- the weighted score calculation using ROC weights
- how the output is exported as Excel for matching results

### export_for_django.py
This script exports match results into CSV format for Django import.

It creates a file with columns:

- mentee_id
- mentor_id
- interest_score
- goal_score
- overall_score

This CSV is intended to be imported into the Django backend using the custom management command.

---

## 2. Matching Engine (Python)

The matching engine is inside:

- svi-backend/svi-backend/matching_engine/

### matching_engine/main.py
This is the entry point for the score calculation process.

It simply runs:

- src/run_matching.py

### matching_engine/src/matching_score.py
This is the core logic for computing the match score.

It does the following:

- normalizes text values
- compares mentee interests with mentor experience
- compares mentee goals with mentor strengths
- assigns match flags (0 or 1)
- multiplies by ranking weights
- produces the final score

The scoring logic is based on this structure:

- Focus 1st / Goal 1st: highest weight
- Focus 2nd / Goal 2nd: medium weight
- Focus 3rd / Goal 3rd: lower weight

Example weights used:

- 30.555
- 13.89
- 5.555

### matching_engine/src/run_matching.py
This script:

- loads mentor and mentee data from JSON files
- compares every mentee with every mentor
- computes the score for each pair
- creates an Excel report with two sheets:
  - Matching Score
  - Score Details

The output is saved at:

- output/matching_score.xlsx

### matching_engine/src/export_for_django.py
This file exports the same matching result in a backend-friendly CSV shape.

It creates:

- output/django_matches.csv

This CSV is used by the Django import command to populate the Match model.

### matching_engine/export_django.py
This file is a wrapper to run the export script more conveniently.

### matching_engine/requirements.txt
Dependencies used by the Python matching engine:

- pandas
- openpyxl

---

## 3. Django backend

The backend is inside:

- svi-backend/svi-backend/

This folder contains the Django apps for the project.

### settings_snippet.py
This is not the full Django settings file, but a snippet that should be inserted into settings.py.

It includes:

- installed apps
- custom user model configuration
- CORS configuration
- media settings

Important settings:

- AUTH_USER_MODEL = "accounts.User"
- includes apps: accounts, matching, mentorship, tasks, notifications

### requirements.txt
This includes backend dependencies:

- Django
- djangorestframework
- django-cors-headers
- Pillow
- openpyxl

---

## 4. Backend app: accounts

### accounts/models.py
This app defines the user and profile models.

It contains:

- User: custom user model based on Django AbstractUser
- Role: mentor / mentee / admin
- employee_no
- department
- MentorProfile
- MenteeProfile

#### MentorProfile
Stores mentor profile fields such as:

- exp_1st, exp_2nd, exp_3rd
- strength_1st, strength_2nd, strength_3rd
- availability
- capacity
- is_accepting

#### MenteeProfile
Stores mentee profile fields such as:

- goal_1st, goal_2nd, goal_3rd
- interest_1st, interest_2nd, interest_3rd
- frequency
- additional_comment

This acts as the main profile layer for login and matching.

---

## 5. Backend app: matching

### matching/models.py
This app stores the computed matches from the Python engine.

It contains the Match model with:

- mentee
- mentor
- interest_score
- goal_score
- overall_score
- computed_at

This table is used to display the match percentage on the mentee page and detail bars on the mentor page.

### matching/management/commands/import_matches.py
This Django management command imports CSV match data into the Match table.

Example usage:

```bash
python manage.py import_matches path/to/match_results.csv
```

It looks up the mentee and mentor by employee number and updates or creates match records.

---

## 6. Backend app: mentorship

### mentorship/models.py
This app models the mentor-mentee relationship flow.

It contains:

- MentorshipRequest
  - stores a request from a mentee to a mentor
  - includes status: pending, accepted, rejected
  - stores match snapshot

- Mentorship
  - created when a request is accepted
  - represents the actual mentorship relationship between mentor and mentee

Important methods:

- accept()
- reject()

These methods update request status and create the mentorship record when accepted.

---

## 7. Backend app: tasks

### tasks/models.py
This app supports the workspace feature.

It contains:

- Task model
  - attached to a mentorship
  - task_name
  - task_detail
  - attachment
  - status
  - due_date
  - created_by

- TaskUpdate model
  - note/comment updates for each task

This is used for the task board and task progress tracking in the workspace UI.

---

## 8. Backend app: notifications

### notifications/models.py
This app stores notifications for the system.

Examples of notification kinds include:

- request received
- request accepted
- request rejected
- task assigned
- task updated

It includes fields like:

- recipient
- kind
- message
- related_app_label
- related_object_id
- is_read

---

## 9. Frontend React app

The frontend is inside:

- svi-frontend/svi-frontend/

### App.jsx
This is the top-level React entry file.

Currently it renders the login page and simulates authentication delay.

### LoginPage.jsx
This page contains the login form with:

- email input
- password input
- show/hide password
- remember me checkbox
- validation and loading states

### LoginPage.css
Styles for the login page design and layout.

### MenteePage.jsx
This page shows a list of mentor matches as cards.

Each card displays:

- mentor name
- title and location
- match percentage ring
- tags
- select mentor button

### MentorPage.jsx
This page shows mentee requests waiting for approval.

It provides:

- request list
- match details
- accept button
- reject button

### WorkspacePage.jsx
This page represents the mentorship workspace.

It supports:

- task board columns
- status changes
- adding updates/comments
- creating new tasks
- mentor/mentee view toggle

### SVIDemo.jsx
This is a combined preview page showing a single-file demo version of the interface.

### svi-logo.jpg
This is the SVI logo asset used in the UI.

---

## How this project works together

The typical flow is:

1. The matching engine reads mentor and mentee profiles.
2. It calculates matching scores.
3. It exports CSV and Excel results.
4. Django imports the CSV into the Match table.
5. The frontend displays match candidates to the mentee.
6. The mentee selects a mentor.
7. The mentor receives the request and accepts or rejects it.
8. A mentorship relationship is created.
9. The workspace allows the pair to assign and track tasks.

---

## How to start the project

## A. Start the matching engine

Open a terminal and run:

```powershell
cd "c:\Users\hr_pichai\Downloads\files (4)\svi-backend\svi-backend\matching_engine"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

This will generate:

- output/matching_score.xlsx

Then export to Django format:

```powershell
python export_django.py
```

This will generate:

- output/django_matches.csv

---

## B. Start the Django backend

You need a proper Django project structure first.

Create a Django project or attach the apps into an existing project:

```bash
django-admin startproject svi_backend .
```

Then add the apps and paste the configuration from settings_snippet.py into settings.py.

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Import the match CSV:

```bash
python manage.py import_matches matching_engine/output/django_matches.csv
```

Then start the server:

```bash
python manage.py runserver
```

---

## C. Start the React frontend

In the frontend folder:

```powershell
cd "c:\Users\hr_pichai\Downloads\files (4)\svi-frontend\svi-frontend"
npm install
npm run dev
```

Then open the local URL shown in the terminal, usually:

- http://localhost:5173

---

## Final note

This project is a strong example of a full-stack prototype combining:

- data matching logic
- backend data models
- frontend UX mockups
- mentorship workflow

It is well-structured for extension into a real production application, especially once the React app and Django project are fully connected through API endpoints.
