export const BASE_URL = process.env.REACT_APP_API_URL;

export const SIGN_IN = `${BASE_URL}/api/auth/login`;
export const SIGN_UP = `${BASE_URL}/api/auth/register`;
export const FORGOT_PASSWORD = `${BASE_URL}/api/auth/forgot-password`;
export const RESET_PASSWORD = `${BASE_URL}/api/auth/reset-password`;