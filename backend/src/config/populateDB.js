const faker = require('faker');
const mongoose = require('mongoose');
require('dotenv').config({path: '../../.env'});
const User = require('../models/user');
const Appointment = require('../models/appointment'); // Import the Appointment model
const Dog = require('../models/dog'); // Import the Dog model
const Service = require('../models/service'); // Import the Service model

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB csatlakozási hiba:'));
db.once('open', () => {
  console.log('A MongoDB sikeresen csatlakozott!');
}); 

// create fake user 
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

// Create some services
const services = Array.from({ length: 5 }).map(() => {
  const service = new Service({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: faker.commerce.price(),
    // Add other fields as necessary
  });

  return service.save();
});

Promise.all([...users, ...services])
  .then((results) => {
    const users = results.slice(0, 15);
    const services = results.slice(15);
    console.log("All users and services inserted");

    // Create some dogs
    const dogs = users.map((user) => {
      const dog = new Dog({
        name: faker.name.firstName(),
        owner: user._id, // Use valid ObjectId
        age: faker.datatype.number({ min: 1, max: 15 }), // Add age
        breed: faker.random.arrayElement(['Bulldog', 'Labrador', 'Poodle', 'Beagle']), // Add breed
        gender: faker.random.arrayElement(['male', 'female']), // Use valid enum values
        // Add other fields as necessary
      });
    
      return dog.save();
    });
    return Promise.all(dogs).then(dogs => ({dogs, services}));
  })
  .then(({dogs, services}) => {
    console.log("All dogs inserted");

    // Create appointments for each user
    const appointments = dogs.map((dog, index) => {
      const appointment = new Appointment({
        user: dog.owner,
        dog: dog._id, // Assign a dog to the appointment
        date: faker.date.future(),
        time: faker.datatype.number({ min: 8, max: 18 }).toString() + ":00",
        duration: faker.datatype.number({ min: 30, max: 120 }),
        status: faker.random.arrayElement(['pending', 'confirmed', 'cancelled']),
        notes: faker.lorem.sentence(),
        serviceType: services[index % services.length].name, // Assign a service to the appointment
      });
    
      return appointment.save();
    });
  
    return Promise.all(appointments);
  })
  .then(() => {
    console.log("All appointments inserted");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });