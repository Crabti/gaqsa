export const BACKEND_MAIN_EP = process.env.REACT_APP_BACKEND_ROUTE
  || 'http://127.0.0.1:8000';
export const PRODUCTS_ROOT = '/products';
export const USERS_ROOT = '/users';
export const PRODUCTS_OPTIONS_ROOT = '/options';
export const ORDERS_ROOT = '/orders';
export const REQUISITIONS_ROOT = `${ORDERS_ROOT}/requisitions`;
export const PROVIDERS_ROOT = '/providers';
export const OFFERS_ROOT = '/offers';
export const LABORATORY_ROOT = `${PRODUCTS_ROOT}/laboratory`;
export const CATEGORY_ROOT = `${PRODUCTS_ROOT}/category`;
export const INVOICE_ROOT = '/invoices';
export const ANNOUNCEMENT_ROOT = '/announcements';
