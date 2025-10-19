import React, { useState, useEffect } from 'react';
import { getUser } from "./authService";
import axiosInstance from "./axiosInstance";

const USER_TYPES = {
  0: 'Entrenador',
  1: 'Estadístico', 
  2: 'Jugador'
};

const Usuario = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        setUserData(response.user);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del usuario',
          confirmButtonText: 'Aceptar'
        });
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditedUser({...userData});
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Validate inputs
      if (!editedUser.nombre || !editedUser.apellidos || !editedUser.email) {
        throw new Error('Todos los campos son obligatorios');
      }

        try {
            setUserData(editedUser);
            setIsEditing(false);

            axiosInstance.put("/api/user/",editedUser)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Perfil Actualizado',
                    text: 'La información del perfil ha sido actualizada',
                    confirmButtonText: 'Aceptar'
                });
            });
        }catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.message || 'No se pudo actualizar el perfil',
              confirmButtonText: 'Aceptar'
            });
          }
      
} catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo actualizar el perfil',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las nuevas contraseñas no coinciden',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    try {
      await axiosInstance.put('/api/change-password/', {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Contraseña Actualizada',
        text: 'Tu contraseña ha sido cambiada exitosamente',
        confirmButtonText: 'Aceptar'
      });
  
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setIsChangingPassword(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'No se pudo cambiar la contraseña',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará tu cuenta permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance.delete("/api/user/")
        Swal.fire(
          'Cuenta Eliminada',
          'Tu cuenta ha sido eliminada permanentemente',
          'success'
        );
      }
    }).then(() => {
      window.location.href = "/home";
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error al cargar la información del usuario
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Perfil de Usuario */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Perfil de Usuario</h3>
              {!isEditing && (
                <div>
                  <button 
                    className="btn btn-outline-light me-2" 
                    onClick={handleEdit}
                  >
                    <i className="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-1"></i>Eliminar
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              {isEditing ? (
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="nombre"
                        value={editedUser.nombre || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellidos</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="apellidos"
                        value={editedUser.apellidos || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={editedUser.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleSave}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              ) : (
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <div className="avatar-container">
                      <i className="bi bi-person-circle display-1 text-muted"></i>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <strong>Nombre Completo:</strong> {userData.nombre} {userData.apellidos}
                    </div>
                    <div className="mb-3">
                      <strong>Correo Electrónico:</strong> {userData.email}
                    </div>
                    <div className="mb-3">
                      <strong>DNI:</strong> {userData.dni}
                    </div>
                    <div className="mb-3">
                      <strong>Último Inicio de Sesión:</strong> {new Date(userData.last_login).toLocaleString()}
                    </div>
                    <div className="mb-3">
                      <strong>Tipo de Usuario:</strong> {USER_TYPES[userData.tipo] || 'Tipo de usuario desconocido'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Cambiar Contraseña</h4>
            </div>
            <div className="card-body">
              {isChangingPassword ? (
                <form>
                  <div className="mb-3">
                    <label className="form-label">Contraseña Actual</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Introduce tu contraseña actual"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Introduce tu nueva contraseña"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar Nueva Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmNewPassword"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handlePasswordChange}
                    >
                      Cambiar Contraseña
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <i className="bi bi-key me-2"></i>Cambiar Contraseña
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;