import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    if (!config) {
      return Promise.reject(error);
    }

    const shouldRetry =
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      (error.response?.status && error.response.status >= 500);

    if (shouldRetry && (!config._retryCount || config._retryCount < MAX_RETRIES)) {
      config._retryCount = (config._retryCount || 0) + 1;
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * config._retryCount!)
      );
      return apiClient(config);
    }

    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as Record<string, unknown>;
      if ('detail' in data) {
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);
