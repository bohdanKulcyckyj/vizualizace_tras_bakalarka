import axios, { AxiosRequestConfig } from "axios";
import { getTokenFromCookie } from "./jwt";

let axiosWithAuth = axios.create();

export const updateAuthHeaders = (token: string) => {
  axiosWithAuth = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

axiosWithAuth.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getTokenFromCookie()}`;
  return config;
});

export const setHeadersConfig = (extraHeaders = {}): AxiosRequestConfig => {
  return {
    ...axiosWithAuth.defaults,
    // @ts-ignore
    headers: {
      ...axiosWithAuth.defaults.headers,
      ...extraHeaders,
    },
  };
};

export { axiosWithAuth };
