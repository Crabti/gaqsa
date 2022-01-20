import { CommonType } from '@types';

export type AddresseeType = 'providers' | 'clients';

export const AddresseeTypes = [
  {
    key: 'providers',
    value: 'Proveedores',
  },
  {
    key: 'clients',
    value: 'Clientes',
  },
];

export interface Announcement extends CommonType {
  title: string;
  content: string;
  file_url: string;
  addressee: AddresseeType;
}

export interface CreateAnnouncement {
  title: string;
  content: string;
  addressee: AddresseeType;
  file: Blob;
}
