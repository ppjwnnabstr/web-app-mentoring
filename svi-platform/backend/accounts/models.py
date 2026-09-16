"""
accounts/models.py

Custom User model (leans on Django's built-in auth for password hashing
and session/login handling) plus one-to-one profile extensions for
mentors and mentees. Profile fields map 1:1 onto the columns in
mentor.xlsx / mentee.xlsx so importing the raw data is a straight copy.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Extends AbstractUser instead of re-inventing id/email/password/role
    the way the wireframe's "Users" table does — Django already hashes
    passwords (PBKDF2 by default) and handles login sessions for us.
    """

    class Role(models.TextChoices):
        MENTOR = "mentor", "Mentor"
        MENTEE = "mentee", "Mentee"
        ADMIN = "admin", "Admin"

    employee_no = models.CharField(
        max_length=20, unique=True, help_text="'EN' in the wireframe — the SVI employee number"
    )
    role = models.CharField(max_length=10, choices=Role.choices)
    department = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"


class MentorProfile(models.Model):
    """One row per mentor — extends User, does not repeat its fields."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="mentor_profile",
        limit_choices_to={"role": User.Role.MENTOR},
    )
    photo = models.ImageField(upload_to="mentor_photos/", blank=True, null=True)
    career_biography = models.TextField(blank=True)

    # mirrors mentor.xlsx: exp_1st / exp_2nd / exp_3rd
    exp_1st = models.CharField(max_length=100)
    exp_2nd = models.CharField(max_length=100)
    exp_3rd = models.CharField(max_length=100)

    # mirrors mentor.xlsx: Strength_1st / Strength_2nd / Strength_3rd
    strength_1st = models.CharField(max_length=100)
    strength_2nd = models.CharField(max_length=100)
    strength_3rd = models.CharField(max_length=100)

    availability = models.CharField(max_length=50)  # e.g. "Fortnightly"
    capacity = models.PositiveSmallIntegerField(default=3, help_text="Max concurrent mentees")
    is_accepting = models.BooleanField(default=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class MenteeProfile(models.Model):
    """One row per mentee — extends User, does not repeat its fields."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="mentee_profile",
        limit_choices_to={"role": User.Role.MENTEE},
    )
    photo = models.ImageField(upload_to="mentee_photos/", blank=True, null=True)

    # mirrors mentee.xlsx: goal_1st / goal_2nd / goal_3rd
    goal_1st = models.CharField(max_length=100)
    goal_2nd = models.CharField(max_length=100)
    goal_3rd = models.CharField(max_length=100)

    # mirrors mentee.xlsx: interest_1st / interest_2nd / interest_3rd
    interest_1st = models.CharField(max_length=100)
    interest_2nd = models.CharField(max_length=100)
    interest_3rd = models.CharField(max_length=100)

    frequency = models.CharField(max_length=50)  # e.g. "Weekly", "Monthly"
    additional_comment = models.TextField(blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username
