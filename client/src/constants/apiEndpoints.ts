const BASE_URL = process.env.REACT_APP_API_URL

const apiEndpoints = {
  //auth
  login: `${BASE_URL}/api/auth/login`,
  logout: `${BASE_URL}/api/auth/logout`,
  registration: `${BASE_URL}/api/auth/register`,
  forgottenPassword: `${BASE_URL}/api/auth/forgot-password`,
  resetPassword: `${BASE_URL}/api/auth/reset-password`,
  //dashboard
  getUserDetail: (_id: string) => `${BASE_URL}/api/users/${_id}`,
  updateUserDetail: (_id: string) => `${BASE_URL}/api/users/${_id}`,
  deleteUser: (_id: string = '') => `${BASE_URL}/api/users/${_id}`, // admin only
  getUsers: `${BASE_URL}/api/users/`, // admin only
  //maps
  newMap: `${BASE_URL}/api/maps`,
  getUserMaps: `${BASE_URL}/api/maps`,
  getMapDetail: (_id: string) => `${BASE_URL}/api/maps/${_id}`,
  editMap: (_id: string) => `${BASE_URL}/api/maps/${_id}`,
  deleteMap: (_id: string = '') => `${BASE_URL}/api/maps/${_id}`,
  getAllUsersMaps: `${BASE_URL}/api/maps/admin-maps`, // admin only
  //uploads
  uploadMedia: `${BASE_URL}/api/blobs`,
  getUploadedMedia: (_name: string) => `${BASE_URL}/api/blobs/${_name}`,
  deleteUploadedMedia: (_name: string) => `${BASE_URL}/api/blobs/${_name}`,
}

export default apiEndpoints
