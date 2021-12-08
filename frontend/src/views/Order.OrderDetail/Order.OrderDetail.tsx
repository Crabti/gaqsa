import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
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
import RequisitionStatusTag from 'components/RequisitionStatusTag';
import OrderSummary from 'components/OrderSummary';
import useAuth from 'hooks/useAuth';

const OrderDetail: React.VC = (
  { verboseName, parentName },
) => {
  const backend = useBackend();
  const history = useHistory();
  const { id: orderId } = useParams<{ id: string; }>();
  const [isLoading, setLoading] = useState(true);
  const [order, setOrders] = useState<Order | undefined>(undefined);

  const { isClient } = useAuth();

  const shouldShowModifyOrder = !isClient;

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
      render: (status: string) => <RequisitionStatusTag status={status} />,
    },
  ];

  if (isLoading || !order) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <OrderSummary order={order} />
      <Table
        rowKey={(row) => row.id}
        data={
          order.requisitions.map((requisition) => ({
            id: requisition.id,
            order: order.id.toString(),
            product: (requisition.product as Product).name,
            quantity_requested: requisition.quantity_requested,
            quantity_accepted: requisition.quantity_accepted,
            price: `$ ${requisition.price.toFixed(2)}`,
            status: requisition.status,
          }))
        }
        actions={[
          {
            text: 'Modificar',
            action: () => history.push(
              `/pedidos/${orderId}/modificar`,
            ),
            hidden: !shouldShowModifyOrder,
          },
        ]}
        columns={columns}
      />
    </Content>
  );
};

export default OrderDetail;
