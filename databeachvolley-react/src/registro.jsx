import { useAuth } from "./AuthContext";
import { useState } from 'react';
import './App.css';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function Registro() {
  const {loginUser} = useAuth();

  const [nuevoUsuario, setNuevoUsuario] = useState({
    dni: '',
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    tipo: ''
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setNuevoUsuario({
      ...nuevoUsuario,
      [name]: value
    });
  };

  const crearUsuario = (e) => {
    e.preventDefault();
    const { email, password } = nuevoUsuario;

    client.post("/api/register/", nuevoUsuario)
      .then(async () => {
        await loginUser(email, password);
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario Registrado',
          text: 'Has sido registrado y logeado correctamente',
          confirmButtonText: 'Ir al Inicio',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          // Redirigir a la página de inicio
          window.location.href = "/inicio";
        });
      })
      .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: error.message || 'Ocurrió un error durante el registro',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#d33'
      });
      console.error(error);
      });
  };

  return (
    <form onSubmit={crearUsuario}>
      <div className='card mx-auto mt-5' style={{ maxWidth: '520px' }}>
        <div className='d-grid gap-3'>
          <input
            name="nombre"
            type="text"
            placeholder='Nombre'
            className='form-control'
            required
            onChange={handleChange}
          />
          <input
            name="apellidos"
            type="text"
            placeholder='Apellidos'
            className='form-control'
            required
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder='Email'
            className='form-control'
            required
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className='form-control'
            required
            onChange={handleChange}
          />
          <input
            name="dni"
            type="text"
            placeholder='DNI'
            className='form-control'
            required
            onChange={handleChange}
          />
          <select
            name="tipo"
            defaultValue=""
            required
            className='form-control'
            onChange={handleChange}
          >
            <option value="" disabled>Seleccione tipo de cuenta</option>
            <option value="0">Entrenador</option>
            <option value="2">Jugador</option>
            <option value="1">Estadístico</option>
          </select>
          <button type="submit" className='btn btn-primary'>Registrarse</button>
        </div>
      </div>
    </form>
  );
}

export default Registro;
