"""
matching/models.py

Stores the output of the standalone Python matching engine (kept in its
own folder, per your setup). Django never computes scores itself — it
only reads/writes this table so the Mentee page can render the % match
ring and the Mentor page can show match detail bars.
"""
from django.db import models

from accounts.models import MenteeProfile, MentorProfile


class Match(models.Model):
    mentee = models.ForeignKey(MenteeProfile, on_delete=models.CASCADE, related_name="matches")
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name="matches")

    # interest_1st/2nd/3rd (mentee) <-> exp_1st/2nd/3rd (mentor)
    interest_score = models.DecimalField(max_digits=5, decimal_places=2)
    # goal_1st/2nd/3rd (mentee) <-> strength_1st/2nd/3rd (mentor)
    goal_score = models.DecimalField(max_digits=5, decimal_places=2)
    overall_score = models.DecimalField(max_digits=5, decimal_places=2)

    computed_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["mentee", "mentor"], name="one_match_row_per_pair")
        ]
        indexes = [
            models.Index(fields=["mentee", "-overall_score"]),
            models.Index(fields=["mentor", "-overall_score"]),
        ]

    def __str__(self):
        return f"{self.mentee} <-> {self.mentor}: {self.overall_score}%"
