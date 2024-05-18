import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import routes from './constants/routes'
import { UserRole } from './interfaces/User'
import { ComponentMode } from './interfaces/dashboard/ComponentProps'
import { MainProvider } from './context/MainContext'

import './styles/main.scss'

// components
import RouteGuard from './components/dashboard/RouteGuard'
import PageLayout from './components/layout/PageLayout'
import ExtendedPageLayoutDefault from './components/layout/ExtendedPageLayoutDefault'
import ExtendedPageLayoutDashboard from './components/layout/ExtendedPageLayoutDashboard'
import Loading from './components/Loading'
import ErrorPage from './pages/errors/ErrorPage'

// pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Registration = lazy(() => import('./pages/Registration'))
const ForgottenPassword = lazy(() => import('./pages/ForgottenPassword'))
const MapModel = lazy(() => import('./pages/MapModel'))
const Users = lazy(() => import('./pages/dashboard/admin/Users'))
const Profile = lazy(() => import('./pages/dashboard/Profile'))
const MapDetail = lazy(() => import('./pages/MapDetail'))
const Maps = lazy(() => import('./pages/dashboard/Maps'))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<PageLayout />}>
                <Route
                  path={routes.mapPreview(':modelid')}
                  element={<MapModel mode={ComponentMode.PREVEIW} />}
                />

                <Route element={<ExtendedPageLayoutDefault />}>
                  <Route path={routes.home} element={<Home />} />
                  <Route path={routes.login} element={<Login />} />
                  <Route path={routes.register} element={<Registration />} />
                  <Route
                    path={routes.forgottenPasword}
                    element={<ForgottenPassword />}
                  />
                  <Route path={routes.restorePassword} element={<Home />} />
                </Route>

                <Route
                  path='/admin'
                  element={<RouteGuard allowedRoles={[UserRole.ADMIN]} />}
                >
                  <Route
                    path={routes.dashboard.editMapModel(
                      UserRole.ADMIN,
                      ':modelid',
                    )}
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
                  <Route element={<ExtendedPageLayoutDashboard />}>
                    <Route
                      path={routes.dashboard.maps(UserRole.ADMIN)}
                      element={<Maps />}
                    />
                    <Route path={routes.admin.users} element={<Users />} />
                    <Route
                      path={routes.dashboard.profile(UserRole.ADMIN)}
                      element={<Profile />}
                    />
                  </Route>
                </Route>

                <Route
                  path='/user'
                  element={<RouteGuard allowedRoles={[UserRole.USER]} />}
                >
                  <Route
                    path={routes.dashboard.editMapModel(
                      UserRole.USER,
                      ':modelid',
                    )}
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
                  <Route element={<ExtendedPageLayoutDashboard />}>
                    <Route
                      path={routes.dashboard.maps(UserRole.USER)}
                      element={<Maps />}
                    />
                    <Route
                      path={routes.dashboard.profile(UserRole.USER)}
                      element={<Profile />}
                    />
                  </Route>
                </Route>
                <Route element={<ExtendedPageLayoutDefault />}>
                  <Route
                    path='/403'
                    element={
                      <ErrorPage
                        errorCode={403}
                        subheading='Forbidden'
                        link={routes.login}
                        linkText='Sign in'
                      />
                    }
                  />
                  <Route
                    path='/*'
                    element={
                      <ErrorPage
                        errorCode={404}
                        subheading='Page not found'
                        link={routes.home}
                        linkText='Home'
                      />
                    }
                  />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster closeButton richColors />
      </MainProvider>
    </QueryClientProvider>
  )
}

export default App
