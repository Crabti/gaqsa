import { CommonType } from '@types';

export interface Requisition {
    id: number;
    order: number;
    provider: number | string;
    product: number | string;
    quantity_requested: number;
    quantity_accepted: number;
    price: number;
    status: string;
};

export interface Order extends CommonType {
    id: number;
    user: number | string;
    created_at: Date;
    requisitions: Requisition[];
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
