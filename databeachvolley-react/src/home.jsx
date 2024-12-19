import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Home() {
  return (
    <div className="d-flex flex-column min-vh-100 mt-5">
      <main className="flex-grow-1">
        <div className="bg-secondary text-white text-center d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
          <h1>La Aplicación de Gestión de equipos que estabas buscando!</h1>
        </div>
        <div className="bg-white d-flex align-items-center justify-content-center" style={{ height: '40vh' }}>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3">
        <p>Información de contacto</p>
      </footer>
    </div>
  );
}

export default Home;
