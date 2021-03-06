import React, { useState } from 'react';
import Title from 'components/Title';
import OrderSummary from 'components/OrderSummary';
import { Content } from 'antd/lib/layout/layout';
import { Order, Product } from '@types';
import Table from 'components/Table';
import { InputNumber, Form, notification } from 'antd';
import FormButton from 'components/FormButton';
import { useBackend } from 'integrations';
import { useHistory } from 'react-router';

interface Props {
  order: Order;
}

interface OrderUpdateForm {
  quantity_accepted: number;
  requisition: number;
  sent: boolean;
}

const OrderUpdate: React.FC<Props> = ({ order }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const backend = useBackend();
  const history = useHistory();
  const initialSentRequisitons = order.requisitions.filter(
    (requisition) => requisition.sent,
  );
  const initialSelected = initialSentRequisitons.map(
    (requisition) => requisition.id,
  );
  const [
    selectedRowKeys,
    setSelected,
  ] = useState(initialSelected);

  const onSelectChange = (rows : any) : void => {
    setSelected(rows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnTitle: 'Surtido',
  };

  const columns = [
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
            initialValue={data.quantity_requested}
          >
            <InputNumber
              max={data.quantity_requested}
              min={0}
            />
          </Form.Item>
          <Form.Item
            hidden
            initialValue={data.id}
            name={['requisitions', index, 'requisition']}
          />
        </>
      ),
    },
  ];

  const onSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    const payload = values.requisitions.map((data: OrderUpdateForm) => ({
      ...data,
      sent: selectedRowKeys.find(
        (id: number) => id === data.requisition,
      ) !== undefined,
    }));
    setLoading(true);
    const [, error] = await backend.orders.patch(
      `${order.id}/update`,
      payload,
    );
    if (error) {
      notification.error({
        message: 'Ocurrio un error al enviar los cambios.',
      });
    } else {
      notification.success({
        message: 'Se ha modificado el pedido exitosamente.',
      });
      history.replace(`/pedidos/${order.id}`);
    }
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
          selection={rowSelection}
          data={
          order.requisitions.map((requisition) => ({
            id: requisition.id,
            name: (requisition.product as Product).name,
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
