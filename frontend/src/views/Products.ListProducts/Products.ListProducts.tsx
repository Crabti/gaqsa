import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  notification, Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Product,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import { PlusOutlined } from '@ant-design/icons';
import useShoppingCart from 'hooks/shoppingCart';
import { SHOW_ADD_TO_CART_BTN } from 'constants/featureFlags';

const ListProducts: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const { addProducts } = useShoppingCart();

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getAll(
      'status=Aceptado',
    );

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setProducts(result.data);
    setLoading(false);
  }, [backend.products]);

  useEffect(() => {
    fetchProducts();
  }, [history, fetchProducts]);

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
      {isLoading || !products ? <LoadingIndicator /> : (
        <Table
          data={
            products.map((product) => ({
              id: product.id,
              name: product.name,
              provider: product.provider,
              presentation: product.presentation,
              price: product.price,
              iva: product.iva,
              ieps: product.ieps,

            }))
        }
          columns={columns}
        />
      )}
    </Content>
  );
};

export default ListProducts;
