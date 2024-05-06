import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getDogs, getDogPicture } from '../../api/dogApi';
import { Dog } from '../../types/types';
import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import { error } from 'console';
import IconButton from '@mui/material/IconButton';
import GetAppIcon from '@mui/icons-material/GetApp';
import CardMedia from '@mui/material/CardMedia';

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

const DogManagement = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const classes = useStyles();
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchDogs = async () => {
            const data = await getDogs();
            const formattedData = data.map((dog: Dog) => ({
                ...dog,
                id: dog._id,
            }));
            setDogs(data);
        };
        fetchDogs();
    }, []);

    useEffect(() => {
        if (selectedDog) {
            console.log(selectedDog._id);
            getDogPicture(selectedDog._id)
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
            })
            .catch(error => {
                console.error('Error:', error);

            });
        }
    }, [selectedDog]);

    const handleOpen = (dog: Dog) => {
        setSelectedDog(dog);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
console.log(fileUrl);
    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'breed', headerName: 'Breed', width: 150 },
        { field: 'age', headerName: 'Age', width: 150 },
        {field: 'owner', headerName: 'Owner', width: 150},
        { field: 'picture', headerName: 'Details', width: 150, renderCell: (params) => (
            <div>
                <Tooltip title="View">
                    <IconButton onClick={() => { handleOpen(params.row as Dog)}} color="default">
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            </div>
        ),
        },
    ];

return (
    <div style={{height: 400, width: '100%'}} className={classes.root}>
        <h1 style={{ marginBottom: '20px' }}> Dogs </h1>
        <DataGrid rows={dogs}
        columns={columns}
        className={classes.grid}
        getRowId={(row) => row._id}
        checkboxSelection
        />
         <Button component={RouterLink} to="/dashboard" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Back to Dashboard
        </Button>
        {open && (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    <strong>Name of Dog: </strong> {selectedDog?.name}
                    </Typography>
                    <Typography color="textSecondary">
                        <strong>Breed: </strong>{selectedDog?.breed}
                    </Typography>
                    <Typography color="textSecondary">
                        <strong>Age: </strong>{selectedDog?.age}
                    </Typography>
                    <Typography color="textSecondary">
                        <strong>Owner: </strong>{selectedDog?.owner}
                    </Typography>
                    <Typography color="textSecondary">
  <strong>Dog Picutue: </strong> 
  {fileUrl && (
    <>
       <CardMedia
        component="img"
        image={fileUrl}
        alt="Dog"
        style={{height: '200px', width: '200px', objectFit: 'cover', borderRadius: '50%'}}
        />
        <Button 
        variant="contained" 
        color="primary" 
        href={fileUrl} 
        download="picture.jpg" // change this to your desired filename and extension
        startIcon={<GetAppIcon />}
        style={{marginTop: '10px'}}
        >
        Download Picture
        </Button>
    </>
  )}
</Typography>
<Button variant='contained' color='secondary' autoFocus onClick={handleClose} className={classes.closeButton} style={{marginTop: '10px'}}>
              Close
            </Button>
                    
                </CardContent>
            </Card>
        )}
        </div>
    );
};

export default DogManagement
