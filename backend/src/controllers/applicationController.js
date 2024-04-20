const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Application = require('../models/application');

const applcationValidationSchema = Joi.object({
      lastName: Joi.string().required(),
      firstName: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      placeOfBirth: Joi.string().required(),
      motivation: Joi.string().required(),
      cv: Joi.string().required(), // This will be a link to the stored PDF file
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
});

// Create an application
exports.createApplication = async (req, res) => {
    const { error } = applicationValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const application = new Application({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        dateOfBirth: req.body.dateOfBirth,
        placeOfBirth: req.body.placeOfBirth,
        motivation: req.body.motivation,
        cv: req.body.cv,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    });

    try {
        const savedApplication = await application.save();
        res.json(savedApplication);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all applications
exports.getApplications = async (req, res) => {
    try {
      const applications = await Application.find();
      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Get an application by ID
exports.getApplicationById = async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      if (application == null) {
        return res.status(404).json({ message: 'Cannot find application' });
      }
      res.json(application);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

// Update an application
exports.updateApplication = async (req, res) => {
    const { error } = applicationValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try {
      const updatedApplication = await Application.findByIdAndUpdate(req.id, req.body, { new: true });
      res.json(updatedApplication);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Delete an application
exports.deleteApplication = async (req, res) => {
    try {
      await Application.findByIdAndDelete(req.params.id);
      res.json({ message: 'Application deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };