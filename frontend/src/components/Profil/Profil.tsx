import React, { Suspense, useEffect, useState } from 'react';
import { Avatar, Typography, Grid, Paper, makeStyles, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import useFetchUserById from '../../api/useFetchUserById';
import { Dog, User, Appointment, AppointmentStatus, Service, Review } from '../../types/types';
import useFetchDogsByUserId from '../../api/useFetchDogsByOwnerId';
import { getDogPicture } from '../../api/dogApi';
import { getService } from '../../api/serviceApi';
import { getReviews,getReviewsByUserId } from '../../api/reviewApi';
import useFetchAppointmentsByUserId from '../../api/useFetchAppointmentsByUserId';
import useFetchServicesByUserId from '../../api/useFetchServicesByUserId';
import useFetchReviewByUserId from '../../api/useFetchReviewByUserId';
import {rescheduleAppointment} from '../../api/appointmentApi';

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const { data: user, error: userError } = useFetchUserById(id);
  const { data: dogs, error: dogsError } = useFetchDogsByUserId(id);
  const { data: appointments, error: appointmentsError } = useFetchAppointmentsByUserId(id);
  const { data: services, error: servicesError } = useFetchServicesByUserId(id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');;
  

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

  useEffect(() => {
    if (id) { // Check if id is not undefined
      getReviewsByUserId(id)
        .then((reviewsData: Review[]) => {
          setReviews(reviewsData);
          return Promise.all(
            reviewsData.map((review) =>
                typeof review.service === 'string'
                    ? getService(review.service).then((service: Service) => [review.service, service.name] as [string, string])
                    : Promise.resolve([review.service._id, review.service.name] as [string, string])
            )
        ) as Promise<[string, string][]>;
        })
        .then((servicesData: [string, string][]) =>
          setServiceNames(Object.fromEntries(servicesData))
        )
        .catch((error: Error) => console.error(error));
    }
  }, [id]);

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

  if (!reviews || reviews.length === 0) {
    return <div>Loading...</div>; // or a loading spinner
  }

  const { username, email, profile } = user;
  const { firstName, lastName, age, address } = profile;

  const lastDogs = dogs.slice(-2);
  const lastAppointments = appointments.slice(-2);

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleEdit = async () => {
    handleClose();
  };
  // const handleEdit = async (appointmentId: string) => {
  //   try {
  //     const response = await rescheduleAppointment(appointmentId, { date, startTime, endTime });
  
  //   //   // Update the appointments state
  //   // setAppointments((prevAppointments: Appointment[])  => {
  //   //   return prevAppointments.map((appointment: Appointment) => {
  //   //     if (appointment.id === appointmentId) {
  //   //       // This is the appointment that was rescheduled, update it with the new data
  //   //       return response;
  //   //     } else {
  //   //       return appointment;
  //   //   });
  //   // });
  //     handleClose();
  //   } catch (error) {
  //     console.error('Failed to reschedule appointment:', error);
  //   }
  // };

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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Grid item>
    {/* <Button variant="contained" color="primary" className={classes.button} onClick={handleOpen(appointment._id)}>
  Reschedule Appointment
</Button> */}
<Button variant="contained" color="primary" className={classes.button} onClick={handleEdit} >
  Reschedule Appointment
</Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
              Cancel Appointment
              </Button>
            </Grid>
  </Paper>
))}
<Typography variant="h3" gutterBottom className={classes.title}>
                             Your Review(s):
                        </Typography>
{reviews.map((review, index) => (
  <Paper key={index} className={classes.paper}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="h6">
              Review {index + 1}:
            </Typography>
            <Typography variant="h4" gutterBottom>
            Service: {serviceNames[typeof review.service === 'string' ? review.service : review.service._id]}
              </Typography>
            <Typography variant="body2" gutterBottom>
              Date: {new Date(review.date).toDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Rating: {review.rating}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Comments: {review.content}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      </Grid>
      <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
                Edit Review
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
              Delete Review
              </Button>
            </Grid>
      </Paper>
    ))}
     <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reschedule Appointment</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleEdit}>Reschedule</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default Profile;