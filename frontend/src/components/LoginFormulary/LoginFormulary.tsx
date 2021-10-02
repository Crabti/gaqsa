import React, { useEffect } from 'react';
import {
  Form, Input,
} from 'antd';
import FormButton from 'components/FormButton';
import Props from './LoginFormulary.type';

const LoginFormulary: React.FC<Props> = ({
  initialState,
  onFinish,
  onFinishFailed,
  form,
  isLoading,
}) => {
  useEffect(() => {
    form.setFieldsValue({ ...initialState });
  }, [form, initialState]);

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      name="loginFormulary"
      initialValues={initialState}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="username"
        label="Nombre de usuario"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Contraseña"
        rules={[{ required: true }]}
      >
        <Input.Password
          placeholder="Introducir contraseña"
        />
      </Form.Item>

      <FormButton
        loading={isLoading}
        text="Confirmar"
      />
    </Form>
  );
};

export default LoginFormulary;
