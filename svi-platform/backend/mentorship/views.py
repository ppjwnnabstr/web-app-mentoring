from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import MentorProfile
from matching.models import Match
from .models import MentorshipRequest, Mentorship
from .serializers import (
    MentorshipRequestSerializer,
    CreateMentorshipRequestSerializer,
    MentorshipSerializer,
)


class CreateMentorshipRequestView(APIView):
    """
    POST /api/requests/  { "mentor_id": <MentorProfile.user_id>, "message": "" }
    The Mentee page's 'Select mentor' button.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not hasattr(request.user, "mentee_profile"):
            raise PermissionDenied("Only mentees can send mentorship requests.")

        serializer = CreateMentorshipRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mentee = request.user.mentee_profile
        mentor = get_object_or_404(MentorProfile, user_id=serializer.validated_data["mentor_id"])
        match = Match.objects.filter(mentee=mentee, mentor=mentor).first()

        try:
            req = MentorshipRequest.objects.create(
                mentee=mentee,
                mentor=mentor,
                match=match,
                message=serializer.validated_data.get("message", ""),
            )
        except IntegrityError:
            raise ValidationError("You already have a pending request to this mentor.")

        return Response(MentorshipRequestSerializer(req).data, status=status.HTTP_201_CREATED)


class MyMentorRequestsView(generics.ListAPIView):
    """
    GET /api/requests/mine/?status=p
    The Mentor page's request list. Defaults to pending only.
    """

    serializer_class = MentorshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, "mentor_profile"):
            raise PermissionDenied("Only mentors have incoming requests.")

        status_param = self.request.query_params.get("status", MentorshipRequest.Status.PENDING)
        qs = MentorshipRequest.objects.filter(mentor=user.mentor_profile).select_related(
            "mentee__user", "match"
        )
        if status_param:
            qs = qs.filter(status=status_param)
        return qs.order_by("-requested_at")


class RespondToRequestView(APIView):
    """
    POST /api/requests/<id>/accept/
    POST /api/requests/<id>/reject/
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, decision):
        req = get_object_or_404(MentorshipRequest, pk=pk)

        if not hasattr(request.user, "mentor_profile") or req.mentor_id != request.user.mentor_profile.user_id:
            raise PermissionDenied("You can only respond to your own requests.")

        if req.status != MentorshipRequest.Status.PENDING:
            raise ValidationError("This request has already been responded to.")

        if decision == "accept":
            req.accept()
        else:
            req.reject()

        return Response(MentorshipRequestSerializer(req).data)


class MyMentorshipView(APIView):
    """
    GET /api/mentorships/mine/
    The active mentorship for the logged-in user (mentor or mentee) —
    used by the Workspace page to know which task board to load.
    Returns a list since a mentor may have several active mentorships.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, "mentor_profile"):
            qs = Mentorship.objects.filter(mentor=user.mentor_profile, status=Mentorship.Status.ACTIVE)
        elif hasattr(user, "mentee_profile"):
            qs = Mentorship.objects.filter(mentee=user.mentee_profile, status=Mentorship.Status.ACTIVE)
        else:
            qs = Mentorship.objects.none()

        qs = qs.select_related("mentor__user", "mentee__user")
        return Response(MentorshipSerializer(qs, many=True).data)
