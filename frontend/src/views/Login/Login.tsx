import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  notification,
} from 'antd';
import Title from 'components/Title';
import LoginFormulary from 'components/LoginFormulary';
import { LoginForm } from 'components/LoginFormulary/LoginFormulary.type';

const INITIAL_STATE = {
  email: '',
  password: '',
};

const Home: React.ViewComponent = ({ verboseName }) => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al iniciar sesión!',
      description: 'Por favor revisa tus credenciales e intentalo nuevamente',
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish = async (values: LoginForm) : Promise<void> => {
    setLoading(true);
    // TODO: Get login data
    const error = false;

    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: '¡Sesión iniciada correctamente',
      });
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName="Iniciar Sesión" />
      <LoginFormulary
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
      />
    </Content>
  );
};

export default Home;
