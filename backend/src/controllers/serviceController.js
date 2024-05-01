const Service = require('../models/service');
const Joi = require('joi');

const serviceValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required()
});


// Create a new service
exports.createService = async (req, res) => {
    const { error } = serviceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    try {
      const newService = new Service(req.body);
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ error: 'Server error, An error occurred while creating service' });
    }
  }
  
  // Get all services
  exports.getAllServices = async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      console.error('Error getting services:', error);
      res.status(500).json({ error: 'Server error, An error occurred while fetching services' });
    }
  }
  
  // Get a service by ID
  exports.getServiceById = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      console.error('Error getting service:', error);
      res.status(500).json({ error: 'Server error, An error occurred while fetching service' });
    }
  }
  
  // Update a service
  exports.updateService = async (req, res) => {
    const { error } = serviceValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    try {
      const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!service) return res.status(404).json({ error: 'Service not found' });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the service' });
    }
  };
  
  // Delete a service
  exports.deleteService = async (req, res) => {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) return res.status(404).json({ error: 'Service not found' });
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the service' });
    }
  };