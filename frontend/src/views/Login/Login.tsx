import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  message,
  notification,
} from 'antd';
import Title from 'components/Title';
import LoginFormulary from 'components/LoginFormulary';
import { LoginForm } from 'components/LoginFormulary/LoginFormulary.type';
import useAuth from 'hooks/useAuth';
import { useBackend } from 'integrations';

const INITIAL_STATE = {
  username: '',
  password: '',
};

const Home: React.ViewComponent = ({ verboseName }) => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [canLogin, setCanLogin] = useState(true);
  const { user, setTokens } = useAuth();
  const backend = useBackend();

  useEffect(() => {
    setCanLogin(!user);
  }, [user]);

  const login = async (username: string, password: string): Promise<void> => {
    if (!canLogin) {
      return;
    }

    setLoading(true);
    const [result, error] = await backend.users.post<
      {access: string; refresh: string;}, {username: string; password: string;}
    >(
      `${backend.users.baseURL}/login/`, {
        username,
        password,
      },
    );

    if (error || !result || !result.data) {
      message.error('¡Error al iniciar sesión!');
      setLoading(false);
      return;
    }

    setTokens(result.data.access, result.data.refresh);
    setLoading(false);
    message.success('Sesión inciada');
  };

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al iniciar sesión!',
      description: 'Por favor revisa tus credenciales e intentalo nuevamente',
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish = async (values: LoginForm) : Promise<void> => {
    login(values.username, values.password);
  };

  if (!canLogin) {
    return (<Redirect to="/" />);
  }

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
