/* eslint-disable react/jsx-props-no-spreading */
import {
  Form, Input, Select, Col, Row, Divider, InputNumber,
} from 'antd';
import React, { useEffect, useState } from 'react';
import FormButton from 'components/FormButton';
import AddMail from 'components/AddMail';
import AddRanch from 'components/AddRanch';
import {
  INVOICES_MAILS_CATEGORY, ORDERS_MAILS_CATEGORY,
  PAYMENTS_MAILS_CATEGORY, PRICE_CHANGE_MAILS_CATEGORY,
} from 'constants/strings';
import { UserGroups } from 'hooks/useAuth';
import Props from './UserForm.type';

const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const UserForm: React.FC<Props> = ({
  initialState,
  onFinish,
  onFinishFailed,
  form,
  isLoading,
}) => {
  useEffect(() => {
    form.setFieldsValue({ ...initialState });
  }, [form, initialState]);

  const [selectedRole, setSelectedRole] = useState<string>(UserGroups.PROVIDER);

  const handleSelectRole = (role : string) : void => setSelectedRole(role);

  const validatePassword = (__: any, value: string, callback: any) : void => {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{9,})',
    );
    if (value && !strongRegex.test(value)) {
      callback(
        'La contraseña debe tener un mínimo de 9 caracteres,'
        + ' una letra mayúscula, una letra minúsucla,'
        + ' un numero, y un caracter especial.',
      );
    } else {
      callback();
    }
  };

  const validateUsername = (__: any, value: string, callback: any) : void => {
    if (value && value.includes(' ')) {
      callback(
        'El nombre de usuario no puede contener espacios vacíos.',
      );
    } else if (value.length < 4) {
      callback(
        'El nombre de usuario debe contener por lo menos 4 caracteres.',
      );
    } else {
      callback();
    }
  };

  const standardFields = (
    <>
      <Col span={12}>
        <Form.Item
          name="group"
          label="Tipo de Usuario"
          rules={[{ required: true }]}
        >
          <Select onChange={handleSelectRole}>
            <Option value={UserGroups.ADMIN} key={UserGroups.ADMIN}>
              {UserGroups.ADMIN}
            </Option>
            <Option value={UserGroups.PROVIDER} key={UserGroups.PROVIDER}>
              {UserGroups.PROVIDER}
            </Option>
            <Option value={UserGroups.CLIENT} key={UserGroups.CLIENT}>
              {UserGroups.CLIENT}
            </Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['user', 'username']}
          label="Usuario"
          rules={[{ required: true, validator: validateUsername }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['user', 'first_name']}
          label="Nombre"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['user', 'last_name']}
          label="Apellidos"
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['user', 'password']}
          label="Contraseña"
          dependencies={['confirmPassword']}
          hasFeedback
          rules={[
            { required: true },
            { validator: validatePassword },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value
                  || !getFieldValue('confirmPassword')
                  || value === getFieldValue('confirmPassword')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(
                  'Las contraseñas ingresadas no coinciden.',
                ));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="confirmPassword"
          label="Confirmar contraseña"
          dependencies={['user', 'password']}
          hasFeedback
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value === getFieldValue(['user', 'password'])) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(
                  'Las contraseñas ingresadas no coinciden.',
                ));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['profile', 'telephone']}
          label="Teléfono"
          rules={[{ required: true, max: 16 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['user', 'email']}
          label="Correo"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>
      </Col>

    </>
  );

  return (
    <Form
      {...layout}
      form={form}
      name="userForm"
      initialValues={initialState}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row justify="space-around">
        { standardFields }
        { selectedRole !== UserGroups.ADMIN ? (
          <>
            <Col span={12}>
              <Form.Item
                name={['business', 'invoice_telephone']}
                label="Teléfono de Facturación"
                rules={[{ required: true, max: 16 }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['business', 'internal_key']}
                label="Clave Interna del Usuario"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            { selectedRole === UserGroups.PROVIDER
              ? (
                <Col span={12}>
                  <Form.Item
                    name={['business', 'nav_key']}
                    label="Clave Nav"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              ) : null}
            <Col span={12}>
              <Form.Item
                name={['business', 'dimension']}
                label="Dimensión"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['business', 'rfc']}
                label="RFC"
                rules={[{
                  required: true,
                  min: 12,
                  max: 13,
                }]}
              >
                <Input maxLength={13} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['business', 'name']}
                label="Razón Social"
                rules={[{ required: true }]}
              >
                <TextArea rows={3} />
              </Form.Item>
            </Col>

            <Divider />
          </>
        ) : null }
      </Row>
      { selectedRole === UserGroups.CLIENT
        ? (
          <Row justify="space-around">
            <AddMail
              category={ORDERS_MAILS_CATEGORY}
              placeholder="Correo"
              addLabel="Agregar correo(s) de pedidos"
              title="Correos de pedidos"
              listName="orderMails"
            />
            <AddMail
              category={PAYMENTS_MAILS_CATEGORY}
              placeholder="Correo"
              addLabel="Agregar correo(s) de cambio de saldos"
              title="Correos de saldos"
              listName="paymentMails"
            />
          </Row>
        )
        : null}
      { selectedRole === UserGroups.PROVIDER
        ? (
          <Row justify="space-around">

            <AddMail
              category={ORDERS_MAILS_CATEGORY}
              placeholder="Correo"
              addLabel="Agregar correo(s) de pedidos"
              title="Correo de pedidos"
              listName="orderMails"
            />
            <AddMail
              category={INVOICES_MAILS_CATEGORY}
              placeholder="Correo"
              addLabel="Agregar correo(s) de facturas"
              title="Correos de facturas"
              listName="invoiceMails"
            />

            <AddMail
              category={PRICE_CHANGE_MAILS_CATEGORY}
              placeholder="Correo"
              addLabel="Agregar correo(s) de cambio de precios"
              title="Correos de cambios de precios"
              listName="priceChangeMails"
            />
          </Row>
        )
        : null}
      { selectedRole === UserGroups.CLIENT
        ? (
          <>
            <Divider />
            <Row justify="center">
              <AddRanch />
            </Row>
          </>
        ) : null}
      <FormButton
        loading={isLoading}
        text="Confirmar"
      />
    </Form>
  );
};

export default UserForm;
