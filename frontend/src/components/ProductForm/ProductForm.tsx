/* eslint-disable react/jsx-props-no-spreading */
import {
  Form, Input, InputNumber, Select, Col, Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import FormButton from 'components/FormButton';
import Props from './ProductForm.type';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

enum ProductStatus {
  DECLINED = 'Rechazado',
  PENDING = 'Pendiente',
  INACTIVE = 'Inactivo',
  CANCELLED = 'Cancelado',
  ACCEPTED = 'Aceptado'
}

const ProductForm: React.FC<Props> = ({
  initialState,
  onFinish,
  onFinishFailed,
  form,
  isLoading,
  isUpdate,
  options,
}) => {
  const [isProductRejected, setIsProductRejected] = useState(false);

  const handleStateDropdown = (status : string) : void => setIsProductRejected(
    status !== 'Rechazado',
  );

  useEffect(() => {
    form.setFieldsValue({ ...initialState });
    handleStateDropdown(form.getFieldValue('status'));
  }, [form, initialState]);

  return (
    <Form
      {...layout}
      form={form}
      name="productForm"
      initialValues={initialState}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row justify="space-around">
        <Col span={12}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
            <InputNumber
              min={0.01}
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`.replace(
                /\B(?=(\d{3})+(?!\d))/g, ',',
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="presentation"
            label="Presentación"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="iva" label="IVA (%)" rules={[{ required: true }]}>
            <Select>
              <Option value="0.00" key="0.00"> 0.00 %</Option>
              <Option value="0.16" key="0.16"> 0.16 %</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="more_info"
            label="Información"
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="ieps" label="IEPS" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}%`}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="laboratory"
            label="Laboratorio"
            rules={[{ required: true }]}
          >
            <Select>
              { Object.values(options.laboratories).map(
                (lab) => (
                  <Option value={lab.id} key={lab.id}>
                    {lab.name}
                  </Option>
                ),
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Categoría"
            rules={[{ required: true }]}
          >
            <Select>
              { Object.values(options.categories).map(
                (category) => (
                  <Option value={category.id} key={category.id}>
                    {category.name}
                  </Option>
                ),
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="animal_groups"
            label="Especie"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              { Object.values(options.animal_groups).map(
                (group) => (
                  <Option value={group.id} key={group.id}>
                    {group.name}
                  </Option>
                ),
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="active_substance"
            label="Substancia activa"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        {isUpdate && (
          <>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Estado"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={handleStateDropdown}
                >
                  { Object.values(ProductStatus).map(
                    (status) => (
                      <Option value={status} key={status}>
                        {status}
                      </Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                shouldUpdate
                name="reject_reason"
                label="Razon de rechazo"
                rules={[]}
              >
                <Input.TextArea disabled={isProductRejected} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="key"
                label="Clave"
                rules={[{ required: true, max: 8 }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      <FormButton
        loading={isLoading}
        text="Confirmar"
      />
    </Form>
  );
};

export default ProductForm;
