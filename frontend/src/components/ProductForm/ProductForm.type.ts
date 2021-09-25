import { FormInstance } from 'antd';
import { CreateProductForm, UpdateProductForm } from '@types';

export default interface Props {
  initialState: CreateProductForm | UpdateProductForm;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  isUpdate?: boolean;
}
