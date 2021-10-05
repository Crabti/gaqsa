import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError,
} from 'axios';
import { LOCAL_STORAGE_KEY, AuthType } from 'hooks/useAuth';
import { otherRoutes } from 'Routes';
import { BACKEND_MAIN_EP, USERS_ROOT } from 'settings';
import { BackendConfig } from './config';

class Api {
  private api: AxiosInstance;

  public baseURL: string;

  public constructor(
    baseURL: string, config?: BackendConfig,
  ) {
    this.api = axios.create(config);
    this.baseURL = baseURL;
    this.api.interceptors.request.use((param: AxiosRequestConfig) => ({
      baseURL,
      ...param,
    }));

    // Handle refresh token
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url !== otherRoutes.login.path && error.response) {
          // Access token is expired
          if (error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true;
            try {
              const uninterceptedAxios = axios.create();

              const result = await uninterceptedAxios.post(
                `${BACKEND_MAIN_EP}${USERS_ROOT}/refresh/`, {
                  refresh: config?.refresh,
                },
              );
              const newAccess = result.data.access;
              // Store new access token to localstorage
              const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
              if (newAccess && stored) {
                const parsedStored = JSON.parse(stored);
                const newValues : AuthType = {
                  ...parsedStored,
                  access: newAccess,
                };
                localStorage.setItem(
                  LOCAL_STORAGE_KEY, JSON.stringify(newValues),
                );

                // Update current instance headers
                this.api.defaults
                  .headers.common.Authorization = `Bearer ${newAccess}`;
                return this.api({
                  ...originalRequest,
                  headers: { Authorization: `Bearer ${newAccess}` },
                });
              }
              return this.api(originalRequest);
            } catch (err) {
              return Promise.reject(err);
            }
          }
        }

        return Promise.reject(error);
      },
    );
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<T> | null, AxiosError | null]> {
    try {
      const res = await this.api.get<T>(url, config);
      return [res, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<T> | null, AxiosError | null]> {
    try {
      const res = await this.api.delete<T>(url, config);
      return [res, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  public async post<T, B>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<T> | null, AxiosError | null]> {
    try {
      const res = await this.api.post<T>(url, data, config);
      return [res, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }

  public async patch<T, B>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<T> | null, AxiosError | null]> {
    try {
      const res = await this.api.patch<T>(url, data, config);
      return [res, null];
    } catch (e) {
      return [null, e as AxiosError];
    }
  }
}

export default Api;
