const mongoose = require('mongoose');

const CalendarioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  day: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
  reservedBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Calendario', CalendarioSchema);
