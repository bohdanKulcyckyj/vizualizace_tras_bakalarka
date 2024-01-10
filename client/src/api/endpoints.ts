export const BASE_URL = process.env.REACT_APP_API_URL;
//auth
export const SIGN_IN = `${BASE_URL}/api/auth/login`;
export const SIGN_UP = `${BASE_URL}/api/auth/register`;
export const SIGN_OUT = `${BASE_URL}/api/auth/logout`;
export const FORGOT_PASSWORD = `${BASE_URL}/api/auth/forgot-password`;
export const RESET_PASSWORD = `${BASE_URL}/api/auth/reset-password`;
//users
export const USER_ALL_USERS = `${BASE_URL}/api/user/all-users`;
export const USER_DETAIL = `${BASE_URL}/api/user/`;
export const USER_DETAIL_CHANGE = `${BASE_URL}/api/user/`;
export const USER_DELETE = `${BASE_URL}/api/user/`
//maps
export const MAP_NEW = `${BASE_URL}/api/map/new`;
export const MAP_USER_MAPS = `${BASE_URL}/api/map/user-maps`;
export const MAP_ALL_MAPS = `${BASE_URL}/api/map/all-maps`;
export const MAP_UPLOAD_GPX = `${BASE_URL}/api/map/upload/gpx`;
export const MAP_DETAIL = `${BASE_URL}/api/map/`
export const MAP_EDIT = `${BASE_URL}/api/map/`
export const MAP_DELETE = `${BASE_URL}/api/map/`