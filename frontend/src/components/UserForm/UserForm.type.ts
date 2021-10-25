import { FormInstance } from 'antd';
import {
  CreateUserForm,
} from '@types';

interface Props {
  initialState: CreateUserForm;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  isUpdate?: boolean;
}

export default Props;
