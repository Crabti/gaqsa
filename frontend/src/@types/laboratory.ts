import CommonType from './common';

export type Laboratory = CommonType & {
    name: string;
}

export type CreateLaboratoryForm = {
    name: string;
}

export type UpdateLaboratoryForm = CommonType & {
    name: string;
}
