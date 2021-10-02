import { FormInstance } from 'antd';

export interface LoginForm {
  email: string;
  password: string;
}

interface Props {
  initialState: LoginForm;
  onFinish: (values: LoginForm) => void;
  onFinishFailed: () => void;
  form: FormInstance<LoginForm>;
  isLoading: boolean;
}

export default Props;
