import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BarChart, Bar } from 'recharts';

function Home() {
  const data = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 30 },
    { value: 40 },
    { value: 70 },
    { value: 60 },
    { value: 30 },
    { value: 100 }
  ];

  const testimonios = [
    "Esta aplicación ha revolucionado la manera en que gestiono mi equipo. Ahora puedo tomar decisiones estratégicas con estadísticas claras y detalladas.",
    "Fácil de usar y llena de funcionalidades útiles. Mis jugadores están más motivados gracias al seguimiento de su progreso.",
    "¡Increíble! La interfaz es intuitiva y los gráficos me ayudan a ver el panorama general del rendimiento de mi equipo.",
    "Una herramienta imprescindible para cualquier entrenador. Nos ha permitido optimizar nuestros entrenamientos y mejorar en competencias."
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <div className="bg-secondary text-white py-5" style={{ minHeight: '60vh' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-7">
                <h1 className="display-4 mb-4">La Aplicación de Gestión de equipos que estabas buscando!</h1>
                <p className="lead mb-4">
                  Descubre una nueva forma de gestionar tu equipo de voleibol playa. Nuestra aplicación te permite realizar un seguimiento detallado del rendimiento, estadísticas y evolución de tus jugadores. Con herramientas avanzadas de análisis y una interfaz intuitiva, llevar el control de tu equipo nunca había sido tan fácil.
                </p>
              </div>
              <div className="col-md-5">
                <div className="text-center">
                  <BarChart width={520} height={220} data={data}>
                    <Bar dataKey="value" fill="#FFFFFF" />
                  </BarChart>
                  <h2 className="mt-3">Tus estadísticas Personalizadas al siguiente nivel!</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-5">
          <div className="container">
            <div className="row g-4">
              {testimonios.map((testimonio, index) => (
                <div key={index} className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <p className="mb-0">{testimonio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-4">
        <p className="h5 mb-0">Información de contacto</p>
      </footer>
    </div>
  );
}

export default Home;
