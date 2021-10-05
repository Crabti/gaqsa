import { AxiosRequestConfig } from 'axios';

interface RefreshData {
    refresh: string;
}

export type BackendConfig = AxiosRequestConfig & RefreshData;
