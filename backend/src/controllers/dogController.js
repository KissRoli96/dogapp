const User = require('../models/user');
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

