import { CreateLaboratoryForm, UpdateLaboratoryForm } from '@types';
import { FormInstance } from 'antd';

interface Props {
    initialState: CreateLaboratoryForm | UpdateLaboratoryForm;
    onFinish: (values: any) => void;
    onFinishFailed: (values: any) => void;
    form: FormInstance<any>;
    isLoading: boolean;
  }

export default Props;
