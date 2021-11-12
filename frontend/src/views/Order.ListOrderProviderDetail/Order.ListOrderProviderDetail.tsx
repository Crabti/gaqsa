import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  notification,
  Tag,
} from 'antd';
import { useHistory, useParams } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Order,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import { SHOW_BUTTON_CANCEL_ORDER } from 'constants/featureFlags';

// eslint-disable-next-line max-len
const OrderListOrderProviderDetail: React.VC = ({ verboseName, parentName }) => {
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

  const listItems = () : any => {
    const list : any[] = [];
    orders.requisitions.forEach((requisition) => {
      list.push({
        order: orders.id.toString(),
        product: requisition.product,
        quantity_requested: requisition.quantity_requested,
        quantity_accepted: requisition.quantity_accepted,
        price: `$ ${requisition.price.toFixed(2)}`,
        status: requisition.status,
      });
    });
    return list;
  };

  // order: `Pedido ${order.id.toString()}
  // - ${moment(order.created_at).format('YYYY-mm-DD hh:mm')}`,
  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Table
        rowKey={(row) => row.id}
        data={listItems()}
        columns={columns}
      />
    </Content>
  );
};

export default OrderListOrderProviderDetail;
