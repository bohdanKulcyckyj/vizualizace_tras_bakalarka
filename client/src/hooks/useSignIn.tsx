import { saveTokenToCookie } from '../utils/jwt'
import { ILoggedUser, UserRoleMapper } from '../interfaces/User'
import { useMainContext } from '../context/MainContext'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'

export const useSignIn = () => {
  const { setLoggedUser } = useMainContext()
  const navigate = useNavigate()

  const storeSignIn = (
    token: string,
    user: ILoggedUser,
    dashboardRedirect: boolean = false,
  ) => {
    try {
      saveTokenToCookie(token)
      setLoggedUser(user)
      sessionStorage.setItem('loggedUser', JSON.stringify(user))

      if (dashboardRedirect) {
        navigate(routes.dashboard.profile(user.role, user.id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return { storeSignIn }
}

export default useSignIn
