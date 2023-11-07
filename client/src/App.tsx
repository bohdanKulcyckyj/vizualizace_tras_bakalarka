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
import ForgottenPassword from './pages/ForgottenPassword';
import Dashboard from './pages/Dashboard';

import { ConfigProvider } from './context/ConfigProvider';
//scss
import './styles/main.scss'
import { IModelOptions } from './terainModel/model';
import MapDetail from './pages/MapDetail';

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
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/forgotten-password" element={<ForgottenPassword />} />
            <Route path="/restore-password" element={<Home />} />

            {/* Admin */}
            <Route path="/admin" element={<RouteGuard />}>
              <Route path="/admin/maps" element={
                  <Dashboard />
              }/>
              <Route path="/admin/maps/new" element={
                  <MapDetail />
              }/>
              <Route path="/admin/maps/edit/:mapid" element={
                  <Dashboard />
              }/>
              <Route path="/admin/profile" element={
                  <Dashboard />
              }/>
            </Route>

            {/* User */}
            <Route path="/user" element={<RouteGuard />}>
              <Route path="/user/maps" element={
                  <Dashboard />
              }/>
              <Route path="/user/profile" element={
                  <Dashboard />
              }/>
              <Route path="/user/maps/new" element={
                  <Dashboard />
              }/>
              <Route path="/user/maps/edit/:mapid" element={
                  <Dashboard />
              }/>
            </Route>
          </Route>
          {/* TEST MAP ROUTE */}
          <Route path="/map" element={
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
