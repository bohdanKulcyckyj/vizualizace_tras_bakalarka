import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './api/endpoints';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//components
import Header from './components/Header';
import Footer from './components/Footer';
import PageLayout from './components/PageLayout';
//pages
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
//scss
import './styles/main.scss'

function App() {
  useEffect(() => {
    axios.get(BASE_URL + "/WeatherForecast")
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
  }, [])

  return (
    <>
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
    </>
  );
}

export default App;
