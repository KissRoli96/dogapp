import { Link } from 'react-router-dom';
import { createApplication, updateApplication } from '../../api/applicationApi';
import { Application, Status } from '../../types/types';
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, TextField, Typography, Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

type ErrorResponse = {
    errors: Partial<Application>;
};

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function DogcosmeticsTraining() {
    const [file, setFile] = useState<File | null>(null);
    const [isFormFinalized, setIsFormFinalized] = useState(false);
    const [isFormSaved, setIsFormSaved] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isUpdateActive, setIsUpdateActive] = useState(false);
    const [isFinalizeActive, setIsFinalizeActive] = useState(false);
    const [application, setApplication] = useState<Partial<Application>>({
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        motivation: '',
        email: '',
        phoneNumber: '',
        status: Status.Pending
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

        // Clear the server error for this field
        setServerErrors((prevErrors: Partial<Application>) => ({
            ...prevErrors,
            [event.target.name]: undefined,
        }));
    };

    const SuccessMessage = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Typography variant="h4" component="div" color="success">
                Successful application for the training
            </Typography>
        </Box>
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsFormSaved(true);
        setIsEditMode(true);
        setIsUpdateActive(false); // Disable the Update button after saving
        setIsFinalizeActive(true); // Enable the Finalize button after saving
        setSnackbarMessage("Application saved successfully!");
        setSnackbarOpen(true);


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
        let applicationId: string | undefined;
        let result;

        if (isFormSaved) {
            const firstSaved = await createApplication(formData);
            if ('application' in firstSaved) {
                applicationId = (firstSaved as Application)._id;
            }
            console.log(applicationId);
            result = isEditMode ? await updateApplication(applicationId!, formData) : await createApplication(formData);
            setSnackbarMessage(isEditMode ? 'Application updated successfully!' : 'Application saved successfully!');
        } else {
            result = await createApplication(formData);
            setSnackbarMessage('Application created successfully!');
        }

        if ('errors' in result) {
            const errorResponse = result as ErrorResponse;
            setServerErrors(errorResponse.errors);
        } else {
            // If the form was successfully saved or updated, set isFormSaved to true
            setIsFormSaved(true);
        }

        setIsEditMode(false);
        setSnackbarOpen(true);
    };

    const handleUpdate = () => {
        setIsEditMode(true);
        setIsUpdateActive(true); // Disable the Update button in edit mode
        setIsFinalizeActive(false); // Disable the Finalize button in edit mode

        // Clear all server errors
        setServerErrors({});

        setSnackbarMessage("You can now edit the application.");
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    }



    // Add a new function for finalizing the form
    const handleFinalize = () => {
        // Validate the form
        if (!application.firstName || !application.lastName || !application.email || !application.phoneNumber) {
            setSnackbarMessage("Please fill out all required fields before finalizing the application.");
            setSnackbarOpen(true);
            return;
        }

        setIsFormFinalized(true);
        setIsUpdateActive(true); // Enable the Update button after finalizing
        setIsFinalizeActive(false); // Disable the Finalize button after finalizing

        setSnackbarMessage("Application finalized successfully!");
        setSnackbarOpen(true);
    }


    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <div>
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </div>
            </Snackbar>
            {isFormFinalized ? <SuccessMessage /> : (
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
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
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
                                        required
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="placeOfBirth"
                                        label="Place Of Birth"
                                        value={application.placeOfBirth}
                                        onChange={handleChange}
                                        error={Boolean(serverErrors.placeOfBirth)}
                                        helperText="Please enter your place of birth."
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
                                        required />
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
                                        helperText={serverErrors.motivation ? serverErrors.motivation : "Please enter your motivation for applying to this course."}
                                        multiline
                                        rows={4}
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={application.email}
                                        onChange={handleChange}
                                        error={Boolean(serverErrors.email)}
                                        helperText={serverErrors.email ? serverErrors.email : 'Please enter a valid email address'}
                                        required
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth name="phoneNumber" label="Phone Number" value={application.phoneNumber} onChange={handleChange} required
                                        disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        <strong>Upload CV: (ONLY PDF Format) </strong>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            required
                                            disabled={isFormFinalized || !isEditMode} // Disable the field if the form is finalized or not in edit mode
                                        />
                                    </label>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={isFormSaved ? handleUpdate : handleSubmit}
                                        disabled={isFormFinalized || (isEditMode && isFormSaved)}
                                    >
                                        {isFormSaved ? 'Update' : 'Save'}
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    {isFormSaved && !isFormFinalized && (
                                        <Button variant="contained" color="secondary" onClick={handleFinalize}>
                                            Finalize
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export default DogcosmeticsTraining;