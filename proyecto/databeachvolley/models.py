from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


opciones = [
    [0,'entrenador'],
    [1,'estadistico'],
    [2,'jugador']
]


class AppUserManager(BaseUserManager):
	def create_user(self, email, password=None, **extra_fields):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		email = self.normalize_email(email)
		user = self.model(email=email,**extra_fields)
		user.set_password(password)
		user.save(using=self.db)
		return user


class Usuario(AbstractBaseUser):
    dni = models.CharField(unique=True,primary_key=True,max_length=9)
    email = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=128)
    nombre = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=100)
    tipo = models.CharField(choices=opciones,max_length=12)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['dni','password','nombre','apellidos','tipo']
    objects = AppUserManager()
	
    def __str__(self):
        return f'{self.dni}'
