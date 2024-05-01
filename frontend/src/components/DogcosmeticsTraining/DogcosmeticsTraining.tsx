import { Link } from 'react-router-dom';
import { createApplication } from '../../api/applicationApi';
import { Application, Status } from '../../types/types';
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Typography, Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';

type ErrorResponse = {
    errors: Partial<Application>;
  };

function DogcosmeticsTraining() {
    const [file, setFile] = useState<File | null>(null);
    const [application, setApplication] = useState<Partial<Application>>({
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        motivation: '',
        email: '',
        phoneNumber: '',
    });

    const [serverErrors, setServerErrors] = useState<Partial<Application>>({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApplication((prevApplication: Partial<Application>) => ({
            ...prevApplication,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('cv', file as Blob);
        formData.append('lastName', application.lastName || '');
        formData.append('firstName', application.firstName || '');
        formData.append('dateOfBirth', application.dateOfBirth || '');
        formData.append('placeOfBirth', application.placeOfBirth || '');
        formData.append('motivation', application.motivation || '');
        formData.append('email', application.email || '');
        formData.append('phoneNumber', application.phoneNumber || '');
        formData.append('status', Status.Pending);

        const result = await createApplication(formData);
        if ('errors' in result) {
            const errorResponse = result as ErrorResponse;
            setServerErrors(errorResponse.errors);
        } else {
          // handle successful submission
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ maxWidth: 600, width: '100%', mx: 'auto', mt: 5, mb: 5 }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom>Dog Cosmetics Training Application</Typography>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={application.lastName}
                  onChange={handleChange}
                  error={Boolean(serverErrors.lastName)}
                  helperText={serverErrors.lastName}
                  required
                />
              </Grid>
                            <Grid item xs={12} sm={6}>

                                <TextField
                                 fullWidth
                                  name="firstName"
                                   label="First Name"
                                    value={application.firstName}
                                     onChange={handleChange}
                                     error={Boolean(serverErrors.firstName)}
                  helperText={serverErrors.firstName}
                                      required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    type="date"
                                    value={application.dateOfBirth}
                                    onChange={handleChange}
                                    error={Boolean(serverErrors.dateOfBirth)}
                                    helperText={serverErrors.dateOfBirth}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="motivation"
                                    label="Motivation"
                                    value={application.motivation}
                                    onChange={handleChange}
                                    required
                                    error={Boolean(serverErrors.motivation)}
                                    helperText={serverErrors.motivation}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth name="email" label="Email" type="email" value={application.email} onChange={handleChange} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth name="phoneNumber" label="Phone Number" value={application.phoneNumber} onChange={handleChange} required />
                            </Grid>
                            <Grid item xs={12}>
                                <input type="file" onChange={handleFileChange} required /> {/* File input for CV */}
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default DogcosmeticsTraining;