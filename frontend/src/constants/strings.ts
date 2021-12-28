export const DEFAULT_DISABLED_MESSAGE = (
  'Solo administradores pueden actualizar este campo.'
);

export const ORDERS_MAILS_CATEGORY = 'Pedidos';
export const PAYMENTS_MAILS_CATEGORY = 'Saldos';
export const INVOICES_MAILS_CATEGORY = 'Facturas';
export const PRICE_CHANGE_MAILS_CATEGORY = 'Cambio de precios';

export enum OrderStatus {
  RECEIVED = 'Entregado',
  INCOMPLETE = 'Incompleto',
  CANCELLED = 'Cancelado',
  PENDING = 'Pendiente',
}

export enum InvoiceStatus {
  ACCEPTED = 'Aceptado',
  REJECTED = 'Rechazada',
  PENDING = 'Pendiente',
}

export enum RequisitionStatus {
  RECEIVED = 'Entregado',
  INCOMPLETE = 'Incompleto',
  PENDING = 'Pendiente',
}

export enum OrderInvoiceStatus {
  ACCEPTED = 'Aceptada',
  REJECTED = 'Rechazada',
  PENDING = 'Pendiente',
  PARTIAL = 'Parcial',
}
