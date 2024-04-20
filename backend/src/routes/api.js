const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
const serviceController = require('../controllers/serviceController');
const dogController = require('../controllers/dogController');

// Példa GET kérés kezelése
router.get('/example', (req, res) => {
    res.json({ message: 'Ez egy példa válasz a GET kérésre.' });
  });

//Időpontfoglalással kapcsolatos Útvonalak
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointment/:id', appointmentController.getAppointmentById);
router.post('/appointment', appointmentController.createAppointment);
router.put('/appointment/:id', appointmentController.updateAppointment);
router.delete('/appointment/:id', appointmentController.deleteAppointment);

//Felhaszálóval kapcsolatos Útvonalak
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user/', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

// Service routes
router.get('/services', serviceController.getAllServices);
router.get('/service/:id', serviceController.getServiceById);
router.post('/service', serviceController.createService);
router.put('/service/:id', serviceController.updateService);
router.delete('/service/:id', serviceController.deleteService);

// Dog routes
router.get('/dogs', dogController.getAllDogs);
router.get('/dog/:id', dogController.getDogById);
router.post('/dog', dogController.createDog);
router.put('/dog/:id', dogController.updateDog);
router.delete('/dog/:id', dogController.deleteDog);

module.exports = router;