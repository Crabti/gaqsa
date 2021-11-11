import React, { useState } from 'react';
import Title from 'components/Title';
import OrderSummary from 'components/OrderSummary';
import { Content } from 'antd/lib/layout/layout';
import { Order, Product } from '@types';
import Table from 'components/Table';
import { InputNumber, Form } from 'antd';
import FormButton from 'components/FormButton';

interface Props {
  order: Order;
}

const OrderUpdate: React.FC<Props> = ({ order }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    {
      title: 'Clave',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Producto',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Substancia activa',
      dataIndex: 'active_substance',
      key: 'active_substance',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',
    },
    {
      title: 'Cantidad pedida',
      dataIndex: 'quantity_requested',
      key: 'quantity_requested',
    },
    {
      title: 'Cantidad a enviar',
      dataIndex: 'quantity_accepted',
      key: 'quantity_accepted',
      render: (_: string, data: any, index: number) => (
        <>
          <Form.Item
            name={['requisitions', index, 'quantity_accepted']}
            initialValue={0}
          >
            <InputNumber max={data.quantity_requested} />
          </Form.Item>
          <Form.Item
            hidden
            initialValue={data.id}
            name={['requisitions', index, 'product']}
          />
        </>
      ),
    },
  ];

  const onSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    setLoading(true);
    setLoading(false);
  };

  return (
    <Content>
      <Title viewName="Modificar pedido " parentName="Pedidos" />
      <OrderSummary order={order} />
      <Form form={form} onFinish={onSubmit}>
        <Table
          rowKey={(row) => row.id}
          columns={columns}
          data={
          order.requisitions.map((requisition) => ({
            id: requisition.id,
            name: (requisition.product as Product).name,
            key: (requisition.product as Product).key,
            active_substance: (requisition.product as Product).active_substance,
            presentation: (requisition.product as Product).presentation,
            quantity_accepted: requisition.quantity_accepted,
            quantity_requested: requisition.quantity_requested,
          }))
      }
        />
        <FormButton text="Enviar" loading={loading} />
      </Form>
    </Content>

  );
};

export default OrderUpdate;
