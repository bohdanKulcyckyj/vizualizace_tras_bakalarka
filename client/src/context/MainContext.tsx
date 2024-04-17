import { createContext, useContext, useState } from 'react'
import IMainContextProvider, {
  Children,
} from '../interfaces/context/MainContextProvider'
import { ILoggedUser } from '../interfaces/User'

const MainContext = createContext<IMainContextProvider>(null)

export const useMainContext = () => {
  return useContext(MainContext)
}

export const MainProvider = ({ children }: Children) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loggedUser, setLoggedUser] = useState<ILoggedUser>(
    sessionStorage.getItem('loggedUser')
      ? JSON.parse(sessionStorage.getItem('loggedUser'))
      : null,
  )

  return (
    <MainContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loggedUser,
        setLoggedUser,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}
