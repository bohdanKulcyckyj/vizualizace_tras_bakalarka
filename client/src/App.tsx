import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//components
import Header from './components/Header';
import Footer from './components/Footer';
import PageLayout from './components/PageLayout';
import RouteGuard from './components/RouteGuard';
import TerrainModelComponent from './terainModel/TerrainModelComponent';
//pages
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';

import { ConfigProvider } from './context/ConfigProvider';
//scss
import './styles/main.scss'
import { IModelOptions } from './terainModel/model';

const staticOptions : IModelOptions = {
	center: {
		lat: 45.83256987294795,
		lng: 6.865163189418157,
		alt: 4791.7,
	},
	bbox: {
		northEast: {
      	lat: 45.9179008,
        lng: 6.9354122
    },
		southWest: {
        lat: 45.7724925,
      	lng: 6.7421217,
    },
	},
	zoom: 13,
	trailGpxUrl: "./assets/export2.gpx",
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            {/* auth */}
            <Route path="/prihlaseni" element={<Login />} />
            <Route path="/registrace" element={<Registration />} />
            <Route path="/zapomenute-heslo" element={<Home />} />
            <Route path="/obnova-hesla" element={<Home />} />
          </Route>
          {/* Dashboard */}
          <Route path="/administrace" element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }/>
          <Route path="/mapa" element={
            <ConfigProvider>
              <TerrainModelComponent options={staticOptions} />
            </ConfigProvider>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
