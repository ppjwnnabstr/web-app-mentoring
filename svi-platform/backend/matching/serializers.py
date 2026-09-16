from rest_framework import serializers

from accounts.serializers import MentorProfileSerializer, MenteeProfileSerializer
from .models import Match


class MatchSerializer(serializers.ModelSerializer):
    """Used by the mentee page: one card per match, mentor nested in full."""

    mentor = MentorProfileSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ["id", "mentor", "interest_score", "goal_score", "overall_score", "computed_at"]


class MatchWithMenteeSerializer(serializers.ModelSerializer):
    """Used anywhere we need the mentee side nested instead (e.g. mentor-facing views)."""

    mentee = MenteeProfileSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ["id", "mentee", "interest_score", "goal_score", "overall_score", "computed_at"]
