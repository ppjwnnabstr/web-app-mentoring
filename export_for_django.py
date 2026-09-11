"""
Exports match scores in the shape the Django backend's
`import_matches` management command expects:

    mentee_id, mentor_id, interest_score, goal_score, overall_score

Run this alongside (or instead of) run_matching.py when you want the
Django/SQLite side to pick up fresh scores:

    python export_django.py
    # then, from the Django project root:
    python manage.py import_matches path/to/matching_engine/output/django_matches.csv

Sub-scores are derived from the same focus/goal match booleans used
for the xlsx export in matching_score.py, just split into the two
independent dimensions and rescaled to 0-100 each:

    interest_score = (focus1*30.555 + focus2*13.89 + focus3*5.555) * 2
    goal_score     = (goal1*30.555  + goal2*13.89  + goal3*5.555)  * 2
    overall_score  = interest_score/2 + goal_score/2   (== original "score")

interest_score powers the mentee page's % match ring; interest_score
and goal_score together power the mentor page's match-detail bars.
"""
import csv
import json
from pathlib import Path

from .matching_score import calculate_matching_score

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

MENTOR_FILE = DATA_DIR / "mentor.json"
MENTEE_FILE = DATA_DIR / "mentee.json"
OUTPUT_FILE = OUTPUT_DIR / "django_matches.csv"

FOCUS_WEIGHTS = (30.555, 13.89, 5.555)
GOAL_WEIGHTS = (30.555, 13.89, 5.555)
FIELDNAMES = ["mentee_id", "mentor_id", "interest_score", "goal_score", "overall_score"]


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_rows(mentors, mentees):
    rows = []
    for mentee in mentees:
        for mentor in mentors:
            result = calculate_matching_score(mentor, mentee)

            interest_score = (
                result["focus1_match"] * FOCUS_WEIGHTS[0]
                + result["focus2_match"] * FOCUS_WEIGHTS[1]
                + result["focus3_match"] * FOCUS_WEIGHTS[2]
            ) * 2
            goal_score = (
                result["goal1_match"] * GOAL_WEIGHTS[0]
                + result["goal2_match"] * GOAL_WEIGHTS[1]
                + result["goal3_match"] * GOAL_WEIGHTS[2]
            ) * 2

            rows.append(
                {
                    "mentee_id": mentee["mentee_id"],
                    "mentor_id": mentor["mentor_id"],
                    "interest_score": round(interest_score, 3),
                    "goal_score": round(goal_score, 3),
                    "overall_score": round(result["score"], 3),
                }
            )
    return rows


def main():
    mentors = load_json(MENTOR_FILE)
    mentees = load_json(MENTEE_FILE)

    rows = build_rows(mentors, mentees)

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Mentors : {len(mentors)}")
    print(f"Mentees : {len(mentees)}")
    print(f"Pairs   : {len(rows)}")
    print(f"Output  : {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
