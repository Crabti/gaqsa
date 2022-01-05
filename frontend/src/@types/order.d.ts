import { CommonType, Product, Provider } from '@types';
import { Invoice } from './invoice';

export interface Requisition {
    id: number;
    order: number;
    provider: number | string;
    product: number | string | Product;
    quantity_requested: number;
    quantity_accepted: number;
    price: number;
    status: string;
    sent: boolean;
}

export interface Order extends CommonType {
    id: number;
    user: number | string;
    created_at: Date;
    requisitions: Requisition[];
    invoices?: Invoice[];
    provider: string | Provider;
    status: string;
    total?: number;
    cancelled: boolean;
    invoice_status: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateOrderForm { }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateOrderForm {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateRequisitionForm { }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UpdateRequisitionForm { }
