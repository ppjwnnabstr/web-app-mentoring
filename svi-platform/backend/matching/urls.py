from django.urls import path

from .views import MyMatchesView

urlpatterns = [
    path("matches/mine/", MyMatchesView.as_view(), name="matches-mine"),
]
