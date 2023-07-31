from rest_framework import serializers
from .models import ApiUser
from django.contrib.auth import authenticate


class ApiUserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiUser
        fields = ['email', 'password', 'username']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = ApiUser.objects.create_user(**validated_data)
        return user

    def to_representation(self, instance):
        return {
            'email': instance.email,
            'username': instance.username,
            'external_id': instance.external_id
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate_user(self, validated_data):
        user = authenticate(
            username=validated_data['email'],
            password=validated_data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        return user


class ApiUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiUser
        fields = ['email', 'username', 'external_id']
