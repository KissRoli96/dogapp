const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Application = require('../models/application');
const multer = require('multer');
const path = require('path');
const uploadsDir = path.join(__dirname, '../../public/uploads');
const fs = require('fs');

const applicationValidationSchema = Joi.object({
    lastName: Joi.string().required(),
    firstName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    placeOfBirth: Joi.string().required(),
    motivation: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending').required()
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Only accept files with the following extensions
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // Limit file size to 25MB
});

// Create an application
exports.createApplication = async (req, res) => {
    const { error } = applicationValidationSchema.validate(req.body);
    if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
            acc[detail.path[0]] = detail.message;
            return acc;
        }, {});
        return res.status(400).json(errorMessages);
    }

    if (!req.file) {
        return res.status(400).json({ cv: "\"cv\" is required" });
    }

    const application = new Application({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        dateOfBirth: req.body.dateOfBirth,
        placeOfBirth: req.body.placeOfBirth,
        motivation: req.body.motivation,
        cv: req.file.path, // This will be the path to the uploaded file
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

    const updatedApplicationData = {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        dateOfBirth: req.body.dateOfBirth,
        placeOfBirth: req.body.placeOfBirth,
        motivation: req.body.motivation,
        cv: req.file.path, // This will be the path to the uploaded file
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    };

    try {
        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, updatedApplicationData, { new: true });
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

// Update the status of an application
exports.updateApplicationStatus = async (req, res) => {
    const status = req.body.status;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).send('Invalid status');
    }

    try {
        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(updatedApplication);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a CV by application ID
exports.getApplicationCv = async (req, res) => {
    try {
        console.log(req.params.id);
        console.log(req.params);
        const application = await Application.findById(req.params.id);
        if (application == null) {
            return res.status(404).json({ message: 'Cannot find application' });
        }

        // Check if the application has a cv
        if (!application.cv) {
            return res.status(404).json({ message: 'Cannot find CV' });
        }

        // Check if the file exists
        if (!fs.existsSync(application.cv)) {
            return res.status(404).json({ message: 'Cannot find CV' });
        }

        // Set the Content-Type header to application/pdf
        res.setHeader('Content-Type', 'application/pdf');

        // Send the file as a response
        res.sendFile(application.cv);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.upload = upload;