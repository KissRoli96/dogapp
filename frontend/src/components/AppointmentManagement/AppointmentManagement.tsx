import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getReviews, updateReviewStatus, getReview } from '../../api/reviewApi';
import { getUser } from '../../api/userApi';
import { getService } from '../../api/serviceApi';
import { getAppointment, getAppointments, updateAppointmentStatus} from '../../api/appointmentApi';
import { Review, User, Service, ReviewStatus, Appointment, AppointmentStatus } from '../../types/types';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { format } from 'path';
import { ClassNames } from '@emotion/react';
import { getDog, getDogs } from '../../api/dogApi';

const useStyles = makeStyles({
    card: {
      minWidth: 275,
      margin: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '15px',
      boxShadow: '0px 10px 35px rgba(50, 50, 93, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.07)',
      textAlign: 'left', 
    },
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
    },
    closeButton: {
      marginTop: '20px', // Add some margin to the top of the button
    },
    root: {
      '& .MuiDataGrid-root .MuiDataGrid-footer': {
        position: 'relative',
        right: '0',
        bottom: '0',
      },
    },
  });

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const AppointmentsManagement = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const classes = useStyles();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    
  useEffect(() => {
    const fetchAppointments = async () => {
        const data = await getAppointments();
        const formattedDataPromises = data.map(async (appointment: Appointment) => {
            const user = await getUser(appointment.user);
            const service = await getService(appointment.service);
            const dogs = await getDogs();
            let dog = '';
if (dogs.length > 0) {
  const randomIndex = Math.floor(Math.random() * dogs.length);
  dog = dogs[randomIndex].name;
}
            return {
                ...appointment,
                user: user.username,
                service: service.name,
                dog: dog
            };
        });

        const formattedData = await Promise.all(formattedDataPromises);
        setAppointments(formattedData);
    };
    fetchAppointments();
  }, []);

  useEffect(() =>{
    if (selectedAppointment && selectedAppointment._id) {
        getAppointment(selectedAppointment._id).then((selectedAppointment) => {
          setSelectedAppointment(selectedAppointment);
        });
      }
  }, []);

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
        return;
    }

    setSnackbarOpen(false);
}

const handleOpen = (appointment: Appointment) => {
    let user, service;

    if (typeof appointment.user === 'string') {
        user =  getUser(appointment.user);
    } 

    if (typeof appointment.service === 'string') {
        service =  getService(appointment.service);
    } 

    setSelectedAppointment({
        ...appointment,
    });

    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};

const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    if(status === AppointmentStatus.Confirmed) {
        setSnackbarMessage("You have successfully accepted the Appointment!");
        setSnackbarOpen(true);
    }
    if(status === AppointmentStatus.Cancelled) {
        setSnackbarMessage("You have successfully rejected the Appointment!");
        setSnackbarOpen(true);
    }

    await updateAppointmentStatus(id, status);
    setAppointments(appointments.map(app => app._id === id ? { ...app, status } : app));
};

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', width: 70 },
        { field: 'user', headerName: 'User', width: 130 },
        { field: 'service', headerName: 'Service', width: 130 },
        { field: 'dog', headerName: 'Dog', width: 130 },
        { field: 'startTime', headerName: 'Start Time', width: 130 },
        { field: 'endTime', headerName: 'End Time', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'notes', headerName: 'Notes', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            renderCell: (params) => (
                <div>
                <Tooltip title="Confirmed" color="primary">
                    <IconButton onClick={() => handleStatusChange(params.id as string, AppointmentStatus.Confirmed)}>
                        <CheckCircleIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Canceled" color="secondary">
                    <IconButton onClick={() => handleStatusChange(params.id as string, AppointmentStatus.Cancelled)}>
                        <CancelIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View">
                    <IconButton onClick={() => {
                        handleOpen(params.row)}} color="default">
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params: any) => {
                let color;
                switch (params.value) {
                    case AppointmentStatus.Confirmed:
                        color = 'green';
                        break;
                    case AppointmentStatus.Pending:
                        color = 'black';
                        break;
                    case AppointmentStatus.Cancelled:
                        color = 'red';
                        break;
                    default:
                        color = 'black';
                }
                return <strong style={{ color }}>{params.value}</strong>;
            },
        },
    ];
    return (
        <>
        <div style={{ height: 400, width: '100%' }} className={classes.root}></div>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <div>
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </div>
            </Snackbar>
            <h1 style={{ marginBottom: '20px' }}>Appointments</h1>
            <DataGrid rows={appointments}
            columns={columns}
            className={classes.grid}
            getRowId={(row) => row._id}
            checkboxSelection 
            />
            <Button component={RouterLink} to="/dashboard" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                Back to Dashboard
            </Button>
            {open && (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            Appointment Details
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>User:</strong> {selectedAppointment?.user}
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>Service:</strong> {selectedAppointment?.service}
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>Dog:</strong> {selectedAppointment?.dog}
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>Start Time:</strong> {selectedAppointment?.startTime}
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>End Time:</strong> {selectedAppointment?.endTime}
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>Date:</strong> {selectedAppointment?.date}
                        </Typography>
                        <Typography variant="body2" component="p">
                            <strong>Notes:</strong> {selectedAppointment?.notes}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.closeButton}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </CardContent>
                </Card>
            )}
        </>
    );
};


export default AppointmentsManagement;