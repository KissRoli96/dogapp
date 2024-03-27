import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import HomePage from '../HomePage/HomePage';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  console.log('data', data);
  useEffect(() => {
    axios.get(process.env.REACT_APP_BASE_URL + '/users')
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
        <HomePage />
        {error && <p>Error: {error}</p>}
        {data && (
          <div>
            <h2>Data:</h2>
            <p></p>
            {/* Render your data here */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
