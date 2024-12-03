import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa BrowserRouter y Routes
import Registro from './registro'
import Login from './login'
import Inicio from './inicio'
import Home from './home'


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const App = () => {

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    client
      .get("/api/user/")
      .then(() => {
        setCurrentUser(true);
      })
      .catch(() => {
        setCurrentUser(false);
      });
  }, []);

  if (currentUser) {
    return (
      <Router> 
        <div>
          <header>
            <nav className="navbar navbar-dark bg-dark">
              <div className="container-fluid">
                <a className="navbar-brand" href="/inicio">Data Beach Volley</a>
                <div>
                  <button className="btn btn-outline-light me-2" onClick={() => window.location.href = '/grupos'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                    </svg> Grupos
                  </button>
                  <button className="btn btn-primary" onClick={() => window.location.href = '/perfil'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          </header>
          
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/grupos" element={<Home />} />
            <Route path="/profile" element={<Home />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    )
  }

  return (
    <Router> 
      <div>
        <header>
          <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">Data Beach Volley</a>
              <div>
                <button className="btn btn-outline-light me-2" onClick={() => window.location.href = '/login'}>Iniciar Sesión</button>
                <button className="btn btn-primary" onClick={() => window.location.href = '/registro'}>Registrarse</button>
              </div>
            </div>
          </nav>
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Home />} /> 
        </Routes>
      </div>
    </Router>
  )
}

export default App;
