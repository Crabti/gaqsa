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
  Order,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import moment from 'moment';

const ListClientOrders: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.orders.getAll();

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
  }, [backend.orders]);

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

  if (isLoading || !orders) {
    return <LoadingIndicator />;
  }

  const listItems = () : any => {
    const list : any[] = [];
    orders.forEach((order) => {
      order.requisitions.forEach((requisition) => {
        list.push({
          order: order.id.toString(),
          created_at: moment(order.created_at).format('YYYY-mm-DD hh:mm'),
          provider: requisition.provider,
          product: requisition.product,
          quantity_requested: requisition.quantity_requested,
          quantity_accepted: requisition.quantity_accepted,
          price: `$ ${requisition.price.toFixed(2)}`,
          status: requisition.status,
        });
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
        rowKey="order"
        data={listItems()}
        columns={columns}
      />
    </Content>
  );
};

export default ListClientOrders;
