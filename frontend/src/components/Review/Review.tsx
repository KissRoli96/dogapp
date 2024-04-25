import React, { useState } from 'react';
import { Button, TextField, Typography, makeStyles } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { createReview } from '../../api/reviewApi'; // Import the createReview function

interface ReviewProps {
  serviceId: string;
  userId: string;
}

interface Review {
  user: string; // ObjectId
  service: string; // ObjectId
  content: string;
  date: Date;
  rating: number;
}

const useStyles = makeStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1em',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textField: {
      width: '100%',
    },
    button: {
      backgroundColor: '#3f51b5',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#303f9f',
      },
    },
  });

function Review({ serviceId, userId }: ReviewProps) {
  const classes = useStyles();
  const [rating, setRating] = useState<number | null>(2);
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const review: Review = {
      user: userId,
      service: serviceId,
      content: content,
      date: new Date(),
      rating: rating ? rating : 0,
    };

    try {
      // Call the createReview function with the review object
      const savedReview = await createReview(review);
      console.log(savedReview); // Log the saved review
    } catch (error) {
      console.error(error); // Log any errors
    }
  };

  return (
    <div className={classes.root}>
      <Typography component="legend">Rate this service</Typography>
      <div className={classes.rating}>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </div>
      <TextField
        id="outlined-multiline-static"
        label="Your Review"
        multiline
        rows={4}
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={classes.textField}
      />
      <Button variant="contained" className={classes.button} onClick={handleSubmit}>
        Submit Review
      </Button>
    </div>
  );
}

export default Review;