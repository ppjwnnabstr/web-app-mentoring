from django.urls import path

from .views import (
    CreateMentorshipRequestView,
    MyMentorRequestsView,
    RespondToRequestView,
    MyMentorshipView,
)

urlpatterns = [
    path("requests/", CreateMentorshipRequestView.as_view(), name="requests-create"),
    path("requests/mine/", MyMentorRequestsView.as_view(), name="requests-mine"),
    path(
        "requests/<int:pk>/accept/",
        RespondToRequestView.as_view(),
        {"decision": "accept"},
        name="requests-accept",
    ),
    path(
        "requests/<int:pk>/reject/",
        RespondToRequestView.as_view(),
        {"decision": "reject"},
        name="requests-reject",
    ),
    path("mentorships/mine/", MyMentorshipView.as_view(), name="mentorships-mine"),
]
