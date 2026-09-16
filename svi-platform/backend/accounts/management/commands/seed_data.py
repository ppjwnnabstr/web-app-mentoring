"""
Loads the real mentor.json / mentee.json (via matching_engine/) into the
database as Users + profiles, then computes every mentee-mentor Match
using the exact same calculate_matching_score() the standalone engine
uses — no CSV round-trip needed for local dev.

Usage:
    python manage.py seed_data
    python manage.py seed_data --reset   # wipe and reseed everything

Every seeded account gets the password "password123" (printed at the
end along with a couple of sample logins).
"""
import json
import sys
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import User, MentorProfile, MenteeProfile
from matching.models import Match

DEFAULT_PASSWORD = "password123"

ENGINE_DIR = settings.BASE_DIR / "matching_engine"
DATA_DIR = ENGINE_DIR / "data"

FOCUS_WEIGHTS = (30.555, 13.89, 5.555)
GOAL_WEIGHTS = (30.555, 13.89, 5.555)


def split_name(full_name):
    parts = full_name.strip().split(None, 1)
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[1]


class Command(BaseCommand):
    help = "Seed the database from matching_engine/data/{mentor,mentee}.json and compute match scores"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing seeded users/matches before reseeding",
        )

    def handle(self, *args, **options):
        # matching_engine's calculate_matching_score() has no external deps,
        # so importing it directly avoids duplicating the matching logic here.
        sys.path.insert(0, str(ENGINE_DIR))
        from src.matching_score import calculate_matching_score  # noqa: E402

        mentors = json.loads((DATA_DIR / "mentor.json").read_text(encoding="utf-8"))
        mentees = json.loads((DATA_DIR / "mentee.json").read_text(encoding="utf-8"))

        if options["reset"]:
            self.stdout.write("Resetting existing seeded data...")
            User.objects.filter(role__in=[User.Role.MENTOR, User.Role.MENTEE]).delete()

        with transaction.atomic():
            mentor_profiles = {m["mentor_id"]: self._create_mentor(m) for m in mentors}
            mentee_profiles = {m["mentee_id"]: self._create_mentee(m) for m in mentees}

            Match.objects.filter(
                mentor_id__in=[p.user_id for p in mentor_profiles.values()],
                mentee_id__in=[p.user_id for p in mentee_profiles.values()],
            ).delete()

            match_rows = []
            for mentee_raw in mentees:
                mentee_profile = mentee_profiles[mentee_raw["mentee_id"]]
                for mentor_raw in mentors:
                    mentor_profile = mentor_profiles[mentor_raw["mentor_id"]]
                    result = calculate_matching_score(mentor_raw, mentee_raw)

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

                    match_rows.append(
                        Match(
                            mentee=mentee_profile,
                            mentor=mentor_profile,
                            interest_score=round(interest_score, 2),
                            goal_score=round(goal_score, 2),
                            overall_score=round(result["score"], 2),
                        )
                    )

            Match.objects.bulk_create(match_rows)

        self._create_admin()

        self.stdout.write(self.style.SUCCESS(f"\nSeeded {len(mentor_profiles)} mentors, {len(mentee_profiles)} mentees"))
        self.stdout.write(self.style.SUCCESS(f"Computed {len(match_rows)} match scores"))
        self.stdout.write(f"\nEvery seeded account's password is: {DEFAULT_PASSWORD}")
        self.stdout.write("\nSample logins:")
        sample_mentor = next(iter(mentors))
        sample_mentee = next(iter(mentees))
        self.stdout.write(f"  mentor -> {sample_mentor['mentor_id']}@svi.demo")
        self.stdout.write(f"  mentee -> {sample_mentee['mentee_id']}@svi.demo")
        self.stdout.write("  admin  -> admin@svi.demo (Django admin + superuser)")

    def _create_mentor(self, raw):
        first, last = split_name(raw["Name"])
        user, _ = User.objects.update_or_create(
            employee_no=raw["mentor_id"],
            defaults={
                "username": f"mentor_{raw['mentor_id']}",
                "email": f"{raw['mentor_id']}@svi.demo",
                "first_name": first,
                "last_name": last,
                "role": User.Role.MENTOR,
            },
        )
        user.set_password(DEFAULT_PASSWORD)
        user.save()

        profile, _ = MentorProfile.objects.update_or_create(
            user=user,
            defaults={
                "career_biography": raw.get("career_biography", ""),
                "exp_1st": raw["exp_1st"],
                "exp_2nd": raw["exp_2nd"],
                "exp_3rd": raw["exp_3rd"],
                "strength_1st": raw["Strength_1st"],
                "strength_2nd": raw["Strength_2nd"],
                "strength_3rd": raw["Strength_3rd"],
                "availability": raw.get("availability", ""),
            },
        )
        return profile

    def _create_mentee(self, raw):
        first, last = split_name(raw["Full name"])
        user, _ = User.objects.update_or_create(
            employee_no=raw["mentee_id"],
            defaults={
                "username": f"mentee_{raw['mentee_id']}",
                "email": f"{raw['mentee_id']}@svi.demo",
                "first_name": first,
                "last_name": last,
                "role": User.Role.MENTEE,
            },
        )
        user.set_password(DEFAULT_PASSWORD)
        user.save()

        profile, _ = MenteeProfile.objects.update_or_create(
            user=user,
            defaults={
                "goal_1st": raw["goal_1st"],
                "goal_2nd": raw["goal_2nd"],
                "goal_3rd": raw["goal_3rd"],
                "interest_1st": raw["interest_1st"],
                "interest_2nd": raw["interest_2nd"],
                "interest_3rd": raw["interest_3rd"],
                "frequency": raw.get("frequency", ""),
                "additional_comment": raw.get("additional_comment", ""),
            },
        )
        return profile

    def _create_admin(self):
        admin, created = User.objects.update_or_create(
            employee_no="admin",
            defaults={
                "username": "admin",
                "email": "admin@svi.demo",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin.set_password(DEFAULT_PASSWORD)
        admin.save()
