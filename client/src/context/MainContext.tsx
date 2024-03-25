import { createContext, useContext, useState } from 'react'
import IContextProvider, { Children } from '../interfaces/ContextProvider'
import { ILoggedUser } from '../interfaces/User'

const MainContext = createContext<IContextProvider>(null)

export const useMainContext = () => {
  return useContext(MainContext)
}

export const MainProvider = ({ children }: Children) => {
  const [config, setConfig] = useState({
    animateTrail: false,
    enableShadow: false,
    enableSun: true,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loggedUser, setLoggedUser] = useState<ILoggedUser>(
    sessionStorage.getItem('loggedUser')
      ? JSON.parse(sessionStorage.getItem('loggedUser'))
      : null,
  )

  return (
    <MainContext.Provider
      value={{
        config,
        setConfig,
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
