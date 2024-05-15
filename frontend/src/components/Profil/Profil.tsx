import React, { Suspense, useEffect, useState } from 'react';
import { Avatar, Typography, Grid, Paper, makeStyles, Button, CardMedia } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import useFetchUserById from '../../api/useFetchUserById';
import { Dog, User, Appointment, AppointmentStatus, Service } from '../../types/types';
import useFetchDogsByUserId from '../../api/useFetchDogsByOwnerId';
import { getDogPicture } from '../../api/dogApi';
import useFetchAppointmentsByUserId from '../../api/useFetchAppointmentsByUserId';
import useFetchServicesByUserId from '../../api/useFetchServicesByUserId';
import useFetchReviewByUserId from '../../api/useFetchReviewByUserId';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 600,
    marginTop: theme.spacing(8),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  button: {
    margin: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(4), // Adjust as needed
  },
}));

export const Profile: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { data: user, error: userError } = useFetchUserById(id);
  const { data: dogs, error: dogsError } = useFetchDogsByUserId(id);
  const { data: appointments, error: appointmentsError } = useFetchAppointmentsByUserId(id);

  useEffect(() => {
    if (user && dogs) {
      getDogPicture(dogs[0]._id)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setFileUrl(url);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [user, dogs]);
  
  if (!id) {
    return <div>Invalid user ID</div>;
  }


  if (userError) {
    return <div>Error: {userError}</div>;
  }

  if (!user) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!dogs || dogs.length === 0) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!appointments || appointments.length === 0) { 
    return <div>Loading...</div>; // or a loading spinner
  }

  const { username, email, profile } = user;
  const { firstName, lastName, age, address } = profile;

  const lastDogs = dogs.slice(-2);
  const lastAppointments = appointments.slice(-2);


  const handleEdit = () => {
    // Handle edit action
  };

  const handleDelete = () => {
    // Handle delete action
  };
  return (
    <>
     <Typography variant="h3" gutterBottom className={classes.title}>
                            Profile:
                        </Typography>
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar className={classes.avatar}>{firstName[0]}</Avatar>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h6">
                Fullname: {firstName} {lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Username: {username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: {email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Age: {age}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {address.city}, {address.country}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    <Typography variant="h3" gutterBottom className={classes.title}>
                            Dog(s):
                        </Typography>
    {lastDogs.map((dog, index) => (
      <Paper key={index} className={classes.paper}>
        <Grid container spacing={2}>
        <Grid item>
          <Avatar className={classes.avatar}>{dog.name[0]}</Avatar>
        </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h6">
                  Dog's Name: {dog.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Gender: {dog.gender}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Breed: {dog.breed}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Age: {dog.age}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Weight: {dog.weight} Kg
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
                Delete Dog
              </Button>
            </Grid>
      </Paper>
    ))}
    <Typography variant="h3" gutterBottom className={classes.title}>
                             Your Appointment(s):
                        </Typography>
     {lastAppointments.map((appointment, index) => (
  <Paper key={index} className={classes.paper}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="h6">
              Appointment {index + 1}:
            </Typography>
            <Typography variant="body2" gutterBottom>
              Date: {new Date(appointment.date).toDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Start Time: {appointment.startTime}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              End Time: {appointment.endTime}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {appointment.status}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Notes: {appointment.notes}
            </Typography>
            {/* ... rest of appointment's data */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
                Reschedule Appointment
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
              Cancel Appointment
              </Button>
            </Grid>
  </Paper>
))}
    </>
  );
};

export default Profile;