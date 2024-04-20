const faker = require('faker');
const mongoose = require('mongoose');
require('dotenv').config({path: '../../.env'});
const User = require('../models/user');
const Appointment = require('../models/appointment'); // Import the Appointment model
const Dog = require('../models/dog'); // Import the Dog model
const Service = require('../models/service'); // Import the Service model
const Review = require('../models/review');
const Application = require('../models/application'); 

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
      phoneNumber: faker.phone.phoneNumber(),
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

// Create some applications
const applications = Array.from({ length: 10 }).map(() => {
  const application = new Application({
    lastName: faker.name.lastName(),
    firstName: faker.name.firstName(),
    dateOfBirth: faker.date.past(30, '2000-01-01'),
    placeOfBirth: faker.address.city(),
    motivation: faker.lorem.paragraph(),
    cv: faker.internet.url(), // This will be a link to the stored PDF file
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
  });

  return application.save();
});

Promise.all([...users, ...services, ...applications])
  .then((results) => {
    const users = results.slice(0, 15);
    const services = results.slice(15);
    const applications = results.slice(20);
    console.log("All users, services, and applications inserted");

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
    return Promise.all(dogs).then(dogs => ({dogs, services, users, applications}));
  })
  .then(({dogs, services, users}) => {
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
    service: services[index % services.length]._id, // Assign a service to the appointment
  });

  return appointment.save();
});

    // Create some reviews for each service
    const reviews = services.map((service, index) => {
      const review = new Review({
        user: users[index % users.length]._id,
        service: service._id,
        content: faker.lorem.paragraph(),
        date: faker.date.past(),
        rating: faker.datatype.number({ min: 1, max: 5 }),
      });

      return review.save();
    });
  
    return Promise.all([...appointments, ...reviews]);
  })
  .then(() => {
    console.log("All appointments and reviews inserted");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });