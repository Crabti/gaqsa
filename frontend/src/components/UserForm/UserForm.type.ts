import { FormInstance } from 'antd';
import {
  CreateUserForm,
  UpdateUserForm,
} from '@types';

interface Props {
  initialState: CreateUserForm | UpdateUserForm;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  isUpdate?: boolean;
  initialRole?: string;
}

export default Props;
