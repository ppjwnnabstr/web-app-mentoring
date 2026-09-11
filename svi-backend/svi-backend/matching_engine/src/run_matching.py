import json
from pathlib import Path

import pandas as pd

from .matching_score import calculate_matching_score


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

MENTOR_FILE = DATA_DIR / "mentor.json"
MENTEE_FILE = DATA_DIR / "mentee.json"
OUTPUT_FILE = OUTPUT_DIR / "matching_score.xlsx"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    mentors = load_json(MENTOR_FILE)
    mentees = load_json(MENTEE_FILE)

    matrix = []
    details = []

    for mentee in mentees:
        row = {
            "Mentee": mentee["Full name"],
        }

        for mentor in mentors:
            result = calculate_matching_score(mentor, mentee)

            mentor_name = mentor["Name"].strip()
            row[mentor_name] = result["score"]

            details.append({
                "Mentee": mentee["Full name"],
                "Mentor": mentor_name,
                **result,
            })

        matrix.append(row)

    matrix_df = pd.DataFrame(matrix)
    details_df = pd.DataFrame(details)

    with pd.ExcelWriter(OUTPUT_FILE, engine="openpyxl") as writer:
        matrix_df.to_excel(
            writer,
            sheet_name="Matching Score",
            index=False,
        )
        details_df.to_excel(
            writer,
            sheet_name="Score Details",
            index=False,
        )

    print(f"Mentors : {len(mentors)}")
    print(f"Mentees : {len(mentees)}")
    print(f"Pairs   : {len(mentors) * len(mentees)}")
    print(f"Output  : {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
