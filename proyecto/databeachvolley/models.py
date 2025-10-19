from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models import F

TIPO_USUARIO_CHOICES = [
    ('0', 'entrenador'),
    ('1', 'estadistico'),
    ('2', 'jugador')
]

class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class Usuario(AbstractBaseUser):
    dni = models.CharField(unique=True, primary_key=True, max_length=9)
    email = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=128)
    nombre = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=100)
    tipo = models.CharField(max_length=12, choices=TIPO_USUARIO_CHOICES)
    last_login = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['dni', 'nombre', 'apellidos', 'tipo']
    
    objects = AppUserManager()

    class Meta:
        db_table = 'databeachvolley_usuario'

    def __str__(self):
        return f'{self.dni}'

class Grupo(models.Model):
    id_grupo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        db_table = 'databeachvolley_grupo'

    def __str__(self):
        return self.nombre

class Sesion(models.Model):
    id_sesion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=12)

    class Meta:
        db_table = 'databeachvolley_sesion'

class CreaSesion(models.Model):
    id_sesion = models.ForeignKey(Sesion, on_delete=models.CASCADE)
    dni = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databeachvolley_crea_sesion'
        unique_together = (('id_sesion', 'dni'),)

class Contenido(models.Model):
    id_contenido = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)
    tipo = models.CharField(max_length=12)

    class Meta:
        db_table = 'databeachvolley_contenido'

class Envia(models.Model):
    id_contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE)
    dni = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databeachvolley_envia'
        unique_together = (('id_contenido', 'dni'),)

class Registra(models.Model):
    id_contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE)
    dni = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databeachvolley_registra'
        unique_together = (('id_contenido', 'dni'),)


class Pertenece(models.Model):
    id_grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='id_grupo', primary_key=True)
    dni = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='dni')
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databeachvolley_pertenece'
        unique_together = (('id_grupo', 'dni'),)
        managed = False

    def __str__(self):
        return f"{self.dni} - {self.id_grupo}"

class CreaGrupo(models.Model):
    id_grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='id_grupo', primary_key=True)
    dni = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='dni')
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databeachvolley_crea_grupo'
        unique_together = (('id_grupo', 'dni'),)
        managed = False

class GrupoActivo(models.Model):
    dni = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='dni')
    id_grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='id_grupo')
    fecha_activacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databeachvolley_grupo_activo'

class Invitaciones(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptada', 'Aceptada'),
        ('rechazada', 'Rechazada')
    ]

    id_invitacion = models.AutoField(primary_key=True)
    id_grupo = models.ForeignKey(
        Grupo, 
        on_delete=models.CASCADE,
        db_column='id_grupo'  # Especificamos el nombre exacto de la columna
    )
    dni_invitado = models.ForeignKey(
        Usuario, 
        related_name='invitaciones_recibidas', 
        on_delete=models.CASCADE,
        db_column='dni_invitado'  # Especificamos el nombre exacto de la columna
    )
    dni_invitador = models.ForeignKey(
        Usuario, 
        related_name='invitaciones_enviadas', 
        on_delete=models.CASCADE,
        db_column='dni_invitador'  # Especificamos el nombre exacto de la columna
    )
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente')
    fecha_invitacion = models.DateTimeField(auto_now_add=True)
    fecha_respuesta = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'databeachvolley_invitaciones'