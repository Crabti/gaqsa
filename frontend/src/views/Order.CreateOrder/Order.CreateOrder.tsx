/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from 'react';
import layout, { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Form,
  InputNumber,
  notification,
  Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import useShoppingCart from 'hooks/shoppingCart';
import { Product } from '@types';
import { SHOW_ADD_TO_CART_BTN } from 'constants/featureFlags';
import LoadingIndicator from 'components/LoadingIndicator';
import Table from 'components/Table';
import { render } from 'react-dom';
import form from 'antd/lib/form';
import FormButton from 'components/FormButton';
import useAuth from 'hooks/useAuth';

const CreateOrder: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const { user } = useAuth();

  const {
    products, addProducts, removeProducts, clear,
  } = useShoppingCart();

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const onFinish = async () : Promise<void> => {
    setLoading(true);
    if (user) {
      const [, error] = await backend.orders.createOne({
        products, user: user.id,
      });

      if (error) {
        onFinishFailed();
        return;
      }
      clear();
      notification.success({
        message: '¡Petición de orden creado exitosamente!',
        description: 'Su petición sera validado por un administrador proxima'
            + 'proximamente. Sera notificado ya que esta petición '
            + 'cambie de estado',
      });
      history.replace('/');

      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',
    },
    {
      title: 'Laboratorio',
      dataIndex: 'laboratory',
      key: 'laboratory',
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'IVA',
      dataIndex: 'iva',
      key: 'iva',
    },
    {
      title: 'IEPS',
      dataIndex: 'ieps',
      key: 'ieps',
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (id: number, product: Product) => (
        <>
          <Tooltip title="Añadir al carrito">
            {SHOW_ADD_TO_CART_BTN && (
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => addProducts({
                product: { ...product },
                amount: 1,
              })}
            />
            )}
          </Tooltip>
          <Tooltip title="Reducir al carrito">
            {SHOW_ADD_TO_CART_BTN && (
            <Button
              shape="circle"
              icon={<MinusOutlined />}
              onClick={() => removeProducts({
                product: { ...product },
                amount: -1,
              })}
            />
            )}
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Form
        name="productForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {isLoading || !products ? <LoadingIndicator /> : (
          <Table
            data={products.map((product) => ({
              id: product.product.id,
              name: product.product.name,
              provider: product.product.provider,
              presentation: product.product.presentation,
              laboratory: product.product.laboratory,
              category: product.product.category,
              price: product.product.price,
              iva: product.product.iva,
              ieps: product.product.ieps,
              amount: product.amount,
            }))}
            columns={columns}
            rowKey=""
          />
        )}
        <FormButton
          loading={isLoading}
          text="Confirmar"
        />
      </Form>
    </Content>
  );
};

export default CreateOrder;
