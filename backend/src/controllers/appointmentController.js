const User = require('../models/user');
const Appointment = require('../models/Appointment');

// Create an appointment
const createAppointment = async (req, res) => {
    const { user, date, time, duration, notes } = req.body;
  
    try {
      const newAppointment = new Appointment({
        user,
        date,
        time,
        duration,
        notes
      });
  
      const savedAppointment = await newAppointment.save();
  
      res.status(201).json(savedAppointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a specific appointment
  const getAppointment = async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (appointment == null) {
        return res.status(404).json({ message: 'Cannot find appointment' });
      }
      res.json(appointment);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  // Update an appointment
  const updateAppointment = async (req, res) => {
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
    getAppointment,
    updateAppointment,
    deleteAppointment
  };