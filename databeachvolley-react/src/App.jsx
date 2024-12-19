import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Registro from "./registro";
import Login from "./login";
import Inicio from "./inicio";
import Home from "./home";
import Usuario from "./usuario"
import Grupos from './grupos';

const Navbar = ({ toPage }) => {
  const { user, logoutUser , loading} = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const headerRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Seguro que quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
      }
    });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      if (window.scrollY > 0) {
        headerRef.current.className = "header-fixed";
      } else {
        headerRef.current.className = "header";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [])

  if (loading){
    return(
      <></>
    );
  }
  
  return (
    <>
      <header id="hm-header" className='hm-header' ref={headerRef}>
        <nav className="text-warning navbar navbar-dark bg-dark">
          <div className="container-fluid">
            {user && (
              <>
                <button
                  className="btn btn-outline-light fs-5 me-2 navbar-toggler"
                  type="button"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-list"></i>
                </button>
              </>
            )}
            <a className="navbar-brand" style={{ cursor: "pointer" }} onClick={toPage("inicio")}>
              Data Beach Volley
            </a>
            <div>
              {user ? (
                <>
                  <button className="btn btn-outline-light fs-5 me-2 navbar-toggler" onClick={toPage("grupos")}>
                    <i className="bi bi-people"></i>
                  </button>
                  <button className="btn btn-outline-light fs-5 me-2 navbar-toggler" onClick={toPage("usuario")}>
                    <i className="bi bi-person-circle"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger fs-5 me-2 navbar-toggler"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline-light me-2 navbar-toggler"
                    onClick={toPage("login")}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    className="btn btn btn-outline-primary me-2 navbar-toggler"
                    onClick={toPage("registro")}
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Menú lateral */}
      <div className={`z-3 sidebar bg-dark position-fixed h-100 ${ isSidebarOpen ? "d-block" : "d-none"
        }`}
      >
        <ul className="list-group list-group-flush">
          <li className="bg-dark list-group-item text-secondary">
            <i className="bi bi-calendar-week"> </i>
            <a style={{ cursor: "pointer" }} onClick={toPage("")}>Calendario</a>
          </li>
          <li className="bg-dark list-group-item text-secondary">
            <i className="bi bi-chat"> </i>
            <a style={{ cursor: "pointer" }} onClick={toPage("")}>Foro</a>
          </li>
          <li className="bg-dark list-group-item text-secondary">
            <i className="bi bi-person-workspace"> </i>
            <a style={{ cursor: "pointer" }} onClick={toPage("")}>Tu grupo</a>
          </li>
          <li className="bg-dark list-group-item text-secondary">
            <i className="bi bi-question-circle"> </i>
            <a style={{ cursor: "pointer"}} onClick={toPage("")} >Ayuda</a>
          </li>
        </ul>
      </div>
    </>
  );
  
};

const App = () => {

  const [page, setPage] = useState(() => window.location.pathname.slice(1));

  const toPage = (newPage) => (event) => {
    event.preventDefault();
    window.history.pushState(null, "", `/${newPage}`);
    setPage(newPage);
  };

  const getContent = () => {
    switch (page) {
      case "registro":
        return <Registro />;
      case "inicio":
        return <Inicio />;
      case "login":
        return <Login />;
      case "usuario":
        return <Usuario />;
      case "grupos":
        return <Grupos />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
        <Router>
          <Navbar toPage={toPage} />
          {getContent()}
        </Router>
    </AuthProvider>
  );

  
};



export default App;
