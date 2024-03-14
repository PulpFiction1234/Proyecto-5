import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPortalLayout from '../layout/AdminPortalLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment-timezone';
import 'moment/locale/es';
import MiniCalendario from './crearHorarios';
import { Horario } from '../types/types';
import '../css/CalendarioAdmin.css'

moment.locale('es');

const CalendarioAdmin = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/calendario');
            setHorarios(response.data);
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
        }
    };

    const generarEventos = (horarios: Horario[]) => {
        const eventos: any[] = [];
    
        horarios.forEach((horario: Horario) => {
            const horaInicioMoment = moment.utc(horario.fecha).local().set('hour', parseInt(horario.horaInicio.split(':')[0])).set('minute', parseInt(horario.horaInicio.split(':')[1]));
            const horaFinMoment = moment.utc(horario.fecha).local().set('hour', parseInt(horario.horaFin.split(':')[0])).set('minute', parseInt(horario.horaFin.split(':')[1]));
    
            let horaActual = horaInicioMoment.clone();
    
            while (horaActual.isBefore(horaFinMoment)) {
                const title = horario.reservado && horario.usuarioReserva ? `${horario.usuarioReserva.name} ${horario.usuarioReserva.lastname}` : 'Hora Disponible';
                const backgroundColor = horario.reservado ? '#fffaf6' : '#3788d8';
                const textColor = horario.reservado ? '#000' : '#fff';
    
                eventos.push({
                    title: title,
                    start: horaActual.toDate(),
                    end: horaActual.clone().add(1, 'hour').toDate(),
                    backgroundColor: backgroundColor,
                    textColor: textColor, // Color del texto
                    extendedProps: {
                        usuarioReserva: horario.usuarioReserva 
                    }
                });
    
                horaActual.add(1, 'hour');
            }
        });
    
        return eventos;
    };

    const handleEventClick = async (info: any) => {
        console.log('Evento clickeado:', info);
    
        const { start, end } = info.event;
    
        const fecha = moment(start).format('YYYY-MM-DD');
        const horaInicio = moment(start).format('HH:mm');
        const horaFin = moment(end).format('HH:mm');
    
        console.log('Fecha:', fecha);
        console.log('Hora de inicio:', horaInicio);
        console.log('Hora de fin:', horaFin);
    
        const confirmarEliminacion = window.confirm(`¿Seguro que deseas eliminar el horario para ${fecha} de ${horaInicio} a ${horaFin}?`);
    
        if (confirmarEliminacion) {
            console.log('Eliminando horario...');
            await eliminarHorario(fecha, horaInicio, horaFin);
        }
        fetchHorarios();
    };
    
    const eliminarHorario = async (fecha: string, horaInicio: string, horaFin: string) => {
        try {
            // Realizar la solicitud DELETE al backend
            await axios.delete(`http://localhost:5000/api/admin/calendario/${fecha}/${horaInicio}/${horaFin}`);
            console.log('Horario eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el horario:', error);
        }
    };
    
    const buttonText = {
        today: 'Hoy',
        timeGridWeek: 'Semana',
        timeGridDay: 'Día',
    };

    return (
        <AdminPortalLayout>
            <div className='main-admincalendar'>
                <MiniCalendario />
                <h2>Horarios Actuales</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    slotDuration="01:00:00"
                    firstDay={1} // Esto establece el primer día de la semana como lunes
                    locale="es"
                    events={generarEventos(horarios)}
                    eventClick={handleEventClick}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay',
                    }}
                    buttonText={buttonText}
                    slotMinTime="09:00:00" // Establece la hora mínima a las 9:00 am
                    slotMaxTime="22:00:00" // Establece la hora máxima a las 10:00 pm
                    contentHeight="420px"
                />
            </div>
        </AdminPortalLayout>
    );
};

export default CalendarioAdmin;
