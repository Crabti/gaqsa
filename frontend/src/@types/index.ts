import {
  CreateProductForm,
  Product,
  ProductOptions,
  UpdateProductForm,
} from './product';
import CommonType from './common';
import { Category, CreateCategoryForm, UpdateCategoryForm } from './category';
import {
  Laboratory,
  CreateLaboratoryForm, UpdateLaboratoryForm,
} from './laboratory';
import { AnimalGroup } from './animalGroup';
import {
  Order, CreateOrderForm, UpdateOrderForm,
  Requisition, CreateRequisitionForm, UpdateRequisitionForm,
} from './order';
import {
  User, CreateUserForm, BusinessForm, UserEmail,
} from './user';
import { Provider } from './provider';
import { Offer, CreateOfferForm } from './offer';

export type Maybe<T> = T | undefined;

export type {
  AnimalGroup,
  Category,
  CommonType,
  CreateCategoryForm,
  CreateLaboratoryForm,
  CreateProductForm,
  Laboratory,
  Product,
  ProductOptions,
  UpdateCategoryForm,
  UpdateLaboratoryForm,
  Order,
  Requisition,
  CreateOrderForm,
  UpdateOrderForm,
  CreateRequisitionForm,
  UpdateRequisitionForm,
  UpdateProductForm,
  User,
  Provider,
  Offer,
  CreateOfferForm,
  CreateUserForm,
  BusinessForm,
  UserEmail,
};
