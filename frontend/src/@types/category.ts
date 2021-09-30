import CommonType from './common';

export type Category = CommonType & {
    name: string;
};

export type CreateCategoryForm = {
    name: string;
};

export type UpdateCategoryForm = CommonType & {
    name: string;
};
