import { useEffect } from 'react'
import { getTokenFromCookie } from '../../utils/jwt'
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import routes from '../../constants/routes'
import { useMainContext } from '../../context/MainContext'

type TProps = {
  allowedRoles?: string[]
}

const RouteGuard = ({ allowedRoles }: TProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { loggedUser, setLoggedUser } = useMainContext()

  useEffect(() => {
    try {
      if (!getTokenFromCookie()) throw new Error('Token not found')
      if(allowedRoles && !(allowedRoles.includes(loggedUser.role))) {
        navigate(routes.forbidden, {
          replace: true
        })
      }
    } catch (e) {
      setLoggedUser(null)
      sessionStorage.removeItem('loggedUser')
      navigate(routes.login, {
        replace: true,
      })
    }
  }, [allowedRoles, location, navigate, loggedUser, setLoggedUser])

  return <Outlet />
}

export default RouteGuard
