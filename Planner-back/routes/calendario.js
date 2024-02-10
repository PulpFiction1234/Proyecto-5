const express = require('express');
const router = express.Router();
const authenticateToken = require('../auth/authenticateToken');
const calendarioController = require('../controllers/calendario');


router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const availability = await calendarioController.getAvailability(userId);
    res.json({ availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la disponibilidad del calendario.' });
  }
});

router.get('/semana/:fechaInicio', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const fechaInicio = req.params.fechaInicio;

    
    const availability = await calendarioController.getAvailabilityForWeek(userId, fechaInicio);

    res.json({ availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la disponibilidad del calendario para la semana específica.' });
  }
});


router.put('/:date/:hour', authenticateToken, async (req, res) => {
  const { date, hour } = req.params;
  const { reservedBy } = req.body;

  try {
    const userId = req.user._id;

 
    const updatedEntry = await calendarioController.updateAvailability(userId, date, hour, reservedBy);
    
    res.json({ updatedEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la disponibilidad del calendario.' });
  }
});


router.post('/confirmarReserva/:date/:hour', authenticateToken, async (req, res) => {
  const { date, hour } = req.params;
  const { confirmation, reservedBy } = req.body;

  try {
    const userId = req.user._id;

    const updatedEntry = await calendarioController.updateAvailability(userId, date, hour, reservedBy, confirmation);

    res.json({ updatedEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al confirmar la reserva.' });
  }
});

module.exports = router;