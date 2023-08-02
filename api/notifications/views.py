from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import NotificationSerializer
from users.models import ApiUser
from .models import Notification


class NotificationView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (BasicAuthentication,)

    def get(self, request, user_external_id=None, external_id=None):
        try:
            user = ApiUser.get_by_external_id(external_id=user_external_id)

        except ApiUser.DoesNotExist:
            return Response({"error": "Error finding the user"}, status=status.HTTP_401_UNAUTHORIZED)

        if external_id:
            try:
                notification = Notification.objects.get(
                    sent_by=user.email,
                    external_id=external_id
                )

            except Notification.DoesNotExist:
                return Response({"error": "Error finding the message"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = NotificationSerializer(notification)

            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        sent_notifications = Notification.objects.filter(sent_by=user.email)

        received_notifications = Notification.objects.filter(
            received_by=user.email)

        sent_notifications_serializer = NotificationSerializer(
            sent_notifications, many=True)
        received_notifications_serializer = NotificationSerializer(
            received_notifications, many=True)

        return Response({
            'sent_notifications': sent_notifications_serializer.data,
            'received_notifications': received_notifications_serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_external_id=None, external_id=None):
        user_external_id = request.data.get('user_external_id')
        try:
            user = ApiUser.get_by_external_id(external_id=user_external_id)

        except ApiUser.DoesNotExist:
            return Response({"error": "Error finding the user"}, status=status.HTTP_401_UNAUTHORIZED)

        if external_id:
            try:
                notification = Notification.objects.get(
                    external_id=external_id
                )

            except Notification.DoesNotExist:
                return Response({"error": "Error finding the message"}, status=status.HTTP_400_BAD_REQUEST)

            notification.delete()
            return Response(status=status.HTTP_200_OK)

        return Response({"error": "Error finding the message"}, status=status.HTTP_400_BAD_REQUEST)
