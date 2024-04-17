import { Dispatch, SetStateAction, ReactNode } from 'react'
import { ILoggedUser } from '../User'

export interface Children {
  children: ReactNode
}

export default interface IMainContextProvider {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  loggedUser: ILoggedUser
  setLoggedUser: Dispatch<SetStateAction<ILoggedUser>>
}
