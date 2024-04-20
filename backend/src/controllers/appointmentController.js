const User = require('../models/user');
const Appointment = require('../models/appointment');
const Joi = require('joi');
const Dog = require('../models/dog');
Joi.objectId = require('joi-objectid')(Joi);

const appointmentValidationSchema = Joi.object({
  user: Joi.objectId().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  duration: Joi.number().required(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled').default('pending'),
  notes: Joi.string().allow(''),
  service: Joi.objectId().required(),
  dog: Joi.objectId().required() 
});

// Create an appointment
const createAppointment = async (req, res) => {
  const { error } = appointmentValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { user, date, time, duration, notes, serviceType, dog } = req.body;

  try {
    const newAppointment = new Appointment({
      user,
      date,
      time,
      duration,
      notes,
      serviceType,
      dog
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user')
      .populate('dog');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  // Get a specific appointment
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user')
      .populate('dog'); // Populate the dog field
    if (appointment == null) {
      return res.status(404).json({ message: 'Cannot find appointment' });
    }
    res.json({
      ...appointment._doc, // Spread the appointment document
      userName: appointment.user ? appointment.user.name : '',
      dogType: appointment.dog ? appointment.dog.type : '',
      dogName: appointment.dog ? appointment.dog.name : '',
      serviceType: appointment.serviceType,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
  
// Update an appointment
const updateAppointment = async (req, res) => {
  const { error } = appointmentValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
  // Delete an appointment
  const deleteAppointment = async (req, res) => {
    try {
      await Appointment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted appointment' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
  };