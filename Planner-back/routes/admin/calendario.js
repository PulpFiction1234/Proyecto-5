const express = require('express');
const router = express.Router();
const moment = require('moment-timezone'); // Importa moment-timezone
const Horario = require('../../models/horario');





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

       
        const existingHorario = await Horario.findOne({ fecha, horaInicio });

        if (existingHorario) {
            return res.status(400).json({ message: 'La hora seleccionada ya está ocupada.' });
        }

        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format(); 
        
  
        const nuevoHorario = new Horario({
            fecha: fechaZonaHoraria,
            horaInicio,
            horaFin,
            usuarioReserva
        });

       
        await nuevoHorario.save();

       
        res.status(201).json({ message: 'Horario creado exitosamente', horario: nuevoHorario });
    } catch (error) {
      
        console.error('Error al crear el horario:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el horario' });
    }
});

router.patch('/', async (req, res) => {
    const { fecha, horaInicio, horaFin, usuario } = req.body;

    try {
     
        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

   
        const horario = await Horario.findOne({ fecha: fechaZonaHoraria, horaInicio, horaFin });

      
        if (!horario) {
            console.log('Horario no encontrado');
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

     
        if (horario.reservado) {
            console.log('El horario ya está reservado');
            return res.status(400).json({ message: 'El horario ya está reservado' });
        }

       
        horario.reservado = true;
        horario.usuarioReserva = usuario;
        horario.color = '#3788d8'; 

       
        await horario.save();

    
        console.log('Horario reservado exitosamente:', horario);

      
        return res.status(200).json({ message: 'Horario reservado exitosamente', horario: {
            fecha: horario.fecha,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            reservado: horario.reservado,
            usuarioReserva: usuario && usuario._id ? { 
                id: usuario._id,
                name: usuario.name,
                lastname: usuario.lastname,
            } : null, 
            color: horario.color,
        }});
    } catch (error) {
       
        console.error('Error al reservar el horario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});
router.patch('/', async (req, res) => {
    const { fecha, horaInicio, horaFin, usuario } = req.body;

    try {
     
        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

        const horario = await Horario.findOne({ fecha: fechaZonaHoraria, horaInicio, horaFin });

       
        if (!horario) {
            console.log('Horario no encontrado');
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

   
        if (horario.reservado) {
            console.log('El horario ya está reservado');
            return res.status(400).json({ message: 'El horario ya está reservado' });
        }

        horario.reservado = true;
        horario.usuarioReserva = usuario;
        horario.color = '#3788d8'; 

        await horario.save();

     
        console.log('Horario reservado exitosamente:', horario);

        return res.status(200).json({ message: 'Horario reservado exitosamente', horario: {
            fecha: horario.fecha,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            reservado: horario.reservado,
            usuarioReserva: usuario && usuario._id ? { 
                id: usuario._id,
                name: usuario.name,
                lastname: usuario.lastname,
            } : null, 
            color: horario.color,
        }});
    } catch (error) {
      
        console.error('Error al reservar el horario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});



router.delete('/:fecha/:horaInicio/:horaFin', async (req, res) => {
    try {
    
        const { fecha, horaInicio, horaFin } = req.params;

        const fechaZonaHoraria = moment.tz(fecha, 'America/Santiago').format();

     
        await Horario.findOneAndDelete({ fecha: fechaZonaHoraria, horaInicio, horaFin });

        res.json({ message: 'Horario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        res.status(500).json({ error: 'Hubo un error al eliminar el horario' });
    }
});

module.exports = router;
