# Mentor–Mentee Matching — Score Only

This version follows only the requested percentage-calculation requirement.

## Matching fields

Mentor:
- exp_1st
- exp_2nd
- exp_3rd
- Strength_1st
- Strength_2nd
- Strength_3rd

Mentee:
- interest_1st
- interest_2nd
- interest_3rd
- goal_1st
- goal_2nd
- goal_3rd

## Matching logic

Every Mentee is compared with every Mentor.

Focus → Mentor Experience:
- interest_1st against exp_1st/exp_2nd/exp_3rd
- interest_2nd against exp_1st/exp_2nd/exp_3rd
- interest_3rd against exp_1st/exp_2nd/exp_3rd

Goal → Mentor Strength:
- goal_1st against Strength_1st/Strength_2nd/Strength_3rd
- goal_2nd against Strength_1st/Strength_2nd/Strength_3rd
- goal_3rd against Strength_1st/Strength_2nd/Strength_3rd

Match = 1
No match = 0

Weights Using Rank Order Centroid (ROC):
- 1st Focus = 30.555%
- 1st Goal = 30.555%
- 2nd Focus = 13.89%
- 2nd Goal = 13.89%
- 3rd Focus = 5.555%
- 3rd Goal = 5.555%

No Career Biography, Additional Comment, Availability, Frequency,
capacity, ranking, assignment, or AI semantic score is used in this version.

## Run in VS Code

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Output:
`output/matching_score.xlsx`

## Feeding scores into the Django backend

`export_django.py` reuses the same `calculate_matching_score()` — same
weights, same 0/1 match rules — but writes a flat CSV shaped for the
backend's `import_matches` management command instead of the xlsx
matrix:

```powershell
python export_django.py
```

Output:
`output/django_matches.csv` — columns: `mentee_id, mentor_id, interest_score, goal_score, overall_score`

`interest_score` and `goal_score` are the focus-match and goal-match
weights (30.555 / 13.89 / 5.555) split into their own 0–100 scale;
`overall_score` is unchanged — it's the same number as the `score`
column in `matching_score.xlsx`. From the Django project:

```bash
python manage.py import_matches ../matching_engine/output/django_matches.csv
```

(`mentee_id` / `mentor_id` in the CSV must match `User.employee_no` in
Django — they already do, since both come from the same `mentee_id`
/ `mentor_id` fields in `data/mentee.json` / `data/mentor.json`.)
