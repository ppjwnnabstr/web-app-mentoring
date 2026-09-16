"""
Loads match scores produced by your standalone Python matching engine
into the Match table.

Point your matching script's output at a CSV with these columns:
    mentee_id, mentor_id, interest_score, goal_score, overall_score
where mentee_id / mentor_id are the employee numbers (EN) from
mentee.xlsx / mentor.xlsx — i.e. User.employee_no.

Usage:
    python manage.py import_matches path/to/match_results.csv
"""
import csv

from django.core.management.base import BaseCommand

from accounts.models import MenteeProfile, MentorProfile
from matching.models import Match


class Command(BaseCommand):
    help = "Import match scores from the external Python matching engine's CSV output"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str)

    def handle(self, *args, **options):
        path = options["csv_path"]
        created, updated, skipped = 0, 0, 0

        with open(path, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                try:
                    mentee = MenteeProfile.objects.get(user__employee_no=row["mentee_id"])
                    mentor = MentorProfile.objects.get(user__employee_no=row["mentor_id"])
                except (MenteeProfile.DoesNotExist, MentorProfile.DoesNotExist):
                    skipped += 1
                    continue

                _, was_created = Match.objects.update_or_create(
                    mentee=mentee,
                    mentor=mentor,
                    defaults={
                        "interest_score": row["interest_score"],
                        "goal_score": row["goal_score"],
                        "overall_score": row["overall_score"],
                    },
                )
                created += int(was_created)
                updated += int(not was_created)

        self.stdout.write(
            self.style.SUCCESS(
                f"Done — {created} created, {updated} updated, {skipped} skipped (no matching user)"
            )
        )
