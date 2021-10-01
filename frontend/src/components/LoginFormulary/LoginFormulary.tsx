import React, { useEffect } from 'react';
import {
  Form, Input, Col, Row,
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
      name="loginFormulary"
      initialValues={initialState}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row justify="start">
        <Col span={6} />
        <Col span={12}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6} />
        <Col span={5} />
        <Col span={13}>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true }]}
          >
            <Input.Password
              placeholder="Introducir contraseña"
            />
          </Form.Item>
        </Col>
      </Row>

      <FormButton
        loading={isLoading}
        text="Confirmar"
      />
    </Form>
  );
};

export default LoginFormulary;
