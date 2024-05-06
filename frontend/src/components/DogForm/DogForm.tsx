import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Grid, TextField, Typography, Button, Select, MenuItem } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Dog } from '../../types/types';
import {createDog} from '../../api/dogApi';
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Alert } from '@material-ui/lab';

function DogForm() {
    const [open, setOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dog, setDog] = useState<Partial<Dog>>({
        name: '',
        breed: '',
        age: 0,
        weight: 0,
        picture: '',
        gender: 'male',
        owner: '663219e5d704b104f3e11f7b'
    });

    const [errors, setErrors] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        gender: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = event.target as HTMLInputElement;
    
        setDog(prevDog => ({
            ...prevDog,
            [name]: value,
        }));
    
        // Update errors state
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value ? '' : `${name[0].toUpperCase() + name.slice(1)} is required.`,
        }));
    };

    const validate = () => {
        const newErrors = {
            name: dog.name ? '' : 'Name is required.',
            breed: dog.breed ? '' : 'Breed is required.',
            age: dog.age ? '' : 'Age is required.',
            gender: dog.gender ? '' : 'Gender is required.',
            weight: dog.weight ? '' : 'Weight is required.',
            picture: fileInput.current?.files?.length ? '' : 'Picture is required.',
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(errorMessage => errorMessage);
    };

    const SuccessMessage = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Typography variant="h4" component="div" color="success">
                Successful application for the training
            </Typography>
        </Box>
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const formData = new FormData();
        formData.append('name', dog.name || '');
        formData.append('breed', dog.breed || '');
        formData.append('age', String(dog.age) || '');
        formData.append('weight', String(dog.weight) || '');
        formData.append('gender', dog.gender || 'male');
        formData.append('owner', dog.owner || '663219e5d704b104f3e11f7b');
        formData.append('picture', fileInput.current?.files?.[0] as Blob);

        try {
            await createDog(formData  as any);
            setOpen(true);
            setOpenSnackbar(true);
            setIsSubmitted(true);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
        {isSubmitted ? (
            <SuccessMessage />
        ): (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ maxWidth: 600, width: '100%', mx: 'auto', mt: 5, mb: 5 }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom>
                            Add a new dog
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={dog.name}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.gender}>
                                    <FormHelperText id="gender-label">Gender</FormHelperText>
                                    <Select
                                        labelId="gender-label"
                                        id="gender"
                                        name="gender"
                                        value={dog.gender}
                                        onChange={handleChange as any}
                                        error={!!errors.name}
                                    >
                                        <MenuItem value={'male'}>Male</MenuItem>
                                        <MenuItem value={'female'}>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Breed"
                                    name="breed"
                                    value={dog.breed}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.breed}
                                    helperText={errors.breed}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={dog.age}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.age}
                                    helperText={errors.age}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Weight"
                                    name="weight"
                                    type="number"
                                    value={dog.weight}
                                    onChange={handleChange}
                                    required
                                    error={!!errors.weight}
                                    helperText={errors.weight}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <strong>Dog Picture: </strong>
                                <input
                                    type="file"
                                    ref={fileInput}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
        )}
         <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
         <Alert onClose={() => setOpenSnackbar(false)} severity="success">
             Form submitted successfully!
         </Alert>
     </Snackbar>
     </>
    );
}

export default DogForm;