import axios from 'axios';
import { getCurrentLanguage } from './i18nRequest';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

const responseCache = new Map();

const buildCacheKey = (url) => {
  const lang = getCurrentLanguage() || 'en';
  return `${lang}::${url}`;
};

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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401s — queues concurrent requests while one refresh is in flight
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, queue this request until it resolves
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest).then((res) => res.data);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            'http://127.0.0.1:8000/accounts/api/token/refresh/',
            { refresh: refreshToken }
          );

          if (refreshResponse.data?.access) {
            const newAccess = refreshResponse.data.access;
            localStorage.setItem('access', newAccess);

            processQueue(null, newAccess);
            isRefreshing = false;

            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return axios(originalRequest).then((res) => res.data);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          console.error('Token refresh failed:', refreshError);
        }
      }

      isRefreshing = false;
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

const getCached = async (url, options = {}) => {
  const { ttlMs = 30000, forceRefresh = false } = options;
  const key = buildCacheKey(url);
  const now = Date.now();

  if (!forceRefresh && responseCache.has(key)) {
    const cached = responseCache.get(key);
    if (now - cached.timestamp < ttlMs) {
      return cached.data;
    }
  }

  const data = await api.get(url);
  responseCache.set(key, { data, timestamp: now });
  return data;
};

const invalidateCache = (urlPrefix = '') => {
  if (!urlPrefix) {
    responseCache.clear();
    return;
  }

  for (const key of responseCache.keys()) {
    const [, url] = key.split('::');
    if (url?.startsWith(urlPrefix)) {
      responseCache.delete(key);
    }
  }
};

export { api, getCached, invalidateCache };
