from django.shortcuts import render
from rest_framework import generics
from databeachvolley import serializers
from databeachvolley.models import Usuario

from django.contrib.auth import login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions , status
from rest_framework.response import Response
from .validations import custom_validation, validate_email, validate_password
from rest_framework.views import APIView

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

class UsuariosAPIView(generics.ListAPIView):
	permission_classes = (permissions.AllowAny,)
	serializer_class = serializers.UsuariosSerializer
	queryset = Usuario.objects.all()

class UserRegister(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Usuario.objects.all()
    serializer_class = serializers.UserRegisterSerializer

    def post(self, request):
        # Validar y limpiar los datos
        clean_data = custom_validation(request.data)

        # Pasar los datos al serializer
        serializer = serializers.UserRegisterSerializer(data=clean_data)

        if serializer.is_valid():
            # Crear el usuario automáticamente
            user = serializer.save()

            # Retornar la respuesta exitosa con los datos del nuevo usuario (excepto la contraseña)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Retornar errores si hay problemas de validación
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serializer = serializers.UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    serializer_class = serializers.UserSerializer
    queryset = Usuario.objects.values('email', 'nombre', 'apellidos')

    def get_object(self):
        return self.request.user  # Esto hace que siempre se devuelva el usuario autenticado.

    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = serializers.UsuarioSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	
class UsuarioAPIView(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Usuario.objects.all()
	serializer_class = serializers.UsuarioSerializer

def comprobar_usuario(request):
    # Verifica si el usuario está autenticado
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    return JsonResponse({'authenticated': False})