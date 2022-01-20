import { Maybe, Order } from '@types';
import { message } from 'antd';
import LoadingIndicator from 'components/LoadingIndicator';
import { useBackend } from 'integrations';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderUpdate from './Orders.Update';

const OrderUpdateCompound: React.FC = () => {
  const [order, setOrder] = useState<Maybe<Order>>(undefined);

  const [loading, setLoading] = useState(false);
  const backend = useBackend();
  const {
    id: orderId,
  } = useParams<{ id: string; }>();

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      const [result, error] = await backend.orders.getOne(orderId);

      if (error || !result || !result.data) {
        message.error('Error al cargar el pedido.');
        return;
      }

      setOrder(result.data);
    };

    setLoading(true);
    fetchOrder();
    setLoading(false);
  }, [backend.orders, orderId]);

  if (loading || !order) return <LoadingIndicator />;

  return (
    <OrderUpdate order={order} />
  );
};

export default OrderUpdateCompound;
