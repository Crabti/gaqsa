/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { AxiosRequestConfig } from 'axios';
import {
  Product,
  CreateProductForm,
  UpdateProductForm,
} from '@types';
import { BACKEND_MAIN_EP, PRODUCTS_ROOT } from 'settings';
import CRUD from './crud';

export class Backend {
  rootEndpoint: string;

  products: CRUD<Product, CreateProductForm, UpdateProductForm>;

  config?: AxiosRequestConfig;

  public constructor(rootEndpoint: string, config?: AxiosRequestConfig) {
    this.rootEndpoint = rootEndpoint;
    this.config = config;
    this.products = new CRUD(
      `${this.rootEndpoint}${PRODUCTS_ROOT}`, config,
    );
  }
}

export const BackendContext = React.createContext<Backend>(undefined!);

export const BackendProvider: React.FC = ({ children }) => (
  <BackendContext.Provider
    value={
        new Backend(BACKEND_MAIN_EP, {
          headers: {
            // TODO: Implement authentication in backend
            // const { idToken } = useAuth();
          // Authorization: idToken || undefined,
          },
        })
}
  >
    {children}
  </BackendContext.Provider>
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useBackend = () => React.useContext(BackendContext);

export default BackendContext;
