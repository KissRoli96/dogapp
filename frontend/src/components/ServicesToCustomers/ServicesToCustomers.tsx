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

function ServicesToCustomers() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [open, setOpen] = React.useState(false);
  const [newService, setNewService] = React.useState({ name: '', description: '', price: '' });

  React.useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
    };

    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setServices(services.filter((service) => service._id.$oid !== id));
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
    setServices([...services, service]);
    handleClose();
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
          handleDelete(params.row.id as string);
        };

        const onClickUpdate = () => {
          handleUpdate(params.row as Service);
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

  const rows = services.map((service, index) => ({
    id: service._id?.$oid || index,
    name: service.name,
    description: service.description,
    price: service.price,
    __v: service.__v,
  }));

  return (
    <div className="ServicesToCustomers" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(80vh - 60px)' }}>
      <Button component={RouterLink} to="/dashboard" variant="contained" color="primary" style={{ marginTop: '40px' }}>
        Back to Dashboard
      </Button>
      <h1>Services to Customers</h1>
      <div style={{ height: 400, width: '75%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
        />
      </div>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen} style={{ marginTop: '40px' }}>
        Create Service
      </Button>
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
    </div>
  );
}

export default ServicesToCustomers;