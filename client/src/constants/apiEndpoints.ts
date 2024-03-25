const BASE_URL = process.env.REACT_APP_API_URL

const apiEndpoints = {
  //auth
  login: `${BASE_URL}/api/auth/login`,
  logout: `${BASE_URL}/api/auth/logout`,
  registration: `${BASE_URL}/api/auth/register`,
  forgottenPassword: `${BASE_URL}/api/auth/forgot-password`,
  resetPassword: `${BASE_URL}/api/auth/reset-password`,
  //dashboard
  getUserDetail: `${BASE_URL}/api/user`,
  updateUserDetail: `${BASE_URL}/api/user`,
  deleteUser: (_id: string = '') => `${BASE_URL}/api/user/${_id}`, // admin only
  getUsers: `${BASE_URL}/api/user/users`, // admin only
  //maps
  newMap: `${BASE_URL}/api/map`,
  getUserMaps: `${BASE_URL}/api/map`,
  getMapDetail: (_id: string) => `${BASE_URL}/api/map/${_id}`,
  editMap: (_id: string) => `${BASE_URL}/api/map/${_id}`,
  deleteMap: (_id: string = '') => `${BASE_URL}/api/map/${_id}`,
  getAllUsersMaps: `${BASE_URL}/api/map/all-maps`, // admin only
  //uploads
  uploadMedia: `${BASE_URL}/api/blob`,
  getUploadedMedia: (_name: string) => `${BASE_URL}/api/blob/${_name}`,
  deleteUploadedMedia: (_name: string) => `${BASE_URL}/api/blob/${_name}`,
}

export default apiEndpoints
