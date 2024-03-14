const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    },
    reservado: {
        type: Boolean,
        default: false
    },
    usuarioReserva: {
        type: Object, // Cambia el tipo de datos a Object
        default: null // Puedes establecer un valor predeterminado si lo deseas
    }
});

const Horario = mongoose.model('Horario', horarioSchema);

module.exports = Horario;
