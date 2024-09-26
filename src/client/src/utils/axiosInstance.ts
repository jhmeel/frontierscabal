import axios, { AxiosInstance, AxiosRequestConfig} from 'axios';

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  headers: any;
}

const axiosInstance = (token?: string): AxiosInstance => {


  const baseUrl = window.location.protocol.includes("https")
  ? "https://frontierscabal.onrender.com"
  : "http://127.0.0.1:8000";

  const config: AxiosInstanceConfig = {
    baseURL:baseUrl,
    headers: { 'Content-Type': 'application/json' },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer:${token}`;
  }

  return axios.create(config);
};

export default axiosInstance;
