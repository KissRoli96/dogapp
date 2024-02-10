const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB csatlakozási hiba:'));
db.once('open', () => {
  console.log('A MongoDB sikeresen csatlakozott!');
});

module.exports = mongoose;