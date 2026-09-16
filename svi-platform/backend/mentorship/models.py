"""
mentorship/models.py

MentorshipRequest = the "select mentor" action on the Mentee page,
                    answered with Accept/Reject on the Mentor page.
Mentorship        = created automatically once a request is accepted;
                    this is what the workspace/task pages hang off of.
"""
from django.db import models
from django.utils import timezone

from accounts.models import MentorProfile, MenteeProfile
from matching.models import Match


class MentorshipRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "p", "Pending"
        ACCEPTED = "a", "Accepted"
        REJECTED = "r", "Rejected"

    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name="requests")
    mentee = models.ForeignKey(MenteeProfile, on_delete=models.CASCADE, related_name="requests")

    # snapshot of the score that triggered this request, kept even if
    # Match rows get recomputed/overwritten later
    match = models.ForeignKey(
        Match, on_delete=models.SET_NULL, null=True, blank=True, related_name="requests"
    )

    status = models.CharField(max_length=1, choices=Status.choices, default=Status.PENDING)
    message = models.TextField(blank=True)

    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            # a mentee can't have two open requests to the same mentor at once
            models.UniqueConstraint(
                fields=["mentor", "mentee"],
                condition=models.Q(status="p"),
                name="one_pending_request_per_pair",
            )
        ]
        indexes = [
            models.Index(fields=["mentor", "status"]),
            models.Index(fields=["mentee", "status"]),
        ]

    def accept(self):
        self.status = self.Status.ACCEPTED
        self.responded_at = timezone.now()
        self.save(update_fields=["status", "responded_at"])
        Mentorship.objects.get_or_create(
            request=self, defaults={"mentor": self.mentor, "mentee": self.mentee}
        )

    def reject(self):
        self.status = self.Status.REJECTED
        self.responded_at = timezone.now()
        self.save(update_fields=["status", "responded_at"])

    def __str__(self):
        return f"{self.mentee} -> {self.mentor} [{self.get_status_display()}]"


class Mentorship(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ENDED = "ended", "Ended"

    request = models.OneToOneField(
        MentorshipRequest, on_delete=models.CASCADE, related_name="mentorship"
    )
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name="mentorships")
    mentee = models.ForeignKey(MenteeProfile, on_delete=models.CASCADE, related_name="mentorships")

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.mentee} x {self.mentor} ({self.status})"
