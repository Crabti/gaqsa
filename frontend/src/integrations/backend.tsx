/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import {
  Product,
  CreateProductForm,
  UpdateProductForm,
  Order,
  CreateOrderForm,
  UpdateOrderForm,
  Requisition,
  CreateRequisitionForm,
  UpdateRequisitionForm,
} from '@types';

import {
  BACKEND_MAIN_EP,
  PRODUCTS_ROOT, USERS_ROOT, ORDERS_ROOT, REQUISITIONS_ROOT,
} from 'settings';
import useAuth from 'hooks/useAuth';
import CRUD from './crud';

export class Backend {
  rootEndpoint: string;

  products: CRUD<Product, CreateProductForm, UpdateProductForm>;

  orders: CRUD<Order, CreateOrderForm, UpdateOrderForm>;

  requisitions: CRUD<Requisition, CreateRequisitionForm, UpdateRequisitionForm>;

  users: CRUD<any, any, any>;

  config?: AxiosRequestConfig;

  public constructor(rootEndpoint: string, config?: AxiosRequestConfig) {
    this.rootEndpoint = rootEndpoint;
    this.config = config;
    this.products = new CRUD(
      `${this.rootEndpoint}${PRODUCTS_ROOT}`, config,
    );
    this.orders = new CRUD(
      `${this.rootEndpoint}${ORDERS_ROOT}`, config,
    );
    this.requisitions = new CRUD(
      `${this.rootEndpoint}${REQUISITIONS_ROOT}`, config,
    );
    this.users = new CRUD(
      `${this.rootEndpoint}${USERS_ROOT}`, config,
    );
  }
}

export const BackendContext = React.createContext<Backend>(undefined!);

export const BackendProvider: React.FC = ({ children }) => {
  const { access } = useAuth();
  const [config, setConfig] = useState<AxiosRequestConfig>({});

  useEffect(() => {
    if (access) {
      setConfig({ headers: { Authorization: `Bearer ${access}` } });
    }
  }, [access]);

  return (
    <BackendContext.Provider
      value={
        new Backend(BACKEND_MAIN_EP, config)
      }
    >
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () : Backend => React.useContext(BackendContext);

export default BackendContext;
