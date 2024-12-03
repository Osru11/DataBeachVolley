from django.urls import path
from databeachvolley import views


urlpatterns = [
    path('usuarios/', views.UsuariosAPIView.as_view()),
    path('usuario/<pk>/', views.UsuarioAPIView.as_view()),
    path('register/', views.UserRegister.as_view(), name='register'),
	path('login/', views.UserLogin.as_view(), name='login'),
	path('logout/', views.UserLogout.as_view(), name='logout'),
	path('user/', views.UserView.as_view(), name='user'),
   ]