import React from 'react';
import { Avatar, Typography, Grid, Paper, makeStyles, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { getUser } from '../../api/userApi';

interface Address {
  city: string;
  country: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  age: number;
  address: Address;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profile: ProfileData;
}

interface ProfileProps {
  user: User;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 600,
    marginTop: theme.spacing(8),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export const Profile: React.FC = () => {
    const classes = useStyles();
    const [user, setUser] = React.useState<User | null>(null);
    const { id } = useParams<{ id: string }>();
    console.log(id);
  
    React.useEffect(() => {
      const fetchUser = async () => { 
        if(!id) {
            return;
        }
        const user = await getUser(id);
        console.log(user);
        setUser(user);
      };
  
      fetchUser();
    }, [id]);
  
    if (!user) {
      return null; // or a loading spinner
    }
 
  const { username, email, profile } = user;
const { firstName, lastName, age, address } = profile;

  const handleEdit = () => {
    // Handle edit action
  };

  const handleDelete = () => {
    // Handle delete action
  };

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar className={classes.avatar}>{firstName[0]}</Avatar>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1">
                Fullname: {firstName} {lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Username: {username}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: {email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Age: {age}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {address.city}, {address.country}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;