import CommonType from './common';

export interface Category extends CommonType {
    name: string;
}

export interface CreateCategoryForm {
    name: string;
}

export interface UpdateCategoryForm extends CommonType {
    name: string;
}
