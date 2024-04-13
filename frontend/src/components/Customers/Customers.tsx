import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { getUsers } from '../../api/userApi';
import './Customers.css';

type User = {
    _id: { $oid: string };
    username: string;
    email: string;
    roles: string[];
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        address: {
            city: string;
            country: string;
        };
    };
};

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
//         { TODO:..
//     field: 'username',
//     headerName: 'Username',
//     renderCell: (params: GridCellParams) => (
//       <strong>
//         {params.value}
//       </strong>
//     ),
//   },
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'roles', headerName: 'Roles', width: 130 },
        { field: 'firstName', headerName: 'First Name', width: 130 },
        { field: 'lastName', headerName: 'Last Name', width: 130 },
        { field: 'age', headerName: 'Age', width: 130 },
        { field: 'address', headerName: 'Address', width: 130 },
    ];

const rows = users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles.join(', '),
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        age: user.profile.age,
        address: `${user.profile.address.city}, ${user.profile.address.country}`,
}));

    return (
        <div className="Customers" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(80vh - 60px)' }}>
            <h1> Customers</h1>
            <div style={{ height: 400, width: '75%' }}>
                <DataGrid
                    // headerClassName="my-grid-header"
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