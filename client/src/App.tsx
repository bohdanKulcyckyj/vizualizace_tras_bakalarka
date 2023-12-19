import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//components
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageLayout from "./components/PageLayout";
import RouteGuard from "./components/RouteGuard";
import TerrainModelComponent from "./terainModel/TerrainModelComponent";
//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgottenPassword from "./pages/ForgottenPassword";
import MapModel from "./pages/MapModel";
import Users from "./pages/Dashboard/Users";
import Profile from "./pages/Dashboard/Profile";
import PageNotFound from "./pages/errors/404";
import Forbidden from "./pages/errors/403";

import { MainProvider } from "./context/MainContext";
//scss
import "./styles/main.scss";
import MapDetail from "./pages/MapDetail";
import Maps from "./pages/Dashboard/Maps";
import PageLayoutWithFooter from "./components/PageLayoutWithFooter";

function App() {
  return (
    <MainProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<PageLayout />}>
            {/* 3D mapa se statickou konfiguraci pro DEBUG účely */}
            <Route
              path="/map-model"
              element={<MapModel type="preview" />}
            />
            <Route
              path="/map-model/:modelid"
              element={<MapModel type="preview" />}
            />

            <Route element={<PageLayoutWithFooter />}>
              <Route path="/" element={<Home />} />
              {/* auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route
                path="/forgotten-password"
                element={<ForgottenPassword />}
              />
              <Route path="/restore-password" element={<Home />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<RouteGuard />}>
              <Route
                path="/admin/map-model/:modelid"
                element={<MapModel type="edit" />}
              />
              <Route
                path="/admin/maps/new"
                element={<MapDetail status="new" />}
              />
              <Route
                path="/admin/maps/:mapid"
                element={<MapDetail status="edit" />}
              />
              <Route element={<PageLayoutWithFooter />}>
                <Route path="/admin/maps" element={<Maps role="admin" />} />
                <Route path="/admin/users" element={<Users />} />
                <Route
                  path="/admin/profile"
                  element={<Profile role="admin" />}
                />
              </Route>
            </Route>

            {/* User */}
            <Route path="/user" element={<RouteGuard />}>
              <Route
                path="/user/map-model/:modelid"
                element={<MapModel type="edit" />}
              />
              <Route
                path="/user/maps/new"
                element={<MapDetail status="new" />}
              />
              <Route
                path="/user/maps/:mapid"
                element={<MapDetail status="edit" />}
              />
              <Route element={<PageLayoutWithFooter />}>
                <Route path="/user/maps" element={<Maps role="user" />} />
                <Route path="/user/profile" element={<Profile role="user" />} />
              </Route>
            </Route>
            <Route element={<PageLayoutWithFooter />}>
              <Route path="/401" element={<Forbidden />} />
              <Route path="/*" element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </MainProvider>
  );
}

export default App;
