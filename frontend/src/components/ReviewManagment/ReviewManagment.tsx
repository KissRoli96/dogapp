import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getReviews, updateReviewStatus, getReview } from '../../api/reviewApi';
import { getUser } from '../../api/userApi';
import { getService } from '../../api/serviceApi';
import { Review, User, Service, ReviewStatus } from '../../types/types';
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

  const ReviewManagement = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    
    useEffect(() => {
        const fetchReviews = async () => {
            const data = await getReviews();
            const formattedDataPromises = data.map(async (review: Review) => {
                let user;
                let service = { name: 'Unknown' }; // default service
    
                try {
                    if (typeof review.user === 'string') {
                        user = await getUser(review.user);
                    } else {
                        user = review.user;
                    }
    
                    if (typeof review.service === 'string') {
                        service = await getService(review.service);
                    } else {
                        service = review.service;
                    }
                } catch (error) {
                    console.error(`Error fetching user or service: ${error}`);
                }
    
                return {
                    ...review,
                    id: review._id,
                    date: new Date(review.date),
                    user: user?.username, 
                    service: service?.name,
                };
            });
    
            const formattedData = await Promise.all(formattedDataPromises);
            setReviews(formattedData);
        };
    
        fetchReviews();
    }, []);

    useEffect(() => {
            if (selectedReview) {
                getReview(selectedReview._id).then((review) => {
                    setSelectedReview(review);
                });
            }
        }, [selectedReview]);

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setSnackbarOpen(false);
    }

    const handleOpen = (review: Review) => {
        let user, service;
    
        if (typeof review.user === 'string') {
            user =  getUser(review.user);
        } else {
            user = review.user;
        }
    
        if (typeof review.service === 'string') {
            service =  getService(review.service);
        } else {
            service = review.service;
        }
    
        setSelectedReview({
            ...review,
        });

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStatusChange = async (id: string, status: ReviewStatus) => {
        if(status === ReviewStatus.Published) {
            setSnackbarMessage("You have successfully accepted the review!");
            setSnackbarOpen(true);
        }
        if(status === ReviewStatus.Reject) {
            setSnackbarMessage("You have successfully rejected the review");
            setSnackbarOpen(true);
        }

        await updateReviewStatus(id, status);
        setReviews(reviews.map(app => app._id === id ? { ...app, status } : app));
    };

const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'service', headerName: 'Service', width: 150 },
    { field: 'content', headerName: 'Content', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 150 },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
            <div>
                <Tooltip title="Published" color="primary">
                    <IconButton onClick={() => handleStatusChange(params.id as string, ReviewStatus.Published)}>
                        <CheckCircleIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reject" color="secondary">
                    <IconButton onClick={() => handleStatusChange(params.id as string, ReviewStatus.Reject)}>
                        <CancelIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View">
                    <IconButton onClick={() => {
                        console.log(params.row);
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
                case ReviewStatus.Published:
                    color = 'green';
                    break;
                case ReviewStatus.Pending:
                    color = 'black';
                    break;
                case ReviewStatus.Reject:
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
    <div style={{ height: 400, width: '100%' }} className={classes.root}>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <div>
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </div>
            </Snackbar>
            <h1 style={{ marginBottom: '20px' }}>Reviews of the Services</h1>
        <DataGrid rows={reviews}
        columns={columns}
        className={classes.grid}
        checkboxSelection
        />
         <Button component={RouterLink} to="/dashboard" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                Back to Dashboard
            </Button>
        {open && (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    <strong>Username: </strong> {typeof selectedReview?.user === 'object'  ? selectedReview?.user.username : selectedReview?.user}
                    </Typography>
                    <Typography color="textSecondary">
                    <strong>Service: </strong> {typeof selectedReview?.service === 'object' ? selectedReview?.service.name : selectedReview?.service}
                    </Typography>
                    <Typography variant="body2" component="p">
                    <strong>Content: </strong>{selectedReview?.content}
                    </Typography>
                    <Typography variant="body2" component="p">
                    <strong>Rating: </strong>{selectedReview?.rating}
                    </Typography>
                    <Typography variant="body2" component="p">
                    <strong>Date: </strong>{selectedReview && new Date(selectedReview.date).toLocaleDateString()}
                    </Typography>
                    <Button variant='contained' color='secondary' autoFocus onClick={handleClose} className={classes.closeButton}>
              Close
            </Button>
                </CardContent>
            </Card>
        )}
        </div>
    );
};

export default ReviewManagement