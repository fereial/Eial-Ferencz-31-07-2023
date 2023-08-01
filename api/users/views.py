from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth import authenticate, login, logout
from .serializers import ApiUserSerializer, ApiUserCreateSerializer, LoginSerializer


class CreateApiUserView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        serializer = ApiUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            login(request, instance)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (BasicAuthentication,)

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            user = authenticate(
                username=serializer.data.get('username'),
                password=serializer.data.get('password')
            )

            print(user)
            if user:
                login(request, user)
                serializer = ApiUserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
