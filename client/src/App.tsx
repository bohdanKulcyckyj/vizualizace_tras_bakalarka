import { BrowserRouter, Routes, Route } from "react-router-dom";
// routes
import routes from './constants/routes'
// components
import PageLayout from "./components/PageLayout";
import RouteGuard from "./components/dashboard/RouteGuard";
import PageLayoutWithFooter from "./components/PageLayoutWithFooter";
// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgottenPassword from "./pages/ForgottenPassword";
import MapModel from "./pages/MapModel";
import Users from "./pages/dashboard/admin/Users";
import Profile from "./pages/dashboard/Profile";
import PageNotFound from "./pages/errors/404";
import Forbidden from "./pages/errors/403";
import MapDetail from "./pages/MapDetail";
import Maps from "./pages/dashboard/Maps";
// interfaces
import { UserRole } from "./interfaces/User";
import { ComponentMode } from "./interfaces/dashboard/ComponentProps";
// context
import { MainProvider } from "./context/MainContext";
// scss
import "./styles/main.scss";

function App() {
  return (
    <MainProvider>
      <BrowserRouter>
        <Routes>
          {/* 3D mapa se statickou konfiguraci pro DEBUG účely */}
          <Route
            path="/map-model"
            element={<MapModel mode={ComponentMode.PREVEIW} />}
          />
          
          <Route
            path={routes.mapPreview(":modelid")}
            element={<MapModel mode={ComponentMode.PREVEIW} />}
          />
          <Route element={<PageLayout />}>
            <Route element={<PageLayoutWithFooter />}>
              <Route path={routes.home} element={<Home />} />
              {/* auth */}
              <Route path={routes.login} element={<Login />} />
              <Route path={routes.register} element={<Registration />} />
              <Route
                path={routes.forgottenPasword}
                element={<ForgottenPassword />}
              />
              <Route path={routes.restorePassword} element={<Home />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<RouteGuard />}>
              <Route
                path={routes.dashboard.editMapModel(UserRole.ADMIN, ':modelid')}
                element={<MapModel mode={ComponentMode.EDIT} />}
              />
              <Route
                path={routes.dashboard.newMap(UserRole.ADMIN)}
                element={<MapDetail mode={ComponentMode.NEW} />}
              />
              <Route
                path={routes.dashboard.editMap(UserRole.ADMIN, ':mapid')}
                element={<MapDetail mode={ComponentMode.EDIT} />}
              />
              <Route element={<PageLayoutWithFooter />}>
                <Route path={routes.dashboard.maps(UserRole.ADMIN)} element={<Maps role={UserRole.ADMIN} />} />
                <Route path={routes.admin.users} element={<Users />} />
                <Route
                  path={routes.dashboard.profile(UserRole.ADMIN)}
                  element={<Profile role={UserRole.ADMIN} />}
                />
              </Route>
            </Route>

            {/* User */}
            <Route path="/user" element={<RouteGuard />}>
              <Route
                path={routes.dashboard.editMapModel(UserRole.USER, ':modelid')}
                element={<MapModel mode={ComponentMode.EDIT} />}
              />
              <Route
                path={routes.dashboard.newMap(UserRole.USER)}
                element={<MapDetail mode={ComponentMode.NEW} />}
              />
              <Route
                path={routes.dashboard.editMap(UserRole.USER, ':mapid')}
                element={<MapDetail mode={ComponentMode.EDIT} />}
              />
              <Route element={<PageLayoutWithFooter />}>
                <Route path={routes.dashboard.maps(UserRole.USER)} element={<Maps role="user" />} />
                <Route path={routes.dashboard.profile(UserRole.USER)} element={<Profile role="user" />} />
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
