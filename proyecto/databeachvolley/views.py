from django.db.models import Case, When, BooleanField
from django.utils import timezone 
from django.shortcuts import get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import generics, status, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from databeachvolley import serializers
from databeachvolley.models import Usuario
from .validations import custom_validation, validate_email, validate_password
import string
import random

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import (
    Usuario, 
    Grupo, 
    Pertenece, 
    CreaGrupo, 
    GrupoActivo, 
    Invitaciones
)

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

class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def put(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not check_password(old_password, user.password):
            return Response({'error': 'Contraseña actual incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Contraseña actualizada exitosamente'}, status=status.HTTP_200_OK)
    	
class UsuarioAPIView(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Usuario.objects.all()
	serializer_class = serializers.UsuarioSerializer

def comprobar_usuario(request):
    # Verifica si el usuario está autenticado
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    return JsonResponse({'authenticated': False})

class RecoverPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def generate_random_password(self, length=12):
        """Genera una contraseña aleatoria segura"""
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(random.choice(characters) for i in range(length))

    def post(self, request):
        try:
            email = request.data.get('email')
            
            # Verificar si el usuario existe
            user = Usuario.objects.filter(email=email).first()
            if not user:
                return Response(
                    {'error': 'No existe un usuario con este email'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Generar nueva contraseña
            new_password = self.generate_random_password()
            
            # Actualizar la contraseña del usuario
            user.password = make_password(new_password)
            user.save()

            # Enviar email
            send_mail(
                'Recuperación de contraseña - Data Beach Volley',
                f'''
                Hola {user.nombre},
                
                Has solicitado una nueva contraseña para tu cuenta.
                Tu nueva contraseña es: {new_password}
                
                Por favor, cambia esta contraseña tan pronto inicies sesión por motivos de seguridad.
                
                Saludos,
                Data Beach Volley
                ''',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response(
                {'message': 'Se ha enviado una nueva contraseña a tu email'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print(f"Error en recuperación de contraseña: {str(e)}")
            return Response(
                {'error': 'Error al procesar la recuperación de contraseña'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_groups(request, dni):
    if request.user.dni != dni:
        return Response(
            {"error": "No autorizado"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener el grupo activo del usuario
    active_group = GrupoActivo.objects.filter(dni=dni).first()
    
    groups = (Pertenece.objects
             .filter(dni=dni)
             .select_related('id_grupo')  # Optimización de consulta
             .annotate(
                 is_active=Case(
                     When(id_grupo=active_group.id_grupo if active_group else None, then=True),
                     default=False,
                     output_field=BooleanField(),
                 )
             ))
    
    groups_data = []
    for pertenece in groups:
        creator = (CreaGrupo.objects
                  .filter(id_grupo=pertenece.id_grupo)
                  .select_related('dni')
                  .first())
        
        groups_data.append({
            'id_grupo': pertenece.id_grupo.id_grupo,
            'nombre': pertenece.id_grupo.nombre,
            'isActive': pertenece.is_active,
            'creador': {
                'dni': creator.dni.dni,
                'nombre': creator.dni.nombre,
                'apellidos': creator.dni.apellidos
            } if creator else None
        })
    
    return Response(groups_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_invitations(request, dni):
    if request.user.dni != dni:
        return Response(
            {"error": "No autorizado"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    invitations = Invitaciones.objects.filter(
        dni_invitado=dni,
        estado='pendiente'
    ).select_related('id_grupo', 'dni_invitador')
    
    invitations_data = []
    for inv in invitations:
        invitations_data.append({
            'id_invitacion': inv.id_invitacion,
            'nombre_grupo': inv.id_grupo.nombre,
            'invitador': f"{inv.dni_invitador.nombre} {inv.dni_invitador.apellidos}",
            'fecha_invitacion': inv.fecha_invitacion
        })
    
    return Response(invitations_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_active_group(request):
    dni = request.data.get('dni')
    group_id = request.data.get('groupId')
    
    if request.user.dni != dni:
        return Response(
            {"error": "No autorizado"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Verificar que el usuario pertenece al grupo
    if not Pertenece.objects.filter(dni=dni, id_grupo=group_id).exists():
        return Response(
            {"error": "No perteneces a este grupo"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        # Eliminar grupo activo anterior si existe
        GrupoActivo.objects.filter(dni=dni).delete()
        
        # Crear nuevo grupo activo
        grupo_activo = GrupoActivo.objects.create(
            dni_id=dni,
            id_grupo_id=group_id
        )
        
        # Obtener información del grupo para la respuesta
        grupo = Grupo.objects.get(id_grupo=group_id)
        
        return Response({
            "message": "Grupo activo actualizado",
            "grupo": {
                "id_grupo": grupo.id_grupo,
                "nombre": grupo.nombre
            }
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_active_group(request, dni):
    if request.user.dni != dni:
        return Response(
            {"error": "No autorizado"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    active_group = GrupoActivo.objects.filter(dni=dni).select_related('id_grupo').first()
    
    if not active_group:
        return Response(None)
    
    # Obtener información del creador
    creator = CreaGrupo.objects.filter(
        id_grupo=active_group.id_grupo
    ).select_related('dni').first()
    
    # Obtener todos los miembros
    members = Pertenece.objects.filter(
        id_grupo=active_group.id_grupo
    ).select_related('dni')
    
    members_data = []
    for member in members:
        members_data.append({
            'dni': member.dni.dni,
            'nombre': member.dni.nombre,
            'apellidos': member.dni.apellidos,
            'is_creador': member.dni.dni == creator.dni.dni
        })
    
    group_data = {
        'id_grupo': active_group.id_grupo.id_grupo,
        'nombre': active_group.id_grupo.nombre,
        'creador_nombre': f"{creator.dni.nombre} {creator.dni.apellidos}",
        'num_miembros': len(members_data),
        'miembros': members_data
    }
    
    return Response(group_data)

@api_view(['DELETE', 'POST'])  # Agregamos DELETE como método permitido
@permission_classes([IsAuthenticated])
def leave_group(request, group_id):
    dni = request.user.dni  # Usamos el usuario autenticado directamente
    
    # Verificar si el usuario es el creador del grupo
    is_creator = CreaGrupo.objects.filter(id_grupo=group_id, dni=dni).exists()
    if is_creator:
        return Response(
            {"error": "El creador no puede abandonar el grupo"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        # Eliminar pertenencia
        pertenencia = Pertenece.objects.filter(dni=dni, id_grupo=group_id)
        if not pertenencia.exists():
            return Response(
                {"error": "No perteneces a este grupo"},
                status=status.HTTP_400_BAD_REQUEST
            )
        pertenencia.delete()
        
        # Si era el grupo activo, eliminarlo
        GrupoActivo.objects.filter(dni=dni, id_grupo=group_id).delete()
    
    return Response({"message": "Has abandonado el grupo"})

@api_view(['PUT', 'POST'])  # Permitimos ambos métodos
@permission_classes([IsAuthenticated])
def handle_invitation(request, invitation_id):
    invitation = get_object_or_404(Invitaciones, id_invitacion=invitation_id)
    
    # Verificar que el usuario que responde es el invitado
    if request.user.dni != invitation.dni_invitado.dni:
        return Response(
            {"error": "No autorizado para responder a esta invitación"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    new_status = request.data.get('status')
    if new_status not in ['aceptada', 'rechazada']:
        return Response(
            {"error": "Estado no válido"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        invitation.estado = new_status
        invitation.fecha_respuesta = timezone.now()
        invitation.save()
        
        if new_status == 'aceptada':
            # Verificar si ya existe la pertenencia
            if not Pertenece.objects.filter(
                dni=invitation.dni_invitado,
                id_grupo=invitation.id_grupo
            ).exists():
                Pertenece.objects.create(
                    dni=invitation.dni_invitado,
                    id_grupo=invitation.id_grupo
                )
    
    return Response({"message": f"Invitación {new_status} correctamente"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    if int(request.user.tipo) >= 2:
        return Response(
            {"error": "No tienes permisos para crear grupos"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    nombre = request.data.get('nombre')
    if not nombre:
        return Response(
            {"error": "El nombre del grupo es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        grupo = Grupo.objects.create(nombre=nombre)
        
        CreaGrupo.objects.create(
            dni=request.user,
            id_grupo=grupo
        )
        
        Pertenece.objects.create(
            dni=request.user,
            id_grupo=grupo
        )
    
    return Response({"message": "Grupo creado exitosamente"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_invitation(request):
    if int(request.user.tipo) >= 2:
        return Response(
            {"error": "No tienes permisos para enviar invitaciones"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    email_invitado = request.data.get('email_invitado')
    id_grupo = request.data.get('id_grupo')
    
    try:
        # Verificar que el usuario que invita pertenece al grupo
        if not Pertenece.objects.filter(dni=request.user, id_grupo=id_grupo).exists():
            return Response(
                {"error": "No perteneces a este grupo"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        usuario_invitado = Usuario.objects.get(email=email_invitado)
        
        # Verificar si ya existe una invitación pendiente
        if Invitaciones.objects.filter(
            id_grupo_id=id_grupo,
            dni_invitado=usuario_invitado,
            estado='pendiente'
        ).exists():
            return Response(
                {"error": "Ya existe una invitación pendiente para este usuario"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si el usuario ya pertenece al grupo
        if Pertenece.objects.filter(
            id_grupo_id=id_grupo,
            dni=usuario_invitado
        ).exists():
            return Response(
                {"error": "El usuario ya pertenece al grupo"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear la invitación
        Invitaciones.objects.create(
            id_grupo_id=id_grupo,
            dni_invitado=usuario_invitado,
            dni_invitador=request.user
        )
        
        return Response({"message": "Invitación enviada exitosamente"})
        
    except Usuario.DoesNotExist:
        return Response(
            {"error": "El usuario invitado no existe"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    # Verificar si el usuario es el creador del grupo
    is_creator = CreaGrupo.objects.filter(
        id_grupo=group_id, 
        dni=request.user.dni
    ).exists()
    
    if not is_creator:
        return Response(
            {"error": "Solo el creador puede eliminar el grupo"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    with transaction.atomic():
        # Eliminar todas las invitaciones pendientes
        Invitaciones.objects.filter(id_grupo=group_id).delete()
        
        # Eliminar todos los registros de grupo activo
        GrupoActivo.objects.filter(id_grupo=group_id).delete()
        
        # Eliminar todas las pertenencias
        Pertenece.objects.filter(id_grupo=group_id).delete()
        
        # Eliminar el registro de creación
        CreaGrupo.objects.filter(id_grupo=group_id).delete()
        
        # Finalmente eliminar el grupo
        Grupo.objects.filter(id_grupo=group_id).delete()
    
    return Response(
        {"message": "Grupo eliminado exitosamente"},
        status=status.HTTP_200_OK
    )