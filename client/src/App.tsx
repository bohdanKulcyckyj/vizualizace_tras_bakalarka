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
import Users from './pages/Dashboard/Users';
import Profile from './pages/Dashboard/Profile';
import PageNotFound from './pages/404';
import Unauthorized from './pages/403';

import { MainProvider } from './context/MainContext';
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
    <MainProvider>
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

            <Route path="/map" element={
            <TerrainModelComponent options={staticOptions} />
            } />

            {/* Admin */}
            <Route path="/admin" element={<RouteGuard />}>
              <Route path="/admin/maps" element={
                <Dashboard />
              }/>
              <Route path="/admin/users" element={
                <Users />
              }/>
              <Route path="/admin/maps/new" element={
                <MapDetail />
              }/>
              <Route path="/admin/maps/edit/:mapid" element={
                <Dashboard />
              }/>
              <Route path="/admin/profile" element={
                <Profile />
              }/>
            </Route>

            {/* User */}
            <Route path="/user" element={<RouteGuard />}>
              <Route path="/user/maps" element={
                <Dashboard />
              }/>
              <Route path="/user/profile" element={
                <Profile />
              }/>
              <Route path="/user/maps/new" element={
                <Dashboard />
              }/>
              <Route path="/user/maps/edit/:mapid" element={
                <Dashboard />
              }/>
            </Route>
          </Route>

          <Route path="/403" element={<Unauthorized />} />
          {/* Poslední Route pro 404 */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </MainProvider>
  );
}

export default App;
