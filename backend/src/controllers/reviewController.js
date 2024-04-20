const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Review = require('../models/review');

const reviewValidationSchema = Joi.object({
  user: Joi.objectId().required(),
  service: Joi.objectId().required(),
  content: Joi.string().min(1).required(),
  date: Joi.date().default(Date.now),
  rating: Joi.number().min(1).max(5).required()
});

// Create a review
exports.createReview = async (req, res) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const review = new Review({
      user: req.body.user,
      service: req.body.service,
      content: req.body.content,
      date: req.body.date,
      rating: req.body.rating
    });
  
    try {
      const savedReview = await review.save();
      res.json(savedReview);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Get all reviews
  exports.getReviews = async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Get a review by ID
  exports.getReviewById = async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (review == null) {
        return res.status(404).json({ message: 'Cannot find review' });
      }
      res.json(review);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  // Update a review
  exports.updateReview = async (req, res) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try {
      const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedReview);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Delete a review
  exports.deleteReview = async (req, res) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
      res.json({ message: 'Review deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


