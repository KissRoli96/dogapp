import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// import HomePage from '../HomePage/HomePage';
// import NavigationMenu from '../Navbar/Navbar';
import { Helmet } from 'react-helmet';
// import Dashboard from '../Dashboard/Dashboard';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
// import DogcosmeticsTraining from '../DogcosmeticsTraining/DogcosmeticsTraining';
// import Customers from '../Customers/Customers';
// import ResponsiveAppBar from '../ResponsiveAppBar/ResponsiveAppBar';
// import Profil from '../Profil/Profil';
// import Services from '../Services/Services';
// import ServicesToCustomers from '../ServicesToCustomers/ServicesToCustomers';
// import ApplicationManagement from '../ApplicationManagement/ApplicationManagement';
// import DogManagement from '../DogManagment/DogManagment';
// import DogForm from '../DogForm/DogForm';
// import Appointment from '../Appointment/Appointment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import UserContext from '../Contexts/UserContext';

// Lazy load the components
const HomePage = React.lazy(() => import('../HomePage/HomePage'));
const NavigationMenu = React.lazy(() => import('../Navbar/Navbar'));
const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'));
const DogcosmeticsTraining = React.lazy(() => import('../DogcosmeticsTraining/DogcosmeticsTraining'));
const Customers = React.lazy(() => import('../Customers/Customers'));
const ResponsiveAppBar = React.lazy(() => import('../ResponsiveAppBar/ResponsiveAppBar'));
const Profil = React.lazy(() => import('../Profil/Profil'));
const Services = React.lazy(() => import('../Services/Services'));
const ServicesToCustomers = React.lazy(() => import('../ServicesToCustomers/ServicesToCustomers'));
const ApplicationManagement = React.lazy(() => import('../ApplicationManagement/ApplicationManagement'));
const DogManagement = React.lazy(() => import('../DogManagment/DogManagment'));
const DogForm = React.lazy(() => import('../DogForm/DogForm'));
const Appointment = React.lazy(() => import('../Appointment/Appointment'));
const ReviewManagment = React.lazy(() => import('../ReviewManagment/ReviewManagment'));

function App() {
  const  userId  = '663219e5d704b104f3e11f7b';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="App">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"        />
      </Helmet>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <ResponsiveAppBar />
          <UserContext.Provider value={{ userId }}>
          <Routes>
            <Route path="/dogcosmetics-training" element={<DogcosmeticsTraining />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/dogs" element={<DogManagement />} />
            <Route path="/dog" element={<DogForm userId={userId} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/applications" element={<ApplicationManagement />} />
            <Route path="reviews" element={<ReviewManagment />} />
            <Route path="/servicestocustomers" element={<ServicesToCustomers />} />
            <Route path='/bookappointment' element={<Appointment />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:id" element={<Profil />} />
          </Routes>
          </UserContext.Provider>
        </Suspense>
      </Router>
    </div>
    </LocalizationProvider>
  );
}

export default App;