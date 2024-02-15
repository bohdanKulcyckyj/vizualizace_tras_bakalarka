import axios, { AxiosRequestConfig } from "axios";
import { getTokenFromCookie } from "./jwt";

export const axiosWithAuth = axios.create({
    headers: {
      Authorization: `Bearer ${getTokenFromCookie()}`,
    },
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