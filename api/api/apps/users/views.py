from .serializers import ApiUserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth import authenticate


@api_view(['POST'])
@permission_classes([AllowAny])
def create(self, request):
    serializer = ApiUserSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        token = Token.objects.create(user=serializer.instance)

        return Response({
            'token': token.key,
            'user': serializer.to_representation(instance)
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(self, request):
    user = authenticate(
        username=request.data['email'], password=request.data['password'])
    if user is not None:
        return Response("Invalid credentials", status=status.HTTP_400_BAD_REQUEST)

    token = Token.objects.get(user=user)

    user_data = ApiUserSerializer(instance=user).to_representation(user)

    return Response({
        'token': token.key,
        'user': user_data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(self, request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)
