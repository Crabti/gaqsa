import { CommonType } from '@types';

export interface Offer extends CommonType {
    ending_at: string;
    discount_percentage: number;
    user: number;
    product: number;
    ending_at: string;
    cancelled: boolean;
}

export interface CreateOfferForm {
    discount_percentage: number;
    product_provider: number;
    ending_at: string;
    newPrice?: number;
}
