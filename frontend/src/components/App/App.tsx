import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import HomePage from '../HomePage/HomePage';
import NavigationMenu from '../Navbar/Navbar';

function App() {
  return (
    <div className="App">
      <NavigationMenu />
      <header className="App-header">
        <HomePage />
      </header>
    </div>
  );
}

export default App;
