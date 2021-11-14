import React from 'react';
import { OrderStatus } from 'constants/strings';
import { Tag } from 'antd';
import { Props } from './OrderStatusTag.type';

const OrderStatusTag: React.FC<Props> = ({ status }) => {
  let color = '';
  switch (status) {
    case OrderStatus.INCOMPLETE:
      color = 'yellow';
      break;
    case OrderStatus.RECEIVED:
      color = 'green';
      break;
    case OrderStatus.CANCELLED:
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
};
export default OrderStatusTag;
