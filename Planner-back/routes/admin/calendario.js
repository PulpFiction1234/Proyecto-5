const express = require('express');
const router = express.Router();
const moment = require('moment-timezone'); // Importa moment-timezone
const Horario = require('../../models/horario');



router.post('/ruta', (req, res) => {
    // Lógica de la ruta aquí
  });

router.get('/', async (req, res) => {
    try {
  
        const horarios = await Horario.find();

      
        const horariosAjustados = horarios.map(horario => ({
            ...horario.toJSON(),
            fecha: moment(horario.fecha).tz('America/Santiago').format() 
        }));

        res.status(200).json(horariosAjustados);
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los horarios' });
    }
});

// Crear un nuevo horario
router.post('/', async (req, res) => {
    try {
        const { fecha, horaInicio, horaFin,  usuarioReserva } = req.body;

        // Consultar si la hora ya existe
        const existingHorario = await Horario.findOne({ fecha, horaInicio });

        if (existingHorario) {
            return res.status(400).json({ message: 'La hora seleccionada ya está ocupada.' });
        }

        // Convierte la fecha a la zona horaria deseada
        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format(); // Cambia 'America/Santiago' por la zona horaria deseada
        
        // Crea un nuevo objeto de fecha y hora con la zona horaria convertida
        const nuevoHorario = new Horario({
            fecha: fechaZonaHoraria,
            horaInicio,
            horaFin,
            usuarioReserva
        });

        // Guarda el nuevo horario en la base de datos
        await nuevoHorario.save();

        // Responder con un código de estado 201 (Created)
        res.status(201).json({ message: 'Horario creado exitosamente', horario: nuevoHorario });
    } catch (error) {
        // Responder con un código de estado 500 (Internal Server Error) y el mensaje de error
        console.error('Error al crear el horario:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el horario' });
    }
});

router.patch('/', async (req, res) => {
    const { fecha, horaInicio, horaFin, usuario } = req.body;

    try {
        // Convertir la fecha a la zona horaria deseada ('America/Santiago')
        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

        // Buscar el horario en la base de datos
        const horario = await Horario.findOne({ fecha: fechaZonaHoraria, horaInicio, horaFin });

        // Si el horario no existe, devolver un error
        if (!horario) {
            console.log('Horario no encontrado');
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        // Verificar si el horario ya está reservado
        if (horario.reservado) {
            console.log('El horario ya está reservado');
            return res.status(400).json({ message: 'El horario ya está reservado' });
        }

        // Actualizar el horario con la información del usuario que realiza la reserva
        horario.reservado = true;
        horario.usuarioReserva = usuario;
        horario.color = '#3788d8'; // Color azul por defecto

        // Guardar el horario actualizado en la base de datos
        await horario.save();

        // Registro exitoso
        console.log('Horario reservado exitosamente:', horario);

        // Devolver una respuesta exitosa
        return res.status(200).json({ message: 'Horario reservado exitosamente', horario: {
            fecha: horario.fecha,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            reservado: horario.reservado,
            usuarioReserva: usuario && usuario._id ? { // Verificar si usuario existe y tiene _id
                id: usuario._id,
                name: usuario.name,
                lastname: usuario.lastname,
            } : null, // Si usuario no existe o no tiene _id, establecer usuarioReserva como null
            color: horario.color,
        }});
    } catch (error) {
        // Registro de error
        console.error('Error al reservar el horario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});
router.patch('/', async (req, res) => {
    const { fecha, horaInicio, horaFin, usuario } = req.body;

    try {
        // Convertir la fecha a la zona horaria deseada ('America/Santiago')
        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

        // Buscar el horario en la base de datos
        const horario = await Horario.findOne({ fecha: fechaZonaHoraria, horaInicio, horaFin });

        // Si el horario no existe, devolver un error
        if (!horario) {
            console.log('Horario no encontrado');
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        // Verificar si el horario ya está reservado
        if (horario.reservado) {
            console.log('El horario ya está reservado');
            return res.status(400).json({ message: 'El horario ya está reservado' });
        }

        // Actualizar el horario con la información del usuario que realiza la reserva
        horario.reservado = true;
        horario.usuarioReserva = usuario;
        horario.color = '#3788d8'; // Color azul por defecto

        // Guardar el horario actualizado en la base de datos
        await horario.save();

        // Registro exitoso
        console.log('Horario reservado exitosamente:', horario);

        // Devolver una respuesta exitosa
        return res.status(200).json({ message: 'Horario reservado exitosamente', horario: {
            fecha: horario.fecha,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            reservado: horario.reservado,
            usuarioReserva: usuario && usuario._id ? { // Verificar si usuario existe y tiene _id
                id: usuario._id,
                name: usuario.name,
                lastname: usuario.lastname,
            } : null, // Si usuario no existe o no tiene _id, establecer usuarioReserva como null
            color: horario.color,
        }});
    } catch (error) {
        // Registro de error
        console.error('Error al reservar el horario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// Eliminar un horario existente
router.delete('/:fecha/:horaInicio/:horaFin', async (req, res) => {
    try {
        // Obtener los parámetros de la URL
        const { fecha, horaInicio, horaFin } = req.params;

        // Convertir la fecha al formato esperado en la base de datos
        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

        // Buscar el horario en la base de datos y eliminarlo
        await Horario.findOneAndDelete({ fecha: fechaZonaHoraria, horaInicio, horaFin });

        // Responder con un mensaje de éxito
        res.json({ message: 'Horario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        res.status(500).json({ error: 'Hubo un error al eliminar el horario' });
    }
});

module.exports = router;
