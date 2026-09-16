from django.db.models import Q
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from mentorship.models import Mentorship
from .models import Task, TaskUpdate
from .serializers import TaskSerializer, TaskUpdateSerializer


def _mentorships_for(user):
    """Mentorships the logged-in user belongs to, as mentor or mentee."""
    q = Q()
    if hasattr(user, "mentor_profile"):
        q |= Q(mentor=user.mentor_profile)
    if hasattr(user, "mentee_profile"):
        q |= Q(mentee=user.mentee_profile)
    if not q:
        return Mentorship.objects.none()
    return Mentorship.objects.filter(q)


class TaskViewSet(viewsets.ModelViewSet):
    """
    GET    /api/tasks/?mentorship=<id>   list tasks for one workspace
    POST   /api/tasks/                   create (mentor only)
    PATCH  /api/tasks/<id>/              update status/fields
    POST   /api/tasks/<id>/updates/      post a progress note (either side)
    """

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        mentorship_ids = _mentorships_for(self.request.user).values_list("id", flat=True)
        qs = Task.objects.filter(mentorship_id__in=mentorship_ids).prefetch_related("updates")

        mentorship_param = self.request.query_params.get("mentorship")
        if mentorship_param:
            qs = qs.filter(mentorship_id=mentorship_param)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        mentorship = serializer.validated_data["mentorship"]

        if not hasattr(user, "mentor_profile") or mentorship.mentor_id != user.mentor_profile.user_id:
            raise PermissionDenied("Only the mentor in this mentorship can assign tasks.")

        serializer.save(created_by=user)

    @action(detail=True, methods=["post"], url_path="updates")
    def add_update(self, request, pk=None):
        task = self.get_object()  # get_queryset already scopes to the user's mentorships
        note = (request.data.get("note") or "").strip()
        if not note:
            return Response({"detail": "note is required."}, status=status.HTTP_400_BAD_REQUEST)

        update = TaskUpdate.objects.create(task=task, author=request.user, note=note)
        return Response(TaskUpdateSerializer(update).data, status=status.HTTP_201_CREATED)
