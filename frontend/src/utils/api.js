import axios from 'axios';
import { getCurrentLanguage } from './i18nRequest';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = getCurrentLanguage();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and retry requests or logout
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          // Attempt to get a new access token
          const refreshResponse = await axios.post('http://127.0.0.1:8000/accounts/api/token/refresh/', {
            refresh: refreshToken
          });

          if (refreshResponse.data && refreshResponse.data.access) {
            const newAccess = refreshResponse.data.access;
            localStorage.setItem('access', newAccess);

            // Set the Authorization header on the original request and retry it
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return axios(originalRequest).then(res => res.data); // Return .data since the interceptor unwraps it
          }
        } catch (refreshError) {
          // Refresh token is expired or invalid
          console.error('Token refresh failed:', refreshError);
        }
      }

      // If no refresh token or refresh failed, force logout
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export { api };
