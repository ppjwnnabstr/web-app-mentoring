from rest_framework import serializers

from .models import Task, TaskUpdate


class TaskUpdateSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_role = serializers.SerializerMethodField()

    class Meta:
        model = TaskUpdate
        fields = ["id", "task", "author", "author_name", "author_role", "note", "created_at"]
        read_only_fields = ["author"]

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else "Unknown"

    def get_author_role(self, obj):
        return obj.author.role if obj.author else None


class TaskSerializer(serializers.ModelSerializer):
    updates = TaskUpdateSerializer(many=True, read_only=True)
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id",
            "mentorship",
            "task_name",
            "task_detail",
            "attachment",
            "status",
            "due_date",
            "created_by",
            "created_at",
            "updated_at",
            "assigned_to_name",
            "updates",
        ]
        read_only_fields = ["created_by"]

    def get_assigned_to_name(self, obj):
        return obj.assigned_to.user.get_full_name()
