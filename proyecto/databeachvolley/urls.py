from django.urls import path
from databeachvolley import views


urlpatterns = [
    path('usuarios/', views.UsuariosAPIView.as_view()),
    path('usuario/<pk>/', views.UsuarioAPIView.as_view()),

    path('register/', views.UserRegister.as_view(), name='register'),
	path('login/', views.UserLogin.as_view(), name='login'),
	path('logout/', views.UserLogout.as_view(), name='logout'),
	path('user/', views.UserView.as_view(), name='user'),
    
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('comprobar-usuario/', views.comprobar_usuario, name='comprobar_usuario'),
    path('recover-password/', views.RecoverPasswordView.as_view(), name='recover_password'),

    path('user/groups/<str:dni>/', views.get_user_groups, name='user-groups'),
    path('user/invitations/<str:dni>/', views.get_user_invitations, name='user-invitations'),
    path('user/active-group/', views.set_active_group, name='set-active-group'),
    path('user/active-group/<str:dni>/', views.get_active_group, name='get-active-group'),
    path('groups/<int:group_id>/leave/', views.leave_group, name='leave-group'),
    path('invitations/<int:invitation_id>/', views.handle_invitation, name='handle-invitation'),
    path('groups/create/', views.create_group, name='create-group'),
    path('invitations/create/', views.create_invitation, name='create-invitation'),
    path('groups/<int:group_id>/', views.delete_group, name='delete-group'),
   ]