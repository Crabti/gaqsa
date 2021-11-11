import React from 'react';
import {
  Typography, Row, Col, Divider, Card,
} from 'antd';
import moment from 'moment';
import { Props } from './OrderSummary.type';

const { Title, Text } = Typography;

const OrderSummary: React.FC<Props> = ({ order }) => {
  const renderRow = (label: string, value: string) : any => (
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
          { value }
        </Text>
      </Col>
      <Divider />
    </Row>
  );

  const rows = [
    {
      label: 'Cliente',
      value: (order.user as string),
    },
    {
      label: 'Proveedor',
      value: 'COMERCIALIZADORA',
    },
    {
      label: 'Fecha de creación',
      value: moment(order.created_at).format('YYYY-MM-dd'),
    },
  ];

  return (
    <Card style={{
      marginRight: '15em',
      marginLeft: '15em',
      marginBottom: '3em',
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
        rows.map((row) => renderRow(row.label, row.value))
      }
    </Card>
  );
};

export default OrderSummary;
