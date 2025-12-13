from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from core.views import health_check

urlpatterns = [
    path("admin/", admin.site.urls),
    # Disabling CSRF for the graphql endpoint (development only)
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path("health/", health_check),
]
