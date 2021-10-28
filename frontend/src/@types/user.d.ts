import { CommonType, Provider } from '@types';
import { CreateClientForm } from './client';
import { CreateProviderForm } from './provider';

export interface User extends CommonType {
  first_name: string;
  last_name: string;
  email: string;
  groups: string[];
  last_login?: string;
  date_joined?: string;
  username?: string;
  is_active?: boolean;
  provider?: Provider,
  client?: Client,
}

interface Profile {
  telephone: string;
}

interface Ranch {
  key: string;
  name: string;
}

interface UserEmail {
  id?: number;
  email: string;
  category: string;
}

export type BusinessForm = CreateClientForm | CreateProviderForm;

export interface CreateUserForm {
  user: {
    username: string,
    first_name: string,
    last_name: string,
    email: string;
    password: string;
  },
  profile: Profile,
  ranchs?: Ranch[],
  emails?: UserEmail[],
  business?: BusinessForm,
  client?: BusinessForm,
  provider?: BusinessForm,
  group: string;
  orderMails?: UserEmail[],
  paymentMails?: UserEmail[],
  invoiceMails?: UserEmail[],
  priceChangeMails?: UserEmail[],
}
