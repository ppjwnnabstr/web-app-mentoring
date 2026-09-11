"""
notifications/models.py

Backs the "Noti" bell icon shown in the header of every page in the
wireframes. Uses a loose (app_label, object_id) pointer rather than a
FK to any one model, since a notification might reference a request,
a task, or a task update.
"""
from django.db import models

from accounts.models import User


class Notification(models.Model):
    class Kind(models.TextChoices):
        REQUEST_RECEIVED = "request_received", "New mentee request"
        REQUEST_ACCEPTED = "request_accepted", "Request accepted"
        REQUEST_REJECTED = "request_rejected", "Request rejected"
        TASK_ASSIGNED = "task_assigned", "New task assigned"
        TASK_UPDATED = "task_updated", "Task updated"

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    kind = models.CharField(max_length=30, choices=Kind.choices)
    message = models.CharField(max_length=255)

    # e.g. related_app_label="mentorship", related_object_id=<MentorshipRequest.id>
    related_app_label = models.CharField(max_length=50, blank=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["recipient", "is_read"])]

    def __str__(self):
        return f"[{'read' if self.is_read else 'unread'}] {self.recipient}: {self.message}"
