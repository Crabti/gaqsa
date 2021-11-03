import { FormInstance } from 'antd';
import {
  Create__model__Form, Update__model__Form,
} from '@types';

interface Props {
  initialState: Create__model__Form | Update__model__Form;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  isUpdate?: boolean;
}

export default Props;
