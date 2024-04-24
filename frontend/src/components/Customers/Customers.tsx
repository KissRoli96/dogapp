import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { getUsers } from '../../api/userApi';
import './Customers.css';
import { User } from '../../types/types'; // Import User interface

function Customers() {
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'roles', headerName: 'Roles', width: 130 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'age', headerName: 'Age', width: 130 },
    { field: 'address', headerName: 'Address', width: 130 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
    { field: 'updatedAt', headerName: 'Updated At', width: 200 },
  ];

  const rows = users.map((user, index) => ({
    id: user._id?.$oid || index,
    username: user.username,
    email: user.email,
    roles: user.roles.join(', '),
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    age: user.profile.age,
    address: `${user.profile.address.city}, ${user.profile.address.country}`,
    createdAt: user.createdAt?.$date ? new Date(user.createdAt.$date).toLocaleString() : 'N/A',
    updatedAt: user.updatedAt?.$date ? new Date(user.updatedAt.$date).toLocaleString() : 'N/A',
  }));

  return (
    <div className="Customers" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(80vh - 60px)' }}>
      <h1> Customers</h1>
      <div style={{ height: 400, width: '75%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
        />
      </div>
      <Button component={RouterLink} to="/dashboard" variant="contained" color="primary" style={{ marginTop: '40px' }}>
        Back to Dashboard
      </Button>
    </div>
  );
}

export default Customers;