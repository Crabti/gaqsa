/* eslint-disable react/jsx-props-no-spreading */
import {
  Form, Input, InputNumber, Select, Col, Row,
} from 'antd';
import React, { useEffect } from 'react';
import FormButton from 'components/FormButton';
import { CreateProductForm } from '@types';
import Props from './ProductForm.type';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const ProductForm: React.FC<Props> = ({
  initialState,
  onFinish,
  onFinishFailed,
  form,
  isLoading,
  options,
  isUpdate,
  disabledFields,
  providers,
  isAdmin,
}) => {
  useEffect(() => {
    form.setFieldsValue({ ...initialState });
  }, [form, initialState]);

  const onSubmit = () : void => {
    const values = form.getFieldsValue();

    if (isAdmin && values.providers) {
      const result : CreateProductForm = {
        ...values,
        provider: values.providers.map((id: number) => ({
          provider: id,
          ...values.provider,
        })),
      };
      onFinish(result);
    } else {
      onFinish(values);
    }
  };
  return (
    <Form
      {...layout}
      form={form}
      name="productForm"
      initialValues={initialState}
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      { !isUpdate && isAdmin && providers && (
      <>
        <Col span={24}>
          <Form.Item
            name="providers"
            label="Proveedores"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Buscar proveedor"
              optionFilterProp="children"
              mode="multiple"
              filterOption={(input, option: any) => (
                (option === undefined || option?.children === undefined)
                  ? false : option.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >
              {Object.values(providers).map(
                (provider) => (
                  <Option value={provider.id} key={provider.id}>
                    {`${provider.name} - ${provider.nav_key}`}
                  </Option>
                ),
              )}
            </Select>
          </Form.Item>
        </Col>
      </>
      )}
      {isUpdate && (
      <>
        <Col span={24}>
          <Form.Item
            name="key"
            label="Clave"
            rules={[{ required: true, max: 8 }]}
          >
            <Input disabled={!!disabledFields?.key} />
          </Form.Item>
        </Col>
      </>
      )}
      <Row justify="space-around">
        <Col span={12}>
          <Form.Item
            name="category"
            label="Categoría"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              disabled={!!disabledFields?.category}
              placeholder="Buscar categoría"
              filterOption={(input, option: any) => (
                (option === undefined || option?.children === undefined)
                  ? false : option.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >
              {Object.values(options.categories).map(
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
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input disabled={!!disabledFields?.name} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="space-around">
        <Col span={12}>
          <Form.Item
            name="active_substance"
            label="Sustancia activa"
            rules={[{ required: true }]}
          >
            <Input disabled={!!disabledFields?.active_substance} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="presentation"
            label="Presentación"
            rules={[{ required: true }]}
          >
            <Input disabled={!!disabledFields?.presentation} />
          </Form.Item>
        </Col>
        { isUpdate ? null : (
          <>
            <Col span={12}>
              <Form.Item
                name={['provider', 'price']}
                label="Precio"
                rules={[{ required: true }]}
              >
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
                name={['provider', 'laboratory']}
                label="Laboratorio"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  placeholder="Buscar laboratorio"
                  filterOption={(input, option: any) => (
                    (option === undefined || option?.children === undefined)
                      ? false : option.children
                        .toLowerCase().indexOf(input.toLowerCase()) >= 0)}
                >
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
                name={['provider', 'iva']}
                label="IVA (%)"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="0" key="0"> 0.00 %</Option>
                  <Option value="16" key="16"> 16.00 %</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={12}>
          <Form.Item name="ieps" label="IEPS" rules={[{ required: true }]}>
            <InputNumber
              min={0.00}
              max={100}
              style={{ width: '100%' }}
              formatter={(value) => `${value}%`}
              disabled={!!disabledFields?.ieps}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="animal_groups"
            label="Especie"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Buscar especie"
              filterOption={(input, option: any) => (
                (option === undefined || option?.children === undefined)
                  ? false : option.children
                    .toLowerCase().indexOf(input.toLowerCase()) >= 0)}
              mode="multiple"
              disabled={!!disabledFields?.animal_groups}
            >
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
            name="more_info"
            label="Información"
          >
            <Input.TextArea disabled={!!disabledFields?.more_info} />
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

export default ProductForm;
