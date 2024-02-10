const Calendario = require('../models/calendario');
const { startOfWeek, addDays, format } = require('date-fns');

// Obtener la disponibilidad del calendario para el usuario autenticado
async function getAvailability(userId) {
  try {
    const availability = await Calendario.find({ userId });
    return availability;
  } catch (error) {
    throw new Error('Error al obtener la disponibilidad del calendario.');
  }
}

// Obtener la disponibilidad del calendario para la semana específica
async function getAvailabilityForWeek(userId, fechaInicio) {
  try {
    // Parsea la fecha de inicio recibida en el parámetro
    const weekStartDate = new Date(fechaInicio);
    
    // Calcula la fecha de fin de la semana sumando 6 días a la fecha de inicio
    const weekEndDate = addDays(weekStartDate, 6);

    const availability = await Calendario.find({
      userId,
      day: { $gte: weekStartDate, $lte: weekEndDate },
    });

    return availability;
  } catch (error) {
    throw new Error('Error al obtener la disponibilidad del calendario para la semana específica.');
  }
}

async function updateAvailability(userId, date, hour, reservedBy, confirmation) {
  try {
    let updateData = { availability: true, reservedBy };


    if (confirmation === 'yes') {
      updateData = { ...updateData, confirmed: true };
    }

    console.log('Datos a enviar al backend:', updateData); 

 const updatedEntry = await Calendario.findOneAndUpdate(
  { userId, day: new Date(date), hour }, 
  updateData,
  { new: true, upsert: true }
);

    return updatedEntry;
  } catch (error) {
    console.error('Error al comunicarse con el backend.', error);
    throw new Error('Error al actualizar la disponibilidad del calendario.');
  }
}


module.exports = {
  getAvailability,
  getAvailabilityForWeek, 
  updateAvailability,
};