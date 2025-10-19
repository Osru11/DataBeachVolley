from django.forms import ValidationError
from rest_framework import serializers

from databeachvolley.models import Usuario
from django.contrib.auth import authenticate

UserModel = Usuario

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['dni', 'email','password','nombre','apellidos','tipo']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['email','nombre','apellidos']

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['dni', 'email', 'password', 'nombre', 'apellidos', 'tipo']
        extra_kwargs = {
            'password': {'write_only': True}  # No devolver la contraseña en la respuesta
        }

    def create(self, validated_data):
        # Crear el usuario utilizando todos los campos
        user_obj = Usuario.objects.create(
            dni=validated_data['dni'],
            email=validated_data['email'],
            nombre=validated_data['nombre'],
            apellidos=validated_data['apellidos'],
            tipo=validated_data['tipo']
        )
        # Encriptar la contraseña antes de guardarla
        user_obj.set_password(validated_data['password'])
        user_obj.save()
        return user_obj
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'], password=clean_data[
            'password'])
        if not user:
            raise ValidationError('user not found')
        return user
    
class UserSerializer (serializers. ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)