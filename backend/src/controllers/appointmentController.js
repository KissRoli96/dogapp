const User = require('../models/user');
const Appointment = require('../models/appointment');
const Joi = require('joi');
const Dog = require('../models/dog');
Joi.objectId = require('joi-objectid')(Joi);
const Service = require('../models/service'); //

const appointmentValidationSchema = Joi.object({
  user: Joi.objectId().required(),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
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

  const { user, date, startTime,endTime,  notes, service, dog, status } = req.body;

  try {
    // Get the service to find its duration
    const serviceObj = await Service.findById(service);
    if (!serviceObj) {
      return res.status(400).json({ error: 'Invalid service ID.' });
    }

    // Check for overlapping appointments
    const overlappingAppointments = await Appointment.find({
      user,
      date,
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gt: startTime }, endTime: { $lt: endTime } },
      ],
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }

    const newAppointment = new Appointment({
      user,
      date,
      startTime,
      endTime,
      notes,
      service,
      dog,
      status
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.log(error);
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


// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!cancelledAppointment) {
      return res.status(404).json({ message: 'Cannot find appointment' });
    }

    res.json(cancelledAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    // Check for overlapping appointments
    const overlappingAppointments = await Appointment.find({
      user: '6639469db27e59c55b796a23',
      date,
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gt: startTime }, endTime: { $lt: endTime } },
      ],
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, startTime, endTime },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Cannot find appointment' });
    }

    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment
};