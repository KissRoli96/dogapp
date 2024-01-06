const express = require('express');
const router = express.Router();

// Példa GET kérés kezelése
router.get('/example', (req, res) => {
    res.json({ message: 'Ez egy példa válasz a GET kérésre.' });
  });
  
module.exports = router;