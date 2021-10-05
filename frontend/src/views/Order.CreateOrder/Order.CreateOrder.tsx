/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Form,
  notification,
  Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import { PlusOutlined } from '@ant-design/icons';
import useShoppingCart from 'hooks/shoppingCart';
import { Product } from '@types';
import { SHOW_ADD_TO_CART_BTN } from 'constants/featureFlags';
import LoadingIndicator from 'components/LoadingIndicator';
import Table from 'components/Table';

const CreateOrder: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const { products, addProducts, total } = useShoppingCart();
  console.log(products);

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
      title: 'Susbtancia activa',
      dataIndex: 'active_substance',
      key: 'active_substance',
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
        <Tooltip title="Añadir al carrito">
          { SHOW_ADD_TO_CART_BTN && (
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
      ),
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !products ? <LoadingIndicator /> : (
        <Table
          data={
            products.map((product) => ({
              id: product.product.id,
              name: product.product.name,
              provider: product.product.provider,
              presentation: product.product.presentation,
              active_substance: product.product.active_substance,
              laboratory: product.product.laboratory,
              category: product.product.category,
              price: product.product.price,
              iva: product.product.iva,
              ieps: product.product.ieps,
            }))
        }
          columns={columns}
        />
      )}
    </Content>
  );
};

export default CreateOrder;
