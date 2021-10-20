import { FormInstance } from 'antd';
import {
  CreateProductForm, ProductOptions, Provider, UpdateProductForm,
} from '@types';

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
  providers?: Provider[];
  isUpdate?: boolean;
  disabledFields?: DisabledFields;
  isAdmin?: boolean;
}

export default Props;
