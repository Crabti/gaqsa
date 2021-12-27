import React from 'react';
import { InvoiceStatus } from 'constants/strings';
import { Tag } from 'antd';
import { Props } from './InvoiceStatusTag.type';

const InvoiceStatusTag: React.FC<Props> = ({ status }) => {
  let color = '';
  switch (status) {
    case InvoiceStatus.ACCEPTED:
      color = 'green';
      break;
    case InvoiceStatus.REJECTED:
      color = 'red';
      break;
    case InvoiceStatus.PENDING:
      color = 'yellow';
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
export default InvoiceStatusTag;
