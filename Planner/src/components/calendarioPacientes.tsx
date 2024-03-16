import { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UserPortalLayout from '../layout/UserPortalLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment-timezone';
import 'moment/locale/es';
import '../css/CalendarioPacientes.css'
import { Horario } from '../types/types';
import { useAuth } from '../auth/AuthProvider'; // Importa el contexto de autenticación

moment.locale('es');

const CalendarioPaciente = () => {
    const auth = useAuth(); // Obtiene el contexto de autenticación
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [showPayPalButton, setShowPayPalButton] = useState(false);
    const [reservationData, setReservationData] = useState<any>(null);

    const fetchHorarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/calendario', {
                headers: { Authorization: `Bearer ${auth.getAccessToken()}` } // Utiliza el método getAccessToken del contexto de autenticación
            });
            setHorarios(response.data);
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
        }
    };

    useEffect(() => {
        fetchHorarios();
    }, [auth.getAccessToken()]);
    
    useEffect(() => {
        // Recuperar la información del usuario después de la carga inicial y los refrescos de página
        const userInfo = auth.getUser();
        console.log('Datos del usuario:', userInfo);
    }, [auth]);// Actualiza los horarios cuando cambia el accessToken
    
    const handleEventClick = async (info: any) => {
        const { start, end } = info.event;
    
        const fecha = moment(start).format('YYYY-MM-DD');
        const horaInicio = moment(start).format('HH:mm');
        const horaFin = moment(end).format('HH:mm');

        const usuario = auth.getUser(); // Obtiene la información del usuario del contexto de autenticación
        console.log('Datos del usuario:', usuario); 

        let confirmMessage = `¿Seguro que deseas reservar el horario para ${fecha} de ${horaInicio} a ${horaFin}?`;
        if (info.event.extendedProps.usuarioReserva) {
            const { name, lastname } = info.event.extendedProps.usuarioReserva;
            alert(`Este horario ya está reservado por ${name} ${lastname}.`);
            return; // No realizar la reserva si el horario ya está reservado
        }
    
        const confirmarReserva = window.confirm(confirmMessage);
    
        if (confirmarReserva) {
            // Solicitar al servidor generar un ID de orden
            try {
                const response = await axios.post('http://localhost:5000/api/create-orders', {
                    amount: '10.00' // Ajusta el monto según tus necesidades
                });
                const orderId = response.data.orderId;
                setReservationData({ orderId, fecha, horaInicio, horaFin, usuario });
                setShowPayPalButton(true);
            } catch (error) {
                console.error('Error al generar el ID de orden:', error);
            }
        }
    };

    const onApprove = async (_data: any) => {
        try {
            // Realizar la reserva enviando los datos al servidor
            await axios.patch('http://localhost:5000/api/admin/calendario', reservationData);
            // Actualizar la lista de horarios después de la reserva
            fetchHorarios();
        } catch (error) {
            console.error('Error al reservar el horario:', error);
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

    const buttonText = {
        today: 'Hoy',
        timeGridWeek: 'Semana',
        timeGridDay: 'Día',
    };

    return (
        <UserPortalLayout>
            <div>
                <h2>Calendario para Pacientes</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    slotDuration="01:00:00"
                    firstDay={1} 
                    locale="es"
                    events={generarEventos(horarios)}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay',
                    }}
                    buttonText={buttonText}
                    slotMinTime="09:00:00" 
                    slotMaxTime="22:00:00" 
                    contentHeight="420px"
                    selectable={true}
                    eventClick={handleEventClick} 
                />
                  {showPayPalButton && (
                <div className="paypal-popup">
                    <div className="paypal-popup-content">
                        <PayPalScriptProvider options={{ clientId: "ASfmfanLPf2NnJzI1Dvu6Jga06qNF3gWfNUplgbx3n5QDujKhlHUQ7Ln2bLFR7yHgc7dPP4Bn7MR_1jI" }}>
                            <PayPalButtons
                                style={{ layout: 'horizontal' }}
                                createOrder={(_data, actions) => {
                                    return actions.order.create({
                                        intent: 'CAPTURE', // Agrega la propiedad intent con el valor 'CAPTURE'
                                        purchase_units: [{
                                            amount: {
                                                value: '10.00', // Ajusta el monto según tus necesidades
                                                currency_code: 'USD'
                                            }
                                        }]
                                    });
                                }}
                                onApprove={onApprove}
                            />
                        </PayPalScriptProvider>
                        <button onClick={() => setShowPayPalButton(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    </UserPortalLayout>
);
};    

export default CalendarioPaciente;