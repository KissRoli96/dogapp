import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import HomePage from '../HomePage/HomePage';
import NavigationMenu from '../Navbar/Navbar';
import { Helmet } from 'react-helmet';


function App() {
  return (
    <div className="App">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"        />
      </Helmet>
      <NavigationMenu />
      <header className="App-header">
        <HomePage />
      </header>
    </div>
  );
}

export default App;
