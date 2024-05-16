import * as React from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getServices } from '../../api/serviceApi';
import { withStyles } from '@material-ui/core/styles';
import Review from '../Review/Review'; // Import the Review component
import EditIcon from '@material-ui/icons/Edit';
import { Service } from '../../types/types';
import { useState } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
// Assume you have a userId, you might need to fetch it from your user context or authentication
const userId = '6623f105eeef89be3d9bb88d';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '1em',
    padding: '1em',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    boxShadow: '0px 10px 18px -2px rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  description: {
    color: '#757575',
  },
  price: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '1em',
  },
  duration: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '1em',
  },
  button: {
    marginTop: '1em',
  },
  reviewButton: {
    backgroundColor: '#3f51b5',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },
});

const StyledDialogTitle = withStyles({
    root: {
      backgroundColor: '#f5f5f5',
      color: '#3f51b5',
      fontSize: '1.5em',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '1em',
    },
  })(DialogTitle);

function Services() {
    const classes = useStyles();
    const [services, setServices] = React.useState<Service[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedServiceId, setSelectedServiceId] = React.useState('');
    const [isReviewOpen, setIsReviewOpen] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
  
    const handleClickOpen = (serviceId: string) => {
      setSelectedServiceId(serviceId);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
          return;
      }
      setSnackbarOpen(false);
    }
  
    React.useEffect(() => {
      const fetchServices = async () => {
        const data = await getServices();
        setServices(data);
      };
  
      fetchServices();
    }, []);

  return (
    <>
    <Grid container spacing={3}>
      {services.map((service) => (
        <Grid item xs={12} sm={6} md={4} key={service._id}>
          <Card className={classes.root}>
            <CardContent>
            <Typography variant="h5" component="div" className={classes.title}>
                {service.name}
              </Typography>
              <Typography className={classes.description} color="textSecondary">
                {service.description}
              </Typography>
              <Typography variant="body2" className={classes.price}>
                Price: {service.price}Ft
              </Typography>
              <Typography variant="body2" className={classes.duration}>
                Duration: {service.duration} Minutes
              </Typography>
            </CardContent>
            <CardActions>
            <Button 
  size="small" 
  className={`${classes.button} ${classes.reviewButton}`} 
  onClick={() => handleClickOpen(service._id)}
>
  <EditIcon />
  Write a Review
</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
          {isReviewOpen &&
           <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <StyledDialogTitle id="form-dialog-title">Write a Review</StyledDialogTitle>
              <DialogContent>
                   <Review serviceId={selectedServiceId} userId={userId} closeReview={() => setIsReviewOpen(false)} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage} />
              </DialogContent>
          </Dialog>
          }
    </Grid>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <div><Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
      </div>
    </Snackbar>
    </>
  );
}

export default Services;