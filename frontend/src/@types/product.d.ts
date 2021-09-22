import CommonType from './common';

// TODO: Add rest of fields

export type Product = CommonType & {
    name: string;
    price: number;
};

export type CreateProductForm = {
    name: string;
    price: number;
};

export type UpdateProductForm = {
    name: string;
    price: number;
};
