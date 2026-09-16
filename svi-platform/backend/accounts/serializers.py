from rest_framework import serializers

from .models import User, MentorProfile, MenteeProfile


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "employee_no",
            "email",
            "full_name",
            "first_name",
            "last_name",
            "role",
            "department",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MentorProfile
        fields = [
            "user",
            "photo",
            "career_biography",
            "exp_1st",
            "exp_2nd",
            "exp_3rd",
            "strength_1st",
            "strength_2nd",
            "strength_3rd",
            "availability",
            "capacity",
            "is_accepting",
        ]


class MenteeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MenteeProfile
        fields = [
            "user",
            "photo",
            "goal_1st",
            "goal_2nd",
            "goal_3rd",
            "interest_1st",
            "interest_2nd",
            "interest_3rd",
            "frequency",
            "additional_comment",
        ]
