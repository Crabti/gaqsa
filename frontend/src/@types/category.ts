import CommonType from './common';

export interface Category extends CommonType {
    code: string;
    name: string;
}

export interface CreateCategoryForm {
    code: string;
    name: string;
}

export interface UpdateCategoryForm extends CommonType {
    code: string;
    name: string;
}
