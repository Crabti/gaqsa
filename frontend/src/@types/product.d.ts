import { AnimalGroup, Offer, Provider } from '@types';
import CommonType from './common';
import Laboratory from './laboratory';
import Category from './category';

export interface ProductProvider extends CommonType {
  provider: Provider | string;
  price: number;
  iva: number;
  laboratory: string | Laboratory;
  offer?: Offer;
  active?: boolean;
}

interface BaseProduct extends CommonType {
  name: string;
  ieps: number;
  more_info: string;
  key: string;
  status: string;
  presentation: string;
  animal_groups: number[] | string[];
  category: number | string;
  active_substance: string;
}

export interface ProductGroup extends BaseProduct {
  providers: ProductProvider[];
}

export interface Product extends BaseProduct {
  provider: ProductProvider;
}

export interface CreateProductProviderForm {
  iva: number;
  price: number;
  laboratory: number;
  provider?: number;
}

export interface CreateProductForm {
  name: string;
  provider?: CreateProductProviderForm | CreateProductProviderForm[];
  ieps: number;
  more_info: string;
  category: number;
  animal_groups: number[];
  active_substance: string;
}

export interface UpdateProductForm {
  name: string;
  ieps: number;
  more_info: string;
  key: string;
  category: number;
  animal_groups: number[];
  active_substance: string;
  presentation: string;
}

export interface ProductOptions {
  categories: Category[],
  laboratories: Laboratory[],
  animal_groups: AnimalGroup[],
}

export type ProductPriceChange = {
  product: number;
  new_price: number;
}

export interface ChangePriceForm {
  token: string;
  products: ProductPriceChange[];
}
