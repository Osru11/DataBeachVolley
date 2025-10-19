import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Registro from "./registro";
import Login from "./login";
import Inicio from "./inicio";
import Home from "./home";
import Usuario from "./usuario"
import GroupsManagement from './GroupsManagement';
import axiosInstance from "./axiosInstance";

const Navbar = ({ toPage }) => {
  const { user, logoutUser, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const headerRef = useRef(null);
  const lateralHeaderRef = useRef(null);

  const fetchActiveGroup = async () => {
    if (!user?.user.dni) return;
    try {
      const response = await axiosInstance.get(`/api/user/groups/${user.user.dni}/`);
      const activeGroup = response.data.find(group => group.isActive);
      setActiveGroup(activeGroup);
    } catch (error) {
      console.error('Error al obtener el grupo activo:', error);
    }
  };

  useEffect(() => {
    // Fetch immediately when component mounts or user changes
    fetchActiveGroup();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchActiveGroup, 5000); // 5000ms = 5 seconds

    // Cleanup function to clear interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [user]); // Dependency on user ensures the effect reruns if user changes

  const toggleSidebar = (e) => {
    //evitar que el click se propague al overlay
    e && e.stopPropagation();

    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
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
    }).then(() => {
      window.location.href = "/home";
    });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      if (window.scrollY > 0) {
        headerRef.current.className = "header-fixed";
        lateralHeaderRef.current.id = "lateral-header-fixed";
      } else {
        headerRef.current.className = "header";
        lateralHeaderRef.current.id = "lateral-header";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (loading) {
    return <></>;
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
                  style={{ 
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 4
                  }}
                >
                  <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
                </button>
              </>
            )}
            <a className="navbar-brand" style={{ cursor: "pointer" }} onClick={toPage("inicio")}>
              Data Beach Volley
            </a>
            <div className="position-relative groups-dropdown-container">
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

      {/* Overlay */}
      <div 
        className={`position-fixed top-0 start-0 w-100 h-100 bg-dark ${
          isSidebarOpen ? 'd-block bg-opacity-50' : 'd-none'
        }`}
        style={{ 
          zIndex: 2,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onClick={toggleSidebar}
      />

      {/* Menú lateral */}
      <div 
        id="lateral-header" 
        ref={lateralHeaderRef} 
        className={`sidebar position-fixed h-100 ${
          isSidebarOpen ? "d-block" : "d-none"
        }`}
        style={{ 
          zIndex: 3,
          backgroundColor: '#1a1a1a',
          width: '250px',
          boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s ease-in-out',
          top: 0,
          left: 0,
          paddingTop: '70px'
        }}
      >
        <ul className="list-group list-group-flush pt-3">
          <li className="list-group-item border-0" 
              style={{ 
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease-in-out'
              }}>
            <a 
              style={{ 
                cursor: "pointer",
                color: '#e0e0e0',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px',
                transition: 'all 0.2s ease'
              }}
              className="sidebar-link"
              onClick={toPage("")}
            >
              <i className="bi bi-bar-chart-line me-3 fs-5"></i>
              <span>Estadísticas</span>
            </a>
          </li>
          <li className="list-group-item border-0" 
              style={{ 
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease-in-out'
              }}>
            <a 
              style={{ 
                cursor: "pointer",
                color: '#e0e0e0',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px',
                transition: 'all 0.2s ease'
              }}
              className="sidebar-link"
              onClick={toPage("")}
            >
              <i className="bi bi-calendar-week me-3 fs-5"></i>
              <span>Calendario</span>
            </a>
          </li>
          <li className="list-group-item border-0" 
              style={{ backgroundColor: 'transparent' }}>
            <a 
              style={{ 
                cursor: "pointer",
                color: '#e0e0e0',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px'
              }}
              className="sidebar-link"
              onClick={toPage("")}
            >
              <i className="bi bi-chat me-3 fs-5"></i>
              <span>Foro</span>
            </a>
          </li>
          <li className="list-group-item border-0" 
              style={{ backgroundColor: 'transparent' }}>
            <div className="sidebar-link">
              <div className="d-flex align-items-center" style={{ padding: '10px 15px' }}>
                <i className="bi bi-person-workspace me-3 fs-5" style={{ color: '#e0e0e0' }}></i>
                <div style={{ color: '#e0e0e0' }}>
                  <small className="d-block" style={{ fontSize: '0.8em' }}>Grupo Activo:</small>
                  <span>{activeGroup ? activeGroup.nombre : 'Ninguno'}</span>
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item border-0" 
              style={{ backgroundColor: 'transparent' }}>
            <a 
              style={{ 
                cursor: "pointer",
                color: '#e0e0e0',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px'
              }}
              className="sidebar-link"
              onClick={toPage("")}
            >
              <i className="bi bi-question-circle me-3 fs-5"></i>
              <span>Ayuda</span>
            </a>
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
        return <GroupsManagement/>;
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