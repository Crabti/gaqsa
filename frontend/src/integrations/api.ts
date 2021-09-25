import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError,
} from 'axios';

class Api {
  private api: AxiosInstance;

  public constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.api = axios.create(config);
    this.api.interceptors.request.use((param: AxiosRequestConfig) => ({
      baseURL,
      ...param,
    }));
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
