import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from "./AuthContext";

const Inicio = () => {

  const { user } = useAuth();

  if (!user) {
    window.location.href = "/home"; 
    return null;
  }

  const handleDateClick = (info) => {
    if (isCoach()) {
      alert(`Has hecho clic en: ${info.dateStr}`);
    }
  };

  const isCoach = () => {
    return true; // Cambiar esta lógica según sea necesario
  };

  const logout = () => {
    alert('Sesión cerrada');
  };

  const crearGrupo = () => {
    alert('Creando nuevo grupo...');
  };

  const saveSession = () => {
    alert('Información de la sesión guardada.');
  };

  return (
    <div className="container mt-5">
      {/* Título */}
      <h1 className="text-center">Bienvenido a Data Beach Volley</h1>

      {/* Calendario */}
      <div className="my-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={[
            { title: 'Entrenamiento', start: '2024-09-03T10:00:00', end: '2024-09-03T12:00:00' },
            { title: 'Partido', start: '2024-09-05T17:00:00', end: '2024-09-05T19:00:00' },
          ]}
          dateClick={handleDateClick}
        />
      </div>

      {/* Foro */}
      <div id="forum">
        <h2>Foro del Grupo</h2>
        <textarea className="form-control mb-3" placeholder="Escribe un comentario..."></textarea>
        <button className="btn btn-primary">Añadir Comentario</button>
      </div>
    </div>
  );
};

export default Inicio;
