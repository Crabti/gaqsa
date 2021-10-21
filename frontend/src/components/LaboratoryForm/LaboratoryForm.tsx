/* eslint-disable react/jsx-props-no-spreading */
import {
  Form, Input, Col, Row,
} from 'antd';
import React, { useEffect } from 'react';
import FormButton from 'components/FormButton';
import Props from './LaboratoryForm.type';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const LaboratoryForm: React.FC<Props> = ({
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
      {...layout}
      form={form}
      name="LaboratoryForm"
      initialValues={initialState}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row justify="space-around">
        <Col span={12}>
          <Form.Item
            name="name"
            label="Laboratorio"
            rules={[{ required: true }]}
          >
            <Input />
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

export default LaboratoryForm;
