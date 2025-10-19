import React, { useState, useEffect } from 'react';
import { Users, UserPlus, LogOut, Check, X, Plus, Mail, Star, Trash2 } from 'lucide-react';
import { getUser } from "./authService";
import axiosInstance from "./axiosInstance";

// Componentes Card personalizados con Bootstrap
const Card = ({ children, className = '' }) => (
  <div className={`card ${className} mb-4`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h5 className={`card-title mb-0 ${className}`}>
    {children}
  </h5>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

const GroupsManagement = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        setUserData(response.user);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar la información del usuario');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchGroups = async () => {
    if (!userData?.dni) return;
    try {
      const response = await axiosInstance.get(`/api/user/groups/${userData.dni}/`);
      setGroups(response.data);
    } catch (err) {
      setError('Error al cargar los grupos');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axiosInstance.delete(`/api/groups/${groupToDelete}/`);
      setSuccess('Grupo eliminado exitosamente');
      setShowDeleteModal(false);
      setGroupToDelete(null);
      fetchGroups();
    } catch (err) {
      setError('Error al eliminar el grupo');
    }
  };

  const handleSetActiveGroup = async (groupId) => {
    try {
      await axiosInstance.post('/api/user/active-group/', {
        dni: userData.dni,
        groupId: groupId
      });
      
      setSuccess('Grupo activo actualizado exitosamente');
      fetchGroups(); // Refresh groups to update active status
    } catch (err) {
      setError('Error al establecer el grupo activo');
    }
  };

  const fetchInvitations = async () => {
    if (!userData?.dni) return;
    try {
      const response = await axiosInstance.get(`/api/user/invitations/${userData.dni}/`);
      setInvitations(response.data);
    } catch (err) {
      setError('Error al cargar las invitaciones');
    }
  };

  useEffect(() => {
    if (userData?.dni) {
      fetchGroups();
      fetchInvitations();
    }
  }, [userData]);

  const handleCreateGroup = async () => {
    try {
      await axiosInstance.post('/api/groups/create/', {
        nombre: newGroupName,
        creador_dni: userData.dni
      });
      
      setSuccess('Grupo creado exitosamente');
      setShowCreateGroupModal(false);
      setNewGroupName('');
      fetchGroups();
    } catch (err) {
      // Mejorar el manejo de errores para mostrar el mensaje específico
      setError(err.response?.data?.error || 'Error al crear el grupo');
      console.error('Error detallado:', err.response?.data);
    }
  };

  const handleInviteUser = async () => {
    try {
      await axiosInstance.post('/api/invitations/create/', {
        email_invitado: inviteEmail,
        id_grupo: selectedGroup,
        dni_invitador: userData.dni
      });

      setSuccess('Invitación enviada exitosamente');
      setShowInviteModal(false);
      setInviteEmail('');
      setSelectedGroup(null);
    } catch (err) {
      setError('Error al enviar la invitación');
    }
  };

  const handleInvitation = async (invitationId, status) => {
    try {
      await axiosInstance.put(`/api/invitations/${invitationId}/`, {
        status: status
      });
      
      setSuccess(`Invitación ${status === 'aceptada' ? 'aceptada' : 'rechazada'} exitosamente`);
      fetchInvitations();
      if (status === 'aceptada') {
        fetchGroups();
      }
    } catch (err) {
      setError(`Error al ${status === 'aceptada' ? 'aceptar' : 'rechazar'} la invitación`);
      console.error('Error detallado:', err.response?.data);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await axiosInstance.delete(`/api/groups/${groupId}/leave/`);
      setSuccess('Has abandonado el grupo exitosamente');
      fetchGroups();
    } catch (err) {
      setError('Error al abandonar el grupo');
      console.error('Error detallado:', err.response?.data);
    }
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

  const canManageGroups = userData?.tipo < 2;
  return (
    <div className="container py-4">
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4" role="alert">
          {success}
        </div>
      )}

      <div className="row">
        {/* Grupos */}
        <div className="col-12">
          <Card>
            <CardHeader className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle>
                  <div className="d-flex align-items-center">
                    <Users className="me-2" size={20} />
                    <span>Mis Grupos</span>
                  </div>
                </CardTitle>
                {canManageGroups && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowCreateGroupModal(true)}
                  >
                    <Plus size={18} className="me-1" />
                    Crear Grupo
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <p className="text-muted">No perteneces a ningún grupo</p>
              ) : (
                <div className="list-group list-group-flush">
                  {groups.map((group) => (
                    <div key={group.id_grupo} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">
                            {group.nombre}
                            {group.isActive && (
                              <span className="badge bg-primary ms-2">Activo</span>
                            )}
                          </h6>
                          <small className="text-muted">
                            Creado por: {group.creador.nombre} {group.creador.apellidos}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          {!group.isActive && (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleSetActiveGroup(group.id_grupo)}
                              title="Establecer como grupo activo"
                            >
                              <Star size={18} />
                            </button>
                          )}
                          {canManageGroups && group.creador.dni === userData?.dni && (
                            <>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  setSelectedGroup(group.id_grupo);
                                  setShowInviteModal(true);
                                }}
                              >
                                <Mail size={18} />
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  setGroupToDelete(group.id_grupo);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                          {(group.creador.dni !== userData?.dni || !canManageGroups) && (
                            <button
                              onClick={() => handleLeaveGroup(group.id_grupo)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              <LogOut size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modal Crear Grupo */}
        {showCreateGroupModal && (
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Nuevo Grupo</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateGroupModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="groupName" className="form-label">Nombre del Grupo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateGroupModal(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleCreateGroup}>
                    Crear Grupo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Invitar Usuario */}
        {showInviteModal && (
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Invitar Usuario</h5>
                  <button type="button" className="btn-close" onClick={() => setShowInviteModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="userEmail" className="form-label">Email del Usuario</label>
                    <input
                      type="email"
                      className="form-control"
                      id="userEmail"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleInviteUser}>
                    Enviar Invitación
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal Confirmar Eliminación */}
        {showDeleteModal && (
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteGroup}>
                    Eliminar Grupo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Invitaciones */}
        <div className="col-12 mt-4">
          <Card>
            <CardHeader className="bg-light">
              <CardTitle>
                <div className="d-flex align-items-center">
                  <UserPlus className="me-2" size={20} />
                  <span>Invitaciones Pendientes</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <p className="text-muted">No tienes invitaciones pendientes</p>
              ) : (
                <div className="list-group list-group-flush">
                  {invitations.map((invitation) => (
                    <div key={invitation.id_invitacion} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{invitation.nombre_grupo}</h6>
                          <small className="text-muted">
                            Invitado por: {invitation.invitador}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleInvitation(invitation.id_invitacion, 'aceptada')}
                            className="btn btn-outline-success btn-sm"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleInvitation(invitation.id_invitacion, 'rechazada')}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupsManagement;