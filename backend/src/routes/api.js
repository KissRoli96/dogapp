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

// Új felhasználó létrehozása
router.post('/users', async (req, res) => {
  try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
  } catch (error) {
      console.error('Hiba az új felhasználó létrehozásakor:', error);
      res.status(500).json({ error: 'Szerverhiba' });
  }
});

// Felhasználó frissítése
router.put('/users/:id', async (req, res) => {
  try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ error: 'Felhasználó nem található' });
      }
      res.json(updatedUser);
  } catch (error) {
      console.error('Hiba a felhasználó frissítésekor:', error);
      res.status(500).json({ error: 'Szerverhiba' });
  }
});

// Felhasználó törlése
router.delete('/users/:id', async (req, res) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
          return res.status(404).json({ error: 'Felhasználó nem található' });
      }
      res.json({ message: 'Felhasználó sikeresen törölve' });
  } catch (error) {
      console.error('Hiba a felhasználó törlésekor:', error);
      res.status(500).json({ error: 'Szerverhiba' });
  }
});
  
module.exports = router;