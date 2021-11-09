import {
  Form, Input,
} from 'antd';
import React, { useEffect } from 'react';
import FormButton from 'components/FormButton';
import Props from './__model__Form.type';

const __model__Form: React.FC<Props> = ({
  initialState,
  onFinish,
  onFinishFailed,
  form,
  isLoading,
  isUpdate,
}) => {
  useEffect(() => {
    form.setFieldsValue({ ...initialState });
  }, [form, initialState]);

  return (
    <Form
      form={form}
      name="clientForm"
      initialValues={initialState}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name=""
        label=""
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <FormButton
        loading={isLoading}
        text="Confirmar"
      />
    </Form>
  );
};

export default __model__Form;
