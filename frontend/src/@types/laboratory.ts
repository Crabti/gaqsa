import CommonType from './common';

export interface Laboratory extends CommonType {
    name: string;
}

export interface CreateLaboratoryForm {
    name: string;
}

export interface UpdateLaboratoryForm extends CommonType {
    name: string;
}
