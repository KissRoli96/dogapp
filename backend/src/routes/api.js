const express = require('express');
const router = express.Router();
const User = require('../models/user');

console.log(User);
// Példa GET kérés kezelése
router.get('/example', (req, res) => {
    res.json({ message: 'Ez egy példa válasz a GET kérésre.' });
  });

// Példa: Minden felhasználó lekérése
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Mongoose find metódus
    res.json(users);
  } catch (error) {
    console.error('Hiba a felhasználók lekérésekor:', error);
    res.status(500).json({ error: 'Szerverhiba' });
  }
});
  
module.exports = router;