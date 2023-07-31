from django.urls import path

from .views import create, login, logout

urlpatterns = [
    path('post/create_user', create),
    path('post/login', login),
    path('post/logout', logout),
]
