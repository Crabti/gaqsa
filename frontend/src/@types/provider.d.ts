import { CommonType, UserEmail } from '@types';
import { CreateBusinessForm } from './business';

export interface Provider extends CommonType {
  name: string;
  user: number;
  rfc: string;
  address: string;
  emails?: UserEmail[];
}

export interface CreateProviderForm extends CreateBusinessForm {
  nav_key: string;
}
