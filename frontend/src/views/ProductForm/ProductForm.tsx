import React, { useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Row, Col, Form, Input,
} from 'antd';
import Title from 'components/Title';
import FormButton from 'components/FormButton';
import { useBackend } from 'integrations';
import {
  CreateProductForm,
} from '@types';

const ProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const backend = useBackend();

  useEffect(() => {
    const fetchData = async () => {
      const data = await backend.products.getAll();
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <Content>
      <Title text="Form" />
      <Form form={form}>
        <Row justify="space-around">
          <Col span={8}>
            <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item shouldUpdate className="submit">
          <FormButton
            text="Confirmar"
          />
        </Form.Item>
      </Form>
    </Content>
  );
};

export default ProductForm;
