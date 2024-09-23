import axios, { AxiosInstance, AxiosRequestConfig} from 'axios';

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  headers: any;
}

const axiosInstance = (token?: string): AxiosInstance => {
<<<<<<< HEAD
  const config: AxiosInstanceConfig = {
    baseURL: "http://localhost:8000",//"https://fcabalserver.onrender.com",
=======


  const baseUrl = window.location.protocol.includes("https")
  ? "https://frontierscabal.onrender.com"
  : "http://127.0.0.1:8000";

  const config: AxiosInstanceConfig = {
    baseURL:baseUrl,
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    headers: { 'Content-Type': 'application/json' },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer:${token}`;
  }

  return axios.create(config);
};

export default axiosInstance;
