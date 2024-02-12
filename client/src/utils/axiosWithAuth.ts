import axios from "axios";
import { getTokenFromCookie } from "./jwt";

export const axiosWithAuth = axios.create({
    headers: {
      Authorization: `Bearer ${getTokenFromCookie()}`,
    },
});

export const setHeadersConfig = (extraHeaders = {}) => {
  return {
    ...axiosWithAuth.defaults,
    headers: {
      ...axiosWithAuth.defaults.headers,
      ...extraHeaders,
    },
  };
};