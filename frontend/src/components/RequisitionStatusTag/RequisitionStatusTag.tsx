import React from 'react';
import { RequisitionStatus } from 'constants/strings';
import { Tag } from 'antd';
import { Props } from './RequisitionStatusTag.type';

const RequisitionStatusTag: React.FC<Props> = ({ status }) => {
  let color = '';
  switch (status) {
    case RequisitionStatus.PENDING:
      color = 'yellow';
      break;
    case RequisitionStatus.RECEIVED:
      color = 'green';
      break;
    case RequisitionStatus.INCOMPLETE:
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
export default RequisitionStatusTag;
