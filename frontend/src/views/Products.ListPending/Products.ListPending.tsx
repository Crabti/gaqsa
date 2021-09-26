import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
  Tooltip,
  Button,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Product,
} from '@types';
import Table from 'components/Table';
import moment from 'moment';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const UpdateForm: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getAll(
      'status=Pendiente',
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
      title: 'Fecha de registro',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a: Product, b: Product) => {
        if (moment(a.created_at).isBefore(moment(b.created_at))) {
          return -1;
        }
        return 1;
      },
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (id: number) => (
        <Tooltip title="Consultar producto">
          <Button
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => history.push(
              `/productos/${id}/modificar`,
            )}
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
              created_at: moment(
                new Date(product.created_at),
              ).format('DD/MM/YYYY HH:mm'),
              provider: product.provider,
              action: product.id,

            }))
        }
          columns={columns}
        />
      )}
    </Content>
  );
};

export default UpdateForm;
