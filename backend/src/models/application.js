const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  placeOfBirth: { type: String, required: true },
  motivation: { type: String, required: true },
  cv: { type: String, required: true }, // This will be a link to the stored PDF file
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;