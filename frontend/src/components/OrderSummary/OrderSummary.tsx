import React from 'react';
import {
  Typography, Row, Col, Card,
} from 'antd';
import moment from 'moment';
import { Props } from './OrderSummary.type';

const { Title, Text } = Typography;

interface RowType {
  label: string;
  value: string | undefined;
}

const OrderSummary: React.FC<Props> = ({ order }) => {
  const renderRow = (label: string, value?: string) : any => {
    const valueText = value || 'Sin datos';
    return (
      <Row
        key={label}
        justify="space-between"
      >
        <Col>
          <Text strong>
            { label }
          </Text>
        </Col>
        <Col>
          <Text strong>
            { valueText }
          </Text>
        </Col>
      </Row>
    );
  };

  const rows : RowType[] = [
    {
      label: 'Cliente',
      value: (order.user as string),
    },
    {
      label: 'Proveedor',
      value: (order.provider as string),
    },
    {
      label: 'Fecha de creación',
      value: moment(order.created_at).format('YYYY-MM-dd'),
    },
    {
      label: 'Estado',
      value: order.status,
    },
    {
      label: 'Total',
      value: `$${order.total?.toFixed(2)}`,
    },
  ];

  return (
    <Card style={{
      marginRight: '15em',
      marginLeft: '15em',
    }}
    >
      <Row justify="center">
        <Title level={3}>
          PEDIDO No.
          {' '}
          {order.id}
        </Title>
      </Row>
      {
        rows.map((row) => renderRow(
          row.label, row.value,
        ))
      }
    </Card>
  );
};

export default OrderSummary;
