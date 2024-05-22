const User = require('../models/user');
const mongoose = require('mongoose');
const Joi = require('joi');
// const keycloak = require('../config/keycloakclient')

const userValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  roles: Joi.array().items(Joi.string().valid('user', 'admin')),
  profile: Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30),
    lastName: Joi.string().alphanum().min(3).max(30),
    age: Joi.number().integer().min(0),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/),
    address: Joi.object({
      city: Joi.string().max(100),
      country: Joi.string().max(100)
    })
  })
});

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Server error, An error occurred while fetching users' });
  }
}

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    } else {
      user = await User.findOne({ username: req.params.id });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Server error, An error occurred while fetching user' });
  }
}

// Create a new user
exports.createUser = async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error, An error occurred while creating user' });
  }
};


// Create a new user with keycloak
exports.createUser = async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {

    // Create user in Keycloak
    await kcAdminClient.users.create({
      username: req.body.username,
      email: req.body.email,
      enabled: true,
      firstName: req.body.profile.firstName,
      lastName: req.body.profile.lastName,
      attributes: {
        age: req.body.profile.age.toString(),
        phoneNumber: req.body.profile.phoneNumber,
        city: req.body.profile.address.city,
        country: req.body.profile.address.country
      }
    });

    // Get the newly created user's ID
    const newUserInKeycloak = await kcAdminClient.users.find({username: req.body.username});
    const userId = newUserInKeycloak[0].id;

    // Set the user's password
    await kcAdminClient.users.resetPassword({
      id: userId,
      credential: {
        temporary: false,
        type: 'password',
        value: req.body.password
      }
    });

    // Create user in MongoDB
    const newUserInMongoDB = new User(req.body);
    await newUserInMongoDB.save();

    res.status(201).json(newUserInMongoDB);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error, An error occurred while creating user' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};

// Delete a user 
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};