import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  notification,
} from 'antd';
import { useHistory, useParams } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Order, Product,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import moment from 'moment';
import { SHOW_BUTTON_CANCEL_ORDER } from 'constants/featureFlags';
import RequisitionStatusTag from 'components/RequisitionStatusTag';

const ListClientOrdersDetail: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const { id: orderId } = useParams<{ id: string; }>();
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order | undefined>(undefined);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.orders.getOne(orderId);

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los pedidos!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setOrders(result.data);
    setLoading(false);
  }, [backend.orders, orderId]);

  useEffect(() => {
    fetchOrders();
  }, [history, fetchOrders]);

  const columns = [
    {
      title: 'Orden',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a: Order, b: Order) => {
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
      title: 'Cantidad Recibida',
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
      render: (status: string) => <RequisitionStatusTag status={status} />,
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (status: string) => (
        SHOW_BUTTON_CANCEL_ORDER && (
        <Button
          disabled={(status === 'Pendiente')}
          type="primary"
          danger
        >
          Cancelar
        </Button>
        )
      ),
    },
  ];

  if (isLoading || !orders) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Table
        rowKey={(row) => row.id}
        data={orders.requisitions.map((requisition) => ({
          order: orders.id.toString(),
          created_at: moment(orders.created_at).format('YYYY-mm-DD hh:mm'),
          provider: requisition.provider,
          product: (requisition.product as Product).name,
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

export default ListClientOrdersDetail;
