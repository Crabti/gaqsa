import {
  AddresseeTypes,
  Announcement,
  CreateAnnouncement,
} from './announcement';
import {
  CreateProductForm,
  Product,
  ProductOptions,
  UpdateProductForm,
  ProductPriceChange,
  ChangePriceForm,
  ProductProvider,
  ProductGroup,
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
  User, CreateUserForm, BusinessForm, UserEmail, UpdateUserForm,
} from './user';
import { Provider } from './provider';
import { Offer, CreateOfferForm } from './offer';
import { Invoice, UploadInvoiceForm } from './invoice';
import { AuditLog } from './auditLog';

export type Maybe<T> = T | undefined;

export { AddresseeTypes };

export type {
  AnimalGroup,
  Announcement,
  CreateAnnouncement,
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
  ProductPriceChange,
  ChangePriceForm,
  ProductProvider,
  ProductGroup,
  Invoice,
  UploadInvoiceForm,
  AuditLog,
  UpdateUserForm,
};
