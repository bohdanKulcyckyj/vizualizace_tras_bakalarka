import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './api/endpoints';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

//components
import Header from './Components/Header';
import Footer from './Components/Footer';
import PageLayout from './Components/PageLayout';

//pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Registration';

//custom theme
import { darkTheme } from "./Styles/Theme";
//scss
import './Styles/scss/main.scss'

function App() {
  useEffect(() => {
    axios.get(BASE_URL + "/WeatherForecast")
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <Header />

      <BrowserRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            {/* auth */}
            <Route path="/prihlaseni" element={<Login />} />
            <Route path="/registrace" element={<Registration />} />
            <Route path="/restore-password" element={<Home />} />
          </Route>

          {/* Dashboard */}
          <Route   />
        </Routes>
      </BrowserRouter>

      <Footer />
    </ThemeProvider>
  );
}

export default App;
