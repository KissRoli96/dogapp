const Dog = require('../models/dog');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const dogSchemaJoi = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().valid('male', 'female').required(),
    breed: Joi.string().required(),
    age: Joi.number().required(),
    owner: Joi.objectId().required()
});

// Create a new dog
exports.createDog = async (req, res) => {
  const { error } = dogSchemaJoi.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newDog = new Dog(req.body);
    await newDog.save();
    res.status(201).json(newDog);
  } catch (error) {
    console.error('Error creating dog:', error);
    res.status(500).json({ error: 'Server error, An error occurred while creating dog' });
  }
}

// Get all dogs
exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.json(dogs);
  } catch (error) {
    console.error('Error getting dogs:', error);
    res.status(500).json({ error: 'Server error, An error occurred while fetching dogs' });
  }
}

// Get a dog by ID
exports.getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }
    res.json(dog);
  } catch (error) {
    console.error('Error getting dog:', error);
    res.status(500).json({ error: 'Server error, An error occurred while fetching dog' });
  }
}

// Update a dog
exports.updateDog = async (req, res) => {
  const { error } = dogSchemaJoi.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const dog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    res.json(dog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the dog' });
  }
};

// Delete a dog
exports.deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    res.json({ message: 'Dog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the dog' });
  }
};