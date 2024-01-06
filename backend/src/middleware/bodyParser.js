const express = require('express');
// Middleware függvény definíciója
const bodyParser = express.json();

// Exportáljuk a middleware függvényt
module.exports = bodyParser;
