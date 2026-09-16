"""
tasks/models.py

Backs the Workspace page's "Create task" form and the mentor/mentee
task board. Extends your wireframe's minimal "Mentor tasks" entity
(id, task_name, task_detail) with the fields actually needed to track
and assign work: status, due date, attachment, ownership, and a
comment/update thread.
"""
from django.db import models

from accounts.models import User
from mentorship.models import Mentorship


class Task(models.Model):
    class Status(models.TextChoices):
        NOT_STARTED = "not_started", "Not started"
        IN_PROGRESS = "in_progress", "In progress"
        COMPLETED = "completed", "Completed"

    mentorship = models.ForeignKey(Mentorship, on_delete=models.CASCADE, related_name="tasks")

    task_name = models.CharField(max_length=200)
    task_detail = models.TextField(blank=True)
    attachment = models.FileField(upload_to="task_attachments/", blank=True, null=True)

    status = models.CharField(max_length=15, choices=Status.choices, default=Status.NOT_STARTED)
    due_date = models.DateField(null=True, blank=True)

    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="tasks_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def assigned_to(self):
        """The mentee this task is for — implied by the mentorship it belongs to."""
        return self.mentorship.mentee

    def __str__(self):
        return self.task_name


class TaskUpdate(models.Model):
    """Progress notes / comments either side can post on a task."""

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="updates")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.author} on {self.task}: {self.note[:40]}"
