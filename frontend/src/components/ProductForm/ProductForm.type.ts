import { FormInstance } from 'antd';
import { CreateProductForm, ProductOptions, UpdateProductForm } from '@types';

interface Props {
  initialState: CreateProductForm | UpdateProductForm;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  isUpdate?: boolean;
  options: ProductOptions;
}

export default Props;
