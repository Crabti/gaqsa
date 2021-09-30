import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  notification,
} from 'antd';
import Title from 'components/Title';
import LoginForm from 'components/LoginForm';

const INITIAL_STATE = {
  email: '',
  password: '',
};

const Home: React.ViewComponent = ({ verboseName }) => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const onFinish = async () : Promise<void> => {
    setLoading(true);
    // TODO: Get login data
    const error = false;

    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: '¡Sesión iniciada correctamente',
        description: 'Su petición sera validado por un administrador proxima'
          + 'proximamente. Sera notificado ya que esta petición '
          + 'cambie de estado',
      });
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName="Iniciar Sesión" />
      <LoginForm
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
