import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getServices, updateService, deleteService, createService } from '../../api/serviceApi';
import './ServicesToCustomers.css';
import { Service } from '../../types/types';
import { Snackbar } from '@mui/material';

function ServicesToCustomers() {
    const [services, setServices] = React.useState<Service[]>([]);
    const [open, setOpen] = React.useState(false);
    const [newService, setNewService] = React.useState({ name: '', description: '', price: '' });
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [serviceToDelete, setServiceToDelete] = React.useState<string | null>(null);

    const fetchServices = async () => {
        const data = await getServices();
        setServices(data);
    };

    React.useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async () => {
        if (serviceToDelete) {
            const deletedService = await deleteService(serviceToDelete);
            if (deletedService) {
                await fetchServices();
                setSnackbarMessage('Service deleted successfully');
                setSnackbarOpen(true);
            }
        }
        setServiceToDelete(null);
        setDeleteConfirmOpen(false);
    };

    const handleUpdate = (service: Service) => {
        // Implement update logic here
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewService(prevState => ({
            ...prevState,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async () => {
        const service = await createService({
            name: newService.name,
            description: newService.description,
            price: parseFloat(newService.price),
        });
        await fetchServices();
        handleClose();
    };

    const handleConfirmDelete = (id: string) => {
        setServiceToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'price', headerName: 'Price', width: 130 },
        { field: '__v', headerName: 'Version', width: 70 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => {
                const onClickDelete = () => {
                    if (params.row.id) {
                        handleConfirmDelete(params.row.id as string);
                    } else {
                        console.error('Cannot delete service: id is undefined');
                    }
                };

                const onClickUpdate = () => {
                    if (params.row.id) {
                        handleUpdate(params.row as Service);
                    } else {
                        console.error('Cannot update service: _id is undefined');
                    }
                };

                return (
                    <>
                        <IconButton onClick={onClickUpdate} color="primary" aria-label="update">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={onClickDelete} color="secondary" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    const rows = services.map((service) => ({
        id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        __v: service.__v,
    }));

    return (
        <div className="ServicesToCustomers">
            <Button component={RouterLink} to="/dashboard" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                Back to Dashboard
            </Button>
            <h1 style={{ marginBottom: '20px' }}>Services to Customers</h1>
            <div className="datagrid-container">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                />
            </div>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen} style={{ marginTop: '20px' }}>
                Create Service
            </Button>
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this service?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>No</Button>
                    <Button onClick={handleDelete}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="name" label="Name" type="text" fullWidth variant="standard" onChange={handleChange} />
                    <TextField margin="dense" name="description" label="Description" type="text" fullWidth variant="standard" onChange={handleChange} />
                    <TextField margin="dense" name="price" label="Price" type="text" fullWidth variant="standard" onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
}

export default ServicesToCustomers;