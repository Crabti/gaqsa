import React from 'react';
import { OrderInvoiceStatus } from 'constants/strings';
import { Tag } from 'antd';
import { Props } from './OrderInvoiceStatusTag.type';

const OrderInvoiceStatusTag: React.FC<Props> = ({ status }) => {
  let color = '';
  switch (status) {
    case OrderInvoiceStatus.ACCEPTED:
      color = 'green';
      break;
    case OrderInvoiceStatus.REJECTED:
      color = 'red';
      break;
    case OrderInvoiceStatus.PENDING:
      color = 'blue';
      break;
    case OrderInvoiceStatus.PARTIAL:
      color = 'yellow';
      break;
    default:
      color = '';
      break;
  }

  return (
    <Tag key={status} color={color}>
      {status?.toUpperCase()}
    </Tag>
  );
};
export default OrderInvoiceStatusTag;
