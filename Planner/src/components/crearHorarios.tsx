import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment, { Moment } from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import '../css/CrearHorarios.css'

const MiniCalendario: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
    const [horaInicio, setHoraInicio] = useState<string>('09:00');
    const [horaFin, setHoraFin] = useState<string>('10:00');
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        if (selectedDate) {
            console.log('Fecha seleccionada:', selectedDate.format('YYYY-MM-DD'));
        }
    }, [selectedDate]);

    const handleDateClick = (info: any) => {
        setSelectedDate(moment(info.date));
    };

    const handleCrearHorario = async () => {
        if (!selectedDate || !horaInicio || !horaFin) {
            console.log('Por favor selecciona una fecha y proporciona horas de inicio y fin');
            return;
        }
    
        try {
            // Consultar los horarios existentes para la fecha seleccionada en el backend
            const response = await axios.get(`http://localhost:5000/api/admin/calendario`, {
                params: {
                    fecha: selectedDate.format('YYYY-MM-DD')
                }
            });
            const existingHours: any[] = response.data;
    
            // Filtrar las horas existentes solo para el día seleccionado
            const existingHoursForSelectedDate = existingHours.filter(horario => {
                return moment(horario.fecha).isSame(selectedDate, 'day');
            });
    
            // Verificar si alguna hora del rango seleccionado está ocupada
            const overlappingHour = existingHoursForSelectedDate.some(horario => {
                const existingStartHour = moment(horario.horaInicio, 'HH:mm');
                const existingEndHour = moment(horario.horaFin, 'HH:mm');
                const selectedStartHour = moment(horaInicio, 'HH:mm');
                const selectedEndHour = moment(horaFin, 'HH:mm');
                return (
                    (selectedStartHour.isBetween(existingStartHour, existingEndHour, undefined, '[)') || selectedStartHour.isSame(existingStartHour)) ||
                    (selectedEndHour.isBetween(existingStartHour, existingEndHour, undefined, '(]') || selectedEndHour.isSame(existingEndHour)) ||
                    (existingStartHour.isBetween(selectedStartHour, selectedEndHour, undefined, '[)') || existingStartHour.isSame(selectedStartHour)) ||
                    (existingEndHour.isBetween(selectedStartHour, selectedEndHour, undefined, '(]') || existingEndHour.isSame(selectedEndHour)) ||
                    (selectedStartHour.isSame(existingStartHour) && selectedEndHour.isSame(existingEndHour))
                );
            });
    
            if (overlappingHour) {
                console.log('Al menos una hora seleccionada ya está ocupada para la fecha seleccionada.');
                return;
            }
    
            // Si no hay conflictos, crear el nuevo horario
            const promises = [];
            let currentHour = moment(horaInicio, 'HH:mm');
            while (currentHour.isBefore(moment(horaFin, 'HH:mm'))) {
                const horaInicioActual = currentHour.format('HH:mm');
                const horaFinActual = currentHour.add(1, 'hour').format('HH:mm');
                promises.push(
                    axios.post('http://localhost:5000/api/admin/calendario', {
                        fecha: selectedDate.format('YYYY-MM-DD'),
                        horaInicio: horaInicioActual,
                        horaFin: horaFinActual
                    })
                );
            }
    
            await Promise.all(promises);
    
            console.log('Horario(s) creado(s) exitosamente');
        } catch (error) {
            console.error('Error al crear el horario:', error);
        }
    
        setSelectedDate(null);
        setHoraInicio('09:00');
        setHoraFin(':00');
    };

    const buttonText = {
        today: 'Hoy',
     
    };
    
    
    return (
        <div style={{ width: '300px' }} className="mini-calendario">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                firstDay={1}
                selectable={true}
                dateClick={handleDateClick}
                ref={calendarRef}
                buttonText={buttonText}
                locale="es"
                contentHeight="200px"
            />
            {selectedDate && (
                <div className="formulario-horario">
                    <h3>Selecciona las horas para el día {selectedDate.format('DD/MM')}</h3>
                    <div className='seleccionarhoras-div'>
                        <div>
                            <label htmlFor="horaInicio">Hora de Inicio:</label>
                                <select id="horaInicio" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)}>
                                    {[...Array(13)].map((_, index) => {
                                        const hour = index + 9; // Empieza desde las 9 AM
                                        return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                                    })}
                                </select>
                        </div>
                        <div className='seleccionarhoras-div2'>
                            <label htmlFor="horaFin">Hora de Fin:</label>
                                <select id="horaFin" value={horaFin} onChange={(e) => setHoraFin(e.target.value)}>
                                    {[...Array(13)].map((_, index) => {
                                        const hour = index + 10; // Empieza desde las 10 AM
                                        return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                                    })}
                                </select>
                        </div>
                    </div>
                    <button className='buttom-crearhorario' onClick={handleCrearHorario}>
                        Crear Horario
                    </button>
                </div>
            )}
        </div>
    );
};

export default MiniCalendario;