import CommonType from './common';

// TODO: Add rest of fields

export type Product = CommonType & {
  name: string;
  price: number;
  dose: string;
  iva: number;
  ieps: number;
  more_info: string;
  is_generic: string;
  provider?: string;
  key: string;
  status: string;
  reject_reason: string;
};

export type CreateProductForm = {
  name: string;
  price: number;
  dose: string;
  iva: number;
  ieps: number;
  more_info: string;
  is_generic: string;
  provider?: number;
};

export type UpdateProductForm = {
  name: string;
  price: number;
  dose: string;
  iva: number;
  ieps: number;
  more_info: string;
  is_generic: string;
  provider?: number;
  key: string;
  status: string;
  reject_reason: string;
};
