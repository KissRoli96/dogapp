const mongoose = require('mongoose');

require('dotenv').config();

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  dog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog',
    required: true
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;