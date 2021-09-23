import {
    Form, Input, InputNumber, Select, Col, Row
} from 'antd';
import FormButton from 'components/FormButton';
import React, { useEffect } from 'react';
import Props from './ProductForm.type';

const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
  
const ProductForm: React.FC<Props> = ({
    initialState,
    onFinish,
    onFinishFailed,
    form,
    isLoading,
    isUpdate
}) => {

  useEffect(() => {
    form.setFieldsValue({ ...initialState });
  }, [form, initialState]);

  return (
    <Form 
        {...layout}
        form={form}
        name="productForm"
        initialValues={initialState}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        size="large"
    >
        <Row justify="space-around">
            <Col span={8}>
                <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="dose" label="Dosis" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
            </Col>
        </Row>
        <Row justify="space-around">

        <Col span={8}>
            <Form.Item name="presentation" label="Presentación" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
            <InputNumber />
            </Form.Item>
        </Col>
        </Row>
        <Row justify="space-around">

        <Col span={8}>
            <Form.Item name="iva" label="IVA" rules={[{ required: true }]}>
            <Select>
                <Option value="0.08"> 0.08 </Option>
                <Option value="0.16"> 0.16 </Option>
            </Select>
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name="ieps" label="IEPS" rules={[{ required: true }]}>
                <InputNumber /> 
            </Form.Item>
        </Col>
        </Row>
        <Row justify="space-around">

        <Col span={8}>
            <Form.Item name="more_info" label="Información" rules={[{ required: true }]}>
            <Input.TextArea />
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name="is_generic" label="Genérico" rules={[]}>
            <Select>
                <Option value="Sí">Sí</Option>
                <Option value="No">No</Option>
            </Select>
            </Form.Item>
        </Col>
        </Row>
        {
        isUpdate && <Row justify="space-around">
        <Col span={8}>
            <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
                <Select>
                    <Option value="Aceptado">Aceptado</Option>
                    <Option value="Cancelado">Cancelado</Option>
                    <Option value="Rechazado">Rechazado</Option>
                    <Option value="Inactivo">Inactivo</Option>
                </Select>
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name="reject_reason" label="Razon de rechazo (Si aplica)" rules={[]}>
            <Input.TextArea />

            </Form.Item>
        </Col>
        </Row>
        }
        <Row justify="space-around">
            <Col span={8}>
                <Form.Item name="key" label="Clave" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item shouldUpdate className="submit">
        <FormButton
            loading={isLoading}
            text="Confirmar"
        />
        </Form.Item>
    </Form>
  );
};

export default ProductForm;