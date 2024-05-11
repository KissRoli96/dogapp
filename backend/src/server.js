// Express inicializálása
const express = require('express');
const bodyParser = require('./middleware/bodyParser');
const mongoose = require('./config/mongoose');
const cors = require('cors');
const router = require('./routes/api.js');
// const session = require('express-session');
// const Keycloak = require('keycloak-connect');

const app = express();

// Middleware-ek hozzáadása
app.use(bodyParser);  // Beépített JSON body parser
// - CORS engedélyezése, hogy a frontend hozzáférhessen a backend erőforrásokhoz
app.use(cors());

// Keycloak setup
// const memoryStore = new session.MemoryStore();
// app.use(session({
//   secret: 'some secret',
//   resave: false,
//   saveUninitialized: true,
//   store: memoryStore
// }));


// const keycloak = new Keycloak({ store: memoryStore }, {
//   "realm": "myrealm",
//   "auth-server-url": "http://localhost:8080",
//   "ssl-required": "external",
//   "resource": "myclient",
//   "public-client": true,
//   "confidential-port": 0
// });

// app.use(keycloak.middleware());

// Statikus fájlok szolgáltatása a "public" mappából
app.use(express.static('public'));

// Útválasztók beállítása
//    - Importálni az API útválasztókat (routes/api.js)
const apiRoutes = require('./routes/api');
//    - Az '/api' prefix alatt lesznek kezelve az  API hívások
// app.use('/api', keycloak.protect(), apiRoutes); // Protect API routes with Keycloak
app.use('/api', apiRoutes); // API routes witwhout keylcoak

// Port beállítása és szerver indítása
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`A szerver fut a http://localhost:${PORT} címen`);
});