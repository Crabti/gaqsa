import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
  Tag,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Requisition,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const ListRequisitions: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [requisitions,
    setRequisitions] = useState<Requisition[] | undefined>(undefined);

  const fetchRequisitions = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.requisitions.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los pedidos!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setRequisitions(result.data);
    setLoading(false);
  }, [backend.requisitions]);

  useEffect(() => {
    fetchRequisitions();
  }, [history, fetchRequisitions]);

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Cantidad Solicitada',
      dataIndex: 'quantity_requested',
      key: 'quantity_requested',
    },
    {
      title: 'Cantidad Aceptada',
      dataIndex: 'quantity_accepted',
      key: 'quantity_accepted',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status) {
          case 'Pendiente':
            color = 'yellow';
            break;
          case 'Aceptado':
            color = 'green';
            break;
          case 'Rechazado':
            color = 'red';
            break;
          default:
            color = 'blue';
            break;
        }
        return (
          <Tag key={status} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  if (isLoading || !requisitions) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Table
        rowKey="id"
        data={requisitions.map((requisition) => ({
          id: requisition.id,
          product: requisition.product,
          quantity_requested: requisition.quantity_requested,
          quantity_accepted: requisition.quantity_accepted,
          price: `$ ${requisition.price.toFixed(2)}`,
          status: requisition.status,
        }))}
        columns={columns}
      />
    </Content>
  );
};

export default ListRequisitions;
