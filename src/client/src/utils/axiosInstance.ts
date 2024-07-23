import axios, { AxiosInstance, AxiosRequestConfig} from 'axios';

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  headers: any;
}

const axiosInstance = (token?: string): AxiosInstance => {
  const config: AxiosInstanceConfig = {
    baseURL: "http://localhost:8000",//"https://fcabalserver.onrender.com",
    headers: { 'Content-Type': 'application/json' },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer:${token}`;
  }

  return axios.create(config);
};

export default axiosInstance;
