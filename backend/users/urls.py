from django.urls import path

from .views import CreateApiUserView, LoginView, LogoutView

urlpatterns = [
    path('create_api_user/', CreateApiUserView.as_view(), name='create'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
