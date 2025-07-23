import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: baseUrl });

export const setupInterceptors = (setLoading: (loading: boolean) => void) => {
  api.interceptors.request.use(
    (config) => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );
};

const getUrl = (path: string) => `${baseUrl}/${path}`;

export { api, getUrl };