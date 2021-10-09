import { FormInstance } from 'antd';
import { CreateProductForm, ProductOptions, UpdateProductForm } from '@types';

type DisabledFields = {
  /**
   * Reason why the field is disabled
   */
  [name in keyof UpdateProductForm]?: string;
};

interface Props {
  initialState: CreateProductForm | UpdateProductForm;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  options: ProductOptions;
  isUpdate?: boolean;
  disabledFields?: DisabledFields;
}

export default Props;
