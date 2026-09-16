from rest_framework import serializers

from accounts.serializers import MentorProfileSerializer, MenteeProfileSerializer
from .models import MentorshipRequest, Mentorship


class MentorshipRequestSerializer(serializers.ModelSerializer):
    """
    Used by the Mentor page: one card per incoming request, with the
    mentee's profile and the match-detail breakdown nested in.
    """

    mentee = MenteeProfileSerializer(read_only=True)
    interest_score = serializers.DecimalField(
        source="match.interest_score", max_digits=5, decimal_places=2, read_only=True, allow_null=True
    )
    goal_score = serializers.DecimalField(
        source="match.goal_score", max_digits=5, decimal_places=2, read_only=True, allow_null=True
    )
    overall_score = serializers.DecimalField(
        source="match.overall_score", max_digits=5, decimal_places=2, read_only=True, allow_null=True
    )

    class Meta:
        model = MentorshipRequest
        fields = [
            "id",
            "mentee",
            "status",
            "message",
            "requested_at",
            "responded_at",
            "interest_score",
            "goal_score",
            "overall_score",
        ]


class CreateMentorshipRequestSerializer(serializers.Serializer):
    """Used by the Mentee page's 'Select mentor' action."""

    mentor_id = serializers.IntegerField()
    message = serializers.CharField(required=False, allow_blank=True, default="")


class MentorshipSerializer(serializers.ModelSerializer):
    mentor = MentorProfileSerializer(read_only=True)
    mentee = MenteeProfileSerializer(read_only=True)

    class Meta:
        model = Mentorship
        fields = ["id", "mentor", "mentee", "status", "started_at", "ended_at"]
