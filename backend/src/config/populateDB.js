const faker = require('faker');
const mongoose = require('mongoose');
require('dotenv').config({path: '../../.env'});
const User = require('../models/user');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB csatlakozási hiba:'));
db.once('open', () => {
  console.log('A MongoDB sikeresen csatlakozott!');
}); 

const users = Array.from({ length: 15 }).map(() => {
  const user = new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: ["user"],
    profile: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number({ min: 18, max: 60 }),
      address: {
        city: faker.address.city(),
        country: faker.address.country(),
      },
    },
  });

  return user.save();
});

Promise.all(users)
  .then(() => {
    console.log("All users inserted");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });