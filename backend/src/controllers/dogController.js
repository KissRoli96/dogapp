const Dog = require('../models/dog');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const multer = require('multer');
const path = require('path');
const uploadsDir = path.join(__dirname, '../../public/pictures');
const fs = require('fs');

const dogSchemaJoi = Joi.object({
  name: Joi.string().required(),
  gender: Joi.string().valid('male', 'female').required(),
  breed: Joi.string().required(),
  age: Joi.number().required(),
  owner: Joi.objectId().required(),
  weight: Joi.number().required(),
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Only accept files with the following extensions
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
});

// Create a new dog
exports.createDog = async (req, res) => {
  const { error } = dogSchemaJoi.validate(req.body);
  if (error) {
    const errorMessages = error.details.reduce((acc, detail) => {
      acc[detail.path[0]] = detail.message;
      return acc;
    }, {});
    return res.status(400).json(errorMessages);
  }

  if (!req.file) {
    return res.status(400).json({ picture: "\"picture\" is required" });
  }

  const dog = new Dog({
    name: req.body.name,
    gender: req.body.gender,
    breed: req.body.breed,
    age: req.body.age,
    weight: req.body.weight,
    owner: '663219e5d704b104f3e11f7b', // Get the user's id from req.user._id
    picture: req.file.path,
  });

  try {
    const savedDog = await dog.save();
    res.json(savedDog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all dogs
exports.getAllDogs = async (req, res) => {
  try {
    const userId = req.query.userId;
    let query = {};
    if (userId) {
      query.owner = userId;
    }
    const dogs = await Dog.find(query);
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a dog by ID
exports.getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id).populate('owner');
    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }
      // let userId = '664255f17256867d80d88981';
    // if (req.params.id !== dog.owner._id.toString()) {
    //   return res.status(403).json({ error: 'This dog does not belong to the current user' });
    // }

    res.json(dog);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Update a dog
exports.updateDog = async (req, res) => {
  const { error } = dogSchemaJoi.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!req.file) {
    return res.status(400).json({ picture: "\"picture\" is required" });
  }


  const updatedDogData = {
    name: req.body.name,
    gender: req.body.gender,
    breed: req.body.breed,
    age: req.body.age,
    weight: req.body.weight,
    owner: '663219e5d704b104f3e11f7b',
    picture: req.file.path,
  };
  
  try {
    const updatedDog = await Dog.findByIdAndUpdate(req.params.id, updatedDogData, { new: true });
    if (!updatedDog) return res.status(404).json({ error: 'Dog not found' });
    res.json(updatedDog);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

exports.getDogPicture = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) {
      return res.status(404).json({ error: 'Dog not found' });
    }

    const ext = path.extname(dog.picture);
    let contentType = 'image/jpeg'; // Default to jpeg

    if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    }

    res.setHeader('Content-Type', contentType);
    res.sendFile(dog.picture);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.uploadDog = upload;