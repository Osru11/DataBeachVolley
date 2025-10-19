import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { useAuth } from "./AuthContext";
import { recoverPassword } from './passwordRecovery';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const Login = () => {
  const {user} = useAuth();

  const {loginUser} = useAuth();

  const submitLogin = async (e) => {
    
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (user) {
      Swal.fire({
        icon: "error",
        title: "Ya hay una sesión iniciada.",
      });
    }else{
      try {
        await loginUser(email, password); 
  
        Swal.fire({
          icon: "success",
          title: "Has iniciado sesión correctamente",
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.href = "/inicio";
        });
  
  
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Credenciales inválidas",
          text: "Compruebe su email y contraseñe e intentelo de nuevo."
        });
  
      }
    }
  };

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate(); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleRecoverPassword = () => {
    recoverPassword();
  };

  return (
    <div className="card mx-auto mt-5" style={{ maxWidth: '520px' }}>
      <div className="card-body">
        <h1 className="text-center">Data Beach Volley</h1>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={submitLogin}>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              placeholder="Introduzca su correo electrónico"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleRecoverPassword}>
              Recuperar contraseña
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <a href="" onClick={() => navigate("/registro")}>
            ¿No tienes cuenta? Regístrate.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
