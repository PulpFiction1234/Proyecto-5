import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPortalLayout from '../layout/AdminPortalLayout';

const HorariosSemanales: React.FC = () => {
  const [horarios, setHorarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axios.get('/api/admin/calendario');
        setHorarios(response.data);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    };

    fetchHorarios();
  }, []);

  return (
    <AdminPortalLayout>
      <div>
        <h1>Horarios Semanales</h1>
        <ul>
          {Array.isArray(horarios) ? (
            horarios.map((horario, index) => (
              <li key={index}>{/* Renderizar cada horario aquí */}</li>
            ))
          ) : (
            <li>No hay horarios disponibles</li>
          )}
        </ul>
      </div>
  </AdminPortalLayout>
    
  );
};

export default HorariosSemanales;
