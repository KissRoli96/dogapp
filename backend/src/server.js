// Express inicializálása
const express = require('express');
const app = express();

// Middleware-ek hozzáadása
//    - express.json() middleware az incoming JSON adatok könnyű olvashatóságához
app.use(express.json());

/* CORS engedélyezése (fejlesztési környezetben)
- CORS engedélyezése, hogy a frontend hozzáférhessen a backend erőforrásokhoz
*/
const cors = require('cors');
app.use(cors());

// Útválasztók beállítása
//    - Importálni az API útválasztókat (routes/api.js)
const apiRoutes = require('./routes/api');
//    - Az '/api' prefix alatt lesznek kezelve az  API hívások
app.use('/api', apiRoutes);

// Statikus fájlok szolgáltatása (opcionális)
app.use(express.static('public'));

// Port beállítása és szerver indítása
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`A szerver fut a http://localhost:${PORT} címen`);
});