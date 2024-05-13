// Express inicializálása
const express = require('express');
const bodyParser = require('./middleware/bodyParser');
const mongoose = require('./config/mongoose');
const cors = require('cors');
const router = require('./routes/api.js');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const morgan = require('morgan');

app.use(morgan('combined'));

// Middleware-ek hozzáadása
app.use(bodyParser);  // Beépített JSON body parser
// - CORS engedélyezése, hogy a frontend hozzáférhessen a backend erőforrásokhoz
app.use(cors());
// bin\kc.bat start-dev ezzel inditom a kecloak servert
// Keycloak setup
const memoryStore = new session.MemoryStore();
const store = new MongoDBStore({
  uri: 'mongodb://localhost/dogcosmetics',
  collection: 'dogcosmetics_sessions'
});

app.use(session({
  secret: process.env.KEYCLOAK_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  resave: true,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": `${process.env.KEYCLOAK_REALM}`,
  "auth-server-url": `${process.env.KEYCLOAK_URL}`,	
  "ssl-required": "external",
  "resource": `${process.env.KEYCLOAK_CLIENT_ID}`,
  "public-client": true,
  "confidential-port": 0
});

app.use(keycloak.middleware());

// Statikus fájlok szolgáltatása a "public" mappából
app.use(express.static('public'));

// Útválasztók beállítása
//    - Importálni az API útválasztókat (routes/api.js)
const apiRoutes = require('./routes/api');
//    - Az '/api' prefix alatt lesznek kezelve az  API hívások
app.use('/api', keycloak.protect((token, request) => {
  return token.hasRole('admin') || token.hasRole('dogbeautician') || token.hasRole('guest') || token.hasRole('registereduser');
}), apiRoutes); // Protect API routes with Keycloak


// Port beállítása és szerver indítása
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`A szerver fut a http://localhost:${PORT} címen`);
});