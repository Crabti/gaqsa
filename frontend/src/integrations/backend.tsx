/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react';
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
  Provider,
  Offer,
  CreateOfferForm,
} from '@types';

import {
  BACKEND_MAIN_EP,
  PRODUCTS_ROOT, USERS_ROOT, ORDERS_ROOT,
  REQUISITIONS_ROOT, PROVIDERS_ROOT, OFFERS_ROOT,
} from 'settings';
import useAuth from 'hooks/useAuth';
import CRUD from './crud';
import { BackendConfig } from './config';

export class Backend {
  rootEndpoint: string;

  products: CRUD<Product, CreateProductForm, UpdateProductForm>;

  orders: CRUD<Order, CreateOrderForm, UpdateOrderForm>;

  requisitions: CRUD<Requisition, CreateRequisitionForm, UpdateRequisitionForm>;

  users: CRUD<any, any, any>;

  providers: CRUD<Provider, any, any>;

  offers: CRUD<Offer, CreateOfferForm, any>;

  config?: AxiosRequestConfig;

  public constructor(
    rootEndpoint: string, config?: BackendConfig,
  ) {
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
    this.providers = new CRUD(
      `${this.rootEndpoint}${PROVIDERS_ROOT}`, config,
    );
    this.offers = new CRUD(
      `${this.rootEndpoint}${OFFERS_ROOT}`, config,
    );
  }
}

export const BackendContext = React.createContext<Backend>(undefined!);

export const BackendProvider: React.FC = ({ children }) => {
  const { access, refresh } = useAuth();
  const config : BackendConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${access}` },
    refresh,
  }), [access, refresh]);

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
