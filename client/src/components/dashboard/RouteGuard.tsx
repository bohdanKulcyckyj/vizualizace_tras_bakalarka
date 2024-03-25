import { useEffect } from 'react'
import { getTokenFromCookie } from '../../utils/jwt'
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import routes from '../../constants/routes'
import { useMainContext } from '../../context/MainContext'

const RouteGuard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setLoggedUser } = useMainContext()

  useEffect(() => {
    if (!getTokenFromCookie()) {
      setLoggedUser(null)
      sessionStorage.removeItem('loggedUser')
      navigate(routes.login, {
        replace: true,
      })
    }
  }, [location])

  return <Outlet />
}

export default RouteGuard
