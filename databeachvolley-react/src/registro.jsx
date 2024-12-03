import { useNavigate } from 'react-router-dom';
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
  const [nuevoUsuario, setNuevoUsuario] = useState({
    dni: '',
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    tipo: ''
  });

  const navigate = useNavigate(); 

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

    client
      .post("/api/register/", nuevoUsuario)
      .then(() => {
        return client.post("/api/login/", { email, password });
      })
      .then(() => {
        alert("Usuario Registrado y Logeado correctamente");

        // Redirigir a la página de inicio
        navigate("/");
      })
      .catch((error) => {
        alert("ERROR");
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
