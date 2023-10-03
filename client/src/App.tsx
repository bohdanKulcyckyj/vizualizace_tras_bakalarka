import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//components
import Header from './components/Header';
import Footer from './components/Footer';
import PageLayout from './components/PageLayout';
import RouteGuard from './components/RouteGuard';
//pages
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
//scss
import './styles/main.scss'

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
            <Route path="/restore-password" element={<Home />} />
          </Route>
          {/* Dashboard */}
          <Route path="/administrace" element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
