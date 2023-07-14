import React, { useEffect } from 'react';
import axios from 'axios';
import { baseURL } from './api/endpoints';


function App() {
  useEffect(() => {
    axios.get(baseURL + "/WeatherForecast")
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
  }, [])

  return (
    <div className="App">
      <h1>Hello from my app</h1>
    </div>
  );
}

export default App;
