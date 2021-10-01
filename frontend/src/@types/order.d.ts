import { CommonType } from '@types';

export type Requisition = {
    id: number;
    order: number;
    provider: number | string;
    product: number | string;
    quantity_requested: number;
    quantity_accepted: number;
    price: number;
    status: string;
};

export type Order = CommonType & {
    id: number;
    user: number | string;
    created_at: Date;
    requisitions: Requisition[];
};

export type CreateOrderForm = {
}

export type UpdateOrderForm = {
}
