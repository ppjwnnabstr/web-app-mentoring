from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Match
from .serializers import MatchSerializer


class MyMatchesView(generics.ListAPIView):
    """
    GET /api/matches/mine/?limit=4
    Top mentor matches for the logged-in mentee, highest score first.
    Powers the Mentee page's 4 cards.
    """

    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, "mentee_profile"):
            raise PermissionDenied("Only mentees have match results.")

        limit = int(self.request.query_params.get("limit", 4))
        return (
            Match.objects.filter(mentee=user.mentee_profile)
            .select_related("mentor__user")
            .order_by("-overall_score")[:limit]
        )
