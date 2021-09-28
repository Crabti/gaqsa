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
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const ListProducts: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);

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
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => console.log(product)}
          />
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
