import apiEndpoints from '../constants/apiEndpoints'
import { ILoggedUser, UserRoleMapper } from '../interfaces/User'
import { axiosWithAuth } from '../utils/axiosWithAuth'

export const getUserProfile = async (userId: string): Promise<ILoggedUser> => {
  const res = await axiosWithAuth.get(apiEndpoints.getUserDetail(userId))
  const userData = { ...res.data, role: UserRoleMapper[res.data.role] }
  return userData as ILoggedUser
}

export const updateUserProfile = async (
  userId: string,
  data: ILoggedUser,
): Promise<ILoggedUser> => {
  const res = await axiosWithAuth.post(
    apiEndpoints.updateUserDetail(userId),
    data,
  )

  const userData = {
    ...res.data.user,
    role: UserRoleMapper[res.data.user.role],
  }
  return userData as ILoggedUser
}
