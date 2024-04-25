import * as React from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getServices } from '../../api/serviceApi';
import { withStyles } from '@material-ui/core/styles';
import Review from '../Review/Review'; // Import the Review component
import EditIcon from '@material-ui/icons/Edit';



interface Service {
  _id: { $oid: string };
  name: string;
  description: string;
  price: number;
}

// Assume you have a userId, you might need to fetch it from your user context or authentication
const userId = '6623f105eeef89be3d9bb88d';

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
  
    const handleClickOpen = (serviceId: string) => {
      setSelectedServiceId(serviceId);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    React.useEffect(() => {
      const fetchServices = async () => {
        const data = await getServices();
        setServices(data);
      };
  
      fetchServices();
    }, []);


  return (
    <Grid container spacing={3}>
      {services.map((service) => (
        <Grid item xs={12} sm={6} md={4} key={service._id.$oid}>
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
            </CardContent>
            <CardActions>
            <Button 
  size="small" 
  className={`${classes.button} ${classes.reviewButton}`} 
  onClick={() => handleClickOpen(service._id.$oid)}
>
  <EditIcon />
  Write a Review
</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <StyledDialogTitle id="form-dialog-title">Write a Review</StyledDialogTitle>
              <DialogContent>
                  <Review serviceId={selectedServiceId} userId={userId} />
              </DialogContent>
          </Dialog>
    </Grid>
  );
}

export default Services;