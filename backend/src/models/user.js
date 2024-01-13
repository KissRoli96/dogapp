const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: [String],
    default: ['user']
  },
  profile: {
    firstName: String,
    lastName: String,
    age: Number,
    address: {
      city: String,
      country: String
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;