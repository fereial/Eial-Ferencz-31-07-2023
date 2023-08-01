from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth import authenticate, login, logout
from .serializers import ApiUserSerializer, LoginSerializer, ApiUserCreateSerializer


class CreateApiUserView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        serializer = ApiUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            userToken = login(request, instance)
            print(userToken)
            print(serializer.data)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (BasicAuthentication,)

    def post(self, request):

        user = authenticate(
            username=request.data['username'],
            password=request.data['password']
        )

        if user:
            print("entro")
            login(request, user)
            serializer = ApiUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error", "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
