import { FormInstance } from 'antd';
import { LoginForm } from '@types';

interface Props {
  initialState: LoginForm;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
}

export default Props;