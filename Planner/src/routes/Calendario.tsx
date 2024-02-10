import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PortalLayout from '../layout/PortalLayout';
import {isValid ,startOfWeek, addDays, format, addWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/authConstants';
import '../css/Calendario.css';

Modal.setAppElement('#root');

export default function Calendario() {
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  const [currentMonth, setCurrentMonth] = useState('');
  const [currentWeek, setCurrentWeek] = useState('');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availability, setAvailability] = useState(() => {
    const storedAvailability = localStorage.getItem('calendarioAvailability');
    return storedAvailability ? JSON.parse(storedAvailability) : null;
  });
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ dayIndex: number; hourIndex: number }>({ dayIndex: 0, hourIndex: 0 });

  const auth = useAuth();

  useEffect(() => {
    updateCurrentMonth(firstDayOfWeek);
    updateCurrentWeek(firstDayOfWeek);
    initializeAvailability();
  }, [firstDayOfWeek]);

  useEffect(() => {
    if (!availability) {
      initializeAvailability();
    }
  }, [availability]);

  async function initializeAvailability() {
    try {
      const weekStartDate = startOfWeek(firstDayOfWeek, { weekStartsOn: 1 });
      const formattedWeekStart = format(weekStartDate, 'yyyy-MM-dd');
  
      const response = await fetch(`${API_URL}/calendario/semana/${formattedWeekStart}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });
  
      if (response.ok) {
        const { availability } = await response.json();
        setAvailability(availability);
        localStorage.setItem('calendarioAvailability', JSON.stringify(availability));
      } else {
        console.error('Error al obtener la disponibilidad del calendario.');
      }
    } catch (error) {
      console.error('Error al obtener la disponibilidad del calendario.', error);
    }
  }

  async function saveAvailabilityToBackend(updatedAvailability: boolean[]) {
    try {
      const weekStartDate = startOfWeek(firstDayOfWeek, { weekStartsOn: 1 });

      if (!isValid(weekStartDate)) {
        console.error('La fecha de inicio de la semana no es válida:', weekStartDate);
        return;
      }
      
      const formattedWeekStart = format(weekStartDate, 'yyyy-MM-dd');
      
      const formattedAvailability = updatedAvailability.map(avail => ({ available: avail }));
  
      const response = await fetch(`${API_URL}/calendario/actualizarDisponibilidad/${formattedWeekStart}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({ availability: formattedAvailability }),
      });
  
      const responseData = await response.json();
      console.log('Respuesta del backend:', responseData);
  
      if (!response.ok) {
        console.error('Error al guardar la disponibilidad en el backend.');
      }
    } catch (error) {
      console.error('Error al comunicarse con el backend.', error);
    }
  }



  function updateCurrentMonth(date: Date) {
    const month = date.toLocaleString('default', { month: 'long' });
    setCurrentMonth(month);
  }

  function updateCurrentWeek(date: Date) {
    const formattedWeek = format(date, 'MMMM do', { locale: es });
    setCurrentWeek(formattedWeek);
  }

  function handlePrevWeek() {
    const prevWeek = addWeeks(firstDayOfWeek, -1);
    updateWeek(prevWeek);
  }

  function handleNextWeek() {
    const nextWeek = addWeeks(firstDayOfWeek, 1);
    updateWeek(nextWeek);
  }

  async function toggleAvailability(dayIndex: number, hourIndex: number) {
    const isAdmin = auth.getUser()?.rol === 'admin';

    if (isAdmin) {
      const updatedAvailability = [...availability];
      updatedAvailability[dayIndex * hours.length + hourIndex] = !updatedAvailability[dayIndex * hours.length + hourIndex];
      setAvailability(updatedAvailability);

      await saveAvailabilityToBackend(updatedAvailability);
    } else {
      console.log('Solo los administradores pueden cambiar la disponibilidad.');
    }
  }

  async function handleReserveForUser(dayIndex: number, hourIndex: number) {
    const isUser = auth.getUser()?.rol === 'usuario';
  
    if (isUser) {
      const cellAvailability = availability[dayIndex * hours.length + hourIndex];
  
      if (!cellAvailability || !cellAvailability.reservedBy) {
        setSelectedCell({ dayIndex, hourIndex });
        setReservationModalOpen(true);
      } else {
        console.log('Esta hora ya está reservada por:', cellAvailability.reservedBy);
      }
    } else {
      console.log('Solo los usuarios pueden realizar reservas.');
    }
  }

  async function handleConfirmReservation() {
  const isUser = auth.getUser()?.rol === 'usuario';

  if (isUser) {
    try {
      const day = addDays(firstDayOfWeek, selectedCell.dayIndex);
      const hour = hours[selectedCell.hourIndex];

      const reservedBy = `${auth.getUser()?.name} ${auth.getUser()?.lastname}`;

      const requestBody = {
        confirmation: 'yes',
        reservedBy,
      };

      const response = await fetch(`${API_URL}/calendario/confirmarReserva/${format(day, 'yyyy-MM-dd')}/${hour}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedAvailability = [...availability];
        updatedAvailability[selectedCell.dayIndex * hours.length + selectedCell.hourIndex] = { reservedBy };
        setAvailability(updatedAvailability);
        localStorage.setItem('calendarioAvailability', JSON.stringify(updatedAvailability));
      } else {
        console.error('Error al confirmar la reserva.');
      }
    } catch (error) {
      console.error('Error al confirmar la reserva.', error);
    }

    setReservationModalOpen(false);
  } else {
    console.log('Solo los usuarios pueden confirmar reservas.');
  }
}

  function getCellClassName(cellAvailability: { reservedBy: any }) {
    if (cellAvailability) {
      return cellAvailability.reservedBy ? 'reserved' : 'available';
    } else {
      return 'unavailable';
    }
  }

  async function updateWeek(newWeek: Date) {
    updateCurrentMonth(newWeek);
    updateCurrentWeek(newWeek);
    setFirstDayOfWeek(newWeek);

    initializeAvailability();
  }

  return (
    <PortalLayout>
      <div className='main__calendar'>
        <h1 className='title'>Calendario Semanal</h1>

        <div className='calendar'>
          <div className='calendar__info'>
            <div className='info-item'>Mes: {currentMonth}</div>
            <div className='info-item'>Semana: {currentWeek}</div>
            <div className='calendar__nav'>
              <button onClick={handlePrevWeek}>&lt; Anterior</button>
              <button onClick={handleNextWeek}>Siguiente &gt;</button>
            </div>
          </div>

          <div className='calendar__grid'>
            <div className='calendar__days'>
              {dayNames.map((day, dayIndex) => (
                <div key={dayIndex} className='calendar__day'>
                  {day} {format(addDays(firstDayOfWeek, dayIndex), 'd')}
                </div>
              ))}
            </div>

            <div className='calendar__content'>
              {hours.map((hour, hourIndex) => (
                <div key={hourIndex} className='calendar__hour-row'>
                  {dayNames.map((_, dayIndex) => {
                    const cellAvailability = availability[dayIndex * hours.length + hourIndex];
                    const cellClassName = getCellClassName(cellAvailability);

                    return (
                      <div
                        key={dayIndex}
                        className={`calendar__cell ${cellClassName}`}
                        onClick={() => toggleAvailability(dayIndex, hourIndex)}
                      >
                        <div className='calendar__hour-label'>{hour}</div>
                        <div className='calendar__event'>
                          {cellAvailability && (
                            <div className='reservation-info'>
                              {cellAvailability.reservedBy ? (
                                <p>{cellAvailability.reservedBy}</p>
                              ) : (
                                <button onClick={() => handleReserveForUser(dayIndex, hourIndex)}>Reservar</button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={reservationModalOpen}
        onRequestClose={() => setReservationModalOpen(false)}
        contentLabel='Confirmar Reserva'
        className="ReactModal__Content"
      >
        {/* Contenido del modal */}
        <h2>Confirmar Reserva</h2>
        <p>¿Confirmar la reserva para la hora seleccionada?</p>
        <button className="modal-button" onClick={handleConfirmReservation}>Confirmar</button>
        <button className="modal-button" onClick={() => setReservationModalOpen(false)}>Cancelar</button>
      </Modal>
    </PortalLayout>
  );
}