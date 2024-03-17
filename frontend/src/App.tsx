import React, {useEffect, useState} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  console.log('data', data);
  useEffect(() => {
    axios.get('http://localhost:3000/api/users')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        // Handle the error
        setError(error.message);
        console.error('Error fetching data: ', error);
      })
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>THIS IS TEST ASD!</p>
        {error && <p>Error: {error}</p>}
        {data && (
          <div>
            <h2>Data:</h2>
            {/* Render your data here */}
          </div>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
