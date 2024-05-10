import React, { useEffect, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Box, Card, CardContent, Typography, Grid, FormControl, FormHelperText, Select, MenuItem, Button, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getServices } from '../../api/serviceApi';
import { Service } from '../../types/types';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { makeStyles } from '@mui/styles';


dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
  status: string;
}

const useStyles = makeStyles({
  legend: {
    // maxWidth: '200px'
  },
  available: {
    backgroundColor: 'green',
    color: 'white',
  },
  booked: {
    backgroundColor: 'red',
    color: 'white',
  },
  unavailable: {
    backgroundColor: 'gray',
    color: 'white',
  },
});

export default function Appointment() {
  const classes = useStyles();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [services, setServices] = useState<Service[]>([]);
  const [dog, setDog] = useState('');
  const [payment, setPayment] = useState('');
  const [open, setOpen] = useState(false);
  const [times, setTimes] = useState<TimeSlot[]>([]);



  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
    };

    fetchServices();
  }, []);

  const handleDateChange = (date: Dayjs | null) => {
    if (date && selectedService) {
      setDate(date);
      setEndTime(date.add(selectedService.duration, 'minute'));
    }
  };

  const bookAppointment = () => {
    // Here you would typically send the selected date to your server
    // For the sake of this example, we'll just log it to the console
    console.log(date);
    console.log(`Booking appointment for ${date.tz('Europe/Budapest').format()}`);
  };


  //   const handleSnackbarClose = (event, reason) => {
  //     if (reason === 'clickaway') {
  //       return;
  //     }
  //     setOpen(false);
  //   };


  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5">Appointment Booking</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl>
                <Select
                  value={selectedService ? selectedService._id : ''}
                  onChange={(e) => setSelectedService(services.find(service => service._id === e.target.value) || null)}
                >
                  {services.map((service: Service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name}
                      {service.duration && ` (${service.duration} minutes)`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a service</FormHelperText>
              </FormControl>
            </Grid>
           
            <Grid item xs={8}>
              <TableContainer component={Paper} style={{ maxWidth: '200px', margin: 'auto'}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Color</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.available}><strong>Green</strong></TableCell>
                      <TableCell>Available for booking</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.booked}><strong>Red</strong></TableCell>
                      <TableCell>Already booked</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.unavailable}><strong>Gray</strong></TableCell>
                      <TableCell>Not available</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} >
              <Typography variant="h6">
                <strong>Select Appointment Date and Time</strong>
              </Typography>
              <DateTimePicker
                value={date}
                onChange={handleDateChange}
                shouldDisableDate={(date) => date.isBefore(dayjs(), 'day')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>End time:</strong> {endTime.format('dddd, MMMM D, YYYY [at] HH:mm')}
              </Typography>
            </Grid>
            {/* <Grid item xs={12}>
                <FormControl>
                  <Select value={dog} onChange={(e) => setDog(e.target.value)}>
                    Map over dogs and create a MenuItem for each 
                  </Select>
                  <FormHelperText>Select a dog or <Button color="primary">Create new</Button></FormHelperText>
                </FormControl>
              </Grid> */}
            <Grid item xs={12}>
              {/* <FormControl>
                  <Select value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="inPerson">In Person</MenuItem>
                  </Select>
                  <FormHelperText>Select a payment method</FormHelperText>
                </FormControl> */}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">Book</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <MuiAlert onClose={handleSnackbarClose} severity="success">
            Appointment booked successfully!
          </MuiAlert>
        </Snackbar> */}
    </Box>
  );
}