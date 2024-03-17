const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');

// Példa GET kérés kezelése
router.get('/example', (req, res) => {
    res.json({ message: 'Ez egy példa válasz a GET kérésre.' });
  });

// Példa: Minden felhasználó lekérése
router.get('/users', userController.getAllUsers);

// Új felhasználó létrehozása
router.post('/users', userController.createUser);

// Felhasználó frissítése
router.put('/users/:id', userController.updateUser);

// Felhasználó törlése
router.delete('/users/:id', userController.deleteUser);

module.exports = router;