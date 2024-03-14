const express = require('express');
const router = express.Router();
const Horario = require('../../models/horario');

// Reservar un horario disponible
router.patch('/reservation', async (req, res) => {
    const { fecha, horaInicio, horaFin } = req.body;

    try {
        // Buscar el horario correspondiente en la base de datos
        const horario = await Horario.findOne({ fecha, horaInicio, horaFin });

        if (!horario) {
            return res.status(404).json({ message: 'Horario no encontrado' });
        }

        // Actualizar el estado de reserva a true
        horario.reservado = true;
        await horario.save();

        res.json({ message: 'Horario reservado exitosamente' });
    } catch (error) {
        console.error('Error al reservar el horario:', error);
        res.status(500).json({ message: 'Error al reservar el horario' });
    }
});

module.exports = router;