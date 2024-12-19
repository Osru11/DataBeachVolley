import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const Grupos = () => {
    const [groupData, setGroupData] = useState({
        name: '',
        category: '',
        description: '',
        photo: null,
    });
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [newUser, setNewUser] = useState({ email: '', personalData: '' });
    const [isCreating, setIsCreating] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setGroupData((prev) => ({
            ...prev,
            photo: e.target.files[0],
        }));
    };

    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addUser = () => {
        if (!newUser.email || !newUser.personalData) {
            Swal.fire('Error', 'Por favor, completa todos los campos para invitar al usuario.', 'error');
            return;
        }
        setInvitedUsers([...invitedUsers, newUser]);
        setNewUser({ email: '', personalData: '' });
    };

    const createGroup = async () => {
        const formData = new FormData();
        formData.append('name', groupData.name);
        formData.append('category', groupData.category);
        formData.append('description', groupData.description);
        if (groupData.photo) {
            formData.append('photo', groupData.photo);
        }

        try {
            setIsCreating(true);
            const response = await axiosInstance.post('api/groups/', formData);
            Swal.fire('Grupo creado', `El grupo "${response.data.name}" fue creado exitosamente.`, 'success');
            setGroupData({ name: '', category: '', description: '', photo: null });
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el grupo. Intenta nuevamente.', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const sendInvitations = async () => {
        try {
            const response = await axiosInstance.post('api/groups/invite/', { users: invitedUsers });
            Swal.fire('Invitaciones enviadas', `${response.data.success.length} invitaciones enviadas con éxito.`, 'success');
            setInvitedUsers([]);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron enviar las invitaciones.', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-dark text-white">
                            <h3 className="mb-0">Crear Nuevo Grupo</h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Nombre del Grupo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={groupData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Categoría</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    value={groupData.category}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={groupData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Foto del Grupo</label>
                                <input type="file" className="form-control" onChange={handleFileChange} />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={createGroup}
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creando...' : 'Crear Grupo'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white">
                            <h3 className="mb-0">Invitar Usuarios</h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleUserInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Datos Personales</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="personalData"
                                    value={newUser.personalData}
                                    onChange={handleUserInputChange}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={addUser}
                                >
                                    Añadir Usuario
                                </button>
                            </div>

                            <ul className="mt-3 list-group">
                                {invitedUsers.map((user, index) => (
                                    <li key={index} className="list-group-item">
                                        {user.email} - {user.personalData}
                                    </li>
                                ))}
                            </ul>

                            <div className="d-flex justify-content-end mt-3">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={sendInvitations}
                                >
                                    Enviar Invitaciones
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grupos;
