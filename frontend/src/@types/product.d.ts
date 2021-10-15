import { AnimalGroup, Offer } from '@types';
import CommonType from './common';
import Laboratory from './laboratory';
import Category from './category';

export interface Product extends CommonType {
  name: string;
  price: number;
  iva: number;
  ieps: number;
  more_info: string;
  provider?: string;
  key: string;
  status: string;
  reject_reason: string;
  presentation: string;
  animal_groups: number[] | string[];
  laboratory: number | string;
  category: number | string;
  active_substance: string;
  offer?: Offer;
}

export interface CreateProductForm {
  name: string;
  price: number;
  iva: number;
  ieps: number;
  more_info: string;
  provider?: number;
  category: number;
  laboratory: number;
  animal_groups: number[];
  active_substance: string;
}

export interface UpdateProductForm {
  name: string;
  price: number;
  iva: number;
  ieps: number;
  more_info: string;
  provider?: number;
  key: string;
  status: string;
  reject_reason: string;
  category: number;
  laboratory: number;
  animal_groups: number[];
  active_substance: string;
}

export interface ProductOptions {
  categories: Category[],
  laboratories: Laboratory[],
  animal_groups: AnimalGroup[],
}
