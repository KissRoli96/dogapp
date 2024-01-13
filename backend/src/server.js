// Express inicializálása
const express = require('express');
const bodyParser = require('./middleware/bodyParser');
const mongoose = require('./config/mongoose');
const cors = require('cors');
const router = require('./routes/api.js');

const app = express();

// Middleware-ek hozzáadása
app.use(bodyParser);  // Beépített JSON body parser
// - CORS engedélyezése, hogy a frontend hozzáférhessen a backend erőforrásokhoz
app.use(cors());

// Statikus fájlok szolgáltatása a "public" mappából
app.use(express.static('public'));

// Útválasztók beállítása
//    - Importálni az API útválasztókat (routes/api.js)
const apiRoutes = require('./routes/api');
//    - Az '/api' prefix alatt lesznek kezelve az  API hívások
app.use('/api', apiRoutes);

// Port beállítása és szerver indítása
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`A szerver fut a http://localhost:${PORT} címen`);
});