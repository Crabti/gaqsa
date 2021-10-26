import { CreateCategoryForm, UpdateCategoryForm } from '@types';
import { FormInstance } from 'antd';

interface Props {
    initialState: CreateCategoryForm | UpdateCategoryForm;
    onFinish: (values: any) => void;
    onFinishFailed: (values: any) => void;
    form: FormInstance<any>;
    isLoading: boolean;
  }

export default Props;
