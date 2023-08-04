from django.urls import path

from .views import NotificationView

urlpatterns = [
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('notifications/<uuid:user_external_id>/',
         NotificationView.as_view(), name='notifications'),
    path('notifications/<uuid:user_external_id>/<uuid:external_id>/',
         NotificationView.as_view(), name='notifications'),

]
