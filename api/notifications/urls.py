from django.urls import path

from .views import NotificationView

urlpatterns = [
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('notifications/<uuid:external_id>/',
         NotificationView.as_view(), name='notification'
         ),

]
